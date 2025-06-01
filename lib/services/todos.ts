import { supabase } from '../supabase'

// Function to create a new task
export async function createTask(task: { title: string; description: string; dueDate: Date; priority: "low" | "medium" | "high" }) {
  const { title, description, dueDate, priority } = task;
  const { data, error } = await supabase
    .from('tasks')
    .insert([{ title, description, dueDate, priority }])

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// Function to get all tasks with optional date filters
export async function getTasks(filters: { startDate?: Date; endDate?: Date } = {}) {
  const { startDate, endDate } = filters;
  
  let query = supabase.from('tasks').select('*');
  
  // Filter tasks by date range if provided
  if (startDate) {
    query = query.gte('due_date', startDate.toISOString());
  }
  
  if (endDate) {
    query = query.lte('due_date', endDate.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
