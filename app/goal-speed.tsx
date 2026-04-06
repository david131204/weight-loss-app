import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const COLORS = {
  primary: '#007AFF',
  background: '#eef6ff',
  card: '#ffffff',
  text: '#1c1c1e',
  border: '#d0d7de',
};

export default function GoalSpeed() {

  const router = useRouter();
  const params = useLocalSearchParams();

  const [speed, setSpeed] = useState<number | null>(null);

 const continueNext = () => {
  if (!speed) {
    alert('Please select a weight loss speed');
    return;
  }

  alert(`Selected speed: ${speed} kg per week`);
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>

        <Text style={styles.title}>Weight Loss Speed</Text>

        <Text style={styles.subtitle}>
          Choose how fast you want to lose weight
        </Text>

        <Pressable
          style={[
            styles.option,
            speed === 0.5 && styles.selected
          ]}
          onPress={() => setSpeed(0.5)}
        >
          <Text style={speed === 0.5 ? styles.selectedText : styles.optionText}>
            0.5 kg per week
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.option,
            speed === 1 && styles.selected
          ]}
          onPress={() => setSpeed(1)}
        >
          <Text style={speed === 1 ? styles.selectedText : styles.optionText}>
            1 kg per week
          </Text>
        </Pressable>

        <Pressable style={styles.button} onPress={continueNext}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>

      </View>
    </KeyboardAvoidingView>
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
    marginBottom: 30,
    color: COLORS.text,
  },

  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: COLORS.card,
  },

  optionText: {
    color: COLORS.primary,
    fontSize: 16,
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