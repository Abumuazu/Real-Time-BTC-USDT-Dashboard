import { act } from "@testing-library/react-native";
import { useThemeStore } from "../app/entities/theme/model";
test("theme store toggles mode", () => {
  const set = useThemeStore.getState().setMode;
  act(() => set("dark"));
  expect(useThemeStore.getState().mode).toBe("dark");
});
