import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

// Activity options with MET values
const ACTIVITIES = [
  { name: "Walking", met: 4.3 },
  { name: "Running", met: 8.3 },
  { name: "Cycling", met: 6.8 },
  { name: "Football", met: 7.0 },
  { name: "Gym Workout", met: 5.0 },
  { name: "Swimming", met: 6.0 },
];

// Main activity logging screen
export default function LogActivity() {
  const router = useRouter();

  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [minutes, setMinutes] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null);

  // Calculate calories burned using MET formula
  const handleCalculate = async () => {
    if (!selectedActivity) {
      Alert.alert("Error", "Please choose an activity");
      return;
    }

    if (!minutes.trim()) {
      Alert.alert("Error", "Please enter minutes");
      return;
    }

    const parsedMinutes = parseFloat(minutes);

    if (isNaN(parsedMinutes) || parsedMinutes <= 0) {
      Alert.alert("Error", "Enter valid minutes");
      return;
    }

    const storedWeight = await AsyncStorage.getItem("currentWeight");
    const weight = storedWeight ? parseFloat(storedWeight) : 0;

    if (weight <= 0) {
      Alert.alert("Error", "No saved weight found");
      return;
    }

    const hours = parsedMinutes / 60;

    const burned =
      selectedActivity.met * weight * hours;

    setCaloriesBurned(Math.round(burned));
  };

  // Save activity to storage
  const handleSave = async () => {
    if (caloriesBurned === null || !selectedActivity) {
      Alert.alert("Error", "Calculate calories first");
      return;
    }

    try {
      const existing = await AsyncStorage.getItem("activityLog");
      const activityLog = existing ? JSON.parse(existing) : [];

      const newEntry = {
        activity: selectedActivity.name,
        minutes: Number(minutes),
        caloriesBurned: caloriesBurned,
        date: new Date().toISOString().split("T")[0],
      };

      activityLog.push(newEntry);

      await AsyncStorage.setItem(
        "activityLog",
        JSON.stringify(activityLog)
      );

      Alert.alert("Success", "Activity saved");
      router.replace("/activity-hub");
    } catch (error) {
      Alert.alert("Error", "Failed to save activity");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Log Activity</Text>
      <Text style={styles.subtitle}>
        Record exercise and earn calories back for today
      </Text>

      {/* Activity choices */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Choose Activity</Text>

        {ACTIVITIES.map((item, index) => (
          <Pressable
            key={index}
            style={[
              styles.optionButton,
              selectedActivity?.name === item.name &&
                styles.optionButtonActive,
            ]}
            onPress={() => setSelectedActivity(item)}
          >
            <Text
              style={[
                styles.optionText,
                selectedActivity?.name === item.name &&
                  styles.optionTextActive,
              ]}
            >
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Minutes input */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Duration</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter minutes"
          keyboardType="numeric"
          value={minutes}
          onChangeText={setMinutes}
        />

        <Pressable
          style={styles.button}
          onPress={handleCalculate}
        >
          <Text style={styles.buttonText}>
            Calculate Calories
          </Text>
        </Pressable>

        {caloriesBurned !== null && (
          <Text style={styles.resultText}>
            Estimated Calories Burned: {caloriesBurned} kcal
          </Text>
        )}
      </View>

      <Pressable
        style={styles.button}
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>Save Activity</Text>
      </Pressable>

      <Pressable
        style={styles.buttonSecondary}
        onPress={() => router.push("/activity-hub" as any)}
      >
        <Text style={styles.buttonSecondaryText}>
          Back to Activity Tracker
        </Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
  },
  optionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: "center",
  },
  optionTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
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
  resultText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 8,
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