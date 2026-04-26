import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserStorageKey } from "./storage";

const STREAK_KEY = "dailyStreak";
const LAST_STREAK_DATE_KEY = "lastStreakDate";

export const updateDailyStreak = async () => {
  const today = new Date().toISOString().split("T")[0];

  const streakKey = getUserStorageKey(STREAK_KEY);
  const lastDateKey = getUserStorageKey(LAST_STREAK_DATE_KEY);

  const savedStreak = await AsyncStorage.getItem(streakKey);
  const savedLastDate = await AsyncStorage.getItem(lastDateKey);

  const currentStreak = savedStreak ? parseInt(savedStreak, 10) : 0;

  if (savedLastDate === today) {
    return currentStreak;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split("T")[0];

  const newStreak =
    savedLastDate === yesterdayString ? currentStreak + 1 : 1;

  await AsyncStorage.setItem(streakKey, String(newStreak));
  await AsyncStorage.setItem(lastDateKey, today);

  return newStreak;
};

export const getDailyStreak = async () => {
  const today = new Date().toISOString().split("T")[0];

  const streakKey = getUserStorageKey(STREAK_KEY);
  const lastDateKey = getUserStorageKey(LAST_STREAK_DATE_KEY);

  const savedStreak = await AsyncStorage.getItem(streakKey);
  const savedLastDate = await AsyncStorage.getItem(lastDateKey);

  if (!savedStreak || !savedLastDate) {
    return 0;
  }

  if (savedLastDate === today) {
    return parseInt(savedStreak, 10);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split("T")[0];

  if (savedLastDate === yesterdayString) {
    return parseInt(savedStreak, 10);
  }

  return 0;
};

export const getNextMilestone = (streak: number) => {
  if (streak < 3) return 3;
  if (streak < 7) return 7;
  if (streak < 14) return 14;
  if (streak < 30) return 30;
  return null;
};