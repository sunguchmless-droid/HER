import { HerData } from "./types";

export const initialHerData: HerData = {
  mood: "Okay",
  waterGlasses: 4,
  goals: [
    {
      id: "goal-savings",
      title: "Save KSh 20,000",
      targetAmount: 20000,
      currentAmount: 6000,
      status: "active",
    },
  ],
  tasks: [
    {
      id: "task-assignment",
      title: "Assignment",
      dueDate: "Thursday",
      completed: false,
      category: "study",
    },
    {
      id: "task-reading",
      title: "Read chapter 4",
      dueDate: "Friday",
      completed: false,
      category: "study",
    },
    {
      id: "task-cv",
      title: "Update CV",
      dueDate: "Sunday",
      completed: false,
      category: "career",
    },
  ],
  expenses: [
    { id: "food", category: "Food", amount: 4200, date: "2026-09" },
    { id: "transport", category: "Transport", amount: 2800, date: "2026-09" },
    { id: "personal", category: "Personal", amount: 3100, date: "2026-09" },
    { id: "other", category: "Other", amount: 3300, date: "2026-09" },
  ],
  routines: [
    {
      id: "morning",
      title: "Morning",
      timeOfDay: "morning",
      items: ["Skincare", "Water", "Hair routine", "Move for 10 minutes"],
    },
    {
      id: "evening",
      title: "Evening",
      timeOfDay: "evening",
      items: ["Skincare", "Journal", "Hair care", "Sleep routine"],
    },
  ],
  journalEntries: [],
  cycle: {
    cycleDay: 22,
    typicalCycleLength: 28,
    predictedPeriodDate: "2026-10-04",
    predictionConfidence: "medium",
    lastConfirmedPeriodDate: "2026-09-07",
  },
};
