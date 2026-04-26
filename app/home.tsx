import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useFocusEffect, useRouter } from "expo-router";
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
import { useAuth } from "../context/AuthContext";
import { getUserStorageKey, STORAGE_KEYS } from "../utils/storage";
import { getDailyStreak, getNextMilestone } from "../utils/streak";

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
  const [burnedCalories, setBurnedCalories] = useState(0);
  const { logout } = useAuth();
  const [dailyStreak, setDailyStreak] = useState(0);
// Reload data whenever the screen is opened or focused
  useFocusEffect(
    useCallback(() => {
      const loadStoredData = async () => {
        try {
          const storedHistory = await AsyncStorage.getItem(getUserStorageKey(STORAGE_KEYS.weightHistory));
          const parsedHistory = storedHistory ? JSON.parse(storedHistory) : [];
          setHistory(parsedHistory);
// Use latest weight from history, or fallback to initial setup value
          if (parsedHistory.length > 0) {
          const latestEntry = parsedHistory[parsedHistory.length - 1];
            setSavedWeight(String(latestEntry.weight));
          } else {
            const currentWeightValue = await AsyncStorage.getItem(getUserStorageKey(STORAGE_KEYS.currentWeight));
            if (currentWeightValue) {
              setSavedWeight(currentWeightValue);
            }
          }

          const today = new Date().toISOString().split("T")[0];

// Load today's burned calories from saved activity log
          const activityData = await AsyncStorage.getItem(
            getUserStorageKey(STORAGE_KEYS.activityLog)
           );
           const activityLog = activityData ? JSON.parse(activityData) : [];

           const todayBurned = activityLog
             .filter((item: any) => item.date === today)
             .reduce((sum: number, item: any) => sum + item.caloriesBurned, 0);

          setBurnedCalories(todayBurned);
          // Load calorie target
          const calories = await AsyncStorage.getItem(getUserStorageKey(STORAGE_KEYS.targetCalories));
          if (calories) {
            setSavedTargetCalories(calories);
          }
// Load food log and calculate today's total calories
          const foodData = await AsyncStorage.getItem(getUserStorageKey(STORAGE_KEYS.foodLog));
          const foodLog = foodData ? JSON.parse(foodData) : [];

          const todayCalories = foodLog
           .filter((item: any) => item.date === today)
           .reduce((sum: number, item: any) => sum + item.calories, 0);

          setConsumedCalories(todayCalories);

          const streak = await getDailyStreak();
          setDailyStreak(streak);
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
              getUserStorageKey(STORAGE_KEYS.setupComplete),
              getUserStorageKey(STORAGE_KEYS.currentWeight),
              getUserStorageKey(STORAGE_KEYS.height),
              getUserStorageKey(STORAGE_KEYS.age),
              getUserStorageKey(STORAGE_KEYS.gender),
              getUserStorageKey(STORAGE_KEYS.activity),
              getUserStorageKey(STORAGE_KEYS.targetWeight),
              getUserStorageKey(STORAGE_KEYS.speed),
              getUserStorageKey(STORAGE_KEYS.targetCalories),
              getUserStorageKey(STORAGE_KEYS.weightHistory),
              getUserStorageKey(STORAGE_KEYS.foodLog),
              getUserStorageKey(STORAGE_KEYS.activityLog),
              getUserStorageKey(STORAGE_KEYS.dailyStreak),
              getUserStorageKey(STORAGE_KEYS.lastStreakDate),
              ]);

            router.replace("/");
          },
        },
      ]
    );
  };
// Calculate calories left for today
const remainingCalories =
  Number(savedTargetCalories || 0) - consumedCalories + burnedCalories;
// Weight chart values
  const startingWeight =
    history.length > 0 ? history[0].weight : Number(savedWeight || 0);

  const currentWeight =
    history.length > 0
      ? history[history.length - 1].weight
      : Number(savedWeight || 0);

  const change = currentWeight - startingWeight;
  const nextMilestone = getNextMilestone(dailyStreak);

  // Chart data

const recentHistory = history.slice(-4);

const formatChartDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

  const chartData = {
    labels:
      recentHistory.length > 0
        ? recentHistory.map((item: any) => formatChartDate(item.date))
        : ["Start"],
    datasets: [
      {
        data:
          recentHistory.length > 0
            ? recentHistory.map((item: any) => item.weight)
            : [Number(savedWeight || 0)], 
      },
    ],
  };
return (
  <>
    <Stack.Screen options={{ headerShown: false }} />

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
    <View style={styles.header}>
      <Text style={styles.appName}>LeanPath</Text>
      <Text style={styles.subtitle}>Stay consistent and trust the process</Text>
    </View>

<View style={styles.streakCard}>
  <View style={styles.streakTopRow}>
    <View style={styles.streakIconBox}>
      <Text style={styles.streakIcon}>🔥</Text>
    </View>

    <View style={styles.streakTextBox}>
      <Text style={styles.streakLabel}>Daily Streak</Text>
      <Text style={styles.streakValue}>
        {dailyStreak} Day{dailyStreak === 1 ? "" : "s"}
      </Text>
    </View>
  </View>

  <View style={styles.streakProgressBackground}>
    <View
      style={[
        styles.streakProgressFill,
        {
          width: nextMilestone
            ? `${Math.min((dailyStreak / nextMilestone) * 100, 100)}%`
            : "100%",
        },
      ]}
    />
  </View>

  <Text style={styles.streakSubtext}>
    {nextMilestone
      ? `${nextMilestone - dailyStreak} day${nextMilestone - dailyStreak === 1 ? "" : "s"} until your ${nextMilestone} day milestone`
      : "Milestone completed. Keep the streak alive"}
  </Text>
</View>

    <View style={styles.chartCard}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.sectionTitle}>Weight Progress</Text>
        <Text style={styles.sectionBadge}>Progress</Text>
      </View>

      <LineChart
        data={chartData}
        width={screenWidth - 72}
        height={210}
        yAxisSuffix="kg"
        chartConfig={{
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0,122,255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(90,90,90, ${opacity})`,
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#007AFF",
          },
          propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#e5e7eb",
          },
          style: {
            borderRadius: 18,
          },
        }}
        bezier
        style={styles.chart}
      />

      <View style={styles.progressStatsRow}>
        <View style={styles.progressStatBox}>
          <Text style={styles.progressStatLabel}>Start</Text>
          <Text style={styles.progressStatValue}>{startingWeight} kg</Text>
        </View>

        <View style={styles.progressStatBox}>
          <Text style={styles.progressStatLabel}>Current</Text>
          <Text style={styles.progressStatValue}>{currentWeight} kg</Text>
        </View>

        <View style={styles.progressStatBox}>
          <Text style={styles.progressStatLabel}>Change</Text>
          <Text style={styles.progressStatValue}>{change.toFixed(1)} kg</Text>
        </View>
      </View>
    </View>

    <View style={styles.summarySection}>
      <Text style={styles.summaryTitle}>Today's Summary</Text>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Target</Text>
          <Text style={styles.summaryValue}>{savedTargetCalories}</Text>
          <Text style={styles.summaryUnit}>kcal</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Consumed</Text>
          <Text style={styles.summaryValue}>{consumedCalories}</Text>
          <Text style={styles.summaryUnit}>kcal</Text>
        </View>

        <View style={[styles.summaryCard, styles.highlightCard]}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text style={styles.summaryValue}>{remainingCalories}</Text>
          <Text style={styles.summaryUnit}>kcal</Text>
        </View>
      </View>
    </View>

    <View style={styles.actionsSection}>
      <Text style={styles.summaryTitle}>Quick Actions</Text>

      <Pressable
        style={styles.primaryAction}
        onPress={() => router.push("/food-search" as any)}
      >
        <View>
          <Text style={styles.primaryActionTitle}>Log Food</Text>
          <Text style={styles.primaryActionSubtitle}>
            Add meals and track calories
          </Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </Pressable>

      <Pressable
        style={styles.primaryAction}
        onPress={() => router.push("/activity-hub" as any)}
      >
        <View>
          <Text style={styles.primaryActionTitle}>Activity Hub</Text>
          <Text style={styles.primaryActionSubtitle}>
            Log exercise and stay active
          </Text>
        </View>
        <Text style={styles.actionArrow}>›</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryAction}
        onPress={() => router.push("/update-weight" as any)}
      >
        <Text style={styles.secondaryActionText}>Update Weight</Text>
      </Pressable>
    </View>

    <Pressable
      style={styles.secondaryAction}
      onPress={async () => {
        await logout();
        router.replace("/sign-in");
        }}
>
  <Text style={styles.secondaryActionText}>Sign Out</Text>
</Pressable>

    <Pressable style={styles.resetButton} onPress={handleResetData}>
      <Text style={styles.resetButtonText}>Reset Data</Text>
    </Pressable>
      </ScrollView>
  </>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf1fb"
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.muted,
    marginTop: 6,
  },
  chartCard: {
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
    marginBottom: 10,
  },
  sectionTitle: {
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
  chart: {
    marginTop: 6,
    borderRadius: 18,
  },
  progressStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 10,
  },
  progressStatBox: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  progressStatLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 4,
  },
  progressStatValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  summarySection: {
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  summaryGrid: {
    gap: 12,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  highlightCard: {
    borderWidth: 1.5,
    borderColor: "#dbeafe",
    backgroundColor: "#f8fbff",
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.6,
  },
  summaryUnit: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
  },

streakCard: {
  backgroundColor: COLORS.card,
  borderRadius: 24,
  padding: 20,
  marginBottom: 20,
  shadowColor: "#000",
  shadowOpacity: 0.06,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
},
streakTopRow: {
  flexDirection: "row",
  alignItems: "center",
},
streakIconBox: {
  width: 54,
  height: 54,
  borderRadius: 18,
  backgroundColor: "#fff3e8",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 14,
},
streakIcon: {
  fontSize: 30,
},
streakTextBox: {
  flex: 1,
},
streakLabel: {
  fontSize: 14,
  color: COLORS.muted,
  marginBottom: 4,
},
streakValue: {
  fontSize: 30,
  fontWeight: "800",
  color: COLORS.text,
  letterSpacing: -0.6,
},
streakProgressBackground: {
  height: 10,
  backgroundColor: "#e5e7eb",
  borderRadius: 999,
  marginTop: 18,
  overflow: "hidden",
},
streakProgressFill: {
  height: "100%",
  backgroundColor: "#ff7a00",
  borderRadius: 999,
},
streakSubtext: {
  fontSize: 13,
  color: COLORS.primary,
  marginTop: 12,
  fontWeight: "600",
},
  actionsSection: {
    marginBottom: 18,
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
  secondaryAction: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dbe3ef",
  },
  secondaryActionText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  resetButton: {
    marginTop: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#dc2626",
    fontSize: 15,
    fontWeight: "600",
  },
});