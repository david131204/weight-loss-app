import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = {
  primary: "#007AFF",
  background: "#eaf1fb",
  card: "#ffffff",
  text: "#1c1c1e",
  border: "#d0d7de",
  muted: "#666",
};

export default function GoalSpeed() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [speed, setSpeed] = useState<number | null>(null);

  const continueNext = () => {
    if (!speed) {
      alert("Please select a weight loss speed");
      return;
    }

    router.push({
      pathname: "/results",
      params: {
        ...(params as any),
        speed: speed.toString(),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
          <Text style={styles.title}>Weight Loss Speed</Text>
          <Text style={styles.subtitle}>
            Choose how fast you want to lose weight each week.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Select speed</Text>
            <Text style={styles.sectionBadge}>Step 3</Text>
          </View>

          <Text style={styles.helperText}>
            Faster weight loss requires a larger calorie deficit.
          </Text>

          <Pressable
            style={[
              styles.optionCard,
              speed === 0.5 && styles.selectedCard,
            ]}
            onPress={() => setSpeed(0.5)}
          >
            <Text style={speed === 0.5 ? styles.selectedText : styles.optionTitle}>
              0.5 kg per week
            </Text>
            <Text style={speed === 0.5 ? styles.selectedSub : styles.optionSub}>
              Steady and sustainable
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.optionCard,
              speed === 1 && styles.selectedCard,
            ]}
            onPress={() => setSpeed(1)}
          >
            <Text style={speed === 1 ? styles.selectedText : styles.optionTitle}>
              1 kg per week
            </Text>
            <Text style={speed === 1 ? styles.selectedSub : styles.optionSub}>
              Faster results, more aggressive
            </Text>
          </Pressable>
        </View>

        <Pressable style={styles.primaryAction} onPress={continueNext}>
          <View style={styles.actionContent}>
            <Ionicons name="arrow-forward-circle-outline" size={24} color="#fff" />
            <View>
              <Text style={styles.primaryActionTitle}>Continue</Text>
              <Text style={styles.primaryActionSubtitle}>
                View your calorie plan
              </Text>
            </View>
          </View>

          <Text style={styles.actionArrow}>›</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: 10,
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
  helperText: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 16,
    lineHeight: 20,
  },
  optionCard: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
  },
  selectedCard: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  optionSub: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
  },
  selectedText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  selectedSub: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginTop: 4,
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