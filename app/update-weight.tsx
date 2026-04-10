import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function UpdateWeight() {
  const [weight, setWeight] = useState("");
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleSave = () => {
    if (!weight) {
      Alert.alert("Error", "Please enter your weight");
      return;
    }

    Alert.alert("Success", "Weight updated successfully");

    router.push({
      pathname: "/home",
      params: {
        ...params,
        weight,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Weight</Text>

      <Text style={styles.label}>Enter your current weight (kg)</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 92.5"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Weight</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "white",
    marginBottom: 30,
  },
  label: {
    color: "#cbd5f5",
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    backgroundColor: "white",
    width: "100%",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});