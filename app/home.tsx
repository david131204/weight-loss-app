import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// App colour theme
const COLORS = {
  primary: '#007AFF',
  background: '#eef6ff',
  card: '#ffffff',
  text: '#1c1c1e',
  border: '#d0d7de',
  muted: '#666',
};
// Main dashboard showing user stats such as weight and calories
export default function HomeScreen() {
  const router = useRouter();

  const [savedWeight, setSavedWeight] = useState<string>("");
  const [savedTargetCalories, setSavedTargetCalories] = useState<string>("");
  const [history, setHistory] = useState<any[]>([]);
  const [consumedCalories, setConsumedCalories] = useState(0);
// Reload data whenever the screen is opened or focused
  useFocusEffect(
    useCallback(() => {
      const loadStoredData = async () => {
        try {
          const storedHistory = await AsyncStorage.getItem("weightHistory");
          const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];
          setHistory(parsedHistory);
// Use latest weight from history, or fallback to initial setup value
          if (parsedHistory.length > 0) {
          const latestEntry = parsedHistory[parsedHistory.length - 1];
            setSavedWeight(String(latestEntry.weight));
          } else {
            const currentWeightValue = await AsyncStorage.getItem("currentWeight");
            if (currentWeightValue) {
              setSavedWeight(currentWeightValue);
            }
          }
          // Load calorie target
          const calories = await AsyncStorage.getItem("targetCalories");
          if (calories) {
            setSavedTargetCalories(calories);
          }
// Load food log and calculate today's total calories
          const foodData = await AsyncStorage.getItem("foodLog");
          const foodLog = foodData ? JSON.parse(foodData) : [];

          const today = new Date().toISOString().split("T")[0];

          const todayCalories = foodLog
           .filter((item: any) => item.date === today)
           .reduce((sum: number, item: any) => sum + item.calories, 0);

          setConsumedCalories(todayCalories);
        } catch (error) {
          console.log("Failed to load data");
        }
      };

      loadStoredData();
    }, [])
  );
// Clears all saved data and resets app back to setup
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
              "foodLog",
            ]);

            router.replace("/");
          },
        },
      ]
    );
  };
// Calculate calories left for today
  const remainingCalories =
    Number(savedTargetCalories || 0) - consumedCalories;
// Weight chart values
  const startingWeight =
    history.length > 0 ? history[0].weight : Number(savedWeight || 0);

  const currentWeight =
    history.length > 0
      ? history[history.length - 1].weight
      : Number(savedWeight || 0);

  const change = currentWeight - startingWeight;

  // Chart data
  const chartData = {
    labels:
      history.length > 0
        ? history.map((item: any) => item.date)
        : ["Start"],
    datasets: [
      {
        data:
          history.length > 0
            ? history.map((item: any) => item.weight)
            : [Number(savedWeight || 0)],
      },
    ],
  };
  return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={{ paddingBottom: 30 }}
    showsVerticalScrollIndicator={false}
  >
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Stay consistent and trust the process</Text>

            {/* Weight progress chart */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Weight Progress</Text>

        <LineChart
          data={chartData}
          width={screenWidth - 60}
          height={220}
          yAxisSuffix="kg"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) =>
              `rgba(0,122,255, ${opacity})`,
            labelColor: (opacity = 1) =>
              `rgba(28,28,30, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginTop: 10,
            borderRadius: 16,
          }}
        />

        <Text style={styles.infoText}>
          Starting Weight: {startingWeight} kg
        </Text>

        <Text style={styles.infoText}>
          Current Weight: {currentWeight} kg
        </Text>

        <Text style={styles.infoText}>
          Total Change: {change.toFixed(1)} kg
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Daily Calorie Target</Text>
        <Text style={styles.value}>
          {savedTargetCalories} kcal
        </Text>

        <Text style={styles.label}>Calories Left Today</Text>
        <Text style={styles.value}>
          {remainingCalories} kcal
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/food-search" as any)}
      >
        <Text style={styles.buttonText}>Log Food</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/activity-hub" as any)}
      >
        <Text style={styles.buttonText}>Activity Tracker</Text>
      </Pressable>

      <Pressable
        style={styles.buttonSecondary}
        onPress={() => router.push("/update-weight" as any)}
      >
        <Text style={styles.buttonSecondaryText}>
          Update Weight
        </Text>
      </Pressable>

      <Pressable
        style={styles.resetButton}
        onPress={handleResetData}
      >
        <Text style={styles.resetButtonText}>
          Reset Data
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
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.primary,
    marginBottom: 20,
  },
    subtitle: {
    textAlign: "center",
    color: COLORS.muted,
    marginBottom: 20,
    marginTop: 6,
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
    marginBottom: 5,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.text,
    marginTop: 6,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  value: {
    fontSize: 22,
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 10,
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