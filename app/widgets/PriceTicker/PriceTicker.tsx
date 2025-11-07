import React, { useEffect } from "react"
import { TextStyle } from "react-native"
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated"

type Props = {
  value?: number
  style?: TextStyle
  upColor?: string
  downColor?: string
  neutralColor?: string
}

export const PriceTicker: React.FC<Props> = ({
  value,
  style,
  upColor = "#16a34a",
  downColor = "#dc2626",
  neutralColor = "#0f141a",
}) => {
  const last = useSharedValue(value ?? 0)
  const direction = useSharedValue(0)
  const pulse = useSharedValue(0)
  const upColorSv = useSharedValue(upColor)
  const downColorSv = useSharedValue(downColor)
  const neutralColorSv = useSharedValue(neutralColor)
  const upBgSv = useSharedValue(applyAlpha(upColor, 0.12))
  const downBgSv = useSharedValue(applyAlpha(downColor, 0.12))

  useEffect(() => {
    if (value == null) return
    const diff = value - last.value
    direction.value = diff > 0 ? 1 : diff < 0 ? -1 : direction.value
    last.value = value
    pulse.value = 1
    pulse.value = withTiming(0, { duration: 450 })
  }, [value])
  useEffect(() => {
    upColorSv.value = upColor
    downColorSv.value = downColor
    neutralColorSv.value = neutralColor
    upBgSv.value = applyAlpha(upColor, 0.12)
    downBgSv.value = applyAlpha(downColor, 0.12)
  }, [upColor, downColor, neutralColor])

  const animStyle = useAnimatedStyle(() => {
    const bg = interpolateColor(
      pulse.value,
      [0, 1],
      ["transparent", direction.value >= 0 ? upBgSv.value : downBgSv.value],
    )
    const color =
      direction.value > 0
        ? upColorSv.value
        : direction.value < 0
          ? downColorSv.value
          : neutralColorSv.value
    return {
      backgroundColor: bg,
      borderRadius: 8,
      paddingHorizontal: 6,
      color,
    }
  })

  return (
    <Animated.Text style={[{ fontSize: 32, fontWeight: "800" } as TextStyle, animStyle, style]}>
      {value != null ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "--"}
    </Animated.Text>
  )
}

function applyAlpha(hex: string, alpha: number) {
  const normalized = hex.replace("#", "")
  const bigint = parseInt(normalized.length === 3 ? normalized.repeat(2) : normalized, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r},${g},${b},${alpha})`
}
