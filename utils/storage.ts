import { auth } from "../firebaseConfig";

export const getUserStorageKey = (key: string) => {
  const uid = auth.currentUser?.uid;
  return uid ? `${uid}_${key}` : key;
};

export const STORAGE_KEYS = {
  setupComplete: "setupComplete",
  currentWeight: "currentWeight",
  height: "height",
  age: "age",
  gender: "gender",
  activity: "activity",
  targetWeight: "targetWeight",
  speed: "speed",
  targetCalories: "targetCalories",
  weightHistory: "weightHistory",
  foodLog: "foodLog",
  activityLog: "activityLog",
  dailyStreak: "dailyStreak",
  lastStreakDate: "lastStreakDate",
};