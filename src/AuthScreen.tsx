import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "./supabase";

type AuthProps = { onAuthenticated: (accessToken: string) => void };

export function AuthScreen({ onAuthenticated }: AuthProps) {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) onAuthenticated(data.session.access_token);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) onAuthenticated(session.access_token);
    });
    return () => data.subscription.unsubscribe();
  }, [onAuthenticated]);

  async function submit() {
    if (!supabase) { setMessage("Connect Supabase in your Expo environment first."); return; }
    if (!email.trim() || password.length < 6) { setMessage("Enter a valid email and a password of at least 6 characters."); return; }
    setBusy(true); setMessage("");
    const result = mode === "signIn"
      ? await supabase.auth.signInWithPassword({ email: email.trim(), password })
      : await supabase.auth.signUp({ email: email.trim(), password });
    if (result.error) setMessage(result.error.message);
    else if (mode === "signUp" && !result.data.session) setMessage("Check your email to verify your account, then sign in.");
    else if (result.data.session) onAuthenticated(result.data.session.access_token);
    setBusy(false);
  }

  return <View style={styles.container}>
    <Text style={styles.brand}>HER</Text>
    <Text style={styles.title}>Your private space for life.</Text>
    <Text style={styles.subtitle}>{mode === "signIn" ? "Welcome back." : "Create your private HER account."}</Text>
    <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={styles.input}/>
    <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry style={styles.input}/>
    {!!message && <Text style={styles.message}>{message}</Text>}
    <Pressable disabled={busy} onPress={submit} style={styles.button}><Text style={styles.buttonText}>{busy ? "Please wait…" : mode === "signIn" ? "Sign in" : "Create account"}</Text></Pressable>
    <Pressable onPress={()=>setMode(mode === "signIn" ? "signUp" : "signIn")}><Text style={styles.switch}>{mode === "signIn" ? "New to HER? Create an account" : "Already have an account? Sign in"}</Text></Pressable>
    {busy && <ActivityIndicator />}
  </View>;
}

const styles=StyleSheet.create({
 container:{flex:1,justifyContent:"center",padding:28,backgroundColor:"#F8F5F2"},
 brand:{fontSize:42,fontWeight:"700",color:"#2D2A2A",marginBottom:8},
 title:{fontSize:25,fontWeight:"600",color:"#2D2A2A",marginBottom:8},
 subtitle:{fontSize:16,color:"#817A7A",marginBottom:24},
 input:{backgroundColor:"#FFFFFF",borderWidth:1,borderColor:"#E9E2DF",borderRadius:16,padding:15,marginBottom:12,color:"#2D2A2A"},
 button:{backgroundColor:"#2D2A2A",borderRadius:16,padding:16,alignItems:"center",marginTop:4,marginBottom:18},
 buttonText:{color:"#FFFFFF",fontWeight:"700"},
 switch:{textAlign:"center",color:"#817A7A",padding:10},
 message:{color:"#9A4E63",marginBottom:12},
});
