import React, { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { useThemeTokens } from "../shared/theme/useTheme";
export const StatusBarController: React.FC = () => {
  const t = useThemeTokens();
  useEffect(() => {
    const barStyle = t.isDark ? "light-content" : "dark-content";
    StatusBar.setBarStyle(barStyle, true);
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(t.colors.bg, true);
      StatusBar.setTranslucent(false);
    }
  }, [t.isDark, t.colors.bg]);
  return null;
};
