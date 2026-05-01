import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getUserStorageKey, STORAGE_KEYS } from "../utils/storage";

const COLORS = {
  primary: "#007AFF",
  background: "#eaf1fb",
  card: "#ffffff",
  text: "#1c1c1e",
  border: "#d0d7de",
  muted: "#666",
};

export default function Results() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const weight = parseFloat(params.weight as string);
  const height = parseFloat(params.height as string);
  const age = parseFloat(params.age as string);
  const gender = params.gender as string;
  const activity = parseFloat(params.activity as string);
  const targetWeight = parseFloat(params.targetWeight as string);
  const speed = parseFloat(params.speed as string);

  let bmr = 0;

  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const tdee = bmr * activity;

  let calorieDeficit = 0;

  if (speed === 0.5) {
    calorieDeficit = 500;
  } else if (speed === 1) {
    calorieDeficit = 1000;
  }

  const targetCalories = Math.round(tdee - calorieDeficit);
  const maintenanceCalories = Math.round(tdee);

  const saveResults = async () => {
    await AsyncStorage.setItem(
      getUserStorageKey(STORAGE_KEYS.targetWeight),
      targetWeight.toString()
    );
    await AsyncStorage.setItem(
      getUserStorageKey(STORAGE_KEYS.speed),
      speed.toString()
    );
    await AsyncStorage.setItem(
      getUserStorageKey(STORAGE_KEYS.targetCalories),
      targetCalories.toString()
    );

    const startingEntry = {
      weight,
      date: new Date().toISOString().split("T")[0],
    };

    await AsyncStorage.setItem(
      getUserStorageKey(STORAGE_KEYS.weightHistory),
      JSON.stringify([startingEntry])
    );

    await AsyncStorage.setItem(
      getUserStorageKey(STORAGE_KEYS.setupComplete),
      "true"
    );

    router.replace("/home");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Your Results</Text>
        <Text style={styles.subtitle}>
          Your estimated calorie target based on your setup details.
        </Text>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Daily weight loss target</Text>
        <Text style={styles.heroValue}>{targetCalories}</Text>
        <Text style={styles.heroUnit}>kcal per day</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Plan summary</Text>
          <Text style={styles.sectionBadge}>Estimate</Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Current</Text>
            <Text style={styles.summaryValue}>{weight} kg</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Target</Text>
            <Text style={styles.summaryValue}>{targetWeight} kg</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Maintenance</Text>
            <Text style={styles.summaryValue}>{maintenanceCalories}</Text>
            <Text style={styles.summaryUnit}>kcal/day</Text>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Speed</Text>
            <Text style={styles.summaryValue}>{speed} kg</Text>
            <Text style={styles.summaryUnit}>per week</Text>
          </View>
        </View>
      </View>

      <View style={styles.disclaimerBox}>
        <View style={styles.disclaimerHeader}>
          <Ionicons name="warning-outline" size={20} color="#92400e" />
          <Text style={styles.disclaimerTitle}>Important</Text>
        </View>

        <Text style={styles.disclaimerText}>
          Calorie targets are estimates only and do not replace medical advice.
          If you have health conditions or specific dietary needs, consult a
          healthcare professional.
        </Text>
      </View>

      <Pressable style={styles.primaryAction} onPress={saveResults}>
        <View style={styles.actionContent}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
          <View>
            <Text style={styles.primaryActionTitle}>Start Tracking</Text>
            <Text style={styles.primaryActionSubtitle}>
              Save your plan and open the dashboard
            </Text>
          </View>
        </View>

        <Text style={styles.actionArrow}>›</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginTop: 6,
    lineHeight: 21,
  },
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    alignItems: "center",
  },
  heroLabel: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  heroValue: {
    color: "#fff",
    fontSize: 46,
    fontWeight: "800",
    letterSpacing: -1,
  },
  heroUnit: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  sectionBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
    backgroundColor: "#e8f1ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  summaryBox: {
    width: "47.5%",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  summaryUnit: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 3,
  },
  disclaimerBox: {
    backgroundColor: "#fff7e6",
    borderWidth: 1,
    borderColor: "#facc15",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  disclaimerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  disclaimerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#92400e",
  },
  disclaimerText: {
    fontSize: 13,
    color: "#78350f",
    lineHeight: 19,
  },
  primaryAction: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  primaryActionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  primaryActionSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginTop: 4,
  },
  actionArrow: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "400",
    marginLeft: 12,
  },
});