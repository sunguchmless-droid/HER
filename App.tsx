import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const quickAccess = [
  ["Cycle & Period", "Your cycle, symptoms & predictions", "🌸"],
  ["Wellness", "Mood, water & everyday wellbeing", "💧"],
  ["Self-Care", "Routines that help you feel good", "✨"],
  ["Relationships", "Important people, notes & dates", "💗"],
  ["Money", "Track spending & savings goals", "💰"],
  ["Study & Career", "Tasks, deadlines & progress", "📚"],
  ["Goals", "Keep your plans moving", "🎯"],
  ["Journal", "A private place for your thoughts", "📓"],
];

const tabs = ["Home", "Wellness", "Goals", "Journal", "HER AI"];

export default function App() {
  const [mood, setMood] = useState("Okay");
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>HER</Text>
            <Text style={styles.tagline}>Your private space for life.</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
        </View>

        <Text style={styles.greeting}>Good morning, Amina</Text>
        <Text style={styles.subtle}>How are you feeling today?</Text>

        <View style={styles.moodRow}>
          {["Great", "Okay", "Low", "Tired"].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setMood(item)}
              style={[styles.mood, mood === item && styles.moodActive]}
            >
              <Text style={[styles.moodText, mood === item && styles.moodTextActive]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.todayCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today</Text>
            <Text style={styles.cardHint}>Your gentle plan</Text>
          </View>
          {[
            ["🌸", "Period predicted in 6 days"],
            ["💰", "Save KSh 700 toward your goal"],
            ["📚", "Assignment due Thursday"],
            ["💧", "4/8 glasses water"],
            ["✨", "Evening skincare at 8 PM"],
          ].map(([icon, text]) => (
            <View key={text} style={styles.todayItem}>
              <Text style={styles.itemIcon}>{icon}</Text>
              <Text style={styles.itemText}>{text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.aiCard} onPress={() => setActiveTab("HER AI")}>
          <View style={styles.aiIcon}><Text style={{fontSize: 22}}>✦</Text></View>
          <View style={{flex: 1}}>
            <Text style={styles.aiTitle}>Ask HER</Text>
            <Text style={styles.aiText}>A private space to ask, plan and reflect.</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.grid}>
          {quickAccess.map(([title, desc, icon]) => (
            <TouchableOpacity key={title} style={styles.tile}>
              <Text style={styles.tileIcon}>{icon}</Text>
              <Text style={styles.tileTitle}>{title}</Text>
              <Text style={styles.tileDesc}>{desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <View style={styles.nav}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} style={styles.navItem} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.navLabel, activeTab === tab && styles.navLabelActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F5F2" },
  page: { padding: 22, paddingBottom: 110 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 28 },
  brand: { fontSize: 30, fontWeight: "800", letterSpacing: 1.5, color: "#2D2A2A" },
  tagline: { marginTop: 2, fontSize: 12, color: "#817A7A" },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#E9C9D8", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 16, fontWeight: "700", color: "#5E3F50" },
  greeting: { fontSize: 28, fontWeight: "700", color: "#2D2A2A", marginBottom: 5 },
  subtle: { fontSize: 14, color: "#817A7A", marginBottom: 14 },
  moodRow: { flexDirection: "row", gap: 8, marginBottom: 22 },
  mood: { flex: 1, paddingVertical: 11, borderRadius: 14, backgroundColor: "#FFFFFF", alignItems: "center", borderWidth: 1, borderColor: "#EEE6E5" },
  moodActive: { backgroundColor: "#EBD4E0", borderColor: "#D9B5C8" },
  moodText: { fontSize: 12, color: "#6F6868", fontWeight: "600" },
  moodTextActive: { color: "#5E3F50" },
  todayCard: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: "#EFE8E6" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  cardTitle: { fontSize: 20, fontWeight: "700", color: "#2D2A2A" },
  cardHint: { fontSize: 12, color: "#A08F98" },
  todayItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#F2ECEA" },
  itemIcon: { width: 30, fontSize: 17 },
  itemText: { flex: 1, fontSize: 14, color: "#4F4949" },
  aiCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#E9E2F4", borderRadius: 20, padding: 16, marginBottom: 25 },
  aiIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#D8CBEA", alignItems: "center", justifyContent: "center", marginRight: 12 },
  aiTitle: { fontSize: 17, fontWeight: "700", color: "#4D405B" },
  aiText: { marginTop: 3, fontSize: 12, color: "#6F6378" },
  arrow: { fontSize: 28, color: "#6F6378", marginLeft: 8 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#2D2A2A", marginBottom: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  tile: { width: "48.2%", minHeight: 132, backgroundColor: "#FFFFFF", borderRadius: 19, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: "#EFE8E6" },
  tileIcon: { fontSize: 22, marginBottom: 10 },
  tileTitle: { fontSize: 14, fontWeight: "700", color: "#3D3838", marginBottom: 5 },
  tileDesc: { fontSize: 11, lineHeight: 16, color: "#857B7E" },
  nav: { position: "absolute", left: 12, right: 12, bottom: 12, height: 66, borderRadius: 24, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E9E1E0", flexDirection: "row", alignItems: "center", justifyContent: "space-around" },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
  navLabel: { fontSize: 10, color: "#9A9093", fontWeight: "600" },
  navLabelActive: { color: "#9C5C7A", fontWeight: "800" },
  bottomSpace: { height: 10 },
});
