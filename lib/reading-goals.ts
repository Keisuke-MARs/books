import { supabase } from './supabase'

export interface ReadingGoal {
    id: number
    user_id: string
    year: number
    target_books: number
}

export async function getReadingGoal(userId: string, year: number) {
    const { data, error } = await supabase
        .from('reading_goals')
        .select('*')
        .eq('user_id', userId)
        .eq('year', year)
        .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as ReadingGoal | null
}

export async function createOrUpdateReadingGoal(goal: Omit<ReadingGoal, 'id'>) {
    const { data, error } = await supabase
        .from('reading_goals')
        .upsert(goal, { onConflict: 'user_id,year' })
        .select()

    if (error) throw error
    return data[0] as ReadingGoal
}

export async function deleteReadingGoal(userId: string, year: number) {
    const { error } = await supabase
        .from('reading_goals')
        .delete()
        .eq('user_id', userId)
        .eq('year', year)

    if (error) throw error
}

