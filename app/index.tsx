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

export default function Home() {
const [weight, setWeight] = useState('');
const [height, setHeight] = useState('');
const [age, setAge] = useState('');
const [gender, setGender] = useState<'male' | 'female'>('male');
const [activity, setActivity] = useState(1.2);
const [calories, setCalories] = useState<number | null>(null);
const [fatLossCalories, setFatLossCalories] = useState<number | null>(null);

const calculateCalories = () => {
const w = parseFloat(weight);
const h = parseFloat(height);
const a = parseFloat(age);

if (isNaN(w) || isNaN(h) || isNaN(a)) {
alert('Please enter valid numbers');
return;
}

let bmr;
if (gender === 'male') {
bmr = 10 * w + 6.25 * h - 5 * a + 5;
} else {
bmr = 10 * w + 6.25 * h - 5 * a - 161;
}

const tdee = bmr * activity;

setCalories(Math.round(tdee));
setFatLossCalories(Math.round(tdee - 500));
};

return (
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
<KeyboardAvoidingView
style={{ flex: 1 }}
behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
<View style={styles.container}>
<Text style={styles.title}>Weight Loss App</Text>

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

<Pressable style={styles.button} onPress={calculateCalories}>
<Text style={styles.buttonText}>Calculate Calories</Text>
</Pressable>

{calories !== null && (
<Text style={styles.result}>
Maintenance: {calories} kcal
</Text>
)}

{fatLossCalories !== null && (
<Text style={styles.result}>
Weight Loss: {fatLossCalories} kcal
</Text>
)}
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
backgroundColor: '#f5f5f5',
},
title: {
fontSize: 26,
textAlign: 'center',
marginBottom: 25,
fontWeight: '600',
},
input: {
borderWidth: 1,
borderColor: '#333',
padding: 12,
marginBottom: 12,
borderRadius: 6,
backgroundColor: '#fff',
},
label: {
marginTop: 10,
marginBottom: 5,
fontSize: 16,
},
row: {
flexDirection: 'row',
justifyContent: 'space-around',
marginBottom: 15,
},
option: {
padding: 10,
borderWidth: 1,
borderColor: '#007AFF',
borderRadius: 6,
minWidth: 80,
alignItems: 'center',
},
optionText: {
color: '#007AFF',
},
selected: {
backgroundColor: '#007AFF',
},
selectedText: {
color: '#fff',
fontWeight: '600',
},
button: {
backgroundColor: '#007AFF',
padding: 15,
borderRadius: 6,
alignItems: 'center',
marginTop: 10,
},
buttonText: {
color: '#fff',
fontSize: 16,
fontWeight: '600',
},
result: {
marginTop: 15,
fontSize: 18,
textAlign: 'center',
},
});