import pako from "pako"

const WS_URL = "wss://stream.bybit.com/v5/public/linear"
type Listener = (msg: any) => void
export type WsStatus = "connecting" | "open" | "retrying" | "closed"

export class BybitWS {
  private ws?: WebSocket
  private listeners = new Set<Listener>()
  private backoff = 1000
  private shouldClose = false
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private symbol: string
  private onStatus?: (status: WsStatus) => void
  private pingTimer: ReturnType<typeof setInterval> | null = null
  private logPrefix: string

  constructor(options: { symbol?: string; onStatus?: (status: WsStatus) => void } = {}) {
    this.symbol = options.symbol ?? "BTCUSDT"
    this.onStatus = options.onStatus
    this.logPrefix = `[WS ${this.symbol}]`
  }

  connect() {
    this.shouldClose = false
    this.notify("connecting")
    if (__DEV__) {
      console.log(`${this.logPrefix} connecting to ${WS_URL}`)
    }
    this.ws = new WebSocket(WS_URL)
    this.ws.onopen = () => {
      this.backoff = 1000
      this.notify("open")
      if (__DEV__) {
        console.log(`${this.logPrefix} open - subscribing to tickers.${this.symbol}`)
      }
      this.subscribeTicker(this.symbol)
      this.startPing()
    }
    this.ws.onmessage = (e) => {
      const data = this.parseMessage(e.data)
      if (!data) return
      if (data?.op === "ping") {
        if (__DEV__) {
          console.log(`${this.logPrefix} ← ping`)
        }
        this.send({ op: "pong" })
        return
      }
      if (__DEV__ && data?.op === "subscribe" && data?.success) {
        console.log(`${this.logPrefix} subscription acknowledged`, data)
      }
      this.listeners.forEach((l) => l(data))
    }
    this.ws.onclose = (event) => {
      if (__DEV__) {
        console.warn(`${this.logPrefix} closed`, event.reason)
      }
      this.scheduleReconnect()
    }
    this.ws.onerror = (event) => {
      if (__DEV__) {
        console.error(`${this.logPrefix} error`, event)
      }
      this.scheduleReconnect()
    }
  }

  private scheduleReconnect() {
    if (this.shouldClose) {
      this.notify("closed")
      this.stopPing()
      return
    }
    this.notify("retrying")
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    const jitter = Math.floor(Math.random() * 300)
    const delay = this.backoff + jitter
    if (__DEV__) {
      console.warn(`${this.logPrefix} reconnecting in ${delay}ms`)
    }
    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
    this.backoff = Math.min(this.backoff * 2, 30_000)
  }

  close() {
    this.shouldClose = true
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    this.stopPing()
    if (__DEV__) {
      console.log(`${this.logPrefix} closing`)
    }
    this.notify("closed")
    this.ws?.close()
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private send(json: any) {
    if (this.ws?.readyState === 1) {
      this.ws.send(JSON.stringify(json))
    }
  }

  subscribeTicker(symbol: string) {
    this.symbol = symbol
    this.send({ op: "subscribe", args: [`tickers.${symbol}`] })
  }

  private notify(status: WsStatus) {
    this.onStatus?.(status)
    if (__DEV__) {
      console.log(`${this.logPrefix} status → ${status}`)
    }
  }

  private startPing() {
    this.stopPing()
    this.pingTimer = setInterval(() => {
      this.send({ op: "ping" })
      if (__DEV__) {
        console.log(`${this.logPrefix} → ping`)
      }
    }, 20_000)
  }

  private stopPing() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer)
      this.pingTimer = null
    }
  }

  private parseMessage(data: any) {
    try {
      if (typeof data === "string") {
        return JSON.parse(data)
      }
      if (data instanceof ArrayBuffer) {
        const inflated = pako.inflate(new Uint8Array(data), { to: "string" }) as string
        return JSON.parse(inflated)
      }
      if (__DEV__) {
        console.warn(`${this.logPrefix} unknown message type`, typeof data)
      }
    } catch (error) {
      if (__DEV__) {
        console.error(`${this.logPrefix} failed to parse message`, error)
      }
    }
    return null
  }
}
