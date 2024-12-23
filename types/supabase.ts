export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            books: {
                Row: {
                    id: number
                    title: string
                    author: string
                    description: string | null
                    published_year: number | null
                    user_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    title: string
                    author: string
                    description?: string | null
                    published_year?: number | null
                    user_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    title?: string
                    author?: string
                    description?: string | null
                    published_year?: number | null
                    user_id?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            reading_goals: {
                Row: {
                    id: number
                    user_id: string
                    year: number
                    target_books: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    user_id: string
                    year: number
                    target_books: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    user_id?: string
                    year?: number
                    target_books?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            reading_records: {
                Row: {
                    id: number
                    book_id: number
                    user_id: string
                    status: string
                    progress: number
                    thoughts: string | null
                    completed_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    book_id: number
                    user_id: string
                    status: string
                    progress: number
                    thoughts?: string | null
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    book_id?: number
                    user_id?: string
                    status?: string
                    progress?: number
                    thoughts?: string | null
                    completed_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

