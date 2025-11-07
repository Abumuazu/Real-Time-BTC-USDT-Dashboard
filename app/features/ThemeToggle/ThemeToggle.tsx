import React from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { useThemeStore } from "../../entities/theme/model"
import { hapticToggle } from "../../shared/lib/haptics"
import { useThemeTokens } from "../../shared/theme/useTheme"
import { ThemedText } from "../../shared/ui/Themed"
export const ThemeToggle: React.FC = () => {
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)
  const next = mode === "light" ? "dark" : "light"
  const t = useThemeTokens()
  return (
    <View style={styles.row}>
      <ThemedText muted style={styles.label}>
        Theme
      </ThemedText>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: t.colors.card }]}
        onPress={() => {
          hapticToggle()
          setMode(next as any)
        }}
      >
        <ThemedText style={[styles.btnText, { color: t.colors.text }]}>
          {next.toUpperCase()}
        </ThemedText>
      </TouchableOpacity>
    </View>
  )
}
const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  label: { opacity: 0.7 },
  btn: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  btnText: { fontWeight: "700" },
})
