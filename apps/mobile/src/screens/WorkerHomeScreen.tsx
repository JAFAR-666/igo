import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ModeSwitcher } from "../components/ModeSwitcher";
import { Screen } from "../components/Screen";
import { SectionTitle } from "../components/SectionTitle";
import { Theme } from "../theme/theme";

export function WorkerHomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <Screen>
      <ModeSwitcher />
      <SectionTitle title="Worker dashboard" subtitle="Toggle availability, manage jobs, and track earnings in one place." />

      <View style={styles.statsGrid}>
        <StatCard label="Today" value="₹1,450" />
        <StatCard label="This week" value="₹8,200" />
        <StatCard label="Jobs done" value="18" />
        <StatCard label="Rating" value="4.8" />
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Go Online</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("WorkerOnboarding")}>
          <Text style={styles.secondaryButtonText}>Edit Profile</Text>
        </Pressable>
      </View>

      <View style={styles.jobCard}>
        <Text style={styles.jobTitle}>Incoming request</Text>
        <Text style={styles.jobBody}>2 BHK deep cleaning • Rajahmundry • 3.2 km away • ₹850 estimated</Text>
        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Reject</Text>
          </Pressable>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Accept</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    width: "47%",
    backgroundColor: Theme.colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  statLabel: {
    color: Theme.colors.muted,
  },
  statValue: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "800",
    color: Theme.colors.text,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: Theme.colors.accent,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: Theme.colors.surface,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.colors.border,
  },
  secondaryButtonText: {
    color: Theme.colors.text,
    fontWeight: "700",
  },
  jobCard: {
    backgroundColor: "#FFF1E6",
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Theme.colors.text,
  },
  jobBody: {
    color: Theme.colors.muted,
    lineHeight: 20,
  },
});
