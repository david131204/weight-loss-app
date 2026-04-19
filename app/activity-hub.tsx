import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
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

// Main activity tracker dashboard
export default function ActivityHub() {
  const router = useRouter();

  const [todayBurnedCalories, setTodayBurnedCalories] = useState(0);
  const [todayActivityCount, setTodayActivityCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Load activity data whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadActivityData = async () => {
        try {
          const storedActivities = await AsyncStorage.getItem("activityLog");
          const activityLog = storedActivities ? JSON.parse(storedActivities) : [];

          const today = new Date().toISOString().split("T")[0];

          // Calculate today's totals
          const todayActivities = activityLog.filter(
            (item: any) => item.date === today
          );

          const burnedToday = todayActivities.reduce(
            (sum: number, item: any) => sum + item.caloriesBurned,
            0
          );

          setTodayBurnedCalories(Math.round(burnedToday));
          setTodayActivityCount(todayActivities.length);

          // Show most recent activities first
          const recent = [...activityLog].reverse().slice(0, 5);
          setRecentActivities(recent);
        } catch (error) {
          console.log("Failed to load activity data");
        }
      };

      loadActivityData();
    }, [])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Activity Tracker</Text>
      <Text style={styles.subtitle}>
        Track your exercise and improve your daily calorie balance
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Today's Summary</Text>

        <Text style={styles.label}>Calories Burned Today</Text>
        <Text style={styles.value}>{todayBurnedCalories} kcal</Text>

        <Text style={styles.label}>Activities Logged Today</Text>
        <Text style={styles.value}>{todayActivityCount}</Text>
      </View>

      {/* Navigation buttons */}
      <Pressable
        style={styles.button}
        onPress={() => router.push("/log-activity" as any)}
      >
        <Text style={styles.buttonText}>Log Activity</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/activity-tips" as any)}
      >
        <Text style={styles.buttonText}>Activity Tips</Text>
      </Pressable>

      <Pressable
        style={styles.buttonSecondary}
        onPress={() => router.push("/home" as any)}
      >
        <Text style={styles.buttonSecondaryText}>Back Home</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>

        {recentActivities.length === 0 ? (
          <Text style={styles.emptyText}>No activities logged yet</Text>
        ) : (
          recentActivities.map((item: any, index: number) => (
            <View key={index} style={styles.activityItem}>
              <Text style={styles.activityName}>{item.activity}</Text>
              <Text style={styles.activityDetails}>
                {item.minutes} mins • {item.caloriesBurned} kcal • {item.date}
              </Text>
            </View>
          ))
        )}
      </View>
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
  label: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 4,
    marginBottom: 8,
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
  buttonSecondary: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: 15,
  },
  buttonSecondaryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.muted,
    marginTop: 4,
  },
  activityItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  activityDetails: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
  },
});