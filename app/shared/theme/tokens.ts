export type ThemeTokens = {
  isDark: boolean
  colors: {
    bg: string
    card: string
    text: string
    textMuted: string
    skeletonBase: string
    skeletonShimmer: string
    up: string
    down: string
    accent: string
    border: string
  }
}
export const lightTokens: ThemeTokens = {
  isDark: false,
  colors: {
    bg: "#FFFFFF",
    card: "#F7F7F9",
    text: "#0F141A",
    textMuted: "rgba(15,20,26,0.6)",
    skeletonBase: "#0F141A10",
    skeletonShimmer: "#0F141A15",
    up: "#16a34a",
    down: "#dc2626",
    accent: "#2563eb",
    border: "#00000014",
  },
}
export const darkTokens: ThemeTokens = {
  isDark: true,
  colors: {
    bg: "#0B0F14",
    card: "#121820",
    text: "#E6EEF5",
    textMuted: "rgba(230,238,245,0.6)",
    skeletonBase: "#E6EEF510",
    skeletonShimmer: "#E6EEF515",
    up: "#22c55e",
    down: "#ef4444",
    accent: "#60a5fa",
    border: "#FFFFFF22",
  },
}
