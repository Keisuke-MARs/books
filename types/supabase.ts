export interface Database {
    public: {
      Tables: {
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
            user_id: string
            book_id: number
            status: '未読' | '読書中' | '読了'
            progress: number
            thoughts: string | null
            completed_at: string | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: number
            user_id: string
            book_id: number
            status: '未読' | '読書中' | '読了'
            progress: number
            thoughts?: string | null
            completed_at?: string | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: number
            user_id?: string
            book_id?: number
            status?: '未読' | '読書中' | '読了'
            progress?: number
            thoughts?: string | null
            completed_at?: string | null
            created_at?: string
            updated_at?: string
          }
        }
        reading_sessions: {
          Row: {
            id: number
            user_id: string
            book_id: number
            duration: number
            date: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: number
            user_id: string
            book_id: number
            duration: number
            date: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: number
            user_id?: string
            book_id?: number
            duration?: number
            date?: string
            created_at?: string
            updated_at?: string
          }
        }
        books: {
          Row: {
            id: number
            user_id: string
            title: string
            author: string
            genre: string
            description: string | null
            published_year: number | null
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: number
            user_id: string
            title: string
            author: string
            genre: string
            description?: string | null
            published_year?: number | null
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: number
            user_id?: string
            title?: string
            author?: string
            genre?: string
            description?: string | null
            published_year?: number | null
            created_at?: string
            updated_at?: string
          }
        }
      }
    }
  }
  
  