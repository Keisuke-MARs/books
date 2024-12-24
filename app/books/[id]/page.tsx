'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { getBook, deleteBook, Book, testBooksConnection } from '@/lib/books'
import { useAuth } from '@/app/contexts/AuthContext'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export default function BookDetail() {
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchBook() {
      if (!user) {
        setError('ログインが必要です。')
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        console.log('Testing books table connection...')
        const isConnected = await testBooksConnection()
        if (!isConnected) {
          throw new Error('Failed to connect to the books table. Please try again later.')
        }

        const bookId = params.id
        if (typeof bookId !== 'string') {
          throw new Error('Invalid book ID')
        }

        console.log(`Fetching book with id ${bookId} for user ${user.id}`)
        const fetchedBook = await getBook(bookId, user.id)
        if (fetchedBook === null) {
          setError('指定された書籍が見つかりません。')
        } else {
          setBook(fetchedBook)
        }
      } catch (err) {
        console.error('Error fetching book:', err)
        setError(err instanceof Error ? err.message : '書籍の取得に失敗しました。')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [params.id, user])

  const handleDelete = async () => {
    if (!book || !user) return
    try {
      await deleteBook(book.id, user.id)
      router.push('/books')
    } catch (err) {
      console.error('Error deleting book:', err)
      setError(err instanceof Error ? err.message : '書籍の削除に失敗しました。')
    }
  }

  if (isLoading) return <div className="text-center mt-8">読み込み中...</div>
  if (error) return (
    <Alert variant="destructive" className="mt-8">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
  if (!book) return <div className="text-center mt-8">書籍が見つかりません。</div>

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{book.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-2">著者: {book.author}</p>
          {book.published_year && (
            <p className="text-gray-600 mb-2">出版年: {book.published_year}</p>
          )}
          {book.description && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">概要</h3>
              <p>{book.description}</p>
            </div>
          )}
          {book.reading_records && book.reading_records.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">読書記録</h3>
              {book.reading_records.map((record) => (
                <div key={record.id} className="mb-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <Badge>{record.status}</Badge>
                    <span className="text-sm text-gray-500">
                      {record.created_at
                        ? new Date(record.created_at).toLocaleDateString()
                        : '日付不明'}
                    </span>
                  </div>
                  <p className="mb-2">進捗: {record.progress}%</p>
                  {record.thoughts && (
                    <p className="text-sm text-gray-700">{record.thoughts}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="outline">
            <Link href={`/books/${book.id}/edit`}>
              編集
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">削除</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>本当にこの書籍を削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  この操作は取り消せません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>削除</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
      <div className="mt-4 text-center">
        <Link href="/books" className="text-blue-600 hover:underline">
          書籍一覧に戻る
        </Link>
      </div>
    </div>
  )
}

