'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getReadingRecords, ReadingRecord, testSupabaseConnection } from '@/lib/reading-records'
import { useAuth } from '@/app/contexts/AuthContext'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ReadingRecords() {
  const [records, setRecords] = useState<ReadingRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    async function fetchReadingRecords() {
      if (!user) {
        console.log('No user logged in, skipping reading records fetch')
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        
        // Test Supabase connection
        const isConnected = await testSupabaseConnection()
        if (!isConnected) {
          throw new Error('Failed to connect to the database. Please try again later.')
        }

        const fetchedRecords = await getReadingRecords(user.id)
        setRecords(fetchedRecords)
      } catch (err) {
        console.error('Error fetching reading records:', err)
        setError(err instanceof Error ? err.message : '読書記録の取得に失敗しました。')
      } finally {
        setIsLoading(false)
      }
    }

    fetchReadingRecords()
  }, [user])

  const getStatusColor = (status: ReadingRecord['status']) => {
    switch (status) {
      case '未読': return 'bg-gray-500'
      case '読書中': return 'bg-blue-500'
      case '読了': return 'bg-green-500'
    }
  }

  if (isLoading) return <div className="text-center mt-8">読み込み中...</div>
  if (!user) return (
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
        <h2 className="text-3xl font-bold tracking-tight">読書記録一覧</h2>
        <Button asChild>
          <Link href="/reading-records/add">新規記録追加</Link>
        </Button>
      </div>
      {records.length === 0 ? (
        <p className="text-center mt-4">読書記録がありません。</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>書籍タイトル</TableHead>
              <TableHead>状態</TableHead>
              <TableHead>進捗</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.books?.title || '不明な本'}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(record.status)}>{record.status}</Badge>
                </TableCell>
                <TableCell>{record.progress}%</TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm" className="mr-2">
                    <Link href={`/books/${record.book_id}`}>詳細</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/reading-records/${record.id}/edit`}>編集</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

