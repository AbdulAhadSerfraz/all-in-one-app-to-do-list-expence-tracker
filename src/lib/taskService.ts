export interface Task {
  id: string;
  title: string;
  start: string;
  end?: string;
  color?: string;
  allDay?: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const getTasks = (userId: string): Task[] => {
  try {
    const tasks = localStorage.getItem(`tasks_${userId}`);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
};

export const saveTask = (userId: string, task: Task): void => {
  try {
    const tasks = getTasks(userId);
    localStorage.setItem(`tasks_${userId}`, JSON.stringify([...tasks, task]));
  } catch (error) {
    console.error('Error saving task:', error);
  }
};

export const updateTask = (userId: string, taskId: string, updates: Partial<Task>): void => {
  try {
    const tasks = getTasks(userId);
    const updatedTasks = tasks.map(t => t.id === taskId ? {...t, ...updates} : t);
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks));
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

export const deleteTask = (userId: string, taskId: string): void => {
  try {
    const tasks = getTasks(userId).filter(t => t.id !== taskId);
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};