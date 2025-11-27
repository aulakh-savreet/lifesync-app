import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && supabaseAnonKey && supabase !== null
}

// ============================================
// SLEEP DATA OPERATIONS
// ============================================
export async function uploadSleepData(data) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data: result, error } = await supabase
    .from('sleep_entries')
    .upsert(data, { onConflict: 'date' })
    .select()
  
  if (error) throw error
  return result
}

export async function getSleepData(startDate, endDate) {
  if (!supabase) throw new Error('Supabase not configured')
  
  let query = supabase
    .from('sleep_entries')
    .select('*')
    .order('date', { ascending: true })
  
  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// ============================================
// FITNESS DATA OPERATIONS
// ============================================
export async function uploadFitnessData(data) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data: result, error } = await supabase
    .from('fitness_entries')
    .upsert(data, { onConflict: 'date' })
    .select()
  
  if (error) throw error
  return result
}

export async function getFitnessData(startDate, endDate) {
  if (!supabase) throw new Error('Supabase not configured')
  
  let query = supabase
    .from('fitness_entries')
    .select('*')
    .order('date', { ascending: true })
  
  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// ============================================
// NUTRITION DATA OPERATIONS
// ============================================
export async function uploadNutritionData(data) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data: result, error } = await supabase
    .from('nutrition_entries')
    .upsert(data, { onConflict: 'date' })
    .select()
  
  if (error) throw error
  return result
}

export async function getNutritionData(startDate, endDate) {
  if (!supabase) throw new Error('Supabase not configured')
  
  let query = supabase
    .from('nutrition_entries')
    .select('*')
    .order('date', { ascending: true })
  
  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// ============================================
// SCREEN TIME DATA OPERATIONS
// ============================================
export async function uploadScreenTimeData(data) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data: result, error } = await supabase
    .from('screen_time_entries')
    .upsert(data, { onConflict: 'date' })
    .select()
  
  if (error) throw error
  return result
}

export async function getScreenTimeData(startDate, endDate) {
  if (!supabase) throw new Error('Supabase not configured')
  
  let query = supabase
    .from('screen_time_entries')
    .select('*')
    .order('date', { ascending: true })
  
  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// ============================================
// COMBINED DAILY ENTRY OPERATIONS
// ============================================
export async function uploadDailyEntry(data) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data: result, error } = await supabase
    .from('daily_entries')
    .upsert(data, { onConflict: 'date' })
    .select()
  
  if (error) throw error
  return result
}

export async function getAllDailyEntries(startDate, endDate) {
  if (!supabase) throw new Error('Supabase not configured')
  
  let query = supabase
    .from('daily_entries')
    .select('*')
    .order('date', { ascending: true })
  
  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)
  
  const { data, error } = await query
  if (error) throw error
  return data
}

// Bulk upload for importing data
export async function bulkUploadEntries(entries) {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase
    .from('daily_entries')
    .upsert(entries, { onConflict: 'date' })
    .select()
  
  if (error) throw error
  return data
}

// Delete all data (for testing)
export async function clearAllData() {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { error } = await supabase
    .from('daily_entries')
    .delete()
    .neq('date', '1900-01-01') // Delete all
  
  if (error) throw error
  return true
}
