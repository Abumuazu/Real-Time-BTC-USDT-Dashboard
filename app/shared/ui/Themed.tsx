import React from "react"
import { Text as RNText, View as RNView, StyleSheet, TextProps, ViewProps } from "react-native"
import { useThemeTokens } from "../theme/useTheme"
export const ThemedView: React.FC<ViewProps & { card?: boolean; border?: boolean }> = ({
  style,
  card,
  border,
  ...rest
}) => {
  const t = useThemeTokens()
  return (
    <RNView
      {...rest}
      style={[
        { backgroundColor: card ? t.colors.card : t.colors.bg },
        border && { borderColor: t.colors.border, borderWidth: StyleSheet.hairlineWidth },
        style,
      ]}
    />
  )
}
export const ThemedText: React.FC<TextProps & { muted?: boolean }> = ({
  style,
  muted,
  ...rest
}) => {
  const t = useThemeTokens()
  return <RNText {...rest} style={[{ color: muted ? t.colors.textMuted : t.colors.text }, style]} />
}
