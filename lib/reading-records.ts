import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../types/supabase'

export interface ReadingRecord {
  id: number
  book_id: number
  user_id: string
  status: '未読' | '読書中' | '読了'
  progress: number
  thoughts?: string | null
  completed_at?: string | null
  created_at: string  // この行を追加
  books: {
    id: number
    title: string
    author: string
  } | null
}

const supabase = createClientComponentClient<Database>()

export async function getReadingRecords(userId: string): Promise<ReadingRecord[]> {
  try {
    console.log('Fetching reading records for user:', userId)
    
    const { data, error } = await supabase
      .from('reading_records')
      .select(`
        *,
        books (
          id,
          title,
          author
        )
      `)
      .eq('user_id', userId)
      .order('id', { ascending: false })

    if (error) {
      console.error('Supabase error details:', JSON.stringify(error, null, 2))
      throw new Error(`Failed to fetch reading records: ${error.message}`)
    }

    if (!data) {
      console.log('No reading records found')
      return []
    }

    console.log('Successfully fetched reading records:', data)
    return data as ReadingRecord[]
  } catch (error) {
    console.error('Detailed error in getReadingRecords:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch reading records: ${error.message}`)
    } else {
      throw new Error('An unknown error occurred while fetching reading records')
    }
  }
}

export async function getReadingRecord(id: number, userId: string): Promise<ReadingRecord | null> {
  try {
    const { data, error } = await supabase
      .from('reading_records')
      .select(`
        *,
        books (
          id,
          title,
          author
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Error fetching reading record:', error)
      throw new Error(`Failed to fetch reading record: ${error.message}`)
    }

    return data as ReadingRecord
  } catch (error) {
    console.error('Unexpected error in getReadingRecord:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch reading record: ${error.message}`)
    } else {
      throw new Error('An unknown error occurred while fetching the reading record')
    }
  }
}

export async function createReadingRecord(record: Omit<ReadingRecord, 'id' | 'books'>): Promise<ReadingRecord> {
  try {
    console.log('Creating reading record:', record)
    const { data, error } = await supabase
      .from('reading_records')
      .insert(record)
      .select(`
        *,
        books (
          id,
          title,
          author
        )
      `)
      .single()

    if (error) {
      console.error('Error creating reading record:', error)
      throw new Error(`Failed to create reading record: ${error.message}`)
    }

    if (!data) {
      throw new Error('No data returned after creating reading record')
    }

    console.log('Created reading record:', data)
    return data as ReadingRecord
  } catch (error) {
    console.error('Unexpected error in createReadingRecord:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to create reading record: ${error.message}`)
    } else {
      throw new Error('An unknown error occurred while creating the reading record')
    }
  }
}

export async function updateReadingRecord(id: number, record: Partial<Omit<ReadingRecord, 'id' | 'books'>>, userId: string): Promise<ReadingRecord> {
  try {
    const { data, error } = await supabase
      .from('reading_records')
      .update(record)
      .eq('id', id)
      .eq('user_id', userId)
      .select(`
        *,
        books (
          id,
          title,
          author
        )
      `)
      .single()

    if (error) {
      console.error('Error updating reading record:', error)
      throw new Error(`Failed to update reading record: ${error.message}`)
    }

    if (!data) {
      throw new Error('No data returned after updating reading record')
    }

    return data as ReadingRecord
  } catch (error) {
    console.error('Unexpected error in updateReadingRecord:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to update reading record: ${error.message}`)
    } else {
      throw new Error('An unknown error occurred while updating the reading record')
    }
  }
}

export async function deleteReadingRecord(id: number, userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('reading_records')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting reading record:', error)
      throw new Error(`Failed to delete reading record: ${error.message}`)
    }
  } catch (error) {
    console.error('Unexpected error in deleteReadingRecord:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to delete reading record: ${error.message}`)
    } else {
      throw new Error('An unknown error occurred while deleting the reading record')
    }
  }
}

export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log('Testing Supabase connection...')
    const { data, error } = await supabase
      .from('reading_records')
      .select('count', { count: 'exact', head: true })

    if (error) {
      console.error('Supabase connection test failed:', JSON.stringify(error, null, 2))
      return false
    }

    console.log('Supabase connection test successful')
    return true
  } catch (error) {
    console.error('Unexpected error in testSupabaseConnection:', error)
    return false
  }
}

