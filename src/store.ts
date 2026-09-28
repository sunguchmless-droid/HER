import { initialHerData } from "./data";
import { HerData, Mood } from "./types";

let state: HerData = initialHerData;

export const herStore = {
  get(): HerData {
    return state;
  },
  setMood(mood: Mood) {
    state = { ...state, mood };
    return state;
  },
  addWaterGlass() {
    state = { ...state, waterGlasses: Math.min(8, state.waterGlasses + 1) };
    return state;
  },
  addGoalAmount(goalId: string, amount: number) {
    state = {
      ...state,
      goals: state.goals.map((goal) =>
        goal.id === goalId && goal.currentAmount !== undefined
          ? {
              ...goal,
              currentAmount: Math.min(goal.targetAmount ?? Infinity, goal.currentAmount + amount),
              status:
                goal.targetAmount !== undefined && goal.currentAmount + amount >= goal.targetAmount
                  ? "completed"
                  : goal.status,
            }
          : goal
      ),
    };
    return state;
  },
};
