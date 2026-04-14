import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const COLORS = {
  primary: '#007AFF',
  background: '#eef6ff',
  card: '#ffffff',
  text: '#1c1c1e',
  border: '#d0d7de',
};

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [savedWeight, setSavedWeight] = useState<string>("");
  const [savedTargetWeight, setSavedTargetWeight] = useState<string>("");
  const [savedSpeed, setSavedSpeed] = useState<string>("");
  const [savedTargetCalories, setSavedTargetCalories] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      const loadStoredData = async () => {
        try {
          const storedHistory = await AsyncStorage.getItem("weightHistory");
          const history = storedHistory ? JSON.parse(storedHistory) : [];

          if (history.length > 0) {
            const latestEntry = history[history.length - 1];
            setSavedWeight(String(latestEntry.weight));
          } else {
            const currentWeightValue = await AsyncStorage.getItem("currentWeight");
            if (currentWeightValue) {
              setSavedWeight(currentWeightValue);
            }
          }

          const targetWeightValue = await AsyncStorage.getItem("targetWeight");
          const speedValue = await AsyncStorage.getItem("speed");
          const targetCaloriesValue = await AsyncStorage.getItem("targetCalories");

          if (targetWeightValue) setSavedTargetWeight(targetWeightValue);
          if (speedValue) setSavedSpeed(speedValue);
          if (targetCaloriesValue) setSavedTargetCalories(targetCaloriesValue);
        } catch (error) {
          console.log("Failed to load stored data");
        }
      };

      loadStoredData();
    }, [])
  );

  const handleResetData = async () => {
    Alert.alert(
      "Reset Data",
      "This will clear your saved details and return you to setup.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove([
              "setupComplete",
              "currentWeight",
              "height",
              "age",
              "gender",
              "activity",
              "targetWeight",
              "speed",
              "targetCalories",
              "weightHistory",
            ]);

            router.replace("/");
          },
        },
      ]
    );
  };



const currentWeight =
    savedWeight || (params.weight as string) || "No weight recorded";
  const targetWeight =
    savedTargetWeight || (params.targetWeight as string) || "Not set";
  const speed = savedSpeed || (params.speed as string) || "Not set";
  const targetCalories =
    savedTargetCalories || (params.targetCalories as string) || "0";

  const consumedCalories = Number(params.consumedCalories || 0);
  const remainingCalories = Number(targetCalories || 0) - consumedCalories;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Weight</Text>
        <Text style={styles.value}>
  {currentWeight === "No weight recorded" ? currentWeight : `${currentWeight} kg`}
</Text>

        <Text style={styles.label}>Target Weight</Text>
        <Text style={styles.value}>
  {targetWeight === "Not set" ? targetWeight : `${targetWeight} kg`}
</Text>

        <Text style={styles.label}>Weight Loss Speed</Text>
        <Text style={styles.value}>
  {speed === "Not set" ? speed : `${speed} kg per week`}
</Text>

        <Text style={styles.label}>Daily Calorie Target</Text>
        <Text style={styles.value}>{targetCalories} kcal/day</Text>

        <Text style={styles.label}>Consumed Today</Text>
        <Text style={styles.value}>{consumedCalories} kcal</Text>

        <Text style={styles.label}>Remaining Calories</Text>
        <Text style={styles.value}>{remainingCalories} kcal</Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: '/log-food' as any,
            params: {
              ...(params as any),
            },
          })
        }
      >
        <Text style={styles.buttonText}>Log Food</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: '/progress' as any,
            params: {
              ...(params as any),
            },
          })
        }
      >
        <Text style={styles.buttonText}>View Progress</Text>
      </Pressable>

      <Pressable
        style={styles.buttonSecondary}
        onPress={() =>
          router.push({
            pathname: '/update-weight' as any,
            params: {
              ...(params as any),
            },
          })
        }
      >
        <Text style={styles.buttonSecondaryText}>Update Weight</Text>
      </Pressable>
      <Pressable style={styles.resetButton} onPress={handleResetData}>
        <Text style={styles.resetButtonText}>Reset Data</Text>
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
    marginBottom: 20,
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
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 12,
  },
  buttonSecondaryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    
  },
resetButton: {
    backgroundColor: "#ef4444",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});