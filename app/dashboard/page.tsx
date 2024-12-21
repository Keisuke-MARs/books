'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import Link from 'next/link'
import { getReadingRecords, ReadingRecord } from '@/lib/reading-records'
import { getReadingGoal, ReadingGoal, testSupabaseConnection } from '@/lib/reading-goals'
import { useAuth } from '@/app/contexts/AuthContext'
import { Alert, AlertDescription } from "@/components/ui/alert"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

export default function Dashboard() {
    const [readingRecords, setReadingRecords] = useState<ReadingRecord[]>([])
    const [readingGoal, setReadingGoal] = useState<ReadingGoal | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()

    useEffect(() => {
        async function fetchData() {
            if (!user) {
                console.log('User not logged in, skipping data fetch')
                setIsLoading(false)
                return
            }
            try {
                setIsLoading(true)

                console.log('Testing Supabase connection...')
                const isConnected = await testSupabaseConnection()
                if (!isConnected) {
                    throw new Error('Supabaseとの接続に失敗しました。')
                }
                console.log('Supabase connection test passed')

                console.log('Fetching reading records and goal...')
                const [fetchedRecords, fetchedGoal] = await Promise.all([
                    getReadingRecords(),
                    getReadingGoal(user.id, new Date().getFullYear())
                ])
                console.log('Fetched reading records:', fetchedRecords)
                console.log('Fetched reading goal:', fetchedGoal)
                setReadingRecords(fetchedRecords)
                setReadingGoal(fetchedGoal)
            } catch (err) {
                console.error('Error fetching dashboard data:', err)
                setError(err instanceof Error ? err.message : 'データの取得に失敗しました。')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [user])

    const statusData = {
        labels: ['未読', '読書中', '読了'],
        datasets: [
            {
                data: [
                    readingRecords.filter(record => record.status === '未読').length,
                    readingRecords.filter(record => record.status === '読書中').length,
                    readingRecords.filter(record => record.status === '読了').length,
                ],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
        ],
    }

    const monthlyCompletedBooks = readingRecords
        .filter(record => record.status === '読了' && record.completed_at)
        .reduce((acc, record) => {
            const month = new Date(record.completed_at!).toLocaleString('default', { month: 'long' })
            acc[month] = (acc[month] || 0) + 1
            return acc
        }, {} as Record<string, number>)

    const monthlyData = {
        labels: Object.keys(monthlyCompletedBooks),
        datasets: [
            {
                label: '読了本数',
                data: Object.values(monthlyCompletedBooks),
                backgroundColor: '#36A2EB',
            },
        ],
    }

    const completedBooksCount = readingRecords.filter(record => record.status === '読了').length
    const goalProgress = readingGoal ? (completedBooksCount / readingGoal.target_books) * 100 : 0

    if (isLoading) return <div className="text-center mt-8">読み込み中...</div>
    if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">読書統計ダッシュボード</h1>
            {readingGoal ? (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>{readingGoal.year}年の読書目標</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-2">目標: {readingGoal.target_books}冊</p>
                        <p className="mb-2">達成: {completedBooksCount}冊</p>
                        <Progress value={goalProgress} className="w-full" />
                        <p className="mt-2">{goalProgress.toFixed(1)}% 達成</p>
                    </CardContent>
                </Card>
            ) : (
                <Card className="mb-6">
                    <CardContent>
                        <p>読書目標が設定されていません。</p>
                        <Button asChild className="mt-2">
                            <Link href="/reading-goals">目標を設定する</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>読書状態別の本の数</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Pie data={statusData} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>月ごとの読了本数</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Bar
                            data={monthlyData}
                            options={{
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1
                                        }
                                    }
                                }
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>最近の読書記録</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {readingRecords.slice(0, 5).map(record => (
                            <li key={record.id} className="flex justify-between items-center">
                                <span>{record.book_id}</span>
                                <span className={`px-2 py-1 rounded-full text-sm ${record.status === '未読' ? 'bg-red-200 text-red-800' :
                                        record.status === '読書中' ? 'bg-blue-200 text-blue-800' :
                                            'bg-green-200 text-green-800'
                                    }`}>
                                    {record.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <Link href="/reading-records" className="block mt-4 text-blue-600 hover:underline">
                        すべての読書記録を見る
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}

