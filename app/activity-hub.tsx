import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getUserStorageKey, STORAGE_KEYS } from "../utils/storage";

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
          const storedActivities = await AsyncStorage.getItem(getUserStorageKey(STORAGE_KEYS.activityLog));
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
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.appName}>Activity Hub</Text>
          <Text style={styles.subtitle}>
            Track exercise, burn calories, and stay consistent
          </Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Today's Summary</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Calories Burned</Text>
              <Text style={styles.summaryValue}>{todayBurnedCalories}</Text>
              <Text style={styles.summaryUnit}>kcal</Text>
            </View>

            <View style={[styles.summaryCard, styles.highlightCard]}>
              <Text style={styles.summaryLabel}>Activities Logged</Text>
              <Text style={styles.summaryValue}>{todayActivityCount}</Text>
              <Text style={styles.summaryUnit}>today</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.summaryTitle}>Quick Actions</Text>

          <Pressable
            style={styles.primaryAction}
            onPress={() => router.push("/log-activity" as any)}
          >
            <View>
              <Text style={styles.primaryActionTitle}>Log Activity</Text>
              <Text style={styles.primaryActionSubtitle}>
                Add exercise and calories burned
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>

          <Pressable
            style={styles.primaryAction}
            onPress={() => router.push("/activity-tips" as any)}
          >
            <View>
              <Text style={styles.primaryActionTitle}>Activity Tips</Text>
              <Text style={styles.primaryActionSubtitle}>
                Learn simple ways to stay active
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryAction}
            onPress={() => router.push("/home" as any)}
          >
            <Text style={styles.secondaryActionText}>Back Home</Text>
          </Pressable>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.summaryTitle}>Recent Activities</Text>

          <View style={styles.recentCard}>
            {recentActivities.length === 0 ? (
              <>
                <Text style={styles.emptyText}>No activities logged yet</Text>
                <Text style={styles.emptySubtext}>
                  Start logging your workouts to see your progress here.
                </Text>
              </>
            ) : (
              recentActivities.map((item: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.activityItem,
                    index === recentActivities.length - 1 && styles.lastActivityItem,
                  ]}
                >
                  <View style={styles.activityTopRow}>
                    <Text style={styles.activityName}>{item.activity}</Text>
                    <Text style={styles.activityCalories}>
                      {item.caloriesBurned} kcal
                    </Text>
                  </View>
                  <Text style={styles.activityDetails}>
                    {item.minutes} mins • {item.date}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why activity helps</Text>
          <Text style={styles.infoText}>
            Regular movement supports fat loss, improves fitness, and helps you
            create a more sustainable calorie deficit over time.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf1fb",
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
  actionsSection: {
    marginBottom: 20,
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
  recentSection: {
    marginBottom: 20,
  },
  recentCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 6,
    lineHeight: 20,
  },
  activityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
  },
  lastActivityItem: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  activityTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  activityCalories: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  activityDetails: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 5,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 21,
  },
});