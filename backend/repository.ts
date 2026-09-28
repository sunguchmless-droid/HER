export type HerRepository = {
  getProfile(userId: string): Promise<unknown>;
  getGoals(userId: string): Promise<unknown[]>;
  createGoal(userId: string, input: { title: string; targetAmount?: number; deadline?: string }): Promise<unknown>;
  getDueTasks(userId: string): Promise<unknown[]>;
  createTask(userId: string, input: { title: string; dueDate?: string; category?: "study" | "career" | "personal" }): Promise<unknown>;
  completeTask(userId: string, taskId: string): Promise<unknown>;
  getTodayWater(userId: string): Promise<number>;
  addWaterGlass(userId: string): Promise<unknown>;
  getExpenses(userId: string): Promise<unknown[]>;
  addExpense(userId: string, input: { category: string; amount: number; date?: string }): Promise<unknown>;
  getJournalEntries(userId: string): Promise<unknown[]>;
  addJournalEntry(userId: string, body: string): Promise<unknown>;
  getCycleSummary(userId: string): Promise<unknown | null>;
};

export function createSupabaseRepository(accessToken: string, baseUrl: string, anonKey: string): HerRepository {
  async function request<T>(path: string, init: RequestInit = {}) {
    const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
        ...(init.headers ?? {}),
      },
    });
    if (!response.ok) throw new Error(`Database request failed: ${response.status}`);
    const text = await response.text();
    return (text ? JSON.parse(text) : null) as T;
  }

  return {
    async getProfile() {
      const rows = await request<unknown[]>(`profiles?select=*`);
      return rows[0] ?? null;
    },
    async getGoals() {
      return request<unknown[]>(`goals?select=id,title,target_amount,current_amount,deadline,status&order=created_at.desc`);
    },
    async createGoal(_userId, input) {
      const rows = await request<unknown[]>(`goals`, {
        method: "POST",
        body: JSON.stringify({
          title: input.title,
          target_amount: input.targetAmount ?? null,
          deadline: input.deadline ?? null,
          status: "active",
        }),
      });
      return rows?.[0] ?? null;
    },
    async getDueTasks() {
      return request<unknown[]>(`tasks?select=id,title,due_at,category,completed&completed=eq.false&order=due_at.asc`);
    },
    async createTask(_userId, input) {
      const rows = await request<unknown[]>(`tasks`, {
        method: "POST",
        body: JSON.stringify({
          title: input.title,
          due_at: input.dueDate ?? null,
          category: input.category ?? "personal",
          completed: false,
        }),
      });
      return rows?.[0] ?? null;
    },
    async completeTask(_userId, taskId) {
      const rows = await request<unknown[]>(`tasks?id=eq.${encodeURIComponent(taskId)}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: true }),
      });
      return rows?.[0] ?? null;
    },
    async getTodayWater() {
      const today = new Date().toISOString().slice(0, 10);
      const rows = await request<Array<{ glasses?: number }>>(`water_logs?select=glasses&log_date=eq.${today}`);
      return rows.reduce((sum, row) => sum + (row.glasses ?? 0), 0);
    },
    async addWaterGlass() {
      const today = new Date().toISOString().slice(0, 10);
      const rows = await request<unknown[]>(`water_logs`, { method: "POST", body: JSON.stringify({ log_date: today, glasses: 1 }) });
      return rows?.[0] ?? null;
    },
    async getExpenses() {
      return request<unknown[]>(`expenses?select=id,category,amount,date&order=date.desc`);
    },
    async addExpense(_userId, input) {
      const rows = await request<unknown[]>(`expenses`, { method: "POST", body: JSON.stringify({ category: input.category, amount: input.amount, date: input.date ?? new Date().toISOString().slice(0, 10) }) });
      return rows?.[0] ?? null;
    },
    async getJournalEntries() {
      return request<unknown[]>(`journal_entries?select=id,body,created_at&order=created_at.desc`);
    },
    async addJournalEntry(_userId, body) {
      const rows = await request<unknown[]>(`journal_entries`, { method: "POST", body: JSON.stringify({ body }) });
      return rows?.[0] ?? null;
    },
    async getCycleSummary() {
      return null;
    },
  };
}
