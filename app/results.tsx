import { useLocalSearchParams } from 'expo-router';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const COLORS = {
  primary: '#007AFF',
  background: '#eef6ff',
  card: '#ffffff',
  text: '#1c1c1e',
  border: '#d0d7de',
};

export default function Results() {
  const params = useLocalSearchParams();

  const weight = parseFloat(params.weight as string);
  const height = parseFloat(params.height as string);
  const age = parseFloat(params.age as string);
  const gender = params.gender as string;
  const activity = parseFloat(params.activity as string);
  const targetWeight = parseFloat(params.targetWeight as string);
  const speed = parseFloat(params.speed as string);

  let bmr = 0;

  if (gender === 'male') {
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

      <Pressable style={styles.button}>
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