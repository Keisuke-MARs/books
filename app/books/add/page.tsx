'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createBook } from '@/lib/books'
import { useAuth } from '@/app/contexts/AuthContext'

export default function AddBook() {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [publishedYear, setPublishedYear] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('ログインしてください。')
      return
    }
    if (!title || !author) {
      setError('タイトルと著者は必須です���')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      await createBook({
        title,
        author,
        description: description || undefined,
        published_year: publishedYear ? parseInt(publishedYear) : undefined,
        user_id: user.id
      })
      router.push('/books')
    } catch (err) {
      setError('書籍の追加に失敗しました。')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>新しい書籍を追加</CardTitle>
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
              {isLoading ? '追加中...' : '追加'}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/books">キャンセル</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}
    </div>
  )
}

