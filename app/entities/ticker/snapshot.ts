import type { Ticker } from "./api"

type SnapshotItem = {
  lastPrice: string
  markPrice: string
  highPrice24h: string
  lowPrice24h: string
  turnover24h: string
  price24hPcnt: string
  volume24h?: string
  indexPrice?: string
}

type SnapshotResponse = {
  retCode: number
  retMsg: string
  time: number
  result?: {
    list?: SnapshotItem[]
  }
}

const SNAPSHOT_ENDPOINT = "https://api.bybit.com/v5/market/tickers?category=linear"

const toNumber = (value: string | undefined) => {
  if (!value) return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export async function fetchTickerSnapshot(symbol: string): Promise<Ticker> {
  const url = `${SNAPSHOT_ENDPOINT}&symbol=${encodeURIComponent(symbol)}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Snapshot request failed with status ${response.status}`)
  }

  const json = (await response.json()) as SnapshotResponse
  if (json.retCode !== 0) {
    throw new Error(json.retMsg || "Bybit snapshot error")
  }

  const item = json.result?.list?.[0]
  // console.log("item", item)
  if (!item) {
    throw new Error("Snapshot payload missing ticker data")
  }

  const ts = typeof json.time === "number" ? json.time : Date.now()

  return {
    ts,
    last: toNumber(item.lastPrice),
    mark: toNumber(item.markPrice || item.indexPrice),
    high24h: toNumber(item.highPrice24h),
    low24h: toNumber(item.lowPrice24h),
    turnover24h: toNumber(item.turnover24h),
    volume24h: toNumber(item.volume24h),
    change24h: toNumber(item.price24hPcnt),
  }
}

