import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function Progress() {
  const data = {
    labels: ["Apr 1", "Apr 4", "Apr 7", "Apr 10"],
    datasets: [
      {
        data: [98.5, 97.9, 97.2, 96.8],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight Progress</Text>

      <LineChart
        data={data}
        width={screenWidth - 20}
        height={220}
        yAxisSuffix="kg"
        chartConfig={{
          backgroundColor: "#0f172a",
          backgroundGradientFrom: "#0f172a",
          backgroundGradientTo: "#0f172a",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(34,197,94, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255,255,255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 20,
          borderRadius: 16,
        }}
      />

      <Text style={styles.text}>Starting Weight: 98.5 kg</Text>
      <Text style={styles.text}>Current Weight: 96.8 kg</Text>
      <Text style={styles.text}>Total Change: -1.7 kg</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 28,
    color: "white",
    marginBottom: 20,
  },
  text: {
    color: "#cbd5e1",
    fontSize: 16,
    marginTop: 5,
  },
});