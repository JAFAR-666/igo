import { StyleSheet, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { SectionTitle } from "../components/SectionTitle";
import { mockBookings } from "../data/mock";
import { Theme } from "../theme/theme";

export function BookingHistoryScreen() {
  return (
    <Screen>
      <SectionTitle title="Bookings" subtitle="Track active jobs, past work, and payment status." />
      {mockBookings.map((item) => (
        <View key={item.id} style={styles.card}>
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
          <View>
            <Text style={styles.status}>{item.status}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "700",
    color: Theme.colors.text,
  },
  time: {
    color: Theme.colors.muted,
    marginTop: 4,
  },
  status: {
    textAlign: "right",
    color: Theme.colors.success,
    fontWeight: "700",
  },
  price: {
    marginTop: 4,
    textAlign: "right",
    color: Theme.colors.accentDark,
  },
});
