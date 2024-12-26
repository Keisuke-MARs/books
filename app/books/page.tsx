'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getBooks, Book, testBooksConnection } from '@/lib/books'
import { useAuth } from '@/app/contexts/AuthContext'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BookList() {
  const [books, setBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchBooks() {
      if (!user) {
        console.log('No user logged in, skipping book fetch')
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

        console.log('Fetching books for user:', user.id)
        const fetchedBooks = await getBooks(user.id)
        console.log('Fetched books:', fetchedBooks)
        setBooks(fetchedBooks)
      } catch (err) {
        console.error('Error fetching books:', err)
        setError(err instanceof Error ? err.message : '書籍の取得に失敗しました。')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [user])

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) return <div className="text-center mt-8">読み込み中...</div>
  if (!user) return (
    <Alert variant="destructive" className="mt-8 mx-4">
      <AlertDescription>ログインが必要です。</AlertDescription>
    </Alert>
  )
  if (error) return (
    <Alert variant="destructive" className="mt-8 mx-4">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold">書籍一覧</h1>
        <Link href="/books/add" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto">新しい書籍を追加</Button>
        </Link>
      </div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="書籍名または著者名で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">{book.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between flex-grow">
              <div>
                <p className="text-gray-600 mb-2 text-sm sm:text-base">著者: {book.author}</p>
                {book.published_year && (
                  <p className="text-gray-600 mb-2 text-sm sm:text-base">出版年: {book.published_year}</p>
                )}
              </div>
              <Button asChild variant="outline" className="mt-4">
                <Link href={`/books/${book.id}`}>
                  詳細を見る
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredBooks.length === 0 && (
        <p className="text-center mt-4 text-sm sm:text-base">検索結果がありません。</p>
      )}
    </div>
  )
}

