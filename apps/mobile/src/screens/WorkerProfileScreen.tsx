import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Theme } from "../theme/theme";

export function WorkerProfileScreen() {
  const navigation = useNavigation<any>();

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.name}>Ramesh Kumar</Text>
        <Text style={styles.meta}>4.8 rating • 6 years experience • Verified</Text>
        <Text style={styles.copy}>
          Skilled electrician for home wiring, fan fitting, MCB issues, and urgent repairs. Speaks Hindi and Telugu.
        </Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Pricing</Text>
        <Text style={styles.infoItem}>Hourly: ₹450</Text>
        <Text style={styles.infoItem}>Half day: ₹1,450</Text>
        <Text style={styles.infoItem}>Full day: ₹2,500</Text>
      </View>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Booking", { workerId: "worker-1" })}>
        <Text style={styles.buttonText}>Book this worker</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#FFF2E5",
    borderRadius: 28,
    padding: 22,
    gap: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    color: Theme.colors.text,
  },
  meta: {
    color: Theme.colors.muted,
  },
  copy: {
    color: Theme.colors.text,
    lineHeight: 22,
  },
  infoCard: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    padding: 18,
    gap: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  infoItem: {
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
