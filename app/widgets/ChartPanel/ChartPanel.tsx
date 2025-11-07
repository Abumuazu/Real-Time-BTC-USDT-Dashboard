import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { WebView } from "react-native-webview"
import { useThemeStore } from "../../entities/theme/model"
import { useNetInfo } from "@react-native-community/netinfo"
import { StyleSheet, View } from "react-native"
import { ThemedText, ThemedView } from "../../shared/ui/Themed"

const CHART_HTML = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <style>
    html, body, #container { height: 100%; margin: 0; padding: 0; background: transparent; }
  </style>
  <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
</head>
<body>
  <div id="container"></div>
  <script>
    const widgetOptions = {
      symbol: "BYBIT:BTCUSDT",
      autosize: true,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      enable_publishing: false,
      allow_symbol_change: false,
      hide_side_toolbar: false,
      container_id: "container",
      withdateranges: true,
      studies: ["MASimple@tv-basicstudies"],
    };
    let widget = null;
    function createWidget(theme) {
      widgetOptions.theme = theme || "light";
      widget = new TradingView.widget(widgetOptions);
    }
    function applyTheme(theme) {
      const normalized = theme === "dark" ? "dark" : "light";
      if (widget && widget.changeTheme) {
        widget.changeTheme(normalized);
      } else {
        const root = document.getElementById("container");
        if (root) root.innerHTML = "";
        createWidget(normalized);
      }
    }
    function ensureTradingView(theme) {
      if (window.TradingView && window.TradingView.widget) {
        createWidget(theme);
      } else {
        setTimeout(function () { ensureTradingView(theme); }, 100);
      }
    }
    ensureTradingView("light");
    function handleMessage(event) {
      try {
        const msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (msg && msg.type === "theme") {
          applyTheme(msg.value);
        }
      } catch (err) {}
    }
    document.addEventListener("message", handleMessage);
    window.addEventListener("message", handleMessage);
  </script>
</body>
</html>`

export const ChartPanel: React.FC = () => {
  const mode = useThemeStore((s) => s.mode)
  const ref = useRef<WebView>(null)
  const theme = mode === "dark" ? "dark" : "light"
  const netInfo = useNetInfo()
  const [reloadKey, setReloadKey] = useState(0)
  const [hasError, setHasError] = useState(false)

  const isOnline = useMemo(() => {
    if (netInfo.isConnected === false) return false
    if (netInfo.isInternetReachable === false) return false
    return true
  }, [netInfo.isConnected, netInfo.isInternetReachable])

  const postTheme = useCallback(
    (value: string) => {
      const payload = JSON.stringify({ type: "theme", value })
      ref.current?.postMessage(payload)
    },
    [],
  )

  useEffect(() => {
    postTheme(theme)
  }, [theme, postTheme])

  useEffect(() => {
    if (isOnline && hasError) {
      setHasError(false)
      setReloadKey((prev) => prev + 1)
    }
  }, [isOnline, hasError])

  if (!isOnline || hasError) {
    return (
      <ThemedView border card style={styles.offlineContainer}>
        <ThemedText muted style={styles.offlineTitle}>
          Chart unavailable
        </ThemedText>
        <ThemedText muted style={styles.offlineSubtitle}>
          {hasError
            ? "TradingView will reload automatically when your connection recovers."
            : "Reconnect to load "}
        </ThemedText>
      </ThemedView>
    )
  }

  return (
    <View key={reloadKey} style={styles.wrapper}>
      <WebView
        ref={ref}
        source={{ html: CHART_HTML, baseUrl: "https://s3.tradingview.com" }}
        originWhitelist={["*"]}
        allowFileAccess
        javaScriptEnabled
        onLoad={() => postTheme(theme)}
        onError={() => setHasError(true)}
        onHttpError={() => setHasError(true)}
        setSupportMultipleWindows={false}
        automaticallyAdjustContentInsets={false}
        scrollEnabled={false}
        style={styles.webview}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    height: 500,
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 16,
  },
  webview: {
    height: 500,
    backgroundColor: "transparent",
  },
  offlineContainer: {
    height: 500,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  offlineTitle: {
    fontWeight: "600",
    marginBottom: 4,
  },
  offlineSubtitle: {
    fontSize: 13,
    textAlign: "center",
  },
})
