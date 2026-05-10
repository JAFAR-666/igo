import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { SectionTitle } from "../components/SectionTitle";
import { Theme } from "../theme/theme";

export function PaymentsScreen() {
  const navigation = useNavigation<any>();

  return (
    <Screen>
      <SectionTitle title="Payment" subtitle="MVP currently supports cash and UPI." />
      <View style={styles.optionCard}>
        <Text style={styles.optionTitle}>Cash</Text>
        <Text style={styles.optionCopy}>Collect payment directly after work completion.</Text>
      </View>
      <View style={styles.optionCard}>
        <Text style={styles.optionTitle}>UPI</Text>
        <Text style={styles.optionCopy}>Pay by QR or UPI ID after confirming the amount.</Text>
      </View>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Reviews", { bookingId: "booking-1", workerId: "worker-1" })}>
        <Text style={styles.buttonText}>Mark payment complete</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  optionCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: 6,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  optionCopy: {
    color: Theme.colors.muted,
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
