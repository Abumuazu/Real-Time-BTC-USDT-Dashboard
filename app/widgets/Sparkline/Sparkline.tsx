import React, { useMemo } from "react"
import { View } from "react-native"
import Svg, { Path } from "react-native-svg"

type P = {
  data: { ts: number; last: number }[]
  width?: number
  height?: number
  stroke?: string
  strokeWidth?: number
}

export const Sparkline: React.FC<P> = ({
  data,
  width = 160,
  height = 48,
  stroke = "#2563eb",
  strokeWidth = 2,
}) => {
  const path = useMemo(() => {
    if (!data?.length) return ""
    const min = Math.min(...data.map((d) => d.last))
    const max = Math.max(...data.map((d) => d.last))
    const tmin = data[0].ts,
      tmax = data[data.length - 1].ts || tmin + 1
    const scaleX = (ts: number) => ((ts - tmin) / (tmax - tmin || 1)) * width
    const scaleY = (v: number) => height - ((v - min) / (max - min || 1)) * height
    return data.reduce(
      (acc, d, i) => acc + (i ? "L" : "M") + `${scaleX(d.ts)},${scaleY(d.last)}`,
      "",
    )
  }, [data, width, height])
  return (
    <View>
      <Svg width={width} height={height}>
        <Path d={path} strokeWidth={strokeWidth} fill="none" stroke={stroke} />
      </Svg>
    </View>
  )
}
