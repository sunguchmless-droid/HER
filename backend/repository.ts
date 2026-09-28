export type HerRepository = {
  getProfile(userId: string): Promise<unknown>;
  getGoals(userId: string): Promise<unknown[]>;
  createGoal(userId: string, input: { title: string; targetAmount?: number; deadline?: string }): Promise<unknown>;
  updateGoal(userId: string, goalId: string, input: { currentAmount?: number; title?: string; targetAmount?: number; deadline?: string; status?: "active" | "completed" }): Promise<unknown>;
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
  logPeriod(userId: string, input: { startDate: string; endDate?: string; flow?: string }): Promise<unknown>;
  logCycleSymptom(userId: string, input: { symptom: string; recordedOn?: string }): Promise<unknown>;
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
    async updateGoal(_userId, goalId, input) {
      const rows = await request<unknown[]>(`goals?id=eq.${encodeURIComponent(goalId)}`, { method: "PATCH", body: JSON.stringify({ current_amount: input.currentAmount, title: input.title, target_amount: input.targetAmount, deadline: input.deadline, status: input.status }) });
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
      const rows = await request<Array<{ glasses?: number }>>(`water_logs?select=glasses&recorded_on=eq.${today}`);
      return rows.reduce((sum, row) => sum + (row.glasses ?? 0), 0);
    },
    async addWaterGlass() {
      const today = new Date().toISOString().slice(0, 10);
      const rows = await request<unknown[]>(`water_logs`, { method: "POST", body: JSON.stringify({ recorded_on: today, glasses: 1 }) });
      return rows?.[0] ?? null;
    },
    async getExpenses() {
      return request<unknown[]>(`expenses?select=id,category,amount,occurred_on&order=occurred_on.desc`);
    },
    async addExpense(_userId, input) {
      const rows = await request<unknown[]>(`expenses`, { method: "POST", body: JSON.stringify({ category: input.category, amount: input.amount, occurred_on: input.date ?? new Date().toISOString().slice(0, 10) }) });
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
      const cycles = await request<Array<{ start_date: string; end_date?: string; flow?: string }>>(`cycles?select=start_date,end_date,flow&order=start_date.desc&limit=5`);
      const predictions = await request<Array<{ predicted_start_date: string; confidence?: string }>>(`cycle_predictions?select=predicted_start_date,confidence&order=created_at.desc&limit=1`);
      const latest = cycles[0];
      const previous = cycles[1];
      const cycleLength = latest && previous ? Math.max(1, Math.round((new Date(latest.start_date).getTime() - new Date(previous.start_date).getTime()) / 86400000)) : 28;
      const cycleDay = latest ? Math.max(1, Math.floor((Date.now() - new Date(latest.start_date).getTime()) / 86400000) + 1) : 1;
      return { cycleDay, typicalCycleLength: cycleLength, lastConfirmedPeriodDate: latest?.start_date, predictedPeriodDate: predictions[0]?.predicted_start_date, predictionConfidence: predictions[0]?.confidence, history: cycles };
    },
    async logPeriod(_userId, input) {
      const rows = await request<unknown[]>(`cycles`, { method: "POST", body: JSON.stringify({ start_date: input.startDate, end_date: input.endDate ?? null, flow: input.flow ?? null, confirmed: true }) });
      return rows?.[0] ?? null;
    },
    async logCycleSymptom(_userId, input) {
      const rows = await request<unknown[]>(`cycle_symptoms`, { method: "POST", body: JSON.stringify({ symptom: input.symptom, recorded_on: input.recordedOn ?? new Date().toISOString().slice(0, 10) }) });
      return rows?.[0] ?? null;
    },
  };
}
