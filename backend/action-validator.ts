import type { HerAction } from "../src/herAI";

export type AiPermissions = {
  canCreateGoals: boolean;
  canCreateReminders: boolean;
  canAddExpenses: boolean;
};

export function validateHerAction(action: HerAction, permissions: AiPermissions): void {
  if (action.type === "create_goal" && !permissions.canCreateGoals) {
    throw new Error("HER AI does not have permission to create goals.");
  }
  if (action.type === "create_reminder" && !permissions.canCreateReminders) {
    throw new Error("HER AI does not have permission to create reminders.");
  }
  if (action.type === "add_expense" && !permissions.canAddExpenses) {
    throw new Error("HER AI does not have permission to add expenses.");
  }

  if (action.type === "create_goal" && (!action.title.trim() || (action.targetAmount !== undefined && action.targetAmount < 0))) {
    throw new Error("Invalid goal action.");
  }
  if (action.type === "add_expense" && (!action.category.trim() || action.amount < 0)) {
    throw new Error("Invalid expense action.");
  }
}
