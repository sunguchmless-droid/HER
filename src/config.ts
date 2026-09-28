export type HerClientConfig = {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export function getHerClientConfig(env: Record<string, string | undefined>): HerClientConfig {
  const apiUrl = env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";
  const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("HER authentication is not configured. Add the public Supabase URL and anon key.");
  }

  return { apiUrl, supabaseUrl, supabaseAnonKey };
}
