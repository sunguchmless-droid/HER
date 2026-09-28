import { HerData } from "./types";

export type HerAction =
  | { type: "create_goal"; title: string; targetAmount?: number; deadline?: string }
  | { type: "create_task"; title: string; dueDate?: string; category?: "study" | "career" | "personal" }
  | { type: "create_reminder"; title: string; date?: string }
  | { type: "add_expense"; category: string; amount: number }
  | { type: "none" };

export type HerAIRequest = {
  message: string;
  data: Pick<HerData, "goals" | "tasks" | "expenses" | "routines" | "cycle">;
};

export type HerAIResult = {
  reply: string;
  action: HerAction;
};

/**
 * The client-facing contract for HER AI.
 * The model should suggest an action; the backend validates and executes it.
 * The model never writes directly to the database.
 */
export async function askHerAI(request: HerAIRequest): Promise<HerAIResult> {
  const response = await fetch("/api/her-ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("HER AI is temporarily unavailable.");
  }

  return response.json() as Promise<HerAIResult>;
}
