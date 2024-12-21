/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface ReadingGoal {
    id: number
    user_id: string
    year: number
    target_books: number
}

const supabase = createClientComponentClient()

export async function getReadingGoal(userId: string, year: number): Promise<ReadingGoal | null> {
    try {
        console.log('Fetching reading goal for user:', userId, 'year:', year)
        const { data, error } = await supabase
            .from('reading_goals')
            .select('*')
            .eq('user_id', userId)
            .eq('year', year)
            .maybeSingle()

        if (error) {
            console.error('Error fetching reading goal:', error)
            throw new Error(`Failed to fetch reading goal: ${error.message}`)
        }

        console.log('Fetched reading goal:', data)
        return data
    } catch (error) {
        console.error('Unexpected error in getReadingGoal:', error)
        throw error
    }
}

export async function createOrUpdateReadingGoal(goal: Omit<ReadingGoal, 'id'>): Promise<ReadingGoal> {
    try {
        console.log('Creating or updating reading goal:', goal)
        const { data, error } = await supabase
            .from('reading_goals')
            .upsert([goal], {
                onConflict: 'user_id,year'
            })
            .select()

        if (error) {
            console.error('Supabase error in createOrUpdateReadingGoal:', error)
            throw new Error(`Failed to create/update reading goal: ${error.message}`)
        }

        if (!data || data.length === 0) {
            throw new Error('No data returned from upsert operation')
        }

        console.log('Successfully created/updated reading goal:', data[0])
        return data[0]
    } catch (error) {
        console.error('Unexpected error in createOrUpdateReadingGoal:', error)
        throw error
    }
}

export async function deleteReadingGoal(userId: string, year: number): Promise<void> {
    try {
        console.log('Deleting reading goal for user:', userId, 'year:', year)
        const { error } = await supabase
            .from('reading_goals')
            .delete()
            .eq('user_id', userId)
            .eq('year', year)

        if (error) {
            console.error('Error deleting reading goal:', error)
            throw new Error(`Failed to delete reading goal: ${error.message}`)
        }

        console.log('Successfully deleted reading goal')
    } catch (error) {
        console.error('Unexpected error in deleteReadingGoal:', error)
        throw error
    }
}

export async function testSupabaseConnection() {
    try {
        console.log('Testing Supabase connection...')
        const { data, error } = await supabase.from('reading_goals').select('count', { count: 'exact', head: true })

        if (error) {
            console.error('Supabase connection test failed:', error)
            return false
        }

        console.log('Supabase connection test successful. reading_goals table exists.')
        return true
    } catch (error) {
        console.error('Unexpected error in testSupabaseConnection:', error)
        return false
    }
}

