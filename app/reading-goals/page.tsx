'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { createOrUpdateReadingGoal, getReadingGoal, testSupabaseConnection } from '@/lib/reading-goals'
import { useAuth } from '@/app/contexts/AuthContext'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SetReadingGoal() {
    const [year, setYear] = useState(new Date().getFullYear())
    const [targetBooks, setTargetBooks] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        async function fetchExistingGoal() {
            if (!user) {
                console.log('User not logged in, skipping goal fetch')
                return
            }
            try {
                setIsLoading(true)
                const isConnected = await testSupabaseConnection()
                if (!isConnected) {
                    throw new Error('Supabaseとの接続に失敗しました。')
                }
                const existingGoal = await getReadingGoal(user.id, year)
                if (existingGoal) {
                    setTargetBooks(existingGoal.target_books.toString())
                } else {
                    setTargetBooks('')
                }
            } catch (err) {
                console.error('Error fetching existing goal:', err)
                setError(err instanceof Error ? err.message : '目標の取得に失敗しました。')
            } finally {
                setIsLoading(false)
            }
        }
        fetchExistingGoal()
    }, [user, year])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            setError('ログインしてください。')
            return
        }
        setIsLoading(true)
        setError(null)
        try {
            const isConnected = await testSupabaseConnection()
            if (!isConnected) {
                throw new Error('Supabaseとの接続に失敗しました。')
            }
            const goal = {
                user_id: user.id,
                year,
                target_books: parseInt(targetBooks)
            }
            console.log('Submitting goal:', goal)
            const result = await createOrUpdateReadingGoal(goal)
            if (result === null) {
                throw new Error('読書目標の設定に失敗しました。')
            }
            router.push('/dashboard')
        } catch (err) {
            console.error('Error setting reading goal:', err)
            setError(err instanceof Error ? err.message : '読書目標の設定に失敗しました。')
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return (
            <Alert variant="destructive">
                <AlertDescription>ログインが必要です。</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>読書目標の設定</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="year">年</Label>
                            <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="年を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[...Array(5)].map((_, i) => {
                                        const yearOption = new Date().getFullYear() + i
                                        return (
                                            <SelectItem key={yearOption} value={yearOption.toString()}>
                                                {yearOption}年
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="targetBooks">目標冊数</Label>
                            <Input
                                id="targetBooks"
                                type="number"
                                value={targetBooks}
                                onChange={(e) => setTargetBooks(e.target.value)}
                                min="1"
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? '設定中...' : '目標を設定'}
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/dashboard')}>
                            キャンセル
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

