import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { Screen } from "../components/Screen";
import { SectionTitle } from "../components/SectionTitle";
import { Theme } from "../theme/theme";

export function ReviewsScreen() {
  return (
    <Screen>
      <SectionTitle title="Rate the work" subtitle="Capture skill, behavior, punctuality, and pricing feedback." />
      <TextInput style={styles.input} placeholder="Skill rating (1-5)" />
      <TextInput style={styles.input} placeholder="Behavior rating (1-5)" />
      <TextInput style={styles.input} placeholder="Punctuality rating (1-5)" />
      <TextInput style={styles.input} placeholder="Pricing rating (1-5)" />
      <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Write your review" />
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Submit review</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: Theme.colors.accent,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
  },
});
