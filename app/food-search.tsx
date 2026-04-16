import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
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

  const searchFoods = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);

  const response = await fetch(
  `${process.env.EXPO_PUBLIC_API_URL}/foods/search?q=${encodeURIComponent(query)}`
);

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.log("Food search failed", error);
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
      />

      <Pressable style={styles.button} onPress={searchFoods}>
        <Text style={styles.buttonText}>Search</Text>
      </Pressable>

      {loading && <ActivityIndicator size="large" color={COLORS.primary} />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.resultCard}
            onPress={() =>
              router.push({
                pathname: "/food-detail" as any,
                params: {
                  id: item.id,
                  name: item.name,
                  caloriesPer100g: item.caloriesPer100g.toString(),
                  proteinPer100g: item.proteinPer100g.toString(),
                  carbsPer100g: item.carbsPer100g.toString(),
                  fatPer100g: item.fatPer100g.toString(),
                },
              })
            }
          >
            <Text style={styles.foodName}>{item.name}</Text>
            <Text style={styles.foodInfo}>
              {item.caloriesPer100g} kcal per 100g
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>Search for a food to see results</Text>
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
  foodInfo: {
    fontSize: 14,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
  },
});