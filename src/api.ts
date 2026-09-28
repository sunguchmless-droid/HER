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
    getTasks: <T>() => request<T>("/api/tasks"),
    createTask: <T>(body: unknown) => request<T>("/api/tasks", { method: "POST", body: JSON.stringify(body) }),
    addExpense: <T>(body: unknown) => request<T>("/api/expenses", { method: "POST", body: JSON.stringify(body) }),
    getExpenses: <T>() => request<T>("/api/expenses"),
    addWaterGlass: <T>() => request<T>("/api/water", { method: "POST" }),
    getJournal: <T>() => request<T>("/api/journal"),
    createJournalEntry: <T>(body: unknown) => request<T>("/api/journal", { method: "POST", body: JSON.stringify(body) }),
    askHerAI: <T>(body: unknown) => request<T>("/api/her-ai", { method: "POST", body: JSON.stringify(body) }),
  };
}
