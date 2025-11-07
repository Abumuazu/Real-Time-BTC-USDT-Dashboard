import React from "react"
import { StyleSheet } from "react-native"
import { useNetInfo } from "@react-native-community/netinfo"
import { ThemedText, ThemedView } from "../../shared/ui/Themed"
import { useThemeTokens } from "../../shared/theme/useTheme"

export const NetworkBanner: React.FC = () => {
  const netInfo = useNetInfo()
  const t = useThemeTokens()

  const isOffline = netInfo.isConnected === false
  const isUnreachable = !isOffline && netInfo.isInternetReachable === false
  const isChecking = !isOffline && netInfo.isInternetReachable == null

  if (!isOffline && !isUnreachable && !isChecking) {
    return null
  }

  let message = ""
  let accent = t.colors.accent

  if (isOffline) {
    message = "No internet connection"
    accent = t.colors.down
  } else if (isUnreachable) {
    message = "Internet is unreachable"
    accent = t.colors.accent
  } else {
    message = "Checking network status…"
    accent = t.colors.textMuted
  }

  return (
    <ThemedView
      card
      border
      pointerEvents="none"
      style={[styles.container, { borderColor: accent, backgroundColor: t.colors.card }]}
    >
      <ThemedText style={[styles.text, { color: accent }]}>{message}</ThemedText>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
})

