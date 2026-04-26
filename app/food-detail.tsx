import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { getUserStorageKey, STORAGE_KEYS } from "../utils/storage";

const COLORS = {
  primary: "#007AFF",
  background: "#eef6ff",
  card: "#ffffff",
  text: "#1c1c1e",
  border: "#d0d7de",
};

// Screen for entering portion size and calculating nutrition
export default function FoodDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [grams, setGrams] = useState("");

  const name = params.name as string;
  const caloriesPer100g = Number(params.caloriesPer100g);
  const proteinPer100g = Number(params.proteinPer100g);
  const carbsPer100g = Number(params.carbsPer100g);
  const fatPer100g = Number(params.fatPer100g);

  // Calculate nutrition values based on entered grams
  const nutrition = useMemo(() => {
    const gramsValue = parseFloat(grams);

    if (isNaN(gramsValue) || gramsValue <= 0) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };
    }

    const factor = gramsValue / 100;

    return {
      calories: caloriesPer100g * factor,
      protein: proteinPer100g * factor,
      carbs: carbsPer100g * factor,
      fat: fatPer100g * factor,
    };
  }, [grams, caloriesPer100g, proteinPer100g, carbsPer100g, fatPer100g]);

  // Save selected food entry to food log
  const addToLog = async () => {
    const gramsValue = parseFloat(grams);

    if (isNaN(gramsValue) || gramsValue <= 0) {
      Alert.alert("Error", "Please enter a valid weight in grams");
      return;
    }

    try {
      const existing = await AsyncStorage.getItem(getUserStorageKey(STORAGE_KEYS.foodLog));
      const foodLog = existing ? JSON.parse(existing) : [];

      const newEntry = {
        id: Date.now().toString(),
        name,
        grams: gramsValue,
        calories: Number(nutrition.calories.toFixed(1)),
        protein: Number(nutrition.protein.toFixed(1)),
        carbs: Number(nutrition.carbs.toFixed(1)),
        fat: Number(nutrition.fat.toFixed(1)),
        date: new Date().toISOString().split("T")[0],
      };

      foodLog.push(newEntry);

      await AsyncStorage.setItem(getUserStorageKey(STORAGE_KEYS.foodLog), JSON.stringify(foodLog));

      Alert.alert("Success", "Food added to log");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", "Failed to save food entry");
    }
  };

 return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Per 100 g</Text>
        <Text style={styles.value}>Calories: {caloriesPer100g} kcal</Text>
        <Text style={styles.value}>Protein: {proteinPer100g} g</Text>
        <Text style={styles.value}>Carbs: {carbsPer100g} g</Text>
        <Text style={styles.value}>Fat: {fatPer100g} g</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter grams eaten"
        placeholderTextColor="#666"
        keyboardType="numeric"
        value={grams}
        onChangeText={setGrams}
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />

      <View style={styles.card}>
        <Text style={styles.label}>For {grams || 0} g</Text>
        <Text style={styles.value}>
          Calories: {nutrition.calories.toFixed(1)} kcal
        </Text>
        <Text style={styles.value}>
          Protein: {nutrition.protein.toFixed(1)} g
        </Text>
        <Text style={styles.value}>
          Carbs: {nutrition.carbs.toFixed(1)} g
        </Text>
        <Text style={styles.value}>
          Fat: {nutrition.fat.toFixed(1)} g
        </Text>
      </View>

      <Pressable style={styles.button} onPress={addToLog}>
        <Text style={styles.buttonText}>Add to Log</Text>
      </Pressable>
          </View>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  value: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});