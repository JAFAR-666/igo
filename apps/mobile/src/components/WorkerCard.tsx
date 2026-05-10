import { Pressable, StyleSheet, Text, View } from "react-native";
import { Theme } from "../theme/theme";

type WorkerCardProps = {
  worker: {
    id: string;
    name: string;
    rating: number;
    experience: string;
    pricing: string;
    distance: string;
    availability: string;
    verified: boolean;
    languages: string[];
    skills: string[];
  };
  onPress: () => void;
};

export function WorkerCard({ worker, onPress }: WorkerCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.name}>{worker.name}</Text>
          <Text style={styles.meta}>
            {worker.rating} rating • {worker.experience} • {worker.distance}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{worker.availability}</Text>
        </View>
      </View>
      <Text style={styles.skills}>{worker.skills.join(" • ")}</Text>
      <Text style={styles.languages}>{worker.languages.join(", ")}</Text>
      <View style={styles.footer}>
        <Text style={styles.price}>{worker.pricing}</Text>
        <Text style={styles.verified}>{worker.verified ? "Verified" : "Pending"}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.border,
    gap: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Theme.colors.text,
  },
  meta: {
    color: Theme.colors.muted,
  },
  badge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: Theme.colors.success,
    fontWeight: "700",
  },
  skills: {
    color: Theme.colors.text,
  },
  languages: {
    color: Theme.colors.muted,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    fontWeight: "700",
    color: Theme.colors.accentDark,
  },
  verified: {
    color: Theme.colors.success,
  },
});
