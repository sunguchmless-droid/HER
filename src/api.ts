export type ApiClientOptions = { baseUrl: string; accessToken?: string };

export function createHerApi(options: ApiClientOptions) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");
    if (options.accessToken) headers.set("Authorization", `Bearer ${options.accessToken}`);
    const response = await fetch(`${options.baseUrl}${path}`, { ...init, headers });
    if (!response.ok) throw new Error(`HER API request failed: ${response.status}`);
    const text = await response.text();
    return (text ? JSON.parse(text) : null) as T;
  }

  return {
    getDashboard: <T>() => request<T>("/api/dashboard"),
    getGoals: <T>() => request<T>("/api/goals"),
    createGoal: <T>(body: unknown) => request<T>("/api/goals", { method: "POST", body: JSON.stringify(body) }),
    updateGoal: <T>(id: string, body: unknown) => request<T>(`/api/goals/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(body) }),
    getTasks: <T>() => request<T>("/api/tasks"),
    createTask: <T>(body: unknown) => request<T>("/api/tasks", { method: "POST", body: JSON.stringify(body) }),
    addExpense: <T>(body: unknown) => request<T>("/api/expenses", { method: "POST", body: JSON.stringify(body) }),
    getExpenses: <T>() => request<T>("/api/expenses"),
    getRoutines: <T>() => request<T>("/api/routines"),
    getImportantDates: <T>() => request<T>("/api/important-dates"),
    getRelationshipNotes: <T>() => request<T>("/api/relationship-notes"),
    createRoutine: <T>(body: unknown) => request<T>("/api/routines", { method: "POST", body: JSON.stringify(body) }),
    addRoutineItem: <T>(body: unknown) => request<T>("/api/routine-items", { method: "POST", body: JSON.stringify(body) }),
    createImportantDate: <T>(body: unknown) => request<T>("/api/important-dates", { method: "POST", body: JSON.stringify(body) }),
    createRelationshipNote: <T>(body: unknown) => request<T>("/api/relationship-notes", { method: "POST", body: JSON.stringify(body) }),
    getReminders: <T>() => request<T>("/api/reminders"),
    completeReminder: <T>(id: string) => request<T>(`/api/reminders/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ completed: true }) }),
    createReminder: <T>(body: unknown) => request<T>("/api/reminders", { method: "POST", body: JSON.stringify(body) }),
    addWaterGlass: <T>() => request<T>("/api/water", { method: "POST" }),
    getWellness: <T>() => request<T>("/api/wellness"),
    saveWellness: <T>(body: unknown) => request<T>("/api/wellness", { method: "POST", body: JSON.stringify(body) }),
    getJournal: <T>() => request<T>("/api/journal"),
    createJournalEntry: <T>(body: unknown) => request<T>("/api/journal", { method: "POST", body: JSON.stringify(body) }),
    logPeriod: <T>(body: unknown) => request<T>("/api/cycle", { method: "POST", body: JSON.stringify(body) }),
    logCycleSymptom: <T>(body: unknown) => request<T>("/api/cycle/symptoms", { method: "POST", body: JSON.stringify(body) }),
    askHerAI: <T>(body: unknown) => request<T>("/api/her-ai", { method: "POST", body: JSON.stringify(body) }),
  };
}
