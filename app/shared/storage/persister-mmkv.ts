import type { PersistedClient, Persister } from "@tanstack/react-query-persist-client"
import { storage } from "./mmkv"
export const createMMKVPersister = (key: string): Persister => ({
  persistClient: async (client: PersistedClient) => {
    try {
      storage.set(key, JSON.stringify(client))
    } catch {}
  },
  restoreClient: async () => {
    try {
      const raw = storage.getString(key)
      return raw ? JSON.parse(raw) : undefined
    } catch {
      return undefined
    }
  },
  removeClient: async () => {
    try {
      storage.delete(key)
    } catch {}
  },
})
