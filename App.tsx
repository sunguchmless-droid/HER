import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

type Mood = "Great" | "Okay" | "Low" | "Tired";
type Tab = "Home" | "Wellness" | "Goals" | "Journal" | "HER AI";

const colors = { cream:"#F8F5F2", ink:"#2D2A2A", muted:"#817A7A", blush:"#F1DDE3", lavender:"#DDD8EC", sage:"#DDE8DE", blue:"#DCE8F2", white:"#FFFFFF", line:"#E9E2DF", peach:"#F3E2D8" };

const quickAccess = [
  ["Cycle & Period","◐",colors.blush],["Wellness","♡",colors.sage],["Self-Care","✦",colors.lavender],["Relationships","⌁",colors.peach],
  ["Money","KSh",colors.blue],["Study & Career","✓",colors.sage],["Goals","◎",colors.blush],["Journal","▤",colors.lavender]
] as const;

export default function App() {
  const [tab,setTab]=useState<Tab>("Home");
  const [mood,setMood]=useState<Mood>("Okay");
  const [water,setWater]=useState(4);
  const greeting=useMemo(()=>{const h=new Date().getHours();return h<12?"Good morning, Amina":h<18?"Good afternoon, Amina":"Good evening, Amina"},[]);

  const home=(
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View><Text style={styles.brand}>HER</Text><Text style={styles.tagline}>Your private space for life.</Text></View>
        <Pressable style={styles.profileButton} onPress={()=>setTab("HER AI")}><Text style={styles.profileText}>A</Text></Pressable>
      </View>
      <Text style={styles.greeting}>{greeting}</Text><Text style={styles.subtitle}>Here’s a gentle look at your day.</Text>

      <View style={styles.moodCard}>
        <Text style={styles.cardEyebrow}>HOW ARE YOU FEELING?</Text>
        <Text style={styles.cardTitle}>Check in with yourself</Text>
        <View style={styles.moodRow}>{(["Great","Okay","Low","Tired"] as Mood[]).map(item=>
          <Pressable key={item} onPress={()=>setMood(item)} style={[styles.moodPill,mood===item&&styles.moodPillActive]}>
            <Text style={[styles.moodText,mood===item&&styles.moodTextActive]}>{item}</Text>
          </Pressable>)}</View>
      </View>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Today</Text><Text style={styles.sectionLink}>View all</Text></View>
      <View style={styles.todayGrid}>
        <TodayCard icon="◐" tint={colors.blush} title="Cycle" body="Period predicted in 6 days" footer="Prediction"/>
        <TodayCard icon="◎" tint={colors.sage} title="Savings" body="Save KSh 700 toward your goal" footer="KSh 6,000 saved"/>
        <TodayCard icon="✓" tint={colors.lavender} title="Study" body="Assignment due Thursday" footer="2 tasks today"/>
        <TodayCard icon="◌" tint={colors.blue} title="Water" body={water+"/8 glasses"} footer={
          <Pressable onPress={()=>setWater(Math.min(8,water+1))}><Text style={styles.actionLink}>+ Add glass</Text></Pressable>
        }/>
      </View>

      <View style={styles.reminderCard}><View style={styles.reminderIcon}><Text>✦</Text></View><View style={{flex:1}}>
        <Text style={styles.cardEyebrow}>EVENING ROUTINE</Text><Text style={styles.reminderTitle}>Skincare at 8:00 PM</Text><Text style={styles.reminderBody}>A small thing for you, by you.</Text>
      </View><Text style={styles.chevron}>›</Text></View>

      <Pressable style={styles.aiCard} onPress={()=>setTab("HER AI")}><View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI</Text></View>
        <View style={{flex:1}}><Text style={styles.aiTitle}>Ask HER</Text><Text style={styles.aiBody}>Plan your week, set a goal, or just talk.</Text></View><Text style={styles.aiArrow}>→</Text>
      </Pressable>

      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Quick Access</Text></View>
      <View style={styles.quickGrid}>{quickAccess.map(([label,icon,tint])=>
        <Pressable key={label} style={styles.quickCard}><View style={[styles.quickIcon,{backgroundColor:tint}]}><Text style={styles.quickIconText}>{icon}</Text></View><Text style={styles.quickLabel}>{label}</Text></Pressable>
      )}</View>
    </ScrollView>
  );

  const placeholder=<View style={styles.placeholder}><View style={styles.placeholderIcon}><Text>✦</Text></View>
    <Text style={styles.placeholderTitle}>{tab}</Text><Text style={styles.placeholderBody}>This section is scaffolded and ready to build next. The shared HER design system is already in place.</Text>
    <Pressable style={styles.primaryButton} onPress={()=>setTab("Home")}><Text style={styles.primaryButtonText}>Back to Home</Text></Pressable>
  </View>;

  return <SafeAreaView style={styles.safe}><StatusBar style="dark"/>{tab==="Home"?home:placeholder}
    <View style={styles.bottomNav}>{(["Home","Wellness","Goals","Journal","HER AI"] as Tab[]).map(item=>
      <Pressable key={item} style={styles.navItem} onPress={()=>setTab(item)}>
        <Text style={[styles.navIcon,tab===item&&styles.navIconActive]}>{item==="Home"?"⌂":item==="Wellness"?"♡":item==="Goals"?"◎":item==="Journal"?"▤":"✦"}</Text>
        <Text style={[styles.navLabel,tab===item&&styles.navLabelActive]}>{item}</Text>
      </Pressable>)}</View>
  </SafeAreaView>;
}

function TodayCard({icon,tint,title,body,footer}:{icon:string;tint:string;title:string;body:string;footer:React.ReactNode}) {
  return <View style={styles.todayCard}><View style={[styles.todayIcon,{backgroundColor:tint}]}><Text style={styles.todayIconText}>{icon}</Text></View>
    <Text style={styles.todayTitle}>{title}</Text><Text style={styles.todayBody}>{body}</Text>
    {typeof footer==="string"?<Text style={styles.todayFooter}>{footer}</Text>:footer}</View>;
}

const styles=StyleSheet.create({
  safe:{flex:1,backgroundColor:colors.cream},content:{padding:22,paddingBottom:130},
  header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:28},brand:{fontFamily:"serif",fontSize:32,letterSpacing:2,color:colors.ink},tagline:{fontSize:12,color:colors.muted,marginTop:2},
  profileButton:{width:42,height:42,borderRadius:21,backgroundColor:colors.white,alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:colors.line},profileText:{fontSize:15,fontWeight:"600",color:colors.ink},
  greeting:{fontSize:27,fontWeight:"700",color:colors.ink},subtitle:{color:colors.muted,fontSize:14,marginTop:6,marginBottom:20},
  moodCard:{backgroundColor:colors.white,borderRadius:22,padding:18,borderWidth:1,borderColor:colors.line},cardEyebrow:{fontSize:10,letterSpacing:1.4,color:colors.muted,fontWeight:"700"},
  cardTitle:{fontSize:17,fontWeight:"700",color:colors.ink,marginTop:5},moodRow:{flexDirection:"row",gap:7,marginTop:14},moodPill:{flex:1,paddingVertical:10,borderRadius:14,backgroundColor:colors.cream,alignItems:"center"},
  moodPillActive:{backgroundColor:colors.ink},moodText:{fontSize:11,color:colors.muted,fontWeight:"600"},moodTextActive:{color:colors.white},
  sectionHeader:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:28,marginBottom:12},sectionTitle:{fontSize:18,fontWeight:"700",color:colors.ink},sectionLink:{fontSize:12,color:colors.muted},
  todayGrid:{flexDirection:"row",flexWrap:"wrap",gap:10},todayCard:{width:"48.2%",backgroundColor:colors.white,borderRadius:20,padding:16,minHeight:154,borderWidth:1,borderColor:colors.line},
  todayIcon:{width:36,height:36,borderRadius:12,alignItems:"center",justifyContent:"center",marginBottom:13},todayIconText:{color:colors.ink,fontSize:16},todayTitle:{fontSize:13,fontWeight:"700",color:colors.ink},
  todayBody:{fontSize:12,lineHeight:18,color:colors.muted,marginTop:6},todayFooter:{fontSize:10,color:colors.muted,marginTop:10},actionLink:{fontSize:10,color:colors.ink,fontWeight:"700",marginTop:10},
  reminderCard:{marginTop:12,padding:16,borderRadius:20,backgroundColor:colors.peach,flexDirection:"row",alignItems:"center",gap:13},reminderIcon:{width:38,height:38,borderRadius:13,backgroundColor:colors.white,alignItems:"center",justifyContent:"center"},
  reminderTitle:{fontSize:14,fontWeight:"700",color:colors.ink,marginTop:4},reminderBody:{fontSize:11,color:colors.muted,marginTop:3},chevron:{fontSize:24,color:colors.muted},
  aiCard:{marginTop:22,backgroundColor:colors.ink,borderRadius:22,padding:18,flexDirection:"row",alignItems:"center",gap:13},aiBadge:{width:42,height:42,borderRadius:15,backgroundColor:colors.blush,alignItems:"center",justifyContent:"center"},
  aiBadgeText:{fontSize:11,fontWeight:"800",color:colors.ink},aiTitle:{color:colors.white,fontSize:16,fontWeight:"700"},aiBody:{color:"#C8C2C2",fontSize:11,marginTop:4},aiArrow:{color:colors.white,fontSize:20},
  quickGrid:{flexDirection:"row",flexWrap:"wrap",gap:10},quickCard:{width:"23.3%",minHeight:88,backgroundColor:colors.white,borderRadius:18,padding:9,alignItems:"center",borderWidth:1,borderColor:colors.line},
  quickIcon:{width:36,height:36,borderRadius:12,alignItems:"center",justifyContent:"center"},quickIconText:{color:colors.ink,fontSize:12,fontWeight:"700"},quickLabel:{fontSize:9,color:colors.ink,fontWeight:"600",textAlign:"center",marginTop:8,lineHeight:12},
  placeholder:{flex:1,alignItems:"center",justifyContent:"center",padding:32},placeholderIcon:{width:64,height:64,borderRadius:22,backgroundColor:colors.blush,alignItems:"center",justifyContent:"center"},
  placeholderTitle:{fontSize:28,fontWeight:"700",color:colors.ink,marginTop:18},placeholderBody:{textAlign:"center",color:colors.muted,lineHeight:21,marginTop:8,maxWidth:330},
  primaryButton:{backgroundColor:colors.ink,paddingHorizontal:22,paddingVertical:13,borderRadius:16,marginTop:22},primaryButtonText:{color:colors.white,fontWeight:"700",fontSize:13},
  bottomNav:{position:"absolute",bottom:0,left:0,right:0,height:82,backgroundColor:colors.white,borderTopWidth:1,borderTopColor:colors.line,flexDirection:"row",justifyContent:"space-around",alignItems:"center",paddingBottom:7},
  navItem:{alignItems:"center",justifyContent:"center",width:"20%"},navIcon:{fontSize:19,color:"#A8A0A0"},navIconActive:{color:colors.ink},navLabel:{fontSize:9,color:"#A8A0A0",marginTop:4},navLabelActive:{color:colors.ink,fontWeight:"700"}
});