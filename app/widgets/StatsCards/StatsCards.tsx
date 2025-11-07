import React, { useMemo } from "react"
import { StyleSheet } from "react-native"
import { useTickerQuery } from "../../entities/ticker/api"
import { Skeleton } from "../../shared/ui/Skeleton"
import { ThemedView, ThemedText } from "../../shared/ui/Themed"
import { useThemeTokens } from "../../shared/theme/useTheme"

export const StatsCards: React.FC = () => {
  const { data } = useTickerQuery("BTCUSDT")
  const t = useThemeTokens()
  if (!data) {
    return (
      <ThemedView style={styles.row}>
        <Skeleton width={"46%"} height={64} />
        <Skeleton width={"46%"} height={64} />
        <Skeleton width={"46%"} height={64} />
        <Skeleton width={"46%"} height={64} />
      </ThemedView>
    )
  }

  const change = data.change24h ?? 0
  const changeTone: "up" | "down" | "neutral" = change > 0 ? "up" : change < 0 ? "down" : "neutral"
  const changeValue = useMemo(() => `${(change * 100).toFixed(2)}%`, [change])
  const turnoverValue = useMemo(() => `$${formatCompact(data.turnover24h)}`, [data.turnover24h])
  const volumeValue = useMemo(() => `${formatCompact(data.volume24h)} BTC`, [data.volume24h])

  return (
    <ThemedView style={styles.row}>
      <Card title="Mark" value={data.mark} />
      <Card title="24h High" value={data.high24h} />
      <Card title="24h Low" value={data.low24h} />
      <Card title="24h Turnover" value={turnoverValue} />
      <Card title="24h Volume" value={volumeValue} />
      <Card
        title="24h Change"
        value={changeValue}
        tone={changeTone}
        colors={{ up: t.colors.up, down: t.colors.down, neutral: t.colors.text }}
      />
    </ThemedView>
  )
}

type CardProps = {
  title: string
  value: number | string
  formatter?: (value: number) => string
  tone?: "up" | "down" | "neutral"
  colors?: { up: string; down: string; neutral: string }
}

const Card: React.FC<CardProps> = ({ title, value, formatter, tone = "neutral", colors }) => {
  const display =
    typeof value === "number" ? (formatter ? formatter(value) : value.toFixed(2)) : value
  const color = colors
    ? tone === "up"
      ? colors.up
      : tone === "down"
        ? colors.down
        : colors.neutral
    : undefined

  return (
    <ThemedView card border style={styles.card}>
      <ThemedText muted style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText style={[styles.value, color && { color }]}>{display}</ThemedText>
    </ThemedView>
  )
}

const formatCompact = (val: number) => {
  if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(2)}B`
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(2)}M`
  if (val >= 1_000) return `${(val / 1_000).toFixed(2)}K`
  return val.toFixed(2)
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: { padding: 12, borderRadius: 12, minWidth: "45%" },
  title: { marginBottom: 4 },
  value: { fontWeight: "600", fontSize: 16 },
})
