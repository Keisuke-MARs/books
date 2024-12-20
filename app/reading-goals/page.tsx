'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

interface ReadingGoal {
    id: number
    year: number
    targetBooks: number
}

export default function SetReadingGoal() {
    const [year, setYear] = useState(new Date().getFullYear())
    const [targetBooks, setTargetBooks] = useState('')
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // ここで実際のAPIにデータを送信します
        // 今回はモックデータを使用します
        const newGoal: ReadingGoal = {
            id: Date.now(),
            year,
            targetBooks: parseInt(targetBooks)
        }
        console.log('新しい読書目標:', newGoal)
        // 目標設定後、ダッシュボードにリダイレクトします
        router.push('/dashboard')
    }

    return (
        <Card className="max-w-2xl mx-auto">
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
                                {[...Array(5)].map((_, i) => (
                                    <SelectItem key={i} value={(new Date().getFullYear() + i).toString()}>
                                        {new Date().getFullYear() + i}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="targetBooks">目標冊数</Label>
                        <Input
                            id="targetBooks"
                            type="number"
                            min="1"
                            value={targetBooks}
                            onChange={(e) => setTargetBooks(e.target.value)}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit">目標を設定</Button>
                </CardFooter>
            </form>
        </Card>
    )
}

