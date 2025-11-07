import React from "react";
import { QueryProvider } from "./QueryProvider";
import { FullScreenGate } from "../widgets/Skeletons/FullScreenGate";
import { StatusBarController } from "./StatusBarController";
import { useThemeTokens } from "../shared/theme/useTheme";
import { NavigationDark, NavigationLight } from "../shared/navigation/theme";
export const AppProviders: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <QueryProvider>
      <FullScreenGate>
        <StatusBarController />
        {children}
      </FullScreenGate>
    </QueryProvider>
  );
};
export const useNavigationTheme = () => {
  const t = useThemeTokens();
  return t.isDark ? NavigationDark : NavigationLight;
};
