'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { createReadingRecord } from '@/lib/reading-records'
import { getBooks, Book } from '@/lib/books'
import { useAuth } from '@/app/contexts/AuthContext'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AddReadingRecord() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBookId, setSelectedBookId] = useState<string>('')
  const [status, setStatus] = useState<'未読' | '読書中' | '読了'>('未読')
  const [progress, setProgress] = useState<number>(0)
  const [thoughts, setThoughts] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchBooks() {
      if (!user) return
      try {
        const fetchedBooks = await getBooks(user.id)
        setBooks(fetchedBooks)
      } catch (err) {
        console.error('書籍の取得に失敗しました:', err)
        setError('書籍の取得に失敗しました。')
      }
    }
    fetchBooks()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError('ログインしてください。')
      return
    }
    if (!selectedBookId) {
      setError('書籍を選択してください。')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      await createReadingRecord({
          book_id: parseInt(selectedBookId),
          user_id: user.id,
          status,
          progress,
          thoughts: thoughts || undefined,
          completed_at: status === '読了' ? new Date().toISOString() : undefined,
          created_at: ''
      })
      router.push('/reading-records')
    } catch (err) {
      setError('読書記録の追加に失敗しました。')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>新しい読書記録を追加</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="book">書籍</Label>
              <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                <SelectTrigger>
                  <SelectValue placeholder="書籍を選択" />
                </SelectTrigger>
                <SelectContent>
                  {books.map((book) => (
                    <SelectItem key={book.id} value={book.id.toString()}>
                      {book.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">読書状態</Label>
              <Select value={status} onValueChange={(value: '未読' | '読書中' | '読了') => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="読書状態を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="未読">未読</SelectItem>
                  <SelectItem value="読書中">読書中</SelectItem>
                  <SelectItem value="読了">読了</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">進捗 (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thoughts">感想</Label>
              <Textarea
                id="thoughts"
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '追加中...' : '追加'}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/reading-records">キャンセル</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

