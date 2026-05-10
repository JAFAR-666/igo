import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { Screen } from "../components/Screen";
import { SectionTitle } from "../components/SectionTitle";
import { Theme } from "../theme/theme";

export function WorkerOnboardingScreen() {
  return (
    <Screen>
      <SectionTitle title="Worker onboarding" subtitle="Complete KYC, add pricing, and describe your skills with text or voice." />
      <TextInput style={styles.input} placeholder="Bio / work description" />
      <TextInput style={styles.input} placeholder="Experience in years" />
      <TextInput style={styles.input} placeholder="Languages" />
      <TextInput style={styles.input} placeholder="Skills text" />
      <Pressable style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Use voice to fill skills</Text>
      </Pressable>
      <TextInput style={styles.input} placeholder="Hourly rate" />
      <TextInput style={styles.input} placeholder="Half day rate" />
      <TextInput style={styles.input} placeholder="Full day rate" />
      <Pressable style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Upload Aadhaar / PAN / Voter ID</Text>
      </Pressable>
      <Pressable style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Submit for approval</Text>
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
  secondaryButton: {
    backgroundColor: "#FFF0E5",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: Theme.colors.accentDark,
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: Theme.colors.accent,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "700",
  },
});
