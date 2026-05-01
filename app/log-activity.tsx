import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getUserStorageKey, STORAGE_KEYS } from "../utils/storage";
import { updateDailyStreak } from "../utils/streak";

const COLORS = {
  primary: "#007AFF",
  background: "#eaf1fb",
  card: "#ffffff",
  text: "#1c1c1e",
  border: "#d0d7de",
  muted: "#666",
};

const ACTIVITIES = [
  { name: "Walking", met: 4.3, icon: "walk-outline" },
  { name: "Running", met: 8.3, icon: "fitness-outline" },
  { name: "Cycling", met: 6.8, icon: "bicycle-outline" },
  { name: "Football", met: 7.0, icon: "football-outline" },
  { name: "Gym Workout", met: 5.0, icon: "barbell-outline" },
  { name: "Swimming", met: 6.0, icon: "water-outline" },
];

export default function LogActivity() {
  const router = useRouter();

  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [minutes, setMinutes] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);

  const handleCalculate = async () => {
    if (!selectedActivity) {
      Alert.alert("Error", "Please choose an activity");
      return;
    }

    const parsedMinutes = parseFloat(minutes);

    if (isNaN(parsedMinutes) || parsedMinutes <= 0) {
      Alert.alert("Error", "Please enter valid minutes");
      return;
    }

    const storedWeight = await AsyncStorage.getItem(
      getUserStorageKey(STORAGE_KEYS.currentWeight)
    );
    const weight = storedWeight ? parseFloat(storedWeight) : 0;

    if (weight <= 0) {
      Alert.alert("Error", "No saved weight found");
      return;
    }

    const hours = parsedMinutes / 60;
    const burned = selectedActivity.met * weight * hours;

    Keyboard.dismiss();
    setCaloriesBurned(Math.round(burned));
  };

  const handleSave = async () => {
    if (caloriesBurned === null || !selectedActivity) {
      Alert.alert("Error", "Calculate calories first");
      return;
    }

    try {
      const existing = await AsyncStorage.getItem(
        getUserStorageKey(STORAGE_KEYS.activityLog)
      );
      const activityLog = existing ? JSON.parse(existing) : [];

      const newEntry = {
        activity: selectedActivity.name,
        minutes: Number(minutes),
        caloriesBurned,
        date: new Date().toISOString().split("T")[0],
      };

      activityLog.push(newEntry);

      await AsyncStorage.setItem(
        getUserStorageKey(STORAGE_KEYS.activityLog),
        JSON.stringify(activityLog)
      );

      await updateDailyStreak();

      Alert.alert("Success", "Activity saved");
      router.replace("/activity-hub");
    } catch (error) {
      Alert.alert("Error", "Failed to save activity");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Log Activity</Text>
        <Text style={styles.subtitle}>
          Record exercise and add burned calories to today’s summary.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>Choose activity</Text>
          <Text style={styles.sectionBadge}>MET</Text>
        </View>

        <View style={styles.activityGrid}>
          {ACTIVITIES.map((item, index) => {
            const isSelected = selectedActivity?.name === item.name;

            return (
              <Pressable
                key={index}
                style={[styles.activityOption, isSelected && styles.selectedActivity]}
                onPress={() => {
                  setSelectedActivity(item);
                  setCaloriesBurned(null);
                }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={isSelected ? "#fff" : COLORS.primary}
                />
                <Text style={isSelected ? styles.selectedActivityText : styles.activityText}>
                  {item.name}
                </Text>
                <Text style={isSelected ? styles.selectedMetText : styles.metText}>
                  MET {item.met}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Duration</Text>
        <Text style={styles.helperText}>
          Enter how long you exercised for in minutes.
        </Text>

        <View style={styles.inputRow}>
          <Ionicons name="time-outline" size={20} color={COLORS.muted} />
          <TextInput
            style={styles.input}
            placeholder="Enter minutes"
            placeholderTextColor={COLORS.muted}
            keyboardType="numeric"
            value={minutes}
            onChangeText={(value) => {
              setMinutes(value);
              setCaloriesBurned(null);
            }}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
        </View>

        <Pressable style={styles.secondaryAction} onPress={handleCalculate}>
          <Text style={styles.secondaryActionText}>Calculate Calories</Text>
        </Pressable>
      </View>

      {caloriesBurned !== null ? (
        <View style={styles.resultCard}>
          <View style={styles.resultIconBox}>
            <Ionicons name="flame-outline" size={28} color={COLORS.primary} />
          </View>

          <Text style={styles.resultLabel}>Estimated calories burned</Text>
          <Text style={styles.resultValue}>{caloriesBurned} kcal</Text>
          <Text style={styles.resultSubtext}>
            Based on MET value, saved body weight and exercise duration.
          </Text>
        </View>
      ) : null}

      <Pressable style={styles.primaryAction} onPress={handleSave}>
        <View style={styles.actionContent}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
          <View>
            <Text style={styles.primaryActionTitle}>Save Activity</Text>
            <Text style={styles.primaryActionSubtitle}>
              Add this to your activity log
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
  activityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  activityOption: {
    width: "48%",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
  },
  selectedActivity: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  activityText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  selectedActivityText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  metText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 4,
  },
  selectedMetText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 20,
  },
  inputRow: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    color: COLORS.text,
    fontSize: 16,
  },
  secondaryAction: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryActionText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  resultCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  resultIconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#e8f1ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 34,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.8,
  },
  resultSubtext: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 8,
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