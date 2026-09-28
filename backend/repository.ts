export type HerRepository = {
  getProfile(userId: string): Promise<unknown>;
  getGoals(userId: string): Promise<unknown[]>;
  getDueTasks(userId: string): Promise<unknown[]>;
  getTodayWater(userId: string): Promise<number>;
  getCycleSummary(userId: string): Promise<unknown | null>;
};

export function createSupabaseRepository(accessToken: string, baseUrl: string, anonKey: string): HerRepository {
  async function query<T>(table: string, select = "*") {
    const response = await fetch(`${baseUrl}/rest/v1/${table}?select=${encodeURIComponent(select)}`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error(`Database query failed for ${table}`);
    return (await response.json()) as T;
  }

  // The authenticated PostgREST session supplies the user context through RLS.
  return {
    async getProfile() { const rows = await query<unknown[]>("profiles"); return rows[0] ?? null; },
    async getGoals() { return query<unknown[]>("goals", "id,title,target_amount,current_amount,deadline,status"); },
    async getDueTasks() { return query<unknown[]>("tasks", "id,title,due_at,category,completed"); },
    async getTodayWater() { return 0; },
    async getCycleSummary() { return null; },
  };
}
