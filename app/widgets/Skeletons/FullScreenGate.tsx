import React from "react";
import { View, StyleSheet } from "react-native";
import { Skeleton } from "../../shared/ui/Skeleton";
import { useRQIsRestoring } from "../../providers/QueryProvider";
export const FullScreenGate: React.FC<React.PropsWithChildren> = ({ children }) => {
  const isRestoring = useRQIsRestoring();
  if (isRestoring) {
    return (
      <View style={styles.container}>
        <Skeleton width={220} height={28} style={{ marginBottom: 12 }} />
        <Skeleton width={180} height={24} style={{ marginBottom: 16 }} />
        <View style={styles.cards}>
          <Skeleton width={"46%"} height={64} style={{ marginBottom: 12 }} />
          <Skeleton width={"46%"} height={64} style={{ marginBottom: 12 }} />
          <Skeleton width={"46%"} height={64} style={{ marginBottom: 12 }} />
          <Skeleton width={"46%"} height={64} style={{ marginBottom: 12 }} />
        </View>
        <Skeleton width={"100%"} height={320} />
      </View>
    );
  }
  return <>{children}</>;
};
const styles = StyleSheet.create({ container: { flex: 1, padding: 16, justifyContent: "flex-start" }, cards: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }, });
