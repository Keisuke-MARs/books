'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getBook, updateBook, Book } from '@/lib/books'
import { useAuth } from '@/app/contexts/AuthContext'

export default function EditBook() {
    const [book, setBook] = useState<Book | null>(null)
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [description, setDescription] = useState('')
    const [publishedYear, setPublishedYear] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const params = useParams()
    const { user } = useAuth()

    useEffect(() => {
        async function fetchBook() {
            if (!user) return
            try {
                const fetchedBook = await getBook(Number(params.id))
                setBook(fetchedBook)
                setTitle(fetchedBook.title)
                setAuthor(fetchedBook.author)
                setDescription(fetchedBook.description || '')
                setPublishedYear(fetchedBook.published_year ? fetchedBook.published_year.toString() : '')
            } catch (err) {
                setError('書籍の取得に失敗しました。')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBook()
    }, [params.id, user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || !book) {
            setError('ログインしてください。')
            return
        }
        if (!title || !author) {
            setError('タイトルと著者は必須です。')
            return
        }
        setIsLoading(true)
        setError(null)
        try {
            await updateBook(book.id, {
                title,
                author,
                description: description || undefined,
                published_year: publishedYear ? parseInt(publishedYear) : undefined,
            })
            router.push(`/books/${book.id}`)
        } catch (err) {
            setError('書籍の更新に失敗しました。')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return <div className="text-center mt-8">読み込み中...</div>
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>
    if (!book) return <div className="text-center mt-8">書籍が見つかりません。</div>

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>書籍を編集</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">タイトル</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="author">著者</Label>
                            <Input
                                id="author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">概要</Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="publishedYear">出版年</Label>
                            <Input
                                id="publishedYear"
                                type="number"
                                value={publishedYear}
                                onChange={(e) => setPublishedYear(e.target.value)}
                                min="1000"
                                max={new Date().getFullYear()}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? '更新中...' : '更新'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/books/${book.id}`}>キャンセル</Link>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

