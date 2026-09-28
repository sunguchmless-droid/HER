# HER Repository Contract

Routes should use repository functions instead of writing SQL directly.

Examples: getProfile(userId), getDashboardData(userId), getGoals(userId), createGoal(userId,input), updateGoal(userId,goalId,input), getTasks(userId), createTask(userId,input), completeTask(userId,taskId), getExpenses(userId), addExpense(userId,input), getCycleSummary(userId), getRoutines(userId), getJournalEntries(userId), addJournalEntry(userId,input), getAiPermissions(userId), logAiAction(userId,action).

Every repository function receives the authenticated user ID from the server auth boundary.
