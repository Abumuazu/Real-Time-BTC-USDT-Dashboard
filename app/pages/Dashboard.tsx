import React, { useEffect, useRef, useState } from "react"
import { StyleSheet } from "react-native"
import { useTickerQuery } from "../entities/ticker/api"
import { ChartPanel } from "../widgets/ChartPanel/ChartPanel"
import { StatsCards } from "../widgets/StatsCards/StatsCards"
import { Sparkline } from "../widgets/Sparkline/Sparkline"
import { useSparkline } from "../entities/ticker/sparkline"
import { PriceTicker } from "../widgets/PriceTicker/PriceTicker"
import { ThemeToggle } from "../features/ThemeToggle/ThemeToggle"
import { ConnectionBanner } from "../features/WsConnection/ConnectionBanner"
import { useWsConnection } from "../features/WsConnection/fsm"
import { DashboardSkeleton } from "../widgets/Skeletons/DashboardSkeleton"
import { ThemedView, ThemedText } from "../shared/ui/Themed"
import { useThemeTokens } from "../shared/theme/useTheme"
import { useQueryClient } from "@tanstack/react-query"
import { fetchTickerSnapshot } from "../entities/ticker/snapshot"
import { NetworkBanner } from "../features/NetworkStatus/NetworkBanner"

export const Dashboard: React.FC = () => {
  const { data, status: queryStatus } = useTickerQuery("BTCUSDT")
  const points = useSparkline("BTCUSDT")
  const { status: connectionStatus, reconnect } = useWsConnection()
  const t = useThemeTokens()
  const queryClient = useQueryClient()
  const hasSeededSnapshot = useRef(false)
  const [snapshotRetryToken, setSnapshotRetryToken] = useState(0)



  useEffect(() => {
    const needsSnapshot =
      !data ||
      data.low24h <= 0 ||
      data.high24h <= 0 ||
      data.turnover24h <= 0 ||
      data.volume24h <= 0

    if (!needsSnapshot) {
      hasSeededSnapshot.current = true
      return
    }
    if (connectionStatus !== "open") return
    if (hasSeededSnapshot.current) return
    hasSeededSnapshot.current = true

    let retryHandle: ReturnType<typeof setTimeout> | null = null
    let cancelled = false
    fetchTickerSnapshot("BTCUSDT")
      .then((snapshot) => {
        if (!cancelled) {
          queryClient.setQueryData(["ticker", "BTCUSDT"], (prev: any) => {
            const merged = {
              ...(prev ?? {}),
              ...snapshot,
              last: snapshot.last || prev?.last || 0,
              mark: snapshot.mark || prev?.mark || 0,
              high24h: snapshot.high24h || prev?.high24h || 0,
              low24h: snapshot.low24h || prev?.low24h || 0,
              turnover24h: snapshot.turnover24h || prev?.turnover24h || 0,
              volume24h: snapshot.volume24h || prev?.volume24h || 0,
              change24h: snapshot.change24h || prev?.change24h || 0,
              ts: snapshot.ts,
            }
            return merged
          })
        }
      })
      .catch((error) => {
        if (__DEV__) {
          console.warn("[Dashboard] Snapshot fetch failed", error)
        }
        retryHandle = setTimeout(() => {
          hasSeededSnapshot.current = false
          setSnapshotRetryToken((token) => token + 1)
        }, 5000)
      })
    return () => {
      cancelled = true
      if (retryHandle) clearTimeout(retryHandle)
    }
  }, [data, connectionStatus, queryClient, snapshotRetryToken])

  if (!data) return <DashboardSkeleton />
  const trendUp = points.length > 1 && points[points.length - 1].last >= points[0].last
  const sparkColor = trendUp ? t.colors.up : t.colors.down

  return (
    <ThemedView style={styles.container}>
      <NetworkBanner />
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Bitcoin (BTC/USDT)</ThemedText>
        <ThemeToggle />
      </ThemedView>
      <ThemedView style={styles.priceRow}>
        <PriceTicker
          value={data?.last}
          neutralColor={t.colors.text}
          upColor={t.colors.up}
          downColor={t.colors.down}
        />
        <Sparkline data={points} stroke={sparkColor} />
      </ThemedView>
      <StatsCards />
      <ChartPanel />
      <ConnectionBanner
        status={
          connectionStatus === "open"
            ? "connected"
            : connectionStatus === "retrying"
              ? "retrying"
              : connectionStatus === "connecting"
                ? "connecting"
                : "disconnected"
        }
        onReconnect={reconnect}
      />
    </ThemedView>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700" },
  priceRow: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
})
