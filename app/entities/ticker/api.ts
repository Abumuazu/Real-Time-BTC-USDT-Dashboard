import { useQuery, QueryKey } from "@tanstack/react-query"

export type Ticker = {
  ts: number
  last: number
  mark: number
  high24h: number
  low24h: number
  turnover24h: number
  volume24h: number
  change24h: number
}

export const tickerKey = (symbol: string): QueryKey => ["ticker", symbol]

export const useTickerQuery = (symbol: string) => {
  return useQuery<Ticker>({
    queryKey: tickerKey(symbol),
    // Real-time data is injected via the websocket bridge. We disable the fetcher so
    // React Query simply observes the cache populated by `queryClient.setQueryData`.
    queryFn: async () => {
      throw new Error("Ticker snapshot fetch disabled; data is provided by the WebSocket bridge")
    },
    enabled: false,
    retry: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  })
}
