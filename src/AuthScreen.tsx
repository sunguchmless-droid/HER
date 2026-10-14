import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "./supabase";

type AuthProps = { onAuthenticated: (accessToken: string) => void };

export function AuthScreen({ onAuthenticated }: AuthProps) {
  const [mode, setMode] = useState<"signIn" | "signUp" | "resetPassword">("signIn");
  const [displayName, setDisplayName] = useState("");
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
    if (!supabase) {
      setMessage("Account service is not configured yet. HER needs its Supabase project URL and public key.");
      return;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(cleanEmail)) {
      setMessage("Enter a valid email address.");
      return;
    }
    if (mode !== "resetPassword" && password.length < 8) {
      setMessage("Use a password with at least 8 characters.");
      return;
    }
    if (mode === "signUp" && displayName.trim().length < 2) {
      setMessage("Enter a name with at least 2 characters.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      if (mode === "resetPassword") {
        const result = await supabase.auth.resetPasswordForEmail(cleanEmail);
        setMessage(result.error ? result.error.message : "If an account exists for this email, a password reset link has been sent.");
      } else if (mode === "signIn") {
        const result = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (result.error) setMessage(result.error.message);
        else if (result.data.session) onAuthenticated(result.data.session.access_token);
      } else {
        const result = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { display_name: displayName.trim() } },
        });
        if (result.error) setMessage(result.error.message);
        else if (!result.data.session) setMessage("Account created. Check your email to verify it, then sign in.");
        else onAuthenticated(result.data.session.access_token);
      }
    } catch {
      setMessage("Something went wrong. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return <View style={styles.container}>
    <Text style={styles.brand}>HER</Text>
    <Text style={styles.title}>Your private space for life.</Text>
    <Text style={styles.subtitle}>{mode === "signIn" ? "Welcome back." : mode === "signUp" ? "Create your private HER account." : "Recover access to your account."}</Text>
    {mode === "signUp" && <TextInput value={displayName} onChangeText={setDisplayName} placeholder="Your name" autoCapitalize="words" style={styles.input}/>}\n    <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" style={styles.input}/>
    {mode !== "resetPassword" && <TextInput value={password} onChangeText={setPassword} placeholder="Password (8+ characters)" secureTextEntry style={styles.input}/>}
    {!!message && <Text style={styles.message}>{message}</Text>}
    <Pressable disabled={busy} onPress={submit} style={styles.button}><Text style={styles.buttonText}>{busy ? "Please wait…" : mode === "signIn" ? "Sign in" : mode === "signUp" ? "Create account" : "Send reset link"}</Text></Pressable>
    <Pressable onPress={()=>setMode(mode === "signUp" ? "signIn" : "signUp")}><Text style={styles.switch}>{mode === "signUp" ? "Already have an account? Sign in" : "New to HER? Create an account"}</Text></Pressable>\n    {mode === "signIn" && <Pressable onPress={() => setMode("resetPassword")}><Text style={styles.switch}>Forgot your password?</Text></Pressable>}\n    {mode === "resetPassword" && <Pressable onPress={() => setMode("signIn")}><Text style={styles.switch}>Back to sign in</Text></Pressable>}
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
