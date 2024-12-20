/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { searchBooks, BookSearchResult } from '@/lib/googleBooksApi'
import { createBook } from '@/lib/books'
import { useAuth } from '@/app/contexts/AuthContext'

export default function BookSearch() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<BookSearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { user } = useAuth()

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const searchResults = await searchBooks(query)
            setResults(searchResults)
        } catch (err) {
            setError('書籍の検索中にエラーが発生しました')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddBook = async (book: BookSearchResult) => {
        if (!user) {
            setError('書籍を追加するにはログインが必要です')
            return
        }

        try {
            await createBook({
                title: book.title,
                author: book.authors.join(', '),
                description: book.description,
                published_year: new Date(book.publishedDate).getFullYear(),
                user_id: user.id,
            })
            router.push('/books')
        } catch (err) {
            setError('書籍の追加中にエラーが発生しました')
            console.error(err)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">書籍検索</h1>
            <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="書籍名、著者名、またはISBNで検索"
                        className="flex-grow"
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? '検索中...' : '検索'}
                    </Button>
                </div>
            </form>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {results.map((book) => (
                    <Card key={book.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg">{book.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            {book.imageLinks && (
                                <img
                                    src={book.imageLinks.thumbnail}
                                    alt={`${book.title}の表紙`}
                                    className="w-32 h-auto mb-2"
                                />
                            )}
                            <p className="text-sm text-gray-600 mb-2">著者: {book.authors.join(', ')}</p>
                            <p className="text-sm text-gray-600 mb-2">出版日: {book.publishedDate}</p>
                            <p className="text-sm mb-4">{book.description.slice(0, 100)}...</p>
                            <Button onClick={() => handleAddBook(book)}>
                                書籍を追加
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

