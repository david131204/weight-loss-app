import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
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

const COLORS = {
  primary: "#007AFF",
  background: "#eaf1fb",
  card: "#ffffff",
  text: "#1c1c1e",
  border: "#d0d7de",
  muted: "#666",
};

export default function FoodDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [grams, setGrams] = useState("");

  const name = params.name as string;
  const caloriesPer100g = Number(params.caloriesPer100g);
  const proteinPer100g = Number(params.proteinPer100g);
  const carbsPer100g = Number(params.carbsPer100g);
  const fatPer100g = Number(params.fatPer100g);

  const nutrition = useMemo(() => {
    const gramsValue = parseFloat(grams);

    if (isNaN(gramsValue) || gramsValue <= 0) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }

    const factor = gramsValue / 100;

    return {
      calories: caloriesPer100g * factor,
      protein: proteinPer100g * factor,
      carbs: carbsPer100g * factor,
      fat: fatPer100g * factor,
    };
  }, [grams, caloriesPer100g, proteinPer100g, carbsPer100g, fatPer100g]);

  const addToLog = async () => {
    const gramsValue = parseFloat(grams);

    if (isNaN(gramsValue) || gramsValue <= 0) {
      Alert.alert("Error", "Please enter a valid weight in grams.");
      return;
    }

    try {
      const existing = await AsyncStorage.getItem(
        getUserStorageKey(STORAGE_KEYS.foodLog)
      );
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

      await AsyncStorage.setItem(
        getUserStorageKey(STORAGE_KEYS.foodLog),
        JSON.stringify(foodLog)
      );

      Alert.alert("Success", "Food added to log.");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", "Failed to save food entry.");
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
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>{name}</Text>
            <Text style={styles.subtitle}>
              Enter your portion size to calculate calories and macros.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Nutrition per 100g</Text>
              <Text style={styles.sectionBadge}>Reference</Text>
            </View>

            <View style={styles.macroGrid}>
              <View style={styles.macroBox}>
                <Text style={styles.macroValue}>
                  {Math.round(caloriesPer100g)}
                </Text>
                <Text style={styles.macroLabel}>kcal</Text>
              </View>

              <View style={styles.macroBox}>
                <Text style={styles.macroValue}>
                  {proteinPer100g.toFixed(1)}g
                </Text>
                <Text style={styles.macroLabel}>protein</Text>
              </View>

              <View style={styles.macroBox}>
                <Text style={styles.macroValue}>{carbsPer100g.toFixed(1)}g</Text>
                <Text style={styles.macroLabel}>carbs</Text>
              </View>

              <View style={styles.macroBox}>
                <Text style={styles.macroValue}>{fatPer100g.toFixed(1)}g</Text>
                <Text style={styles.macroLabel}>fat</Text>
              </View>
            </View>

            <Text style={styles.noteText}>
              Values are estimates per 100g of edible portion.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Portion eaten</Text>

            <View style={styles.inputRow}>
              <Ionicons name="scale-outline" size={20} color={COLORS.muted} />
              <TextInput
                style={styles.input}
                placeholder="Enter grams eaten"
                placeholderTextColor={COLORS.muted}
                keyboardType="numeric"
                value={grams}
                onChangeText={setGrams}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>For {grams || 0}g</Text>
              <Text style={styles.sectionBadge}>Calculated</Text>
            </View>

            <View style={styles.macroGrid}>
              <View style={styles.macroBox}>
                <Text style={styles.macroValue}>
                  {nutrition.calories.toFixed(1)}
                </Text>
                <Text style={styles.macroLabel}>kcal</Text>
              </View>

              <View style={styles.macroBox}>
                <Text style={styles.macroValue}>
                  {nutrition.protein.toFixed(1)}g
                </Text>
                <Text style={styles.macroLabel}>protein</Text>
              </View>

              <View style={styles.macroBox}>
                <Text style={styles.macroValue}>
                  {nutrition.carbs.toFixed(1)}g
                </Text>
                <Text style={styles.macroLabel}>carbs</Text>
              </View>

              <View style={styles.macroBox}>
                <Text style={styles.macroValue}>
                  {nutrition.fat.toFixed(1)}g
                </Text>
                <Text style={styles.macroLabel}>fat</Text>
              </View>
            </View>
          </View>

          <Pressable style={styles.primaryAction} onPress={addToLog}>
            <View style={styles.actionContent}>
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
              <View>
                <Text style={styles.primaryActionTitle}>Add to Log</Text>
                <Text style={styles.primaryActionSubtitle}>
                  Save this food to today’s summary
                </Text>
              </View>
            </View>

            <Text style={styles.actionArrow}>›</Text>
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
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
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
    gap: 10,
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
  macroGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  macroBox: {
    width: "47.5%",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
  },
  macroLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },
  noteText: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 14,
    lineHeight: 19,
  },
  inputRow: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginTop: 12,
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