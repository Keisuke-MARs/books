'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getReadingRecord, updateReadingRecord, ReadingRecord } from '@/lib/reading-records'
import { getBooks, Book } from '@/lib/books'
import { useAuth } from '@/app/contexts/AuthContext'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EditReadingRecord() {
  const [books, setBooks] = useState<Book[]>([])
  const [record, setRecord] = useState<ReadingRecord | null>(null)
  const [selectedBookId, setSelectedBookId] = useState<string>('')
  const [status, setStatus] = useState<'未読' | '読書中' | '読了'>('未読')
  const [progress, setProgress] = useState<number>(0)
  const [thoughts, setThoughts] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchData() {
      if (!user || !params.id) {
        setError('ユーザー情報または読書記録IDが不足しています。')
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        setError(null)
        const [fetchedBooks, fetchedRecord] = await Promise.all([
          getBooks(user.id),
          getReadingRecord(Number(params.id), user.id)
        ])
        setBooks(fetchedBooks)
        if (fetchedRecord) {
          setRecord(fetchedRecord)
          setSelectedBookId(fetchedRecord.book_id.toString())
          setStatus(fetchedRecord.status)
          setProgress(fetchedRecord.progress)
          setThoughts(fetchedRecord.thoughts || '')
        } else {
          setError('指定された読書記録が見つかりません。')
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました。')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user, params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !record) {
      setError('ユーザー情報または読書記録が不足しています。')
      return
    }
    setIsLoading(true)
    setError(null)
    try {
      const bookId = parseInt(selectedBookId)
      if (isNaN(bookId)) {
        throw new Error('無効な書籍IDです。')
      }

      const progressValue = Number(progress)
      if (isNaN(progressValue) || progressValue < 0 || progressValue > 100) {
        throw new Error('進捗は0から100の間の数値を入力してください。')
      }

      await updateReadingRecord(record.id, {
        book_id: bookId,
        status,
        progress: progressValue,
        thoughts: thoughts || undefined,
        completed_at: status === '読了' ? new Date().toISOString() : null
      }, user.id)
      router.push('/reading-records')
    } catch (err) {
      console.error('Error updating reading record:', err)
      setError(err instanceof Error ? err.message : '読書記録の更新に失敗しました。')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (newStatus: '未読' | '読書中' | '読了') => {
    setStatus(newStatus);
    if (newStatus === '読了') {
      setProgress(100);
    } else if (newStatus === '未読') {
      setProgress(0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setProgress(value);
      if (value === 100) {
        setStatus('読了');
      } else if (value === 0) {
        setStatus('未読');
      } else {
        setStatus('読書中');
      }
    }
  };

  if (isLoading) return <div className="text-center mt-8">読み込み中...</div>
  if (error) return (
    <Alert variant="destructive" className="mt-8 mx-4">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )
  if (!record) return <div className="text-center mt-8">読書記録が見つかりません。</div>

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">読書記録の編集</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="book">書籍</Label>
              <Select 
                value={selectedBookId.toString()} 
                onValueChange={(value) => setSelectedBookId(value)}
              >
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
              <Select 
                value={status} 
                onValueChange={handleStatusChange}
              >
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
                onChange={handleProgressChange}
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
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? '更新中...' : '更新'}
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/reading-records">キャンセル</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

