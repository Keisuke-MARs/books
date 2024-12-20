import { supabase } from './supabase'

export interface Book {
    id: number
    title: string
    author: string
    description?: string
    published_year?: number
    user_id: string
}

export async function getBooks() {
    const { data, error } = await supabase
        .from('books')
        .select('*')

    if (error) {
        console.error('Error fetching books:', error)
        throw error
    }
    return data as Book[]
}

export async function getBook(id: number) {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching book:', error)
        throw error
    }
    return data as Book
}

export async function createBook(book: Omit<Book, 'id'>) {
    const { data, error } = await supabase
        .from('books')
        .insert(book)
        .select()

    if (error) {
        console.error('Error creating book:', error)
        throw error
    }
    return data[0] as Book
}

export async function updateBook(id: number, book: Partial<Book>) {
    const { data, error } = await supabase
        .from('books')
        .update(book)
        .eq('id', id)
        .select()

    if (error) {
        console.error('Error updating book:', error)
        throw error
    }
    return data[0] as Book
}

export async function deleteBook(id: number) {
    const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting book:', error)
        throw error
    }
}

