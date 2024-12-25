import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../types/supabase'

export interface UserProfile {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

const supabase = createClientComponentClient<Database>()

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error

    return data as UserProfile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return data as UserProfile
  } catch (error) {
    console.error('Error updating user profile:', error)
    return null
  }
}

