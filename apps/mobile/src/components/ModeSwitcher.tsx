import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { Theme } from "../theme/theme";

export function ModeSwitcher() {
  const { activeMode, switchMode, user } = useAuth();

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={() => switchMode("customer")}
        style={[styles.pill, activeMode === "customer" && styles.pillActive]}
      >
        <Text style={[styles.pillLabel, activeMode === "customer" && styles.pillLabelActive]}>Customer</Text>
      </Pressable>
      <Pressable
        onPress={() => switchMode(user?.isWorkerEnabled ? "worker" : "customer")}
        style={[styles.pill, activeMode === "worker" && styles.pillActive]}
      >
        <Text style={[styles.pillLabel, activeMode === "worker" && styles.pillLabelActive]}>Worker</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    backgroundColor: "#F2E7DB",
    borderRadius: 999,
    padding: 4,
  },
  pill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  pillActive: {
    backgroundColor: Theme.colors.surface,
  },
  pillLabel: {
    color: Theme.colors.muted,
    fontWeight: "600",
  },
  pillLabelActive: {
    color: Theme.colors.text,
  },
});
