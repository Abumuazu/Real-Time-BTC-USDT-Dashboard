export type BybitTickerFields = {
  lastPrice?: string
  markPrice?: string
  indexPrice?: string
  highPrice24h?: string
  lowPrice24h?: string
  turnover24h?: string
  price24hPcnt?: string
  volume24h?: string
  ask1Price?: string
  bid1Price?: string
  symbol?: string
}

export type BybitTickerMsg = {
  topic: "tickers.BTCUSDT"
  type: "snapshot" | "delta"
  ts: number
  data: Array<BybitTickerFields> | BybitTickerFields
}
