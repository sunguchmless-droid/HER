export type SupabaseConfig = { url: string; anonKey: string };

export function createSupabaseConfig(env: Record<string, string | undefined>): SupabaseConfig {
  if (!env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
  if (!env.SUPABASE_ANON_KEY) throw new Error("Missing SUPABASE_ANON_KEY");
  return { url: env.SUPABASE_URL, anonKey: env.SUPABASE_ANON_KEY };
}

export async function verifySupabaseAccessToken(config: SupabaseConfig, accessToken: string) {
  const response = await fetch(`${config.url}/auth/v1/user`, {
    headers: { apikey: config.anonKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  const user = (await response.json()) as { id?: string };
  return user.id ? { userId: user.id, accessToken } : null;
}
