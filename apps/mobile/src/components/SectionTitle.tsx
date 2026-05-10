import { StyleSheet, Text, View } from "react-native";
import { Theme } from "../theme/theme";

type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Theme.colors.text,
  },
  subtitle: {
    color: Theme.colors.muted,
    lineHeight: 20,
  },
});
