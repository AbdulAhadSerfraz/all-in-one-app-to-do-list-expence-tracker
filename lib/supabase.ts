// Types that will be used later with Supabase
export interface User {
  id: string
  email: string
  name: string
}

export interface Expense {
  id: string
  user_id: string
  amount: number
  description: string
  category: string
  date: string
  created_at: string
}

export interface Sleep {
  id: string
  user_id: string
  start_time: string
  end_time: string
  quality: number
  notes?: string
  created_at: string
}

export interface MoodEntry {
  id: string
  user_id: string
  mood_level: number
  energy_level: number
  notes?: string
  date: string
  created_at: string
}

export interface CalorieEntry {
  id: string
  user_id: string
  calories: number
  meal_type: string
  food_items: string[]
  date: string
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  content: string
  mood_tag?: string
  date: string
  created_at: string
}

export interface TodoItem {
  id: string
  user_id: string
  title: string
  description?: string
  due_date?: string
  completed: boolean
  created_at: string
}

// Supabase client initialization code removed - using localStorage instead
// import { createClient } from '@supabase/supabase-js'
// 
// if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
//   throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
// }
// if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
//   throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
// }
// 
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// 
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Tables {
  users: {
    id: string
    email: string
    name: string | null
    avatar_url: string | null
    created_at: string
  }
  tasks: {
    id: string
    user_id: string
    title: string
    description: string | null
    due_date: string | null
    priority: 'low' | 'medium' | 'high'
    status: 'todo' | 'in_progress' | 'done'
    created_at: string
  }
  expenses: {
    id: string
    user_id: string
    description: string
    amount: number
    category: string
    date: string
    created_at: string
  }
  sleep: {
    id: string
    user_id: string
    date: string
    hours_slept: number
    quality: number
    notes: string | null
    created_at: string
  }
  calories: {
    id: string
    user_id: string
    date: string
    amount: number
    type: 'intake' | 'burned'
    description: string | null
    created_at: string
  }
  journal: {
    id: string
    user_id: string
    date: string
    content: string
    mood: string | null
    created_at: string
  }
  mood: {
    id: string
    user_id: string
    date: string
    rating: number
    note: string | null
    created_at: string
  }
}
