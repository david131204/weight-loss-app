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
  background: "#eef6ff",
  card: "#ffffff",
  text: "#1c1c1e",
  border: "#d0d7de",
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
      <Text style={styles.title}>Search Food</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for a food"
        placeholderTextColor="#666"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        onSubmitEditing={searchFoods}
        autoCorrect={false}
      />

      <Pressable style={styles.button} onPress={searchFoods}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>

      {loading && <ActivityIndicator size="large" color={COLORS.primary} />}

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
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
            <Text style={styles.foodName}>{item.name}</Text>

            {item.brand ? (
              <Text style={styles.brandText}>{item.brand}</Text>
            ) : null}

            <Text style={styles.foodInfo}>
              {Math.round(item.caloriesPer100g)} kcal per 100g
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>
              {hasSearched
                ? "No foods found. Try a different search."
                : "Search for a food to see results"}
            </Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    marginBottom: 12,
    color: COLORS.text,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  brandText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  foodInfo: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginBottom: 12,
  },
});