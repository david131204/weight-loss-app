import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
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

const COLORS = {
  primary: "#007AFF",
  background: "#eaf1fb",
  card: "#ffffff",
  text: "#1c1c1e",
  border: "#d0d7de",
  muted: "#666",
};

export default function Home() {
  const router = useRouter();

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState(1.2);
  const [checkingSetup, setCheckingSetup] = useState(true);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const setupComplete = await AsyncStorage.getItem(
          getUserStorageKey(STORAGE_KEYS.setupComplete)
        );

        if (setupComplete === "true") {
          router.replace("/home");
          return;
        }
      } catch (error) {
        console.log("Failed to check setup status");
      } finally {
        setCheckingSetup(false);
      }
    };

    checkSetup();
  }, [router]);

  if (checkingSetup) {
    return null;
  }

  const goToTargetWeight = async () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) {
      alert("Please enter valid positive numbers");
      return;
    }

    await AsyncStorage.setItem(getUserStorageKey(STORAGE_KEYS.currentWeight), w.toString());
    await AsyncStorage.setItem(getUserStorageKey(STORAGE_KEYS.height), h.toString());
    await AsyncStorage.setItem(getUserStorageKey(STORAGE_KEYS.age), a.toString());
    await AsyncStorage.setItem(getUserStorageKey(STORAGE_KEYS.gender), gender);
    await AsyncStorage.setItem(getUserStorageKey(STORAGE_KEYS.activity), activity.toString());

    router.push({
      pathname: "/target-weight",
      params: {
        weight: w.toString(),
        height: h.toString(),
        age: a.toString(),
        gender,
        activity: activity.toString(),
      },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.appName}>LeanPath</Text>
              <Text style={styles.subtitle}>
                Set up your profile to calculate a personalised calorie target
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardTitle}>Your details</Text>
                <Text style={styles.sectionBadge}>Setup</Text>
              </View>

              <View style={styles.inputRow}>
                <Ionicons name="barbell-outline" size={20} color={COLORS.muted} />
                <TextInput
                  style={styles.input}
                  placeholder="Weight (kg)"
                  placeholderTextColor={COLORS.muted}
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>

              <View style={styles.inputRow}>
                <Ionicons name="resize-outline" size={20} color={COLORS.muted} />
                <TextInput
                  style={styles.input}
                  placeholder="Height (cm)"
                  placeholderTextColor={COLORS.muted}
                  keyboardType="numeric"
                  value={height}
                  onChangeText={setHeight}
                />
              </View>

              <View style={styles.inputRow}>
                <Ionicons name="calendar-outline" size={20} color={COLORS.muted} />
                <TextInput
                  style={styles.input}
                  placeholder="Age"
                  placeholderTextColor={COLORS.muted}
                  keyboardType="numeric"
                  value={age}
                  onChangeText={setAge}
                />
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Gender</Text>

              <View style={styles.optionRow}>
                <Pressable
                  style={[styles.option, gender === "male" && styles.selected]}
                  onPress={() => setGender("male")}
                >
                  <Text style={gender === "male" ? styles.selectedText : styles.optionText}>
                    Male
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.option, gender === "female" && styles.selected]}
                  onPress={() => setGender("female")}
                >
                  <Text style={gender === "female" ? styles.selectedText : styles.optionText}>
                    Female
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Activity level</Text>
              <Text style={styles.helperText}>
                This helps estimate your daily calorie needs.
              </Text>

              <View style={styles.optionRow}>
                <Pressable
                  style={[styles.option, activity === 1.2 && styles.selected]}
                  onPress={() => setActivity(1.2)}
                >
                  <Text style={activity === 1.2 ? styles.selectedText : styles.optionText}>
                    Low
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.option, activity === 1.55 && styles.selected]}
                  onPress={() => setActivity(1.55)}
                >
                  <Text style={activity === 1.55 ? styles.selectedText : styles.optionText}>
                    Medium
                  </Text>
                </Pressable>

                <Pressable
                  style={[styles.option, activity === 1.9 && styles.selected]}
                  onPress={() => setActivity(1.9)}
                >
                  <Text style={activity === 1.9 ? styles.selectedText : styles.optionText}>
                    High
                  </Text>
                </Pressable>
              </View>
            </View>

            <Pressable style={styles.primaryAction} onPress={goToTargetWeight}>
              <View style={styles.actionContent}>
                <Ionicons name="arrow-forward-circle-outline" size={24} color="#fff" />
                <View>
                  <Text style={styles.primaryActionTitle}>Continue</Text>
                  <Text style={styles.primaryActionSubtitle}>
                    Choose your target weight next
                  </Text>
                </View>
              </View>

              <Text style={styles.actionArrow}>›</Text>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
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
    lineHeight: 21,
  },
  card: {
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
    marginBottom: 14,
  },
  cardTitle: {
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
  inputRow: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    color: COLORS.text,
    fontSize: 16,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 20,
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  option: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  selected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  selectedText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
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
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
});