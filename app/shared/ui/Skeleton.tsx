import React from "react";
import { View, ViewStyle, StyleSheet } from "react-native";
import Animated, { useSharedValue, withRepeat, withTiming, useAnimatedStyle, interpolate } from "react-native-reanimated";
import { useThemeTokens } from "../theme/useTheme";
type Props = { width?: number | string; height?: number; style?: ViewStyle };
export const Skeleton: React.FC<Props> = ({ width = "100%", height = 16, style }) => {
  const t = useThemeTokens(); const progress = useSharedValue(0);
  React.useEffect(() => { progress.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true); }, [progress]);
  const shimmerStyle = useAnimatedStyle(() => { const translateX = interpolate(progress.value, [0, 1], [-50, 50]); return { transform: [{ translateX }] }; });
  return (<View style={[styles.container, { backgroundColor: t.colors.skeletonBase, width, height }, style]}><Animated.View style={[styles.shimmer, { backgroundColor: t.colors.skeletonShimmer }, shimmerStyle]} /></View>);
};
const styles = StyleSheet.create({ container: { overflow: "hidden", borderRadius: 8 }, shimmer: { position: "absolute", top: 0, bottom: 0, width: 50 }, });
