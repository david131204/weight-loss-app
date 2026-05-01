import { Link, Stack, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { auth } from "../firebaseConfig";

const COLORS = {
  primary: "#007AFF",
  background: "#eaf1fb",
  card: "#ffffff",
  text: "#1c1c1e",
  muted: "#666",
};

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Check that all fields are completed before creating the account.
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Missing details", "Please complete all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
       // Create the user account with Firebase, then return to the setup flow.
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Sign up failed", error.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start tracking your progress with LeanPath</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
        />

         <TextInput
           style={styles.input}
           placeholder="Password"
           placeholderTextColor="#666"
           secureTextEntry
           value={password}
           onChangeText={setPassword}
         />

<TextInput
  style={styles.input}
  placeholder="Confirm Password"
  placeholderTextColor="#666"
  secureTextEntry
  value={confirmPassword}
  onChangeText={setConfirmPassword}
/>

          <Pressable style={styles.button} onPress={handleSignUp} disabled={loading}>
            <Text style={styles.buttonText}>
              {loading ? "Creating account..." : "Sign Up"}
            </Text>
          </Pressable>

          <Link href="/sign-in" style={styles.link}>
            Already have an account? Sign in
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 6,
    marginBottom: 18,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  link: {
    textAlign: "center",
    color: COLORS.primary,
    marginTop: 16,
    fontWeight: "600",
  },
  label: {
  fontSize: 14,
  color: COLORS.text,
  marginBottom: 6,
  marginTop: 4,
  fontWeight: "600",
},
});