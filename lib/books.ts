/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../types/supabase'
import { ReadingRecord } from './reading-records'

export interface Book {
  id: number
  title: string
  author: string
  description?: string
  published_year?: number
  user_id: string
  reading_records?: ReadingRecord[]
}

const supabase = createClientComponentClient<Database>()

export async function getBooks(userId: string): Promise<Book[]> {
  try {
    console.log('Fetching books for user:', userId)
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Supabase error details:', JSON.stringify(error, null, 2))
      throw new Error(`Failed to fetch books: ${error.message}`)
    }

    if (!data) {
      console.log('No books found')
      return []
    }

    console.log('Successfully fetched books:', data)
    return data as Book[]
  } catch (error) {
    console.error('Detailed error in getBooks:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch books: ${error.message}`)
    } else {
      throw new Error('An unknown error occurred while fetching books')
    }
  }
}

export async function getBook(id: number | string, userId: string): Promise<Book | null> {
  try {
    console.log(`Fetching book with id ${id} for user ${userId}`)

    // idが数値でない場合はnullを返す
    if (isNaN(Number(id))) {
      console.log('Invalid book id:', id)
      return null
    }

    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        reading_records (*)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Supabase error details:', JSON.stringify(error, null, 2))
      if (error.code === 'PGRST116') {
        console.log('No book found with the given id and user_id')
        return null
      }
      throw new Error(`Failed to fetch book: ${error.message}`)
    }

    if (!data) {
      console.log('No book data returned')
      return null
    }

    console.log('Successfully fetched book:', data)
    return data as Book
  } catch (error) {
    console.error('Detailed error in getBook:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch book: ${error.message}`)
    } else {
      throw new Error('An unknown error occurred while fetching the book')
    }
  }
}

export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
  try {
    console.log('Creating book:', book)
    const { data, error } = await supabase
      .from('books')
      .insert(book)
      .select()

    if (error) {
      console.error('Error creating book:', error)
      throw new Error(`Failed to create book: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned after creating book')
    }

    console.log('Created book:', data[0])
    return data[0] as Book
  } catch (error) {
    console.error('Unexpected error in createBook:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to create book: ${error.message}`)
    } else {
      throw new Error('An unknown error occurred while creating the book')
    }
  }
}

export async function updateBook(id: number, book: Partial<Book>, userId: string): Promise<Book> {
  try {
    const { data, error } = await supabase
      .from('books')
      .update(book)
      .eq('id', id)
      .eq('user_id', userId)
      .select()

    if (error) {
      console.error('Error updating book:', error)
      throw new Error(`Failed to update book: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned after updating book')
    }

    return data[0] as Book
  } catch (error) {
    console.error('Unexpected error in updateBook:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to update book: ${error.message}`)
    } else {
      throw new Error('An unknown error occurred while updating the book')
    }
  }
}

export async function deleteBook(id: number, userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting book:', error)
      throw new Error(`Failed to delete book: ${error.message}`)
    }
  } catch (error) {
    console.error('Unexpected error in deleteBook:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to delete book: ${error.message}`)
    } else {
      throw new Error('An unknown error occurred while deleting the book')
    }
  }
}

export async function testBooksConnection(): Promise<boolean> {
  try {
    console.log('Testing books table connection...')
    const { data, error } = await supabase
      .from('books')
      .select('count', { count: 'exact', head: true })

    if (error) {
      console.error('Books table connection test failed:', JSON.stringify(error, null, 2))
      return false
    }

    console.log('Books table connection test successful')
    return true
  } catch (error) {
    console.error('Unexpected error in testBooksConnection:', error)
    return false
  }
}

