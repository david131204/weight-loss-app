import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
// Initial setup screen where user enters personal details
export default function Home() {
const router = useRouter();

const [weight, setWeight] = useState('');
const [height, setHeight] = useState('');
const [age, setAge] = useState('');
const [gender, setGender] = useState<'male' | 'female'>('male');
const [activity, setActivity] = useState(1.2);
const [checkingSetup, setCheckingSetup] = useState(true);
// Check if user has already completed setup
useEffect(() => {
  const checkSetup = async () => {
    try {
      const setupComplete = await AsyncStorage.getItem("setupComplete");

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
}, []);

if (checkingSetup) {
  return null;
}
// Validate inputs and move to next step in setup
const goToTargetWeight = async () => {
  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseFloat(age);

  if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) {
    alert('Please enter valid positive numbers');
    return;
  }
// Save initial user data for later use in calculations
await AsyncStorage.setItem("currentWeight", w.toString());
await AsyncStorage.setItem("height", h.toString());
await AsyncStorage.setItem("age", a.toString());
await AsyncStorage.setItem("gender", gender);
await AsyncStorage.setItem("activity", activity.toString());
// Navigate to target weight screen with entered data
  router.push({
    pathname: '/target-weight',
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
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
<KeyboardAvoidingView
style={{ flex: 1 }}
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
<View style={styles.container}>
<Text style={styles.title}>Welcome</Text>

<TextInput
style={styles.input}
placeholder="Weight (kg)"
placeholderTextColor="#666"
keyboardType="numeric"
value={weight}
onChangeText={setWeight}
/>

<TextInput
style={styles.input}
placeholder="Height (cm)"
placeholderTextColor="#666"
keyboardType="numeric"
value={height}
onChangeText={setHeight}
/>

<TextInput
style={styles.input}
placeholder="Age"
placeholderTextColor="#666"
keyboardType="numeric"
value={age}
onChangeText={setAge}
/>

<Text style={styles.label}>Gender</Text>
<View style={styles.row}>
<Pressable
style={[
styles.option,
gender === 'male' && styles.selected,
]}
onPress={() => setGender('male')}
>
<Text style={gender === 'male' ? styles.selectedText : styles.optionText}>
Male
</Text>
</Pressable>

<Pressable
style={[
styles.option,
gender === 'female' && styles.selected,
]}
onPress={() => setGender('female')}
>
<Text style={gender === 'female' ? styles.selectedText : styles.optionText}>
Female
</Text>
</Pressable>
</View>

<Text style={styles.label}>Activity Level</Text>
<View style={styles.row}>
<Pressable
style={[
styles.option,
activity === 1.2 && styles.selected,
]}
onPress={() => setActivity(1.2)}
>
<Text style={activity === 1.2 ? styles.selectedText : styles.optionText}>
Low
</Text>
</Pressable>

<Pressable
style={[
styles.option,
activity === 1.55 && styles.selected,
]}
onPress={() => setActivity(1.55)}
>
<Text style={activity === 1.55 ? styles.selectedText : styles.optionText}>
Medium
</Text>
</Pressable>

<Pressable
style={[
styles.option,
activity === 1.9 && styles.selected,
]}
onPress={() => setActivity(1.9)}
>
<Text style={activity === 1.9 ? styles.selectedText : styles.optionText}>
High
</Text>
</Pressable>
</View>

<Pressable style={styles.button} onPress={goToTargetWeight}>
  <Text style={styles.buttonText}>Continue</Text>
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
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '600',
    color: COLORS.primary,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },

  label: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
    color: COLORS.text,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },

  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },

  optionText: {
    color: COLORS.primary,
  },

  selected: {
    backgroundColor: COLORS.primary,
  },

  selectedText: {
    color: '#fff',
    fontWeight: '600',
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