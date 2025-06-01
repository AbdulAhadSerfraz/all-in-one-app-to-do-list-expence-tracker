import { supabase } from '../supabase'
import { Sleep } from '../supabase'

export async function getSleepEntries(userId: string) {
  const { data, error } = await supabase
    .from('sleep_entries')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: false })

  if (error) throw error
  return data
}

export async function addSleepEntry(entry: Omit<Sleep, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('sleep_entries')
    .insert([entry])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSleepEntry(id: string, entry: Partial<Omit<Sleep, 'id' | 'user_id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('sleep_entries')
    .update(entry)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSleepEntry(id: string) {
  const { error } = await supabase
    .from('sleep_entries')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function getSleepStats(userId: string, startDate?: string, endDate?: string) {
  let query = supabase
    .from('sleep_entries')
    .select('start_time, end_time, quality')
    .eq('user_id', userId)

  if (startDate) {
    query = query.gte('start_time', startDate)
  }
  if (endDate) {
    query = query.lte('end_time', endDate)
  }

  const { data, error } = await query

  if (error) throw error

  // Calculate average sleep duration and quality
  const stats = data.reduce((acc, entry) => {
    const start = new Date(entry.start_time)
    const end = new Date(entry.end_time)
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60) // hours

    return {
      totalDuration: acc.totalDuration + duration,
      totalQuality: acc.totalQuality + entry.quality,
      count: acc.count + 1
    }
  }, { totalDuration: 0, totalQuality: 0, count: 0 })

  return {
    averageDuration: stats.count ? stats.totalDuration / stats.count : 0,
    averageQuality: stats.count ? stats.totalQuality / stats.count : 0,
    totalEntries: stats.count
  }
}
