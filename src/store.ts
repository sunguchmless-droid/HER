import { initialHerData } from "./data";
import { HerData, JournalEntry, Mood } from "./types";

let state: HerData = initialHerData;

export const herStore = {
  get(): HerData { return state; },
  setMood(mood: Mood) { state = { ...state, mood }; return state; },
  addWaterGlass() { state = { ...state, waterGlasses: Math.min(8, state.waterGlasses + 1) }; return state; },
  addGoalAmount(goalId: string, amount: number) {
    state = { ...state, goals: state.goals.map((goal) => goal.id === goalId && goal.currentAmount !== undefined ? {
      ...goal,
      currentAmount: Math.min(goal.targetAmount ?? Infinity, goal.currentAmount + amount),
      status: goal.targetAmount !== undefined && goal.currentAmount + amount >= goal.targetAmount ? "completed" : goal.status,
    } : goal) };
    return state;
  },
  addJournalEntry(body: string) {
    const entry: JournalEntry = { id: "journal-" + Date.now(), body, createdAt: new Date().toISOString() };
    state = { ...state, journalEntries: [entry, ...state.journalEntries] };
    return state;
  },
  completeTask(taskId: string) {
    state = { ...state, tasks: state.tasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task) };
    return state;
  },
};
