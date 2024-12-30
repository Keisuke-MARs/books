import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '../types/supabase'

export interface ReadingStatistics {
  totalBooks: number
  booksThisMonth: number
  averageReadingTime: number
  topGenre: string
}

const supabase = createClientComponentClient<Database>()

export async function getReadingStatistics(userId: string): Promise<ReadingStatistics> {
  try {
    // Supabase接続テスト
    const isConnected = await testSupabaseConnection()
    if (!isConnected) {
      throw new Error('Supabaseとの接続に失敗しました。')
    }

    // 総読書冊数を取得
    const { count: totalBooks, error: totalBooksError } = await supabase
      .from('reading_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', '読了')

    if (totalBooksError) {
      console.error('Error fetching total books:', totalBooksError)
      throw totalBooksError
    }

    // 今月の読了本数を取得
    const currentDate = new Date()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString()
    const { count: booksThisMonth, error: booksThisMonthError } = await supabase
      .from('reading_records')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', '読了')
      .gte('completed_at', firstDayOfMonth)

    if (booksThisMonthError) {
      console.error('Error fetching books this month:', booksThisMonthError)
      throw booksThisMonthError
    }

    // 平均読書時間を取得
    console.log('Fetching reading times...')
    const { data: readingTimes, error: readingTimesError } = await supabase
      .from('reading_sessions')
      .select('duration')
      .eq('user_id', userId)

    if (readingTimesError) {
      console.error('Error fetching reading times:', readingTimesError)
      throw readingTimesError
    }

    const totalReadingTime = readingTimes ? readingTimes.reduce((sum, session) => sum + session.duration, 0) : 0
    const averageReadingTime = readingTimes && readingTimes.length > 0 ? Math.round(totalReadingTime / readingTimes.length) : 0

    // 最も読んだジャンルを取得（一時的にコメントアウト）
    /*
    console.log('Fetching genres...')
    const { data: genres, error: genresError } = await supabase
      .from('books')
      .select('genre')
      .eq('user_id', userId)

    if (genresError) {
      console.error('Error fetching genres:', JSON.stringify(genresError, null, 2))
      throw new Error(`ジャンルの取得に失敗しました: ${genresError.message}`)
    }

    console.log('Fetched genres:', JSON.stringify(genres, null, 2))

    if (!genres || genres.length === 0) {
      console.log('No genres found for the user')
      return {
        totalBooks: totalBooks || 0,
        booksThisMonth: booksThisMonth || 0,
        averageReadingTime,
        topGenre: '不明'
      }
    }

    const genreCounts = genres.reduce((acc, { genre }) => {
      if (genre) {
        acc[genre] = (acc[genre] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    const topGenre = Object.entries(genreCounts).length > 0
      ? Object.entries(genreCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      : '不明'
    */

    const topGenre = '現在利用できません' // 一時的な対処

    return {
      totalBooks: totalBooks || 0,
      booksThisMonth: booksThisMonth || 0,
      averageReadingTime,
      topGenre
    }
  } catch (error) {
    console.error('Detailed error in getReadingStatistics:', error)
    if (error instanceof Error) {
      throw new Error(`読書統計の取得に失敗しました: ${error.message}`)
    } else {
      throw new Error('読書統計の取得に失敗しました: 不明なエラー')
    }
  }
}

export async function testSupabaseConnection(): Promise<boolean> {
  try {
    console.log('Testing Supabase connection...')
    const { data, error } = await supabase.from('books').select('count', { count: 'exact', head: true })

    if (error) {
      console.error('Supabase connection test failed:', JSON.stringify(error, null, 2))
      return false
    }

    console.log('Supabase connection test successful. Books count:', data)
    return true
  } catch (error) {
    console.error('Unexpected error in testSupabaseConnection:', error)
    return false
  }
}

