import { queryClient } from "../queryClientSingleton"
import { RingBuffer } from "./ring-buffer"
import type { BybitTickerMsg } from "../api/bybit/types"
type Ticker = {
  ts: number
  last: number
  mark: number
  high24h: number
  low24h: number
  turnover24h: number
  volume24h: number
  change24h: number
}
const buffer = new RingBuffer<BybitTickerMsg>(256)
let rafId: number | null = null
export const startWsBridge = (source: { subscribe: (fn: (m: any) => void) => () => void }) => {
  const unsub = source.subscribe((msg: any) => {
    if (msg?.topic === "tickers.BTCUSDT") {
      buffer.push(msg as BybitTickerMsg)
      if (rafId == null) rafId = requestAnimationFrame(flush)
    }
  })
  return () => {
    unsub()
    if (rafId != null) cancelAnimationFrame(rafId)
    rafId = null
    buffer.clear()
  }
}
function flush() {
  const msgs = buffer.shiftAll()
  if (msgs.length) {
    const last = msgs[msgs.length - 1] as BybitTickerMsg

    const prev =
      (queryClient.getQueryData<Ticker>(["ticker", "BTCUSDT"]) as Ticker | undefined) || {
        ts: Date.now(),
        last: 0,
        mark: 0,
        high24h: 0,
        low24h: 0,
        turnover24h: 0,
        volume24h: 0,
        change24h: 0,
      }

    const rows = Array.isArray(last.data)
      ? last.data
      : last.data
        ? [last.data]
        : []

    if (!rows.length) {
      if (__DEV__) {
        console.warn("[WS-Bridge] message missing data", last)
      }
      rafId = null
      return
    }

    const merged = rows.reduce<Record<string, string | undefined>>((acc, item) => {
      Object.entries(item ?? {}).forEach(([key, value]) => {
        if (value !== undefined) acc[key] = value as string
      })
      return acc
    }, {})

    const safeParse = (value: string | undefined, fallback: number) => {
      if (value == null || value === "") return fallback
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : fallback
    }

    const next: Ticker = {
      ts: typeof last.ts === "number" ? last.ts : prev.ts,
      last: safeParse(merged.lastPrice ?? merged.price, prev.last),
      mark: safeParse(merged.markPrice ?? merged.indexPrice ?? merged.lastPrice, prev.mark),
      high24h: safeParse(merged.highPrice24h, prev.high24h),
      low24h: safeParse(merged.lowPrice24h, prev.low24h),
      turnover24h: safeParse(merged.turnover24h, prev.turnover24h),
      volume24h: safeParse(merged.volume24h, prev.volume24h),
      change24h: safeParse(merged.price24hPcnt, prev.change24h),
    }
    queryClient.setQueryData(["ticker", "BTCUSDT"], next)
  }
  rafId = null
}
