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
  getWellnessCheckin(userId: string): Promise<unknown | null>;
  saveWellnessCheckin(userId: string, input: { energy?: string; sleepMinutes?: number; movementMinutes?: number; reflection?: string }): Promise<unknown>;
  getExpenses(userId: string): Promise<unknown[]>;
  getRoutines(userId: string): Promise<unknown[]>;
  createRoutine(userId: string, input: { title: string; timeOfDay: "morning" | "evening" | "custom" }): Promise<unknown>;
  addRoutineItem(userId: string, routineId: string, title: string): Promise<unknown>;
  getImportantDates(userId: string): Promise<unknown[]>;
  createImportantDate(userId: string, input: { title: string; dateOn: string; notes?: string }): Promise<unknown>;
  getRelationshipNotes(userId: string): Promise<unknown[]>;
  createRelationshipNote(userId: string, input: { title?: string; body: string }): Promise<unknown>;
  addExpense(userId: string, input: { category: string; amount: number; date?: string }): Promise<unknown>;
  getJournalEntries(userId: string): Promise<unknown[]>;
  addJournalEntry(userId: string, body: string): Promise<unknown>;
  getCycleSummary(userId: string): Promise<unknown | null>;
  logPeriod(userId: string, input: { startDate: string; endDate?: string; flow?: string }): Promise<unknown>;
  logCycleSymptom(userId: string, input: { symptom: string; recordedOn?: string }): Promise<unknown>;
  getAiPermissions(userId: string): Promise<any>;
  getReminders(userId: string): Promise<unknown[]>;
  createReminder(userId: string, input: { title: string; dueAt: string; source?: "manual"|"cycle"|"routine"|"study"|"relationship"|"ai" }): Promise<unknown>;
  logAiAction(userId: string, actionType: string, payload: unknown, status: string): Promise<unknown>;
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
    async getWellnessCheckin() {
      const today = new Date().toISOString().slice(0, 10);
      const rows = await request<unknown[]>(`wellness_checkins?select=id,energy,sleep_minutes,movement_minutes,reflection,recorded_on&recorded_on=eq.${today}&limit=1`);
      return rows[0] ?? null;
    },
    async saveWellnessCheckin(_userId, input) {
      const today = new Date().toISOString().slice(0, 10);
      const rows = await request<unknown[]>(`wellness_checkins?recorded_on=eq.${today}`, { method: "PATCH", body: JSON.stringify({ energy: input.energy ?? null, sleep_minutes: input.sleepMinutes ?? null, movement_minutes: input.movementMinutes ?? null, reflection: input.reflection ?? null, updated_at: new Date().toISOString() }) });
      if (rows?.length) return rows[0];
      const created = await request<unknown[]>(`wellness_checkins`, { method: "POST", body: JSON.stringify({ energy: input.energy ?? null, sleep_minutes: input.sleepMinutes ?? null, movement_minutes: input.movementMinutes ?? null, reflection: input.reflection ?? null, recorded_on: today }) });
      return created?.[0] ?? null;
    },
    async getRoutines() {
      return request<unknown[]>(`routines?select=id,title,time_of_day,routine_items(id,title,sort_order,completed)&order=created_at.asc`);
    },
    async createRoutine(_userId, input) {
      const rows=await request<unknown[]>(`routines`,{method:"POST",body:JSON.stringify({title:input.title,time_of_day:input.timeOfDay})}); return rows?.[0]??null;
    },
    async addRoutineItem(_userId,routineId,title) {
      const rows=await request<unknown[]>(`routine_items`,{method:"POST",body:JSON.stringify({routine_id:routineId,title,sort_order:0,completed:false})}); return rows?.[0]??null;
    },
    async getImportantDates() {
      return request<unknown[]>(`important_dates?select=id,title,date_on,notes&order=date_on.asc`);
    },
    async createImportantDate(_userId,input) {
      const rows=await request<unknown[]>(`important_dates`,{method:"POST",body:JSON.stringify({title:input.title,date_on:input.dateOn,notes:input.notes??null})}); return rows?.[0]??null;
    },
    async createRelationshipNote(_userId,input) {
      const rows=await request<unknown[]>(`relationship_notes`,{method:"POST",body:JSON.stringify({title:input.title??null,body:input.body})}); return rows?.[0]??null;
    },
    async getRelationshipNotes() {
      return request<unknown[]>(`relationship_notes?select=id,title,body,created_at&order=created_at.desc`);
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
    async getReminders() {
      const now = new Date();
      const existing = await request<Array<{id:string;title:string;due_at:string;source:string}>>(`reminders?select=id,title,due_at,source,completed&completed=eq.false&order=due_at.asc`);
      const [cycle, tasks, routines, dates] = await Promise.all([
        this.getCycleSummary(""),
        this.getDueTasks(""),
        this.getRoutines(""),
        this.getImportantDates("")
      ]);
      const candidates: Array<{title:string;dueAt:string;source:"cycle"|"study"|"routine"|"relationship"}> = [];
      const cycleData = cycle as any;
      if (cycleData?.predictedPeriodDate) {
        const due = new Date(cycleData.predictedPeriodDate);
        due.setDate(due.getDate() - 2);
        if (due > now) candidates.push({title:"Get ready for your upcoming period",dueAt:due.toISOString(),source:"cycle"});
      }
      for (const task of (tasks as any[]).slice(0, 20)) {
        if (!task.due_at) continue;
        const due = new Date(task.due_at);
        const reminder = new Date(due.getTime() - 24 * 60 * 60 * 1000);
        if (reminder > now) candidates.push({title:`Tomorrow: ${task.title}`,dueAt:reminder.toISOString(),source:"study"});
      }
      const routineTimes: Record<string,number> = { morning: 8, evening: 20 };
      const routineDay = new Date(now);
      routineDay.setHours(0,0,0,0);
      for (const routine of (routines as any[]).slice(0, 10)) {
        const hour = routineTimes[routine.time_of_day];
        if (hour === undefined) continue;
        const due = new Date(routineDay);
        due.setHours(hour,0,0,0);
        if (due <= now) due.setDate(due.getDate()+1);
        candidates.push({title:`Routine: ${routine.title}`,dueAt:due.toISOString(),source:"routine"});
      }
      for (const item of (dates as any[]).slice(0, 20)) {
        if (!item.date_on) continue;
        const year = now.getUTCFullYear();
        let due = new Date(`${year}-${item.date_on.slice(5)}T09:00:00.000Z`);
        if (due <= now) due = new Date(`${year+1}-${item.date_on.slice(5)}T09:00:00.000Z`);
        candidates.push({title:`Today: ${item.title}`,dueAt:due.toISOString(),source:"relationship"});
      }
      for (const candidate of candidates) {
        const duplicate = existing.some(item => item.source === candidate.source && item.title === candidate.title && Math.abs(Date.parse(item.due_at)-Date.parse(candidate.dueAt)) < 60*60*1000);
        if (!duplicate) await this.createReminder("",candidate);
      }
      return request<unknown[]>(`reminders?select=id,title,due_at,source,completed&completed=eq.false&order=due_at.asc`);
    },
    async createReminder(_userId,input) { const rows=await request<unknown[]>(`reminders`,{method:"POST",body:JSON.stringify({title:input.title,due_at:input.dueAt,source:input.source??"manual",completed:false})}); return rows?.[0]??null; },
    async getAiPermissions() {
      const rows = await request<any[]>(`ai_permissions?select=*`);
      return rows[0] ?? { access_goals:true, access_tasks:true, access_money:false, access_wellness:false, access_cycle:false, access_journal:false, can_create_reminders:false, can_create_goals:false, can_add_expenses:false, can_edit_journal:false };
    },
    async logAiAction(_userId, actionType, payload, status) {
      const rows = await request<unknown[]>(`ai_action_logs`, { method:"POST", body:JSON.stringify({ action_type:actionType, action_payload:payload, status }) });
      return rows?.[0] ?? null;
    },
    async logCycleSymptom(_userId, input) {
      const rows = await request<unknown[]>(`cycle_symptoms`, { method: "POST", body: JSON.stringify({ symptom: input.symptom, recorded_on: input.recordedOn ?? new Date().toISOString().slice(0, 10) }) });
      return rows?.[0] ?? null;
    },
  };
}
