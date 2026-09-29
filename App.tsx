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

const themes: ThemeName[] = ["Aurora", "Blossom", "Lavender", "Ocean", "Sunset"];\n\nconst HER_WALLPAPER = "data:image/jpeg;base64,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";

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

const Background = () => (\n    <View pointerEvents="none" style={StyleSheet.absoluteFill}>\n      <ImageBackground source={{ uri: HER_WALLPAPER }} resizeMode="cover" style={StyleSheet.absoluteFill} imageStyle={{ opacity: 0.72 }} />\n      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FFF4FB", opacity: 0.22 }]} />\n    </View>\n  );\n\n  const Card = ({ children, style }: { children: React.ReactNode; style?: any }) => (
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
