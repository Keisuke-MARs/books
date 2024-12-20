import { supabase } from './supabase'

export interface ReadingRecord {
    id: number
    book_id: number
    user_id: string
    status: '未読' | '読書中' | '読了'
    progress: number
    thoughts?: string
    completed_at?: string
}

export async function getReadingRecords() {
    const { data, error } = await supabase
        .from('reading_records')
        .select('*')

    if (error) throw error
    return data as ReadingRecord[]
}

export async function getReadingRecord(id: number) {
    const { data, error } = await supabase
        .from('reading_records')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data as ReadingRecord
}

export async function createReadingRecord(record: Omit<ReadingRecord, 'id'>) {
    const { data, error } = await supabase
        .from('reading_records')
        .insert(record)
        .select()

    if (error) throw error
    return data[0] as ReadingRecord
}

export async function updateReadingRecord(id: number, record: Partial<ReadingRecord>) {
    const { data, error } = await supabase
        .from('reading_records')
        .update(record)
        .eq('id', id)
        .select()

    if (error) throw error
    return data[0] as ReadingRecord
}

export async function deleteReadingRecord(id: number) {
    const { error } = await supabase
        .from('reading_records')
        .delete()
        .eq('id', id)

    if (error) throw error
}

