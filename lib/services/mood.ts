import { supabase } from '@/lib/supabase'

export type MoodEntry = {
  id: string
  user_id: string
  mood_level: number
  energy_level: number
  notes: string | null
  created_at: string
  date: string
}

export type MoodStats = {
  averageMood: number
  averageEnergy: number
  totalEntries: number
  entries: {
    date: string
    mood: number
    energy: number
  }[]
}

export async function addMoodEntry(entry: Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('mood_entries')
    .insert({
      ...entry,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMoodEntries() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as MoodEntry[]
}

export async function getMoodStats(): Promise<MoodStats> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Get all mood entries for the user
  const { data: entries, error } = await supabase
    .from('mood_entries')
    .select('mood_level, energy_level, date')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error

  // Calculate statistics
  const moodEntries = entries as { mood_level: number; energy_level: number; date: string }[]
  const totalEntries = moodEntries.length

  const stats = moodEntries.reduce((acc, entry) => ({
    totalMood: acc.totalMood + entry.mood_level,
    totalEnergy: acc.totalEnergy + entry.energy_level,
    count: acc.count + 1
  }), { totalMood: 0, totalEnergy: 0, count: 0 })

  return {
    averageMood: totalEntries > 0 ? stats.totalMood / totalEntries : 0,
    averageEnergy: totalEntries > 0 ? stats.totalEnergy / totalEntries : 0,
    totalEntries,
    entries: moodEntries.map(entry => ({
      date: entry.date,
      mood: entry.mood_level,
      energy: entry.energy_level
    }))
  }
}

export async function updateMoodEntry(id: string, entry: Partial<Omit<MoodEntry, 'id' | 'user_id' | 'created_at'>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('mood_entries')
    .update(entry)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMoodEntry(id: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase
    .from('mood_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw error
}
