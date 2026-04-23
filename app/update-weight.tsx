import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getUserStorageKey, STORAGE_KEYS } from "../utils/storage";
// Screen for updating user's weight and recalculating calorie targets
export default function UpdateWeight() {
  const [weight, setWeight] = useState("");
  const router = useRouter();
// Save new weight and update related data
  const handleSave = async () => {
  if (!weight.trim()) {
    Alert.alert("Error", "Please enter your weight");
    return;
  }

  const parsedWeight = parseFloat(weight);

  if (isNaN(parsedWeight)) {
    Alert.alert("Error", "Enter a valid number");
    return;
  }

  try {
    const existing = await AsyncStorage.getItem(getUserStorageKey(STORAGE_KEYS.weightHistory));
    let history = existing ? JSON.parse(existing) : [];
// Create a new weight entry with today's date
    const newEntry = {
      weight: parsedWeight,
      date: new Date().toISOString().split("T")[0],
    };

    history.push(newEntry);
// Save updated weight history and current weight for current user
await AsyncStorage.setItem(
  getUserStorageKey(STORAGE_KEYS.weightHistory),
  JSON.stringify(history)
);

await AsyncStorage.setItem(
  getUserStorageKey(STORAGE_KEYS.currentWeight),
  String(parsedWeight)
);

// Retrieve current user's saved data for recalculating calories
const height = await AsyncStorage.getItem(
  getUserStorageKey(STORAGE_KEYS.height)
);

const age = await AsyncStorage.getItem(
  getUserStorageKey(STORAGE_KEYS.age)
);

const gender = await AsyncStorage.getItem(
  getUserStorageKey(STORAGE_KEYS.gender)
);

const activity = await AsyncStorage.getItem(
  getUserStorageKey(STORAGE_KEYS.activity)
);

const speed = await AsyncStorage.getItem(
  getUserStorageKey(STORAGE_KEYS.speed)
);

if (height && age && gender && activity && speed) {
  const h = parseFloat(height);
  const a = parseFloat(age);
  const act = parseFloat(activity);
  const s = parseFloat(speed);

  let bmr = 0;
// Recalculate BMR using updated weight
  if (gender === "male") {
    bmr = 10 * parsedWeight + 6.25 * h - 5 * a + 5;
  } else {
    bmr = 10 * parsedWeight + 6.25 * h - 5 * a - 161;
  }
// Calculate TDEE using activity level
  const tdee = bmr * act;

  let calorieDeficit = 0;
// Apply deficit based on weight loss speed
  if (s === 0.5) {
    calorieDeficit = 500;
  } else if (s === 1) {
    calorieDeficit = 1000;
  }
// Update daily calorie target
  const newTargetCalories = Math.round(tdee - calorieDeficit);

  await AsyncStorage.setItem(getUserStorageKey(STORAGE_KEYS.targetCalories), String(newTargetCalories));
}

Alert.alert("Success", "Weight saved");
 // Return to Home to reflect updated values
router.replace("/home");
  } catch (error) {
    Alert.alert("Error", "Failed to save weight");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Weight</Text>

      <Text style={styles.label}>Enter your current weight (kg)</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 92.5"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Weight</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "white",
    marginBottom: 30,
  },
  label: {
    color: "#cbd5f5",
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});