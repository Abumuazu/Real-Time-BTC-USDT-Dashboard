import React from "react";
import { StyleSheet } from "react-native";
import { Skeleton } from "../../shared/ui/Skeleton";
import { ThemedView } from "../../shared/ui/Themed";
export const DashboardSkeleton: React.FC = () => {
  return (
    <ThemedView style={styles.container}>
      <Skeleton width={220} height={28} style={{ marginBottom: 12 }} />
      <Skeleton width={180} height={24} style={{ marginBottom: 16 }} />
      <ThemedView style={styles.cards}>
        <Skeleton width={"46%"} height={64} style={{ marginBottom: 12 }} />
        <Skeleton width={"46%"} height={64} style={{ marginBottom: 12 }} />
        <Skeleton width={"46%"} height={64} style={{ marginBottom: 12 }} />
        <Skeleton width={"46%"} height={64} style={{ marginBottom: 12 }} />
      </ThemedView>
      <Skeleton width={"100%"} height={320} />
    </ThemedView>
  )
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: "flex-start" },
  cards: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
})
