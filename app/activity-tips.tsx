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
  background: "#eef6ff",
  card: "#ffffff",
  text: "#1c1c1e",
  border: "#d0d7de",
  muted: "#666",
};

// Screen showing helpful activity advice for weight loss
export default function ActivityTips() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Activity Tips</Text>
      <Text style={styles.subtitle}>
        Simple ways to stay active and support your weight loss journey
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>1. Be consistent</Text>
        <Text style={styles.cardText}>
          Regular activity is more effective than doing one intense workout once
          in a while. Even 20 to 30 minutes can make a difference.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>2. Walking still counts</Text>
        <Text style={styles.cardText}>
          Walking is one of the easiest ways to burn extra calories and improve
          fitness. A brisk walk can support fat loss when done consistently.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>3. Combine diet and activity</Text>
        <Text style={styles.cardText}>
          Weight loss works best when calorie control is combined with regular
          movement. Activity can help increase the calories you burn each day.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>4. Choose activities you enjoy</Text>
        <Text style={styles.cardText}>
          You are more likely to stay consistent when you pick activities you
          actually like, such as football, gym training, cycling or swimming.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>5. Progress matters more than perfection</Text>
        <Text style={styles.cardText}>
          Missing one day does not ruin your progress. Focus on building better
          habits over time instead of trying to be perfect every day.
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/activity-hub" as any)}
      >
        <Text style={styles.buttonText}>Back to Activity Tracker</Text>
      </Pressable>

      <Pressable
        style={styles.buttonSecondary}
        onPress={() => router.push("/home" as any)}
      >
        <Text style={styles.buttonSecondaryText}>Back Home</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.primary,
    marginTop: 20,
  },
  subtitle: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 6,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSecondary: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonSecondaryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});