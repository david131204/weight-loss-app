import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
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

// Activity tips list with icons
const TIPS = [
  {
    title: "Be consistent",
    text: "Regular activity is more effective than one intense workout every now and then. Even 20 to 30 minutes can make a difference.",
    icon: "repeat-outline",
  },
  {
    title: "Walking still counts",
    text: "Walking is one of the easiest ways to burn extra calories and improve fitness. A brisk walk can support fat loss when done consistently.",
    icon: "walk-outline",
  },
  {
    title: "Combine diet and activity",
    text: "Weight loss works best when calorie control is combined with regular movement. Activity can help increase the calories you burn each day.",
    icon: "nutrition-outline",
  },
  {
    title: "Choose activities you enjoy",
    text: "You are more likely to stay consistent when you pick activities you actually like, such as football, gym training, cycling or swimming.",
    icon: "heart-outline",
  },
  {
    title: "Progress matters more than perfection",
    text: "Missing one day does not ruin your progress. Focus on building better habits over time instead of trying to be perfect every day.",
    icon: "trending-up-outline",
  },
];

// Screen showing helpful activity advice for weight loss
export default function ActivityTips() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Back navigation */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>

      {/* Header section */}
      <View style={styles.header}>
        <Text style={styles.title}>Activity Tips</Text>
        <Text style={styles.subtitle}>
          Simple ways to stay active and support your weight loss journey.
        </Text>
      </View>

      {/* Highlight card */}
      <View style={styles.heroCard}>
        <View style={styles.heroIconBox}>
          <Ionicons name="walk-outline" size={32} color={COLORS.primary} />
        </View>

        <Text style={styles.heroTitle}>Small actions add up</Text>
        <Text style={styles.heroText}>
          Building a routine with realistic activity goals can make your calorie
          tracking easier to maintain.
        </Text>
      </View>

      {/* Loop through tips */}
      {TIPS.map((tip, index) => (
        <View key={index} style={styles.tipCard}>
          <View style={styles.tipTopRow}>
            <View style={styles.tipIconBox}>
              <Ionicons name={tip.icon as any} size={22} color={COLORS.primary} />
            </View>

            <View style={styles.tipTextBox}>
              <Text style={styles.tipNumber}>Tip {index + 1}</Text>
              <Text style={styles.cardTitle}>{tip.title}</Text>
            </View>
          </View>

          <Text style={styles.cardText}>{tip.text}</Text>
        </View>
      ))}

      {/* Navigation back to activity hub */}
      <Pressable
        style={styles.primaryAction}
        onPress={() => router.push("/activity-hub" as any)}
      >
        <View style={styles.actionContent}>
          <Ionicons name="walk-outline" size={24} color="#fff" />
          <View>
            <Text style={styles.primaryActionTitle}>Activity Tracker</Text>
            <Text style={styles.primaryActionSubtitle}>
              Return to the activity hub
            </Text>
          </View>
        </View>

        <Text style={styles.actionArrow}>›</Text>
      </Pressable>

      {/* Back to home */}
      <Pressable
        style={styles.secondaryAction}
        onPress={() => router.push("/home" as any)}
      >
        <Text style={styles.secondaryActionText}>Back Home</Text>
      </Pressable>
    </ScrollView>
  );
}

// Styles for Activity Tips screen
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
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  heroIconBox: {
    width: 62,
    height: 62,
    borderRadius: 22,
    backgroundColor: "#e8f1ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },
  heroText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
  },
  tipCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
  },
  tipTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#e8f1ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tipTextBox: {
    flex: 1,
  },
  tipNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  cardText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  primaryAction: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 18,
    marginTop: 6,
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
  },
  actionArrow: {
    color: "#fff",
    fontSize: 28,
  },
  secondaryAction: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbe3ef",
  },
  secondaryActionText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
});