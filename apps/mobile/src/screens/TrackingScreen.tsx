import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Theme } from "../theme/theme";

export function TrackingScreen() {
  const navigation = useNavigation<any>();

  return (
    <Screen>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapTitle}>Live tracking</Text>
        <Text style={styles.mapCopy}>Google Maps placeholder for worker location, route, and ETA.</Text>
        <Text style={styles.eta}>ETA: 12 mins</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Arrival OTP</Text>
        <Text style={styles.cardText}>Share `438291` with the worker when they arrive to start the job.</Text>
      </View>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Payments", { bookingId: "booking-1" })}>
        <Text style={styles.buttonText}>Continue to payment</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapPlaceholder: {
    minHeight: 300,
    borderRadius: 28,
    backgroundColor: "#DDEEFE",
    padding: 20,
    justifyContent: "flex-end",
    gap: 6,
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Theme.colors.text,
  },
  mapCopy: {
    color: Theme.colors.text,
  },
  eta: {
    color: Theme.colors.accentDark,
    fontWeight: "700",
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  cardText: {
    color: Theme.colors.muted,
    marginTop: 8,
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
