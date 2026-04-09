import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

const COLORS = {
  primary: '#007AFF',
  background: '#eef6ff',
  card: '#ffffff',
  text: '#1c1c1e',
  border: '#d0d7de',
};

export default function LogFoodScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [foodName, setFoodName] = useState('');
  const [foodCalories, setFoodCalories] = useState('');

  const addFood = () => {
    const caloriesToAdd = parseFloat(foodCalories);
    const currentConsumed = Number(params.consumedCalories || 0);

    if (!foodName.trim()) {
      alert('Please enter a food name');
      return;
    }

    if (isNaN(caloriesToAdd) || caloriesToAdd <= 0) {
      alert('Please enter valid calories');
      return;
    }

    const newConsumedCalories = currentConsumed + caloriesToAdd;

    router.push({
      pathname: '/home' as any,
      params: {
        ...(params as any),
        consumedCalories: newConsumedCalories.toString(),
      },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Log Food</Text>
          <Text style={styles.subtitle}>Enter your food and calories</Text>

          <TextInput
            style={styles.input}
            placeholder="Food name"
            placeholderTextColor="#666"
            value={foodName}
            onChangeText={setFoodName}
          />

          <TextInput
            style={styles.input}
            placeholder="Calories"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={foodCalories}
            onChangeText={setFoodCalories}
          />

          <Pressable style={styles.button} onPress={addFood}>
            <Text style={styles.buttonText}>Add Food</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    color: COLORS.text,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});