import React, { useEffect, useRef } from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { ThemedView, ThemedText } from "../../shared/ui/Themed"
import { hapticSuccess, hapticWarning, hapticError } from "../../shared/lib/haptics"
import { useThemeTokens } from "../../shared/theme/useTheme"
type Props = {
  status: "connected" | "disconnected" | "retrying" | "connecting"
  onReconnect: () => void
}
export const ConnectionBanner: React.FC<Props> = ({ status, onReconnect }) => {
  const prev = useRef(status)
  const t = useThemeTokens()
  useEffect(() => {
    if (prev.current !== status) {
      if (status === "connected") hapticSuccess()
      else if (status === "retrying" || status === "connecting") hapticWarning()
      else hapticError()
      prev.current = status
    }
  }, [status])
  const color =
    status === "connected"
      ? "#2ecc71"
      : status === "retrying"
        ? "#f39c12"
        : status === "connecting"
          ? t.colors.accent
          : "#e74c3c"
  return (
    <ThemedView border style={[styles.container, { backgroundColor: t.colors.card }]}>
      <ThemedText style={[styles.text, { color }]}>
        {status === "connected"
          ? "Connected"
          : status === "connecting"
            ? "Connecting..."
            : status === "retrying"
              ? "Reconnecting..."
              : "Disconnected"}
      </ThemedText>
      {status !== "connected" && (
        <TouchableOpacity
          onPress={() => {
            hapticWarning()
            onReconnect()
          }}
        >
          <ThemedText style={[styles.text, { color, fontWeight: "700" }]}>Reconnect</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  )
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: { fontSize: 14 },
})
