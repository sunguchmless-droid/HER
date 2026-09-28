export type DashboardRepository = {
  getProfile(userId: string): Promise<unknown>;
  getGoals(userId: string): Promise<unknown[]>;
  getDueTasks(userId: string): Promise<unknown[]>;
  getTodayWater(userId: string): Promise<number>;
  getCycleSummary(userId: string): Promise<unknown | null>;
};

export async function buildDashboard(userId: string, repository: DashboardRepository) {
  const [profile, goals, tasks, waterGlasses, cycle] = await Promise.all([
    repository.getProfile(userId),
    repository.getGoals(userId),
    repository.getDueTasks(userId),
    repository.getTodayWater(userId),
    repository.getCycleSummary(userId),
  ]);

  return { profile, goals, tasks, waterGlasses, cycle };
}
