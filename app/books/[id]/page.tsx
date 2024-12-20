'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { getBook, deleteBook, Book } from '@/lib/books'
import { useAuth } from '@/app/contexts/AuthContext'

export default function BookDetail() {
    const [book, setBook] = useState<Book | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        async function fetchBook() {
            if (!user) return
            try {
                setIsLoading(true)
                const fetchedBook = await getBook(Number(params.id))
                setBook(fetchedBook)
            } catch (err) {
                setError('書籍の取得に失敗しました。')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchBook()
    }, [params.id, user])

    const handleDelete = async () => {
        if (!book) return
        try {
            await deleteBook(book.id)
            router.push('/books')
        } catch (err) {
            setError('書籍の削除に失敗しました。')
            console.error(err)
        }
    }

    if (isLoading) return <div className="text-center mt-8">読み込み中...</div>
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>
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

