import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Supabase接続テスト
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('reading_sessions').select('count', { count: 'exact', head: true })
    if (error) throw error
    console.log('Supabase connection test successful. reading_sessions count:', data)
    return true
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return false
  }
}

