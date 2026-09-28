export type AuthenticatedRequest = { userId: string; accessToken: string };

export type ApiRoute = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  auth: true;
  description: string;
};

export const apiRoutes: ApiRoute[] = [
  { method: "GET", path: "/api/me", auth: true, description: "Current user profile" },
  { method: "GET", path: "/api/dashboard", auth: true, description: "Minimal home dashboard projection" },
  { method: "GET", path: "/api/goals", auth: true, description: "User goals" },
  { method: "POST", path: "/api/goals", auth: true, description: "Create a goal" },
  { method: "PATCH", path: "/api/goals/:id", auth: true, description: "Update a goal" },
  { method: "GET", path: "/api/tasks", auth: true, description: "User tasks" },
  { method: "POST", path: "/api/tasks", auth: true, description: "Create a task" },
  { method: "PATCH", path: "/api/tasks/:id", auth: true, description: "Complete or update a task" },
  { method: "GET", path: "/api/expenses", auth: true, description: "User expenses" },
  { method: "POST", path: "/api/expenses", auth: true, description: "Add an expense" },
  { method: "GET", path: "/api/cycle", auth: true, description: "Cycle summary and confirmed history" },
  { method: "POST", path: "/api/cycle/log", auth: true, description: "Log a confirmed cycle event" },
  { method: "GET", path: "/api/routines", auth: true, description: "User routines" },
  { method: "POST", path: "/api/routines", auth: true, description: "Create a routine" },
  { method: "GET", path: "/api/journal", auth: true, description: "User journal entries" },
  { method: "POST", path: "/api/journal", auth: true, description: "Create a journal entry" },
  { method: "POST", path: "/api/her-ai", auth: true, description: "HER AI request and validated action" },
];
