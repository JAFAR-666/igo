import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import { Screen } from "../components/Screen";
import { SectionTitle } from "../components/SectionTitle";
import { Theme } from "../theme/theme";

export function BookingScreen() {
  const navigation = useNavigation<any>();

  return (
    <Screen>
      <SectionTitle title="Create booking" subtitle="Share address, time, work scope, and media so the worker comes prepared." />
      <TextInput style={styles.input} placeholder="Name" />
      <TextInput style={styles.input} placeholder="Mobile number" />
      <TextInput style={styles.input} placeholder="Address" />
      <TextInput style={styles.input} placeholder="Preferred time slot" />
      <TextInput style={[styles.input, styles.textArea]} multiline placeholder="Describe the work" />
      <Pressable style={styles.mediaButton}>
        <Text style={styles.mediaButtonText}>Upload images or video</Text>
      </Pressable>
      <Pressable style={styles.bookButton} onPress={() => navigation.navigate("Tracking", { bookingId: "booking-1" })}>
        <Text style={styles.bookButtonText}>Send booking request</Text>
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
    minHeight: 120,
    textAlignVertical: "top",
  },
  mediaButton: {
    backgroundColor: "#FFF3E8",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  mediaButtonText: {
    color: Theme.colors.accentDark,
    fontWeight: "700",
  },
  bookButton: {
    backgroundColor: Theme.colors.accent,
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontWeight: "700",
  },
});
