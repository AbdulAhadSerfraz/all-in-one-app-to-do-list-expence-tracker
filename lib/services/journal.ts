import { supabase } from '../supabase'
import { JournalEntry } from '../supabase'

export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) throw error
  return data
}

export async function addJournalEntry(entry: Omit<JournalEntry, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([entry])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateJournalEntry(id: string, entry: Partial<Omit<JournalEntry, 'id' | 'user_id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('journal_entries')
    .update(entry)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteJournalEntry(id: string) {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function searchJournalEntries(userId: string, query: string) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .textSearch('content', query)
    .order('date', { ascending: false })

  if (error) throw error
  return data
}

export async function getJournalStats(userId: string) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('date, mood_tag')
    .eq('user_id', userId)

  if (error) throw error

  // Calculate entry frequency and mood tag distribution
  const moodTags: { [key: string]: number } = {}
  const monthlyCount: { [key: string]: number } = {}

  data.forEach(entry => {
    // Count mood tags
    if (entry.mood_tag) {
      moodTags[entry.mood_tag] = (moodTags[entry.mood_tag] || 0) + 1
    }

    // Count entries per month
    const month = entry.date.substring(0, 7) // YYYY-MM format
    monthlyCount[month] = (monthlyCount[month] || 0) + 1
  })

  return {
    totalEntries: data.length,
    moodTagDistribution: Object.entries(moodTags).map(([tag, count]) => ({
      tag,
      count,
      percentage: (count / data.length) * 100
    })),
    monthlyActivity: Object.entries(monthlyCount).map(([month, count]) => ({
      month,
      count
    }))
  }
}
