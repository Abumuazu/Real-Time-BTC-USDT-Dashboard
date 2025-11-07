import { useEffect, useRef, useState } from "react"
import NetInfo from "@react-native-community/netinfo"
import { BybitWS, WsStatus } from "../../shared/api/bybit/ws"
import { startWsBridge } from "../../shared/lib/ws-bridge"
export type Conn = "idle" | "connecting" | "open" | "degraded" | "closed" | "retrying"
export function useWsConnection() {
  const [status, setStatus] = useState<Conn>("idle")
  const wsRef = useRef<BybitWS | null>(null)
  const stopRef = useRef<(() => void) | null>(null)
  const statusRef = useRef<Conn>("idle")
  useEffect(() => {
    statusRef.current = status
    if (__DEV__) {
      console.log(`[WS-FSM] status → ${status}`)
    }
  }, [status])
  useEffect(() => {
    const unsubNet = NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        setStatus("closed")
        wsRef.current?.close()
        stopRef.current?.()
      } else if (statusRef.current === "closed") {
        reconnect()
      }
    })
    reconnect()
    return () => {
      unsubNet()
      wsRef.current?.close()
      stopRef.current?.()
    }
  }, [])
  const reconnect = () => {
    setStatus("connecting")
    const ws = new BybitWS({
      onStatus: (next) => {
        updateStatus(next, setStatus)
      },
    })
    wsRef.current = ws
    ws.connect()
    stopRef.current = startWsBridge(ws)
    if (__DEV__) {
      console.log("[WS-FSM] reconnect invoked")
    }
  }
  return { status, reconnect }
}

function updateStatus(next: WsStatus, setStatus: (s: Conn) => void) {
  if (next === "open") setStatus("open")
  else if (next === "retrying") setStatus("retrying")
  else if (next === "connecting") setStatus("connecting")
  else setStatus("closed")
}
