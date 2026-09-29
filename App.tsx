import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Screen = "Home" | "Wellness" | "Goals" | "Journal" | "HER AI" | "Settings";
type Theme = "Aurora" | "Blossom" | "Lavender" | "Ocean" | "Sunset";

const modules = [
  ["Cycle & Period", "Cycle, symptoms & predictions", "🌸"],
  ["Wellness", "Mood, water & daily wellbeing", "💧"],
  ["Self-Care", "Routines that help you feel good", "✨"],
  ["Relationships", "People, notes & important dates", "💗"],
  ["Money", "Spending & savings goals", "💰"],
  ["Study & Career", "Tasks, deadlines & progress", "📚"],
  ["Goals", "Keep your plans moving", "🎯"],
  ["Journal", "Your private thoughts", "📓"],
];

const themes: Record<Theme, { bg: string; card: string; accent: string; accent2: string; text: string; soft: string; glow: string }> = {
  Aurora: { bg: "#FFF7FC", card: "#FFFFFF", accent: "#B85C8A", accent2: "#7B70D8", text: "#302A35", soft: "#F0E5FA", glow: "#FFD8EA" },
  Blossom: { bg: "#FFF7F5", card: "#FFFFFF", accent: "#D66F8D", accent2: "#F0A36E", text: "#332A2B", soft: "#FFE6EC", glow: "#FFD1DF" },
  Lavender: { bg: "#FAF7FF", card: "#FFFFFF", accent: "#8668C9", accent2: "#B26FD1", text: "#302A38", soft: "#EEE7FF", glow: "#DDD0FF" },
  Ocean: { bg: "#F4FBFF", card: "#FFFFFF", accent: "#4F8EB8", accent2: "#6F72D8", text: "#26333A", soft: "#E1F2FA", glow: "#CBEAFF" },
  Sunset: { bg: "#FFF9F2", card: "#FFFFFF", accent: "#C96D72", accent2: "#D7954B", text: "#352D29", soft: "#FCE8DC", glow: "#FFDABF" },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("Home");
  const [themeName, setThemeName] = useState<Theme>("Aurora");
  const [mood, setMood] = useState("Okay");
  const [water, setWater] = useState(4);
  const [streak, setStreak] = useState(1);
  const [checkedIn, setCheckedIn] = useState(false);
  const [goal, setGoal] = useState(700);
  const [saved, setSaved] = useState(0);
  const [journal, setJournal] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiReply, setAiReply] = useState("Hi love. I’m here to help you plan, reflect, and make today a little easier.");
  const [wallpaper, setWallpaper] = useState("shimmer");

  const t = themes[themeName];

  const themeStyles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.bg },
    page: { padding: 20, paddingBottom: 118 },
    title: { fontSize: 27, fontWeight: "800", color: t.text },
    subtitle: { fontSize: 13, color: "#81777F", marginTop: 3 },
    card: { backgroundColor: t.card, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: "#EEE5EB", marginBottom: 14 },
    accentCard: { backgroundColor: t.soft, borderRadius: 24, padding: 18, marginBottom: 14 },
    smallButton: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 15, backgroundColor: t.soft },
    buttonText: { color: t.accent, fontWeight: "800", fontSize: 12 },
  }), [t]);

  const checkIn = () => {
    if (!checkedIn) {
      setCheckedIn(true);
      setStreak((v) => v + 1);
    }
  };

  const askHER = () => {
    const q = aiQuestion.toLowerCase();
    if (!q.trim()) return;
    if (q.includes("money") || q.includes("save")) setAiReply("Let’s make it simple: save a small amount today, track it, and celebrate each milestone. Your current goal is KSh " + goal + ".");
    else if (q.includes("study") || q.includes("school")) setAiReply("Pick one important task, give it 25 focused minutes, then take a short break. Small progress counts.");
    else if (q.includes("feel") || q.includes("sad") || q.includes("stress")) setAiReply("Be gentle with yourself today. Take a breath, drink some water, and choose one small thing that would make the next hour easier.");
    else setAiReply("I hear you. Break the problem into one small next step, and I’ll help you work through it.");
    setAiQuestion("");
  };

  const Header = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.brand}>HER</Text>
        <Text style={themeStyles.subtitle}>Your private space for life.</Text>
      </View>
      <TouchableOpacity style={[styles.avatar, { backgroundColor: t.glow }]} onPress={() => setScreen("Settings")}>
        <Text style={[styles.avatarText, { color: t.accent }]}>A</Text>
      </TouchableOpacity>
    </View>
  );

  const Shimmer = () => (
    <>
      <View pointerEvents="none" style={[styles.glow, styles.glowOne, { backgroundColor: t.glow }]} />
      <View pointerEvents="none" style={[styles.glow, styles.glowTwo, { backgroundColor: t.soft }]} />
      {wallpaper === "sparkle" && <View pointerEvents="none" style={styles.sparkles}><Text style={styles.sparkleText}>✦  ·  ✧  ·  ✦</Text><Text style={styles.sparkleText}>·  ✦  ·  ✧  ·</Text></View>}
    </>
  );

  const StreakCard = () => (
    <View style={[themeStyles.accentCard, { overflow: "hidden" }]}>
      <View style={styles.rowBetween}>
        <View>
          <Text style={[styles.kicker, { color: t.accent }]}>DAILY HER CHECK-IN</Text>
          <Text style={[styles.streakTitle, { color: t.text }]}>🔥 {streak} day streak</Text>
          <Text style={styles.muted}>Show up for yourself every day.</Text>
        </View>
        <TouchableOpacity onPress={checkIn} style={[styles.checkButton, { backgroundColor: checkedIn ? t.accent : "#FFFFFF" }]}>
          <Text style={{ color: checkedIn ? "#FFFFFF" : t.accent, fontWeight: "800", fontSize: 12 }}>{checkedIn ? "Checked ✓" : "Check in"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.week}>
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <View key={d + i} style={styles.day}>
            <View style={[styles.dayDot, { backgroundColor: i < streak % 7 || checkedIn ? t.accent : "#E7DEE5" }]}><Text style={styles.dayCheck}>{i < streak % 7 || checkedIn ? "✓" : ""}</Text></View>
            <Text style={styles.dayLabel}>{d}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const Home = () => (
    <>
      <Header />
      <View style={styles.heroRow}>
        <View style={{ flex: 1 }}>
          <Text style={themeStyles.title}>Good morning, Amina</Text>
          <Text style={themeStyles.subtitle}>How are you feeling today?</Text>
        </View>
        <Text style={styles.heroEmoji}>✨</Text>
      </View>

      <View style={styles.moodRow}>
        {["Great","Okay","Low","Tired"].map((m) => (
          <TouchableOpacity key={m} onPress={() => setMood(m)} style={[styles.mood, mood === m && { backgroundColor: t.accent, borderColor: t.accent }]}>
            <Text style={[styles.moodText, mood === m && { color: "#FFFFFF" }]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <StreakCard />

      <View style={themeStyles.card}>
        <View style={styles.rowBetween}><Text style={[styles.cardTitle, { color: t.text }]}>Today</Text><Text style={styles.muted}>Your gentle plan</Text></View>
        {[["🌸","Period predicted in 6 days"],["💰","Save KSh " + Math.max(goal-saved,0) + " toward your goal"],["📚","Assignment due Thursday"],["💧",water + "/8 glasses water"],["✨","Evening skincare at 8 PM"]].map(([icon, label]) => (
          <View key={label} style={styles.todayItem}><Text style={styles.itemIcon}>{icon}</Text><Text style={styles.itemText}>{label}</Text></View>
        ))}
      </View>

      <TouchableOpacity style={[styles.aiCard, { backgroundColor: t.soft }]} onPress={() => setScreen("HER AI")}>
        <View style={[styles.aiIcon, { backgroundColor: t.glow }]}><Text style={{fontSize: 22}}>✦</Text></View>
        <View style={{flex: 1}}><Text style={[styles.aiTitle, { color: t.accent }]}>Ask HER</Text><Text style={styles.aiText}>Plan, reflect, learn, or just talk.</Text></View><Text style={[styles.arrow, { color: t.accent }]}>›</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: t.text }]}>Your life, all in one place</Text>
      <View style={styles.grid}>
        {modules.map(([title, desc, icon]) => (
          <TouchableOpacity key={title} style={themeStyles.card} onPress={() => {
            const target: Record<string, Screen> = {"Wellness":"Wellness","Goals":"Goals","Journal":"Journal"};
            setScreen(target[title] || "Home");
          }}>
            <Text style={styles.tileIcon}>{icon}</Text><Text style={[styles.tileTitle, { color: t.text }]}>{title}</Text><Text style={styles.tileDesc}>{desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const Wellness = () => (
    <>
      <ScreenHeader title="Wellness" subtitle="Small habits, better days." />
      <View style={themeStyles.accentCard}><Text style={styles.kicker}>TODAY'S MOOD</Text><Text style={[styles.bigValue,{color:t.text}]}>{mood} ✨</Text><Text style={styles.muted}>You checked in with yourself. That matters.</Text></View>
      <View style={themeStyles.card}>
        <View style={styles.rowBetween}><Text style={[styles.cardTitle,{color:t.text}]}>Water</Text><Text style={[styles.bigMini,{color:t.accent}]}>{water}/8</Text></View>
        <View style={styles.progress}><View style={[styles.progressFill,{width: (water/8)*100+"%", backgroundColor:t.accent}]} /></View>
        <TouchableOpacity style={[styles.primaryButton,{backgroundColor:t.accent}]} onPress={()=>setWater(Math.min(8,water+1))}><Text style={styles.primaryText}>+ Add a glass</Text></TouchableOpacity>
      </View>
      <View style={themeStyles.card}><Text style={[styles.cardTitle,{color:t.text}]}>Gentle care ideas</Text>{["Take a 10-minute walk","Stretch your shoulders","Put your phone away for 20 minutes","Do one thing that makes you feel beautiful"].map(x=><Text key={x} style={styles.listItem}>✓  {x}</Text>)}</View>
    </>
  );

  const Goals = () => (
    <>
      <ScreenHeader title="Goals" subtitle="Turn intentions into little wins." />
      <View style={themeStyles.accentCard}><Text style={styles.kicker}>SAVINGS GOAL</Text><Text style={[styles.bigValue,{color:t.text}]}>KSh {saved} / {goal}</Text><View style={styles.progress}><View style={[styles.progressFill,{width:Math.min(100,(saved/goal)*100)+"%",backgroundColor:t.accent}]} /></View><TouchableOpacity style={[styles.primaryButton,{backgroundColor:t.accent}]} onPress={()=>setSaved(v=>Math.min(goal,v+100))}><Text style={styles.primaryText}>Save KSh 100</Text></TouchableOpacity></View>
      <View style={themeStyles.card}><Text style={[styles.cardTitle,{color:t.text}]}>Goal ideas</Text>{["Emergency fund","New outfit","School project","Self-care day"].map(x=><TouchableOpacity key={x} onPress={()=>setGoal(g=>g+100)}><Text style={styles.listItem}>🎯  {x}</Text></TouchableOpacity>)}</View>
    </>
  );

  const Journal = () => (
    <>
      <ScreenHeader title="Journal" subtitle="Private thoughts, safely kept on this device." />
      <View style={themeStyles.card}><Text style={[styles.cardTitle,{color:t.text}]}>How was today?</Text><TextInput value={journal} onChangeText={setJournal} multiline placeholder="Write whatever is on your mind..." placeholderTextColor="#A59AA1" style={styles.journalInput} /><TouchableOpacity style={[styles.primaryButton,{backgroundColor:t.accent}]}><Text style={styles.primaryText}>Save entry</Text></TouchableOpacity></View>
      <View style={themeStyles.accentCard}><Text style={styles.kicker}>PROMPT</Text><Text style={[styles.prompt,{color:t.text}]}>What is one thing you are proud of today?</Text></View>
    </>
  );

  const AI = () => (
    <>
      <ScreenHeader title="HER AI" subtitle="Your private planning and reflection companion." />
      <View style={themeStyles.accentCard}><Text style={[styles.aiTitle,{color:t.accent}]}>✦ HER says</Text><Text style={[styles.aiReply,{color:t.text}]}>{aiReply}</Text></View>
      <View style={themeStyles.card}><TextInput value={aiQuestion} onChangeText={setAiQuestion} placeholder="Ask HER anything..." placeholderTextColor="#A59AA1" style={styles.aiInput} /><TouchableOpacity style={[styles.primaryButton,{backgroundColor:t.accent}]} onPress={askHER}><Text style={styles.primaryText}>Ask HER</Text></TouchableOpacity></View>
      <Text style={styles.muted}>Try: “Help me plan my study day” or “I feel stressed.”</Text>
    </>
  );

  const Settings = () => (
    <>
      <ScreenHeader title="Make HER yours" subtitle="Themes, wallpaper and your daily experience." />
      <View style={themeStyles.card}><Text style={[styles.cardTitle,{color:t.text}]}>Colour theme</Text><View style={styles.themeGrid}>{(Object.keys(themes) as Theme[]).map(name=><TouchableOpacity key={name} onPress={()=>setThemeName(name)} style={[styles.themeChoice,{backgroundColor:themes[name].soft,borderColor:themeName===name?themes[name].accent:"#EEE5EB"}]}><View style={[styles.themeDot,{backgroundColor:themes[name].accent}]} /><Text style={styles.themeName}>{name}</Text></TouchableOpacity>)}</View></View>
      <View style={themeStyles.card}><Text style={[styles.cardTitle,{color:t.text}]}>Wallpaper</Text>{[["shimmer","Shimmer ✨"],["sparkle","Sparkle ✦"],["clean","Clean & calm"]].map(([key,label])=><TouchableOpacity key={key} onPress={()=>setWallpaper(key)} style={[styles.settingRow,wallpaper===key&&{backgroundColor:t.soft}]}><Text style={styles.settingLabel}>{label}</Text><Text style={{color:wallpaper===key?t.accent:"#AAA"}}>{wallpaper===key?"✓":"○"}</Text></TouchableOpacity>)}</View>
      <View style={themeStyles.card}><Text style={[styles.cardTitle,{color:t.text}]}>HER experience</Text>{["Daily streaks & check-ins","Mood tracking","Water tracking","Private journal"].map(x=><Text key={x} style={styles.listItem}>✓  {x}</Text>)}</View>
    </>
  );

  const ScreenHeader = ({title,subtitle}:{title:string;subtitle:string}) => (
    <View style={styles.screenHeader}><TouchableOpacity onPress={()=>setScreen("Home")}><Text style={[styles.back,{color:t.accent}]}>‹</Text></TouchableOpacity><View style={{flex:1}}><Text style={themeStyles.title}>{title}</Text><Text style={themeStyles.subtitle}>{subtitle}</Text></View></View>
  );

  const content = screen==="Home" ? <Home/> : screen==="Wellness" ? <Wellness/> : screen==="Goals" ? <Goals/> : screen==="Journal" ? <Journal/> : screen==="HER AI" ? <AI/> : <Settings/>;

  return (
    <SafeAreaView style={themeStyles.safe}>
      <Shimmer />
      <ScrollView contentContainerStyle={themeStyles.page} showsVerticalScrollIndicator={false}>{content}</ScrollView>
      <View style={styles.nav}>
        {([["Home","⌂"],["Wellness","♡"],["Goals","◎"],["Journal","✎"],["HER AI","✦"]] as const).map(([name,icon])=><TouchableOpacity key={name} style={styles.navItem} onPress={()=>setScreen(name as Screen)}><Text style={[styles.navIcon,{color:screen===name?t.accent:"#A39AA0"}]}>{icon}</Text><Text style={[styles.navLabel,{color:screen===name?t.accent:"#A39AA0"}]}>{name}</Text></TouchableOpacity>)}
      </View>
      <TouchableOpacity onPress={()=>setScreen("Settings")} style={styles.settingsFab}><Text>⚙</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:22},
  brand:{fontSize:31,fontWeight:"900",letterSpacing:2,color:"#2E2930"},
  avatar:{width:44,height:44,borderRadius:22,alignItems:"center",justifyContent:"center"},
  avatarText:{fontSize:16,fontWeight:"800"},
  heroRow:{flexDirection:"row",alignItems:"center",marginBottom:14},
  heroEmoji:{fontSize:35},
  moodRow:{flexDirection:"row",gap:8,marginBottom:18},
  mood:{flex:1,paddingVertical:11,borderRadius:15,backgroundColor:"#FFFFFF",alignItems:"center",borderWidth:1,borderColor:"#EEE5EB"},
  moodText:{fontSize:12,color:"#716970",fontWeight:"700"},
  glow:{position:"absolute",borderRadius:999,opacity:.55},
  glowOne:{width:220,height:220,right:-90,top:-50},
  glowTwo:{width:190,height:190,left:-100,top:260},
  sparkles:{position:"absolute",right:12,top:100,opacity:.35},
  sparkleText:{fontSize:16,color:"#A66AB0",lineHeight:42},
  rowBetween:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  kicker:{fontSize:10,fontWeight:"900",letterSpacing:1.3,color:"#8D7180",marginBottom:5},
  streakTitle:{fontSize:22,fontWeight:"900",marginBottom:3},
  muted:{fontSize:12,color:"#8C8188",lineHeight:18},
  checkButton:{paddingHorizontal:14,paddingVertical:11,borderRadius:16},
  week:{flexDirection:"row",justifyContent:"space-between",marginTop:17},
  day:{alignItems:"center",gap:5},
  dayDot:{width:25,height:25,borderRadius:13,alignItems:"center",justifyContent:"center"},
  dayCheck:{fontSize:11,color:"#FFFFFF",fontWeight:"900"},
  dayLabel:{fontSize:10,color:"#958A91",fontWeight:"700"},
  cardTitle:{fontSize:18,fontWeight:"800"},
  todayItem:{flexDirection:"row",alignItems:"center",paddingVertical:10,borderTopWidth:1,borderTopColor:"#F1E9EE"},
  itemIcon:{width:31,fontSize:17},
  itemText:{flex:1,fontSize:14,color:"#514950"},
  aiCard:{flexDirection:"row",alignItems:"center",borderRadius:23,padding:16,marginBottom:22},
  aiIcon:{width:43,height:43,borderRadius:22,alignItems:"center",justifyContent:"center",marginRight:12},
  aiTitle:{fontSize:17,fontWeight:"900"},
  aiText:{marginTop:3,fontSize:12,color:"#716873"},
  arrow:{fontSize:29,marginLeft:8},
  sectionTitle:{fontSize:20,fontWeight:"800",marginBottom:12},
  grid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between"},
  tileIcon:{fontSize:23,marginBottom:9},
  tileTitle:{fontSize:14,fontWeight:"800",marginBottom:4},
  tileDesc:{fontSize:11,lineHeight:16,color:"#857B82"},
  screenHeader:{flexDirection:"row",alignItems:"center",gap:8,marginBottom:20},
  back:{fontSize:38,lineHeight:38,fontWeight:"300"},
  bigValue:{fontSize:29,fontWeight:"900",marginBottom:8},
  bigMini:{fontSize:22,fontWeight:"900"},
  progress:{height:9,borderRadius:6,backgroundColor:"#EDE6EB",overflow:"hidden",marginVertical:13},
  progressFill:{height:9,borderRadius:6},
  primaryButton:{alignItems:"center",paddingVertical:12,borderRadius:15,marginTop:7},
  primaryText:{color:"#FFFFFF",fontWeight:"900",fontSize:13},
  listItem:{fontSize:14,color:"#5B525A",paddingVertical:10},
  journalInput:{minHeight:150,textAlignVertical:"top",fontSize:15,color:"#403940",paddingTop:12},
  prompt:{fontSize:20,fontWeight:"800",lineHeight:28},
  aiReply:{fontSize:15,lineHeight:23,marginTop:8},
  aiInput:{minHeight:70,fontSize:15,color:"#403940",textAlignVertical:"top"},
  themeGrid:{flexDirection:"row",flexWrap:"wrap",gap:10,marginTop:14},
  themeChoice:{width:"47%",padding:12,borderRadius:17,borderWidth:2,flexDirection:"row",alignItems:"center",gap:9},
  themeDot:{width:20,height:20,borderRadius:10},
  themeName:{fontSize:12,fontWeight:"800",color:"#554C53"},
  settingRow:{padding:15,borderRadius:15,marginTop:8,flexDirection:"row",justifyContent:"space-between"},
  settingLabel:{fontSize:14,color:"#554C53",fontWeight:"700"},
  nav:{position:"absolute",left:10,right:10,bottom:10,height:70,borderRadius:25,backgroundColor:"#FFFFFF",borderWidth:1,borderColor:"#E9E0E7",flexDirection:"row",alignItems:"center",justifyContent:"space-around",shadowOpacity:.08,shadowRadius:14,elevation:5},
  navItem:{flex:1,alignItems:"center",justifyContent:"center"},
  navIcon:{fontSize:18,fontWeight:"800",marginBottom:2},
  navLabel:{fontSize:9,fontWeight:"800"},
  settingsFab:{position:"absolute",right:17,bottom:92,width:42,height:42,borderRadius:21,backgroundColor:"#FFFFFF",alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:"#E9E0E7",elevation:4},
});