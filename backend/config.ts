export type HerServerConfig = {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey?: string;
  openAiApiKey?: string;
};

export function loadConfig(env: Record<string, string | undefined>): HerServerConfig {
  if (!env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
  if (!env.SUPABASE_ANON_KEY) throw new Error("Missing SUPABASE_ANON_KEY");
  return {
    apiUrl: env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000",
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    openAiApiKey: env.OPENAI_API_KEY,
  };
}
