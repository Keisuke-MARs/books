/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { getBooks, Book } from '@/lib/books'
import { useAuth } from '@/app/contexts/AuthContext'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BookList() {
    const [books, setBooks] = useState<Book[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user, session } = useAuth()

    useEffect(() => {
        async function fetchBooks() {
            if (!session) {
                console.log('No session, skipping book fetch')
                setIsLoading(false)
                return
            }
            try {
                console.log('Fetching books...')
                setIsLoading(true)
                const fetchedBooks = await getBooks()
                console.log('Fetched books:', fetchedBooks)
                setBooks(fetchedBooks)
            } catch (err) {
                console.error('Error fetching books:', err)
                setError('書籍の取得に失敗しました。')
            } finally {
                setIsLoading(false)
            }
        }

        fetchBooks()
    }, [session])

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (isLoading) return <div className="text-center mt-8">読み込み中...</div>
    if (!session) return (
        <Alert variant="destructive" className="mt-8">
            <AlertDescription>ログインが必要です。</AlertDescription>
        </Alert>
    )
    if (error) return (
        <Alert variant="destructive" className="mt-8">
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">書籍一覧</h1>
                <Link href="/books/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out">
                    新しい書籍を追加
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredBooks.map((book) => (
                    <Card key={book.id} className="bg-white p-4 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-xl hover:scale-105">
                        <CardHeader>
                            <CardTitle>{book.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">著者: {book.author}</p>
                            {book.published_year && (
                                <p className="text-gray-600 mb-4">出版年: {book.published_year}</p>
                            )}
                            <Button asChild variant="outline">
                                <Link href={`/books/${book.id}`}>
                                    詳細を見る
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {filteredBooks.length === 0 && (
                <p className="text-center mt-4">検索結果がありません。</p>
            )}
        </div>
    )
}

