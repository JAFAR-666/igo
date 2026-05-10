import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ModeSwitcher } from "../components/ModeSwitcher";
import { Screen } from "../components/Screen";
import { SectionTitle } from "../components/SectionTitle";
import { WorkerCard } from "../components/WorkerCard";
import { defaultCategories } from "../constants/categories";
import { mockNearbyWorkers } from "../data/mock";
import { Theme } from "../theme/theme";

export function CustomerHomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <Screen>
      <ModeSwitcher />
      <SectionTitle title="Find trusted local workers" subtitle="Fast booking for home repair, cleaning, transport, and site jobs." />
      <TextInput placeholder="Search service or worker" style={styles.search} />
      <View style={styles.categoryWrap}>
        {defaultCategories.slice(0, 8).map((category) => (
          <Pressable key={category} style={styles.categoryPill}>
            <Text style={styles.categoryLabel}>{category}</Text>
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.emergencyCard} onPress={() => navigation.navigate("Booking")}>
        <Text style={styles.emergencyTitle}>Emergency booking</Text>
        <Text style={styles.emergencyText}>Need urgent help? Send a nearby worker request with one tap.</Text>
      </Pressable>
      <SectionTitle title="Nearby workers" subtitle="Ranked by trust, response speed, and affordability." />
      {mockNearbyWorkers.map((worker) => (
        <WorkerCard key={worker.id} worker={worker} onPress={() => navigation.navigate("WorkerProfile", { workerId: worker.id })} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: Theme.colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryPill: {
    backgroundColor: "#FFF0E2",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  categoryLabel: {
    color: Theme.colors.accentDark,
    fontWeight: "600",
  },
  emergencyCard: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 20,
    gap: 6,
  },
  emergencyTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
  },
  emergencyText: {
    color: "#E5E7EB",
  },
});
