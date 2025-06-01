// import { supabase } from '../supabase'
// import { CalorieEntry } from '../supabase'

// export async function getCalorieEntries(userId: string) {
//   const { data, error } = await supabase
//     .from('calorie_entries')
//     .select('*')
//     .eq('user_id', userId)
//     .order('date', { ascending: false })
//
//   if (error) throw error
//   return data
// }

// export async function addCalorieEntry(entry: Omit<CalorieEntry, 'id' | 'created_at'>) {
//   const { data, error } = await supabase
//     .from('calorie_entries')
//     .insert([entry])
//     .select()
//     .single()
//
//   if (error) throw error
//   return data
// }

// export async function updateCalorieEntry(id: string, entry: Partial<Omit<CalorieEntry, 'id' | 'user_id' | 'created_at'>>) {
//   const { data, error } = await supabase
//     .from('calorie_entries')
//     .update(entry)
//     .eq('id', id)
//     .select()
//     .single()
//
//   if (error) throw error
//   return data
// }

// export async function deleteCalorieEntry(id: string) {
//   const { error } = await supabase
//     .from('calorie_entries')
//     .delete()
//     .eq('id', id)
//
//   if (error) throw error
// }

// export async function getCalorieStats(userId: string, startDate?: string, endDate?: string) {
//   let query = supabase
//     .from('calorie_entries')
//     .select('calories, meal_type, date')
//     .eq('user_id', userId)
//   if (startDate) {
//     query = query.gte('date', startDate)
//   }
//   if (endDate) {
//     query = query.lte('date', endDate)
//   }
//
//   const { data, error } = await query
//
//   if (error) throw error
//
//   // Calculate daily totals and meal type breakdowns
//   const dailyTotals: { [key: string]: number } = {}
//   const mealTypeTotals: { [key: string]: number } = {}
//   let totalCalories = 0
//
//   data.forEach(entry => {
//     const date = entry.date.split('T')[0]
//     dailyTotals[date] = (dailyTotals[date] || 0) + entry.calories
//     mealTypeTotals[entry.meal_type] = (mealTypeTotals[entry.meal_type] || 0) + entry.calories
//     totalCalories += entry.calories
//   })
//
//   return {
//     dailyTotals: Object.entries(dailyTotals).map(([date, calories]) => ({
//       date,
//       calories
//     })),
//     mealTypeBreakdown: Object.entries(mealTypeTotals).map(([mealType, calories]) => ({
//       mealType,
//       calories,
//       percentage: (calories / totalCalories) * 100
//     })),
//     averageDaily: data.length ? totalCalories / Object.keys(dailyTotals).length : 0,
//     totalEntries: data.length
//   }
// }
