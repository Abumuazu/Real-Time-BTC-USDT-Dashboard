import { Appearance } from "react-native"
import { useThemeStore } from "../../entities/theme/model"
import { lightTokens, darkTokens, ThemeTokens } from "./tokens"
export function useThemeTokens(): ThemeTokens {
  const mode = useThemeStore((s) => s.mode)
  const system = Appearance.getColorScheme() ?? "light"
  const effective = mode === "system" ? system : mode
  return effective === "dark" ? darkTokens : lightTokens
}
