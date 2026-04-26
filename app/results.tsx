import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getUserStorageKey, STORAGE_KEYS } from "../utils/storage";

const COLORS = {
  primary: '#007AFF',
  background: '#eef6ff',
  card: '#ffffff',
  text: '#1c1c1e',
  border: '#d0d7de',
};
// Displays calculated calorie targets based on user input
export default function Results() {
  const router = useRouter();
  const params = useLocalSearchParams();
// Retrieve user data passed from previous screens
  const weight = parseFloat(params.weight as string);
  const height = parseFloat(params.height as string);
  const age = parseFloat(params.age as string);
  const gender = params.gender as string;
  const activity = parseFloat(params.activity as string);
  const targetWeight = parseFloat(params.targetWeight as string);
  const speed = parseFloat(params.speed as string);

  let bmr = 0;
// Calculate Basal Metabolic Rate using Mifflin-St Jeor formula
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
// Apply activity multiplier to get total daily energy expenditure
  const tdee = bmr * activity;

  let calorieDeficit = 0;
// Determine calorie deficit based on selected weight loss speed
  if (speed === 0.5) {
    calorieDeficit = 500;
  } else if (speed === 1) {
    calorieDeficit = 1000;
  }
// Final calorie targets
  const targetCalories = Math.round(tdee - calorieDeficit);
  const maintenanceCalories = Math.round(tdee);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Results</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Weight</Text>
        <Text style={styles.value}>{weight} kg</Text>

        <Text style={styles.label}>Target Weight</Text>
        <Text style={styles.value}>{targetWeight} kg</Text>

        <Text style={styles.label}>Maintenance Calories</Text>
        <Text style={styles.value}>{maintenanceCalories} kcal/day</Text>

        <Text style={styles.label}>Weight Loss Calories</Text>
        <Text style={styles.value}>{targetCalories} kcal/day</Text>

        <Text style={styles.label}>Selected Speed</Text>
        <Text style={styles.value}>{speed} kg per week</Text>
      </View>

<Pressable
  style={styles.button}
  onPress={async () => {
  await AsyncStorage.setItem(getUserStorageKey(STORAGE_KEYS.targetWeight), targetWeight.toString());
  await AsyncStorage.setItem(getUserStorageKey(STORAGE_KEYS.speed), speed.toString());
  await AsyncStorage.setItem(getUserStorageKey(STORAGE_KEYS.targetCalories), targetCalories.toString());

  const startingEntry = {
  weight: weight,
  date: new Date().toISOString().split("T")[0],
};
  await AsyncStorage.setItem(
  getUserStorageKey(STORAGE_KEYS.weightHistory),
  JSON.stringify([startingEntry])
);

await AsyncStorage.setItem(getUserStorageKey(STORAGE_KEYS.setupComplete), "true");

  router.replace('/home');
}}
>
  <Text style={styles.buttonText}>Continue</Text>
</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.primary,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});