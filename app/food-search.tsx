import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const COLORS = {
  primary: "#007AFF",
  background: "#eaf1fb",
  card: "#ffffff",
  text: "#1c1c1e",
  border: "#d0d7de",
  muted: "#666",
};

type FoodItem = {
  id: string;
  source: string;
  name: string;
  brand: string | null;
  servingBasis: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
};

export default function FoodSearchScreen() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const searchFoods = async () => {
    const searchText = query.trim();

    if (!searchText) return;

    try {
      setLoading(true);
      setHasSearched(true);
      setErrorMessage("");
      Keyboard.dismiss();

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/foods/search?q=${encodeURIComponent(searchText)}`
      );

      const data = await response.json();

      console.log(
        "API food results:",
        Array.isArray(data) ? data.map((food) => food.name) : data
      );

      if (!response.ok) {
        setResults([]);
        setErrorMessage("Food search failed. Please try again.");
        return;
      }

      if (!Array.isArray(data)) {
        setResults([]);
        setErrorMessage("Invalid food data received.");
        return;
      }

      setResults(data);
    } catch (error) {
      console.log("Food search failed", error);
      setResults([]);
      setErrorMessage("Could not connect to the food server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Search Food</Text>
        <Text style={styles.subtitle}>
          Find foods and add them to your daily calorie log
        </Text>
      </View>

      <View style={styles.searchCard}>
        <Text style={styles.cardTitle}>Food database</Text>

        <View style={styles.inputRow}>
          <Ionicons name="search-outline" size={20} color={COLORS.muted} />

          <TextInput
            style={styles.input}
            placeholder="Example: roast chicken"
            placeholderTextColor={COLORS.muted}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={searchFoods}
            autoCorrect={false}
          />
        </View>

        <Pressable style={styles.primaryAction} onPress={searchFoods}>
          <View style={styles.actionContent}>
            <Ionicons name="fast-food-outline" size={22} color="#fff" />
            <Text style={styles.primaryActionTitle}>Search</Text>
          </View>

          <Text style={styles.actionArrow}>›</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator size="large" color={COLORS.primary} />}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={styles.resultCard}
            onPress={() =>
              router.push({
                pathname: "/food-detail" as any,
                params: {
                  id: item.id,
                  name: item.name,
                  caloriesPer100g: String(item.caloriesPer100g),
                  proteinPer100g: String(item.proteinPer100g),
                  carbsPer100g: String(item.carbsPer100g),
                  fatPer100g: String(item.fatPer100g),
                },
              })
            }
          >
            <View style={styles.resultTopRow}>
              <View style={styles.foodIconBox}>
                <Ionicons name="restaurant-outline" size={22} color={COLORS.primary} />
              </View>

              <View style={styles.foodTextBox}>
                <Text style={styles.foodName}>{item.name}</Text>

                {item.brand ? (
                  <Text style={styles.brandText}>{item.brand}</Text>
                ) : (
                  <Text style={styles.brandText}>Generic food item</Text>
                )}
              </View>
            </View>

            <View style={styles.macroRow}>
              <View style={styles.macroPill}>
                <Text style={styles.macroValue}>
                  {Math.round(item.caloriesPer100g)}
                </Text>
                <Text style={styles.macroLabel}>kcal</Text>
              </View>

              <View style={styles.macroPill}>
                <Text style={styles.macroValue}>
                  {item.proteinPer100g.toFixed(1)}g
                </Text>
                <Text style={styles.macroLabel}>protein</Text>
              </View>

              <View style={styles.macroPill}>
                <Text style={styles.macroValue}>100g</Text>
                <Text style={styles.macroLabel}>serving</Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyCard}>
              <Ionicons name="nutrition-outline" size={34} color={COLORS.primary} />
              <Text style={styles.emptyTitle}>
                {hasSearched ? "No foods found" : "Search the food database"}
              </Text>
              <Text style={styles.emptyText}>
                {hasSearched
                  ? "Try a more specific food name, such as grilled chicken breast."
                  : "Enter a food name to view calories and macros per 100g."}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    paddingTop: 60,
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
  searchCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  inputRow: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
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
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  primaryActionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  actionArrow: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "400",
    marginLeft: 12,
  },
  listContent: {
    paddingBottom: 30,
  },
  resultCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  resultTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  foodIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#e8f1ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  foodTextBox: {
    flex: 1,
  },
  foodName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  brandText: {
    fontSize: 13,
    color: COLORS.muted,
  },
  macroRow: {
    flexDirection: "row",
    gap: 10,
  },
  macroPill: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  macroValue: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.text,
  },
  macroLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 3,
  },
  emptyCard: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 22,
    marginTop: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    textAlign: "center",
    color: "#dc2626",
    marginBottom: 12,
    fontWeight: "600",
  },
});