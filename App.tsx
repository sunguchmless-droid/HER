import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.brand}>HER</Text>
        <Text style={styles.title}>HER Android startup</Text>
        <Text style={styles.body}>Android is launching HER correctly.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F5F2" },
  card: { flex: 1, justifyContent: "center", padding: 28 },
  brand: { fontSize: 42, fontWeight: "700", color: "#2D2A2A", marginBottom: 14 },
  title: { fontSize: 24, fontWeight: "700", color: "#2D2A2A", marginBottom: 10 },
  body: { fontSize: 15, lineHeight: 22, color: "#817A7A" }
});
