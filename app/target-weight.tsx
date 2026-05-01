import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
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

export default function TargetWeight() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [targetWeight, setTargetWeight] = useState("");

  const continueNext = () => {
    const t = parseFloat(targetWeight);

    if (isNaN(t) || t <= 0) {
      alert("Please enter a valid target weight");
      return;
    }

    router.push({
      pathname: "/goal-speed",
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>Target Weight</Text>
            <Text style={styles.subtitle}>
              Set the goal weight you want to work towards.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>Your goal</Text>
              <Text style={styles.sectionBadge}>Step 2</Text>
            </View>

            <Text style={styles.helperText}>
              This will be used to calculate your weight loss plan.
            </Text>

            <View style={styles.inputRow}>
              <Ionicons name="flag-outline" size={20} color={COLORS.muted} />
              <TextInput
                style={styles.input}
                placeholder="Target weight (kg)"
                placeholderTextColor={COLORS.muted}
                keyboardType="numeric"
                value={targetWeight}
                onChangeText={setTargetWeight}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
          </View>

          <Pressable style={styles.primaryAction} onPress={continueNext}>
            <View style={styles.actionContent}>
              <Ionicons name="arrow-forward-circle-outline" size={24} color="#fff" />
              <View>
                <Text style={styles.primaryActionTitle}>Continue</Text>
                <Text style={styles.primaryActionSubtitle}>
                  Choose your weekly goal speed
                </Text>
              </View>
            </View>

            <Text style={styles.actionArrow}>›</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
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
    lineHeight: 21,
  },
  card: {
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
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  sectionBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
    backgroundColor: "#e8f1ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 14,
    lineHeight: 20,
  },
  inputRow: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 14,
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
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  primaryActionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  primaryActionSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    marginTop: 4,
  },
  actionArrow: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "400",
    marginLeft: 12,
  },
});