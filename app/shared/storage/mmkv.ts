import { MMKV } from "react-native-mmkv"
export const storage = new MMKV({ id: "btcApp-mmkv" })
export const getBoolean = (key: string, fallback = false) => {
  try {
    return storage.getBoolean(key) ?? fallback
  } catch {
    return fallback
  }
}
export const getString = (key: string, fallback?: string) => {
  try {
    return storage.getString(key) ?? fallback
  } catch {
    return fallback
  }
}
export const set = (key: string, value: string | number | boolean) => storage.set(key, value)
