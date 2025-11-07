import { Theme } from "@react-navigation/native"
import { lightTokens, darkTokens } from "../theme/tokens"
export const NavigationLight: Theme = {
  dark: false,
  colors: {
    primary: "#2563eb",
    background: lightTokens.colors.bg,
    card: lightTokens.colors.card,
    text: lightTokens.colors.text,
    border: lightTokens.colors.border,
    notification: "#ef4444",
  },
  fonts: {
    regular: { fontFamily: "Inter-Regular", fontWeight: "400" },
    medium: { fontFamily: "Inter-Medium", fontWeight: "600" },
    bold: { fontFamily: "Inter-Bold", fontWeight: "700" },
    heavy: { fontFamily: "Inter-Heavy", fontWeight: "900" },
  },
}
export const NavigationDark: Theme = {
  dark: true,
  colors: {
    primary: "#60a5fa",
    background: darkTokens.colors.bg,
    card: darkTokens.colors.card,
    text: darkTokens.colors.text,
    border: darkTokens.colors.border,
    notification: "#ef4444",
  },
  fonts: {
    regular: { fontFamily: "Inter-Regular", fontWeight: "400" },
    medium: { fontFamily: "Inter-Medium", fontWeight: "600" },
    bold: { fontFamily: "Inter-Bold", fontWeight: "700" },
    heavy: { fontFamily: "Inter-Heavy", fontWeight: "900" },
  },
}
