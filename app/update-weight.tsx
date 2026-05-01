import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
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

// Screen for updating user's weight and recalculating calorie targets
export default function UpdateWeight() {
  const [weight, setWeight] = useState("");
  const router = useRouter();

  // Save new weight and update related data
  const handleSave = async () => {
    const parsedWeight = parseFloat(weight);

    if (!weight.trim() || isNaN(parsedWeight) || parsedWeight <= 0) {
      Alert.alert("Error", "Please enter a valid weight");
      return;
    }

    try {
      const existing = await AsyncStorage.getItem(
        getUserStorageKey(STORAGE_KEYS.weightHistory)
      );
      const history = existing ? JSON.parse(existing) : [];

      // Add new weight entry to history
      history.push({
        weight: parsedWeight,
        date: new Date().toISOString().split("T")[0],
      });

      await AsyncStorage.setItem(
        getUserStorageKey(STORAGE_KEYS.weightHistory),
        JSON.stringify(history)
      );

      await AsyncStorage.setItem(
        getUserStorageKey(STORAGE_KEYS.currentWeight),
        String(parsedWeight)
      );

      // Recalculate calorie target using updated weight
      const height = await AsyncStorage.getItem(getUserStorageKey(STORAGE_KEYS.height));
      const age = await AsyncStorage.getItem(getUserStorageKey(STORAGE_KEYS.age));
      const gender = await AsyncStorage.getItem(getUserStorageKey(STORAGE_KEYS.gender));
      const activity = await AsyncStorage.getItem(getUserStorageKey(STORAGE_KEYS.activity));
      const speed = await AsyncStorage.getItem(getUserStorageKey(STORAGE_KEYS.speed));

      if (height && age && gender && activity && speed) {
        const h = parseFloat(height);
        const a = parseFloat(age);
        const act = parseFloat(activity);
        const s = parseFloat(speed);

        const bmr =
          gender === "male"
            ? 10 * parsedWeight + 6.25 * h - 5 * a + 5
            : 10 * parsedWeight + 6.25 * h - 5 * a - 161;

        const deficit = s === 1 ? 1000 : 500;
        const newTargetCalories = Math.round(bmr * act - deficit);

        await AsyncStorage.setItem(
          getUserStorageKey(STORAGE_KEYS.targetCalories),
          String(newTargetCalories)
        );
      }

      await updateDailyStreak();

      Alert.alert("Success", "Weight saved");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", "Failed to save weight");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text style={styles.title}>Update Weight</Text>
          <Text style={styles.subtitle}>
            Record your latest weight to update your progress and calorie target.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Current weight</Text>
            <Text style={styles.helperText}>
              This will be added to your weight history.
            </Text>

            <View style={styles.inputRow}>
              <Ionicons name="scale-outline" size={20} color={COLORS.muted} />
              <TextInput
                style={styles.input}
                placeholder="Example: 92.5"
                placeholderTextColor={COLORS.muted}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
          </View>

          <Pressable style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Weight</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 18,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 21,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 6,
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    color: COLORS.text,
    fontSize: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});