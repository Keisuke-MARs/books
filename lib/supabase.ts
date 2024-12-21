import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Supabase接続テスト
supabase.from('reading_goals').select('*', { count: 'exact', head: true })
    .then(({ count, error }) => {
        if (error) {
            console.error('Supabase connection test failed:', error)
        } else {
            console.log('Supabase connection test successful. reading_goals count:', count)
        }
    })

