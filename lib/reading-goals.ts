/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../types/supabase'

export interface ReadingGoal {
    id: number
    user_id: string
    year: number
    target_books: number
}

const supabase = createClientComponentClient<Database>()

export async function getReadingGoal(userId: string, year: number): Promise<ReadingGoal | null> {
    try {
        console.log('Fetching reading goal for user:', userId, 'year:', year)
        const { data, error } = await supabase
            .from('reading_goals')
            .select('*')
            .eq('user_id', userId)
            .eq('year', year)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                // PGRST116 means no rows returned, which is not an error in this case
                return null
            }
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

        // バリデーション
        if (!goal.user_id) throw new Error('User ID is required')
        if (!goal.year) throw new Error('Year is required')
        if (!goal.target_books) throw new Error('Target books is required')

        // 既存の目標をチェック
        const existingGoal = await getReadingGoal(goal.user_id, goal.year)

        let result
        if (existingGoal) {
            // 既存の目標を更新
            const { data, error } = await supabase
                .from('reading_goals')
                .update({ target_books: goal.target_books })
                .eq('id', existingGoal.id)
                .select()
                .single()

            if (error) throw error
            result = data
            console.log('Updated existing reading goal:', result)
        } else {
            // 新しい目標を作成
            const { data, error } = await supabase
                .from('reading_goals')
                .insert(goal)
                .select()
                .single()

            if (error) throw error
            result = data
            console.log('Created new reading goal:', result)
        }

        if (!result) {
            throw new Error('No data returned from create/update operation')
        }

        return result
    } catch (error) {
        console.error('Detailed error in createOrUpdateReadingGoal:', error)
        if (error instanceof Error) {
            throw new Error(`Failed to create/update reading goal: ${error.message}`)
        }
        throw new Error('An unknown error occurred while creating/updating the reading goal')
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
        const { data, error } = await supabase
            .from('reading_goals')
            .select('count', { count: 'exact', head: true })

        if (error) {
            console.error('Supabase connection test failed:', error)
            return false
        }

        console.log('Supabase connection test successful')
        return true
    } catch (error) {
        console.error('Unexpected error in testSupabaseConnection:', error)
        return false
    }
}

