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
// Screen where the user enters their target weight
export default function TargetWeight() {

  const router = useRouter();

  const params = useLocalSearchParams();

  const [targetWeight, setTargetWeight] = useState('');

const continueNext = () => {
  const t = parseFloat(targetWeight);

  if (isNaN(t) || t <= 0) {
    alert('Please enter a valid target weight');
    return;
  }

  router.push({
    pathname: '/goal-speed',
    params: {
      ...params,
      targetWeight: t.toString(),
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

          <Text style={styles.title}>Target Weight</Text>

          <Text style={styles.subtitle}>
            Enter your goal weight
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Target Weight (kg)"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={targetWeight}
            onChangeText={setTargetWeight}
          />

          <Pressable style={styles.button} onPress={continueNext}>
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
    marginBottom: 20,
    fontWeight: '600',
    color: COLORS.primary,
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: COLORS.text,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: COLORS.card,
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

});