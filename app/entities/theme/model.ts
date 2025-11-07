import { create } from "zustand"
import { storage } from "../../shared/storage/mmkv"
type ThemeMode = "light" | "dark" | "system"
type State = { mode: ThemeMode }
type Actions = { setMode: (m: ThemeMode) => void }
const KEY = "theme-mode"
export const useThemeStore = create<State & Actions>()((set) => ({
  mode: (storage.getString(KEY) as ThemeMode) || "system",
  setMode: (m: ThemeMode) => {
    storage.set(KEY, m)
    set({ mode: m })
  },
}))
