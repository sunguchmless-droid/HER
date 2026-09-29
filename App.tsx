import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Screen =
  | "Home" | "Goals" | "Journal" | "AI" | "More"
  | "CheckIn" | "Mood" | "Water" | "Cycle" | "Relationships"
  | "Study" | "SelfCare" | "Themes";

type ThemeName = "Aurora" | "Blossom" | "Lavender" | "Ocean" | "Sunset";

const themeMap: Record<ThemeName, { bg: string; card: string; pink: string; purple: string; blue: string; green: string; glow: string; text: string }> = {
  Aurora:   { bg: "#FFF6FC", card: "#FFFFFF", pink: "#E83F91", purple: "#7862D7", blue: "#55A9E8", green: "#78B987", glow: "#FFD4EA", text: "#342B38" },
  Blossom:  { bg: "#FFF7F7", card: "#FFFFFF", pink: "#E75E86", purple: "#A46BC7", blue: "#77B8DD", green: "#7BBF91", glow: "#FFD2DE", text: "#382C31" },
  Lavender: { bg: "#FAF7FF", card: "#FFFFFF", pink: "#D84F9A", purple: "#805BD0", blue: "#719FEA", green: "#7AB79E", glow: "#E2D6FF", text: "#302B3A" },
  Ocean:    { bg: "#F3FBFF", card: "#FFFFFF", pink: "#D94E93", purple: "#6674D7", blue: "#3EA6D9", green: "#68B68E", glow: "#C8EEFF", text: "#28333A" },
  Sunset:   { bg: "#FFF8F2", card: "#FFFFFF", pink: "#D95B7C", purple: "#9567C4", blue: "#75A9D9", green: "#7EAF87", glow: "#FFD9BF", text: "#392E2D" },
};

const modules = [
  ["Cycle Tracker", "Know your body, own your cycle.", "🌸", "Cycle"],
  ["Mood Tracker", "Check in with how you feel.", "😊", "Mood"],
  ["Water Tracker", "Stay hydrated, feel happier.", "💧", "Water"],
  ["Savings & Goals", "Big dreams need small steps.", "💰", "Goals"],
  ["Journal", "Your thoughts matter.", "📖", "Journal"],
  ["HER AI", "Always here for you.", "✦", "AI"],
  ["Relationships", "Stronger connections.", "💗", "Relationships"],
  ["Study & Career", "Your goals, your future.", "📚", "Study"],
  ["Self-Care", "Take care of the most important person — you.", "🌿", "SelfCare"],
];

const themes: ThemeName[] = ["Aurora", "Blossom", "Lavender", "Ocean", "Sunset"];

export default function App() {
  const [screen, setScreen] = useState<Screen>("Home");
  const [themeName, setThemeName] = useState<ThemeName>("Aurora");
  const [wallpaper, setWallpaper] = useState<"shimmer" | "sparkle" | "clean">("shimmer");
  const [streak, setStreak] = useState(12);
  const [checkedIn, setCheckedIn] = useState(false);
  const [mood, setMood] = useState("Happy");
  const [water, setWater] = useState(5);
  const [saved, setSaved] = useState(250);
  const [goal, setGoal] = useState(1000);
  const [cycleDay, setCycleDay] = useState(12);
  const [journal, setJournal] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiReply, setAiReply] = useState("Hi Queen 👑 I’m HER, your personal AI. I’m here to listen, advise, motivate and support you on your journey.");
  const [studyDone, setStudyDone] = useState(1);
  const [relationshipNote, setRelationshipNote] = useState("");

  const t = themeMap[themeName];

  const go = (next: Screen) => setScreen(next);

  const dailyCheckIn = () => {
    if (!checkedIn) {
      setCheckedIn(true);
      setStreak((value) => value + 1);
    }
  };

  const askAI = () => {
    const q = aiText.toLowerCase();
    if (!q.trim()) return;
    if (q.includes("study") || q.includes("school")) {
      setAiReply("Let’s make your study day lighter: choose one important task, focus for 25 minutes, then take a short break. You’ve got this. 💗");
    } else if (q.includes("money") || q.includes("save")) {
      setAiReply("You’re already building the habit. Try saving a small amount today and celebrate the progress, not just the final number. 💰");
    } else if (q.includes("sad") || q.includes("stress") || q.includes("feel")) {
      setAiReply("Take a slow breath. You don’t have to solve everything at once. Drink some water, step away for a moment, and choose one gentle next step. 💕");
    } else {
      setAiReply("I’m listening. Let’s break it into one small next step together. You can tell me what’s on your mind. ✦");
    }
    setAiText("");
  };

  const Header = ({ title = "HER", subtitle = "Your private space for life." }: { title?: string; subtitle?: string }) => (
    <View style={styles.header}>
      <View>
        <Text style={[styles.brand, { color: t.text }]}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <TouchableOpacity onPress={() => go("Themes")} style={[styles.avatar, { backgroundColor: t.glow }]}>
        <Text style={[styles.avatarText, { color: t.pink }]}>A</Text>
      </TouchableOpacity>
    </View>
  );

  const Background = () => (
    <>
      <View style={[styles.orb, { backgroundColor: t.glow, top: -70, right: -90 }]} />
      <View style={[styles.orb, { backgroundColor: t.purple + "22", top: 330, left: -120 }]} />
      {wallpaper === "sparkle" && (
        <View pointerEvents="none" style={styles.sparkles}>
          <Text style={styles.sparkle}>✦  ✧  ·  ✦</Text>
          <Text style={styles.sparkle}>·  ✦  ·  ✧  ·</Text>
          <Text style={styles.sparkle}>✧  ·  ✦  ·  ✧</Text>
        </View>
      )}
    </>
  );

  const Card = ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <View style={[styles.card, { backgroundColor: t.card }, style]}>{children}</View>
  );

  const Button = ({ label, onPress, secondary = false }: { label: string; onPress: () => void; secondary?: boolean }) => (
    <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: secondary ? t.glow : t.pink }]}>
      <Text style={[styles.buttonText, secondary && { color: t.pink }]}>{label}</Text>
    </TouchableOpacity>
  );

  const Home = () => (
    <>
      <Header />
      <View style={styles.hero}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.greeting, { color: t.text }]}>Good Morning,</Text>
          <Text style={[styles.queen, { color: t.text }]}>Queen 👑</Text>
        </View>
        <Text style={styles.heroFlower}>✦</Text>
      </View>

      <TouchableOpacity onPress={() => go("CheckIn")} style={[styles.streakCard, { backgroundColor: t.card }]}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={[styles.eyebrow, { color: t.pink }]}>🔥 DAILY CHECK-IN</Text>
            <Text style={[styles.streak, { color: t.text }]}>{streak} Day Streak</Text>
            <Text style={styles.muted}>Keep showing up for yourself 💗</Text>
          </View>
          <View style={[styles.streakBadge, { backgroundColor: checkedIn ? t.pink : t.glow }]}>
            <Text style={{ color: checkedIn ? "#FFF" : t.pink, fontWeight: "900" }}>{checkedIn ? "✓" : "🔥"}</Text>
          </View>
        </View>
        <Button label={checkedIn ? "Checked In Today ✓" : "Check In Today"} onPress={dailyCheckIn} />
      </TouchableOpacity>

      <View style={styles.twoCol}>
        <TouchableOpacity onPress={() => go("Mood")} style={[styles.smallCard, { backgroundColor: "#FCE6F1" }]}>
          <Text style={styles.smallIcon}>😊</Text><Text style={[styles.smallTitle, { color: t.text }]}>Mood</Text><Text style={styles.smallText}>{mood}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => go("Water")} style={[styles.smallCard, { backgroundColor: "#E4F5FD" }]}>
          <Text style={styles.smallIcon}>💧</Text><Text style={[styles.smallTitle, { color: t.text }]}>Water</Text><Text style={styles.smallText}>{water}/8 glasses</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => go("Goals")} style={[styles.smallCard, { backgroundColor: "#FFF0DE" }]}>
          <Text style={styles.smallIcon}>💰</Text><Text style={[styles.smallTitle, { color: t.text }]}>Savings</Text><Text style={styles.smallText}>KSh {saved}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => go("Journal")} style={[styles.smallCard, { backgroundColor: "#EEE8FF" }]}>
          <Text style={styles.smallIcon}>📖</Text><Text style={[styles.smallTitle, { color: t.text }]}>Journal</Text><Text style={styles.smallText}>Write your thoughts</Text>
        </TouchableOpacity>
      </View>

      <Card style={{ backgroundColor: t.soft }}>
        <Text style={[styles.eyebrow, { color: t.purple }]}>TODAY'S AFFIRMATION</Text>
        <Text style={[styles.affirmation, { color: t.text }]}>I am enough. I am growing. I am becoming the best version of myself.</Text>
        <Text style={{ alignSelf: "flex-end", color: t.pink, fontSize: 20 }}>♥</Text>
      </Card>

      <Text style={[styles.sectionTitle, { color: t.text }]}>Explore HER</Text>
      <View style={styles.moduleGrid}>
        {modules.map(([title, desc, icon, target]) => (
          <TouchableOpacity key={title} onPress={() => go(target as Screen)} style={[styles.moduleCard, { backgroundColor: t.card }]}>
            <View style={[styles.moduleIcon, { backgroundColor: t.glow }]}><Text style={{ fontSize: 22 }}>{icon}</Text></View>
            <Text style={[styles.moduleTitle, { color: t.text }]}>{title}</Text>
            <Text style={styles.moduleDesc}>{desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const CheckIn = () => (
    <>
      <ScreenHeader title="Daily Check-in" subtitle="Small steps create big changes 💗" />
      <Card style={{ alignItems: "center", backgroundColor: t.soft }}>
        <Text style={{ fontSize: 48 }}>🔥</Text>
        <Text style={[styles.bigNumber, { color: t.pink }]}>{streak}</Text>
        <Text style={[styles.streak, { color: t.text }]}>Day Streak</Text>
        <Text style={styles.muted}>You’re showing up for yourself.</Text>
        <Button label={checkedIn ? "Checked In Today ✓" : "Check In"} onPress={dailyCheckIn} />
      </Card>
      <Card>
        <Text style={[styles.cardTitle, { color: t.text }]}>Today's Focus</Text>
        {["Be kind to yourself", "Stay hydrated", "Do something you love"].map((x) => <Text key={x} style={styles.listItem}>✓  {x}</Text>)}
      </Card>
    </>
  );

  const Mood = () => {
    const moods = [["😊","Happy"],["😌","Calm"],["🤩","Excited"],["😢","Sad"],["😟","Anxious"],["😴","Tired"],["😍","Loved"],["🧠","Focused"],["🙂","Other"]];
    return <>
      <ScreenHeader title="Mood Tracker" subtitle="How are you feeling today?" />
      <View style={styles.moodGrid}>{moods.map(([emoji,name]) => <TouchableOpacity key={name} onPress={() => setMood(name)} style={[styles.moodChoice, { backgroundColor: mood === name ? t.glow : t.card, borderColor: mood === name ? t.pink : "#EEE5EB" }]}><Text style={{fontSize:27}}>{emoji}</Text><Text style={styles.moodName}>{name}</Text></TouchableOpacity>)}</View>
      <Card><TextInput placeholder="Add a note (optional)..." placeholderTextColor="#A59BA2" multiline style={styles.noteInput}/><Button label="Save Mood" onPress={() => Alert.alert("Saved", "Your mood check-in is saved.")}/></Card>
    </>;
  };

  const Water = () => <>
    <ScreenHeader title="Water Tracker" subtitle="Hydrate for a healthier, happier you." />
    <Card style={{ alignItems: "center", backgroundColor: "#DDF4FF" }}>
      <View style={[styles.waterRing, { borderColor: t.blue }]}><Text style={[styles.bigNumber, { color: t.blue }]}>{water}</Text><Text style={styles.muted}>/ 8</Text><Text style={styles.waterLabel}>glasses</Text></View>
      <Text style={styles.muted}>1.5 L goal</Text>
      <Button label="+ Add Water" onPress={() => setWater(Math.min(8, water + 1))}/>
    </Card>
    <View style={styles.glassRow}>{Array.from({length:8}).map((_,i)=><TouchableOpacity key={i} onPress={()=>setWater(i+1)} style={[styles.glass,{backgroundColor:i<water?t.blue:"#EAF4F8"}]}><Text>💧</Text></TouchableOpacity>)}</View>
    <Card><Text style={[styles.cardTitle,{color:t.text}]}>Great job!</Text><Text style={styles.muted}>You’re {Math.round(water/8*100)}% toward your daily goal.</Text></Card>
  </>;

  const Goals = () => <>
    <ScreenHeader title="Savings & Goals" subtitle="Big dreams need small steps 💗" />
    <Card style={{ backgroundColor: t.soft }}>
      <View style={styles.rowBetween}><Text style={[styles.cardTitle,{color:t.text}]}>Total Saved</Text><Text style={{color:t.pink,fontWeight:"900"}}>KSh {saved}</Text></View>
      <View style={styles.progress}><View style={[styles.progressFill,{width: Math.min(100,saved/goal*100)+"%",backgroundColor:t.pink}]}/></View>
      <Text style={styles.muted}>Goal: KSh {goal}</Text>
    </Card>
    {["Travel the World","New Laptop","Self Care Fund"].map((g,i)=><Card key={g}><View style={styles.rowBetween}><View><Text style={[styles.cardTitle,{color:t.text}]}>{g}</Text><Text style={styles.muted}>{i===0?"KSh 250 / KSh 1,500":i===1?"KSh 100 / KSh 800":"KSh 50 / KSh 500"}</Text></View><Text style={{fontSize:25}}>{["✈️","💻","🛍️"][i]}</Text></View><TouchableOpacity onPress={()=>setSaved(v=>Math.min(goal,v+50))} style={[styles.addSmall,{backgroundColor:t.glow}]}><Text style={{color:t.pink,fontWeight:"900"}}>Add KSh 50</Text></TouchableOpacity></Card>)}
  </>;

  const Journal = () => <>
    <ScreenHeader title="Journal" subtitle="Your thoughts matter." />
    <Card><TextInput value={journal} onChangeText={setJournal} placeholder="Write your thoughts..." placeholderTextColor="#A59BA2" multiline style={styles.journalInput}/><Button label="New Entry" onPress={()=>Alert.alert("Journal", journal.trim() ? "Your entry is ready to save." : "Write something first.")}/></Card>
    {["Today","Yesterday","Apr 26"].map((d,i)=><Card key={d}><Text style={[styles.eyebrow,{color:t.pink}]}>{d}</Text><Text style={[styles.journalLine,{color:t.text}]}>{i===0?(journal||"I’m learning, growing and taking care of myself."):i===1?"It’s okay to take a break when I need one.":"Big dreams, bigger plans..."}</Text></Card>)}
  </>;

  const AI = () => <>
    <ScreenHeader title="HER AI" subtitle="Always here for you 💗" />
    <Card style={{backgroundColor:"#231B3C"}}><Text style={{color:"#D9B7FF",fontWeight:"900",fontSize:17}}>✦ HER</Text><Text style={{color:"#FFF",fontSize:15,lineHeight:23,marginTop:10}}>{aiReply}</Text></Card>
    <View style={styles.suggestionRow}>{["Give me motivation","Help with a problem","Daily affirmations","Just chat"].map(x=><TouchableOpacity key={x} onPress={()=>setAiText(x)} style={[styles.suggestion,{backgroundColor:t.card,borderColor:t.purple+"55"}]}><Text style={{color:t.purple,fontWeight:"800",fontSize:11}}>{x}</Text></TouchableOpacity>)}</View>
    <Card><TextInput value={aiText} onChangeText={setAiText} placeholder="Type a message..." placeholderTextColor="#A59BA2" style={styles.aiInput}/><Button label="Ask HER ✦" onPress={askAI}/></Card>
  </>;

  const Cycle = () => <>
    <ScreenHeader title="Cycle Tracker" subtitle="Know your body, own your cycle 🌸" />
    <Card style={{alignItems:"center",backgroundColor:"#FFF0F7"}}><Text style={[styles.bigNumber,{color:t.pink}]}>Day {cycleDay}</Text><Text style={[styles.cardTitle,{color:t.text}]}>of your cycle</Text><Text style={styles.muted}>Next period in {28-cycleDay} days</Text><View style={[styles.cycleRing,{borderColor:t.pink}]}><Text style={{fontSize:30}}>🌸</Text></View><Button label="Log Today" onPress={()=>setCycleDay(v=>Math.min(28,v+1))}/></Card>
    <Card><Text style={[styles.cardTitle,{color:t.text}]}>Cycle Overview</Text><Text style={styles.listItem}>🩷  Period — Apr 16 to Apr 20</Text><Text style={styles.listItem}>💙  Fertile Window — May 2 to May 7</Text><Text style={styles.listItem}>💜  Ovulation — May 5</Text></Card>
  </>;

  const Relationships = () => <>
    <ScreenHeader title="Relationships" subtitle="Stronger connections 💗" />
    {["Self Love","Partner","Friends & Family","Boundaries"].map((x,i)=><Card key={x}><Text style={{fontSize:25}}>{["💗","💞","👯","🛡️"][i]}</Text><Text style={[styles.cardTitle,{color:t.text}]}>{x}</Text><Text style={styles.muted}>{["Build a healthier relationship with you.","Communicate · Grow · Support","Keep your close people close.","Protect your peace."][i]}</Text></Card>)}
    <Card><Text style={[styles.cardTitle,{color:t.text}]}>Private note</Text><TextInput value={relationshipNote} onChangeText={setRelationshipNote} placeholder="Write a note..." placeholderTextColor="#A59BA2" style={styles.noteInput}/><Button label="Save Note" onPress={()=>Alert.alert("Saved","Your relationship note is saved.")}/></Card>
  </>;

  const Study = () => <>
    <ScreenHeader title="Study & Career" subtitle="Your goals, your future 💗" />
    {["My Courses","Study Planner","Career Goals","Skills & Growth"].map((x,i)=><Card key={x}><Text style={{fontSize:25}}>{["📚","🗓️","💼","🌱"][i]}</Text><Text style={[styles.cardTitle,{color:t.text}]}>{x}</Text><Text style={styles.muted}>{["Track your learning","Stay on track","Build your dream career","Learn something new"][i]}</Text></Card>)}
    <Card><Text style={[styles.cardTitle,{color:t.text}]}>Today’s tasks</Text>{["Read chapter 4","Finish assignment","Review notes"].map((x,i)=><TouchableOpacity key={x} onPress={()=>setStudyDone(v=>Math.min(3,v+1))}><Text style={styles.listItem}>{i<studyDone?"✓":"○"}  {x}</Text></TouchableOpacity>)}</Card>
  </>;

  const SelfCare = () => <>
    <ScreenHeader title="Self-Care" subtitle="Take care of the most important person — YOU 💚" />
    {["Skincare & Beauty","Fitness","Nutrition","Sleep","Mindfulness"].map((x,i)=><Card key={x}><Text style={{fontSize:25}}>{["🧴","🏃‍♀️","🥗","🌙","🧘‍♀️"][i]}</Text><Text style={[styles.cardTitle,{color:t.text}]}>{x}</Text><Text style={styles.muted}>{["Glow inside out","Move your body","Fuel your dreams","Rest & recharge","Be present"][i]}</Text></Card>)}
  </>;

  const Themes = () => <>
    <ScreenHeader title="Themes & Wallpapers" subtitle="Make HER yours ✨" />
    <Card><Text style={[styles.cardTitle,{color:t.text}]}>Choose a Theme</Text><View style={styles.themeGrid}>{themes.map((name)=><TouchableOpacity key={name} onPress={()=>setThemeName(name)} style={[styles.themeChoice,{backgroundColor:themeMap[name].glow,borderColor:themeName===name?themeMap[name].pink:"#EEE5EB"}]}><View style={[styles.themePreview,{backgroundColor:themeMap[name].purple}]}><Text style={{color:"#FFF"}}>✦</Text></View><Text style={styles.themeName}>{name}</Text></TouchableOpacity>)}</View></Card>
    <Card><Text style={[styles.cardTitle,{color:t.text}]}>Wallpapers</Text>{[["shimmer","Shimmer ✨"],["sparkle","Sparkle ✦"],["clean","Clean & Calm"]].map(([key,label])=><TouchableOpacity key={key} onPress={()=>setWallpaper(key as any)} style={[styles.settingRow,wallpaper===key&&{backgroundColor:t.glow}]}><Text style={styles.settingLabel}>{label}</Text><Text style={{color:wallpaper===key?t.pink:"#A9A0A7",fontWeight:"900"}}>{wallpaper===key?"✓":"○"}</Text></TouchableOpacity>)}</Card>
  </>;

  const More = () => <>
    <Header title="More" subtitle="Your HER experience." />
    <TouchableOpacity onPress={()=>go("Themes")} style={[styles.moreHero,{backgroundColor:t.soft}]}><Text style={{fontSize:34}}>✨</Text><View style={{flex:1}}><Text style={[styles.cardTitle,{color:t.text}]}>Themes & Wallpapers</Text><Text style={styles.muted}>Choose the look that feels like you.</Text></View><Text style={{fontSize:28,color:t.pink}}>›</Text></TouchableOpacity>
    {[
      ["🔥","Daily Check-in","Keep your streak alive","CheckIn"],
      ["🌸","Cycle Tracker","Your body, your cycle","Cycle"],
      ["💗","Relationships","Important people & notes","Relationships"],
      ["📚","Study & Career","Courses, tasks & growth","Study"],
      ["🌿","Self-Care","Routines for feeling good","SelfCare"],
    ].map(([icon,title,desc,target])=><TouchableOpacity key={title} onPress={()=>go(target as Screen)} style={[styles.moreRow,{backgroundColor:t.card}]}><Text style={{fontSize:25}}>{icon}</Text><View style={{flex:1}}><Text style={[styles.cardTitle,{color:t.text,fontSize:15}]}>{title}</Text><Text style={styles.muted}>{desc}</Text></View><Text style={{fontSize:25,color:t.pink}}>›</Text></TouchableOpacity>)}
  </>;

  const ScreenHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <View style={styles.screenHeader}>
      <TouchableOpacity onPress={() => go("Home")}><Text style={[styles.back,{color:t.pink}]}>‹</Text></TouchableOpacity>
      <View style={{flex:1}}><Text style={[styles.title,{color:t.text}]}>{title}</Text><Text style={styles.subtitle}>{subtitle}</Text></View>
    </View>
  );

  const render = () => {
    switch (screen) {
      case "Home": return <Home />;
      case "Goals": return <Goals />;
      case "Journal": return <Journal />;
      case "AI": return <AI />;
      case "More": return <More />;
      case "CheckIn": return <CheckIn />;
      case "Mood": return <Mood />;
      case "Water": return <Water />;
      case "Cycle": return <Cycle />;
      case "Relationships": return <Relationships />;
      case "Study": return <Study />;
      case "SelfCare": return <SelfCare />;
      case "Themes": return <Themes />;
      default: return <Home />;
    }
  };

  return (
    <SafeAreaView style={{flex:1,backgroundColor:t.bg}}>
      <Background />
      <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>{render()}</ScrollView>
      <View style={[styles.nav,{backgroundColor:t.card}]}>
        {([["Home","⌂"],["Goals","◎"],["Journal","▤"],["AI","✦"],["More","•••"]] as const).map(([name,icon])=>(
          <TouchableOpacity key={name} style={styles.navItem} onPress={()=>go(name as Screen)}>
            <Text style={[styles.navIcon,{color:screen===name?t.pink:"#A39AA4"}]}>{icon}</Text>
            <Text style={[styles.navLabel,{color:screen===name?t.pink:"#A39AA4"}]}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page:{padding:18,paddingBottom:120},
  header:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:20},
  brand:{fontSize:31,fontWeight:"900",letterSpacing:2},
  title:{fontSize:27,fontWeight:"900"},
  subtitle:{fontSize:12,color:"#877D86",marginTop:3},
  avatar:{width:44,height:44,borderRadius:22,alignItems:"center",justifyContent:"center"},
  avatarText:{fontSize:16,fontWeight:"900"},
  hero:{flexDirection:"row",alignItems:"center",marginBottom:17},
  greeting:{fontSize:25,fontWeight:"700"},
  queen:{fontSize:29,fontWeight:"900"},
  heroFlower:{fontSize:48,color:"#E83F91"},
  card:{borderRadius:22,padding:17,marginBottom:13,borderWidth:1,borderColor:"#EEE5EB"},
  streakCard:{borderRadius:23,padding:17,marginBottom:13,borderWidth:1,borderColor:"#EEE5EB",shadowOpacity:.08,shadowRadius:12,elevation:2},
  rowBetween:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  eyebrow:{fontSize:10,fontWeight:"900",letterSpacing:1.1,marginBottom:5},
  streak:{fontSize:21,fontWeight:"900"},
  muted:{fontSize:12,color:"#8D838B",lineHeight:18},
  streakBadge:{width:52,height:52,borderRadius:26,alignItems:"center",justifyContent:"center"},
  button:{borderRadius:18,paddingVertical:12,alignItems:"center",marginTop:13},
  buttonText:{color:"#FFF",fontSize:12,fontWeight:"900"},
  twoCol:{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",marginBottom:1},
  smallCard:{width:"48.3%",minHeight:105,borderRadius:19,padding:14,marginBottom:11},
  smallIcon:{fontSize:23,marginBottom:5},
  smallTitle:{fontSize:14,fontWeight:"900"},
  smallText:{fontSize:11,color:"#7D737B",marginTop:3},
  affirmation:{fontSize:18,lineHeight:26,fontWeight:"800"},
  sectionTitle:{fontSize:20,fontWeight:"900",marginBottom:11},
  moduleGrid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between"},
  moduleCard:{width:"48.3%",minHeight:151,borderRadius:21,padding:14,marginBottom:11,borderWidth:1,borderColor:"#EEE5EB"},
  moduleIcon:{width:43,height:43,borderRadius:22,alignItems:"center",justifyContent:"center",marginBottom:10},
  moduleTitle:{fontSize:14,fontWeight:"900",marginBottom:4},
  moduleDesc:{fontSize:10.5,lineHeight:15,color:"#877D86"},
  screenHeader:{flexDirection:"row",alignItems:"center",marginBottom:18},
  back:{fontSize:40,lineHeight:40,fontWeight:"300",marginRight:7},
  bigNumber:{fontSize:40,fontWeight:"900"},
  cardTitle:{fontSize:17,fontWeight:"900"},
  listItem:{fontSize:14,color:"#5B525A",paddingVertical:9},
  moodGrid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",marginBottom:13},
  moodChoice:{width:"31.5%",height:90,borderRadius:18,borderWidth:1,alignItems:"center",justifyContent:"center",marginBottom:10},
  moodName:{fontSize:11,color:"#665D65",fontWeight:"800",marginTop:5},
  noteInput:{minHeight:85,fontSize:14,color:"#403940",textAlignVertical:"top",paddingTop:8},
  waterRing:{width:175,height:175,borderRadius:88,borderWidth:13,alignItems:"center",justifyContent:"center"},
  waterLabel:{fontSize:14,color:"#5D7682",fontWeight:"800"},
  glassRow:{flexDirection:"row",justifyContent:"space-between",marginBottom:13},
  glass:{width:36,height:45,borderRadius:12,alignItems:"center",justifyContent:"center"},
  progress:{height:9,borderRadius:6,backgroundColor:"#EDE6EB",overflow:"hidden",marginVertical:12},
  progressFill:{height:9,borderRadius:6},
  addSmall:{alignSelf:"flex-start",paddingHorizontal:13,paddingVertical:8,borderRadius:14,marginTop:10},
  journalInput:{minHeight:160,textAlignVertical:"top",fontSize:15,color:"#403940",paddingTop:10},
  journalLine:{fontSize:15,lineHeight:23},
  suggestionRow:{flexDirection:"row",flexWrap:"wrap",gap:7,marginBottom:11},
  suggestion:{paddingHorizontal:11,paddingVertical:9,borderRadius:17,borderWidth:1},
  aiInput:{minHeight:55,fontSize:14,color:"#403940"},
  cycleRing:{width:115,height:115,borderRadius:58,borderWidth:10,alignItems:"center",justifyContent:"center",marginTop:15},
  themeGrid:{flexDirection:"row",flexWrap:"wrap",justifyContent:"space-between",marginTop:13},
  themeChoice:{width:"48%",padding:10,borderRadius:18,borderWidth:2,marginBottom:10},
  themePreview:{height:65,borderRadius:13,alignItems:"center",justifyContent:"center",marginBottom:7},
  themeName:{fontSize:12,fontWeight:"900",color:"#514950"},
  settingRow:{padding:14,borderRadius:16,marginTop:8,flexDirection:"row",justifyContent:"space-between"},
  settingLabel:{fontSize:13,fontWeight:"800",color:"#5A5158"},
  moreHero:{borderRadius:23,padding:17,flexDirection:"row",alignItems:"center",gap:13,marginBottom:13},
  moreRow:{borderRadius:20,padding:15,marginBottom:9,flexDirection:"row",alignItems:"center",gap:13,borderWidth:1,borderColor:"#EEE5EB"},
  nav:{position:"absolute",left:9,right:9,bottom:9,height:68,borderRadius:25,borderWidth:1,borderColor:"#E8DEE6",flexDirection:"row",alignItems:"center",justifyContent:"space-around",shadowOpacity:.10,shadowRadius:15,elevation:6},
  navItem:{flex:1,alignItems:"center",justifyContent:"center"},
  navIcon:{fontSize:19,fontWeight:"900",marginBottom:2},
  navLabel:{fontSize:9,fontWeight:"900"},
  orb:{position:"absolute",width:230,height:230,borderRadius:115,opacity:.55},
  sparkles:{position:"absolute",right:13,top:120,opacity:.28},
  sparkle:{fontSize:17,color:"#9A63B7",lineHeight:42},
});
