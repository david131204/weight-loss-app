import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";


const screenWidth = Dimensions.get("window").width;

export default function Progress() {
  const [history, setHistory] = useState<any[]>([]);
  useEffect(() => {
  const loadHistory = async () => {
    const data = await AsyncStorage.getItem("weightHistory");
    if (data) {
      setHistory(JSON.parse(data));
    }
  };

  loadHistory();
}, []);
  const data = {
    labels: history.length > 0 ? history.map(e => e.date) : ["No data"],
    datasets: [
      {
        data: history.length > 0 ? history.map(e => e.weight) : [0]
      },
    ],
  };

const startingWeight = history.length > 0 ? history[0].weight : 0;
const currentWeight = history.length > 0 ? history[history.length - 1].weight : 0;
const change = currentWeight - startingWeight;

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

<Text style={styles.text}>Starting Weight: {startingWeight} kg</Text>
<Text style={styles.text}>Current Weight: {currentWeight} kg</Text>
<Text style={styles.text}>Total Change: {change.toFixed(1)} kg</Text>
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