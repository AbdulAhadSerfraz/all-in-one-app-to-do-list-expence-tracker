// Helper functions for localStorage
function getStorageData<T>(key: string, userId: string): T[] {
  const data = localStorage.getItem(`${key}_${userId}`);
  return data ? JSON.parse(data) : [];
}

function setStorageData<T>(key: string, userId: string, data: T[]): void {
  localStorage.setItem(`${key}_${userId}`, JSON.stringify(data));
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// User Profile Operations
export async function getUserProfile(userId: string) {
  const users = JSON.parse(localStorage.getItem('app_users') || '{}')
  return users[userId] || null
}

export async function updateUserProfile(userId: string, updates: any) {
  const users = JSON.parse(localStorage.getItem('app_users') || '{}')
  users[userId] = { ...users[userId], ...updates }
  localStorage.setItem('app_users', JSON.stringify(users))
  return users[userId]
}

// Task Operations
type Task = {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  priority: 'low' | 'medium' | 'high';
  user_id: string;
  created_at: string;
  status: string;
};

export async function getTasks(userId: string): Promise<Task[]> {
  return getStorageData<Task>('tasks', userId).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
}

export async function createTask(task: Task) {
  const tasks = getStorageData<Task>('tasks', task.user_id);
  const newTask = {
    ...task,
    id: generateId('task'),
    created_at: new Date().toISOString()
  };
  setStorageData('tasks', task.user_id, [...tasks, newTask]);
  return newTask;
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const tasks = getStorageData<Task>('tasks', updates.user_id || '');
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) throw new Error('Task not found');
  
  const updatedTask = { ...tasks[index], ...updates };
  tasks[index] = updatedTask;
  setStorageData('tasks', updates.user_id || '', tasks);
  return updatedTask;
}

export async function deleteTask(taskId: string, userId: string) {
  const tasks = getStorageData<Task>('tasks', userId);
  const filteredTasks = tasks.filter(t => t.id !== taskId);
  setStorageData('tasks', userId, filteredTasks);
  console.log('[deleteTask] Deleted:', taskId, 'for user:', userId, 'remaining:', filteredTasks.length, 'localStorage key:', `tasks_${userId}`);
}

export async function deleteAllTasks(userId: string) {
  try {
    localStorage.removeItem(`tasks_${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting all tasks:', error);
    throw error;
  }
}

// Expense Operations
export async function createExpense(expense: any) {
  const expenses = getStorageData<any>('expenses', expense.user_id)
  const newExpense = {
    ...expense,
    id: generateId('exp'),
    created_at: new Date().toISOString()
  }
  expenses.push(newExpense)
  setStorageData('expenses', expense.user_id, expenses)
  return newExpense
}

export async function getExpenses(userId: string) {
  const expenses = getStorageData<any>('expenses', userId)
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Sleep Operations
export async function createSleepEntry(sleep: any) {
  const entries = getStorageData<any>('sleep', sleep.user_id)
  const newEntry = {
    ...sleep,
    id: generateId('sleep'),
    created_at: new Date().toISOString()
  }
  entries.push(newEntry)
  setStorageData('sleep', sleep.user_id, entries)
  return newEntry
}

export async function getSleepEntries(userId: string) {
  const entries = getStorageData<any>('sleep', userId)
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Calorie Operations
export async function createCalorieEntry(calorie: any) {
  const entries = getStorageData<any>('calories', calorie.user_id)
  const newEntry = {
    ...calorie,
    id: generateId('cal'),
    created_at: new Date().toISOString()
  }
  entries.push(newEntry)
  setStorageData('calories', calorie.user_id, entries)
  return newEntry
}

export async function getCalorieEntries(userId: string) {
  const entries = getStorageData<any>('calories', userId)
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Journal Operations
export async function createJournalEntry(journal: any) {
  const entries = getStorageData<any>('journal', journal.user_id)
  const newEntry = {
    ...journal,
    id: generateId('journal'),
    created_at: new Date().toISOString()
  }
  entries.push(newEntry)
  setStorageData('journal', journal.user_id, entries)
  return newEntry
}

export async function getJournalEntries(userId: string) {
  const entries = getStorageData<any>('journal', userId)
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Mood Operations
export async function createMoodEntry(mood: any) {
  const entries = getStorageData<any>('mood', mood.user_id)
  const newEntry = {
    ...mood,
    id: generateId('mood'),
    created_at: new Date().toISOString()
  }
  entries.push(newEntry)
  setStorageData('mood', mood.user_id, entries)
  return newEntry
}

export async function getMoodEntries(userId: string) {
  const entries = getStorageData<any>('mood', userId)
  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Dashboard Data
export async function getDashboardData(userId: string) {
  const [tasks, expenses, sleep, calories] = await Promise.all([
    getTasks(userId),
    getExpenses(userId),
    getSleepEntries(userId),
    getCalorieEntries(userId)
  ])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return {
    tasks: {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'done').length,
      urgent: tasks.filter(t => t.priority === 'high').length,
      recent: tasks.slice(0, 3)
    },
    expenses: {
      today: expenses
        .filter(e => new Date(e.date).toDateString() === today.toDateString())
        .reduce((sum, e) => sum + e.amount, 0),
      upcoming: expenses.slice(0, 2)
    },
    sleep: sleep[0] || { hours_slept: 0, quality: 0 },
    calories: {
      today: calories
        .filter(c => new Date(c.date).toDateString() === today.toDateString())
        .reduce((sum, c) => sum + (c.type === 'intake' ? c.amount : -c.amount), 0)
    }
  }
}
