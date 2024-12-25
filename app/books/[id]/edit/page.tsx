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
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EditBook() {
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
      if (!user || !params.id) {
        setError('必要な情報が不足しています。')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const fetchedBook = await getBook(Number(params.id), user.id)
        
        if (!fetchedBook) {
          setError('書籍が見つかりません。')
          return
        }

        setTitle(fetchedBook.title)
        setAuthor(fetchedBook.author)
        setDescription(fetchedBook.description || '')
        setPublishedYear(fetchedBook.published_year ? fetchedBook.published_year.toString() : '')
      } catch (err) {
        console.error('Error fetching book:', err)
        setError('書籍の取得に失敗しました。')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [params.id, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !params.id) {
      setError('必要な情報が不足しています。')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      await updateBook(Number(params.id), {
        title,
        author,
        description: description || undefined,
        published_year: publishedYear ? parseInt(publishedYear) : undefined,
        user_id: user.id
      }, user.id)

      router.push(`/books/${params.id}`)
    } catch (err) {
      console.error('Error updating book:', err)
      setError('書籍の更新に失敗しました。')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="text-center mt-8">読み込み中...</div>
  if (error) return (
    <Alert variant="destructive" className="mt-8 mx-4">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">書籍を編集</CardTitle>
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
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">著者</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">概要</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full"
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
                className="w-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? '更新中...' : '更新'}
            </Button>
            <Button 
              variant="outline" 
              asChild
              className="w-full sm:w-auto"
            >
              <Link href={`/books/${params.id}`}>キャンセル</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

