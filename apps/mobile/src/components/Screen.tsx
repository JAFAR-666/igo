import type { PropsWithChildren } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Theme } from "../theme/theme";

export function Screen({ children }: PropsWithChildren) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
});
