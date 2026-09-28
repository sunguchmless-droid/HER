export type Mood = "Great" | "Okay" | "Low" | "Tired";

export type Goal = {
  id: string;
  title: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: string;
  status: "active" | "completed";
};

export type Task = {
  id: string;
  title: string;
  dueDate?: string;
  completed: boolean;
  category: "study" | "career" | "personal";
};

export type Expense = {
  id: string;
  category: string;
  amount: number;
  date: string;
};

export type Routine = {
  id: string;
  title: string;
  items: string[];
  timeOfDay: "morning" | "evening";
};

export type CycleSummary = {
  cycleDay: number;
  typicalCycleLength: number;
  predictedPeriodDate?: string;
  predictionConfidence?: "low" | "medium" | "high";
  lastConfirmedPeriodDate?: string;
};

export type JournalEntry = {
  id: string;
  body: string;
  createdAt: string;
};

export type HerData = {
  mood?: Mood;
  waterGlasses: number;
  goals: Goal[];
  tasks: Task[];
  expenses: Expense[];
  routines: Routine[];
  journalEntries: JournalEntry[];
  cycle?: CycleSummary;
};
