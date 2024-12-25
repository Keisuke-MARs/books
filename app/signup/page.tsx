<<<<<<< HEAD
=======
/* eslint-disable @typescript-eslint/no-explicit-any */
>>>>>>> 87e720237d2951c9c18452385551de5fb0fd2b49
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from '@/app/contexts/AuthContext'

export default function Signup() {
<<<<<<< HEAD
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      await signup(email, password)
      setSuccess('アカウントが作成されました。確認メールをご確認ください。')
      // 成功後、3秒後にログインページへリダイレクト
      setTimeout(() => router.push('/login'), 3000)
    } catch (error: any) {
      console.error('サインアップエラー:', error)
      if (error.message.includes('For security purposes, you can only request this after')) {
        setError('セキュリティのため、しばらく待ってから再度お試しください。')
      } else {
        setError('アカウントの作成に失敗しました。もう一度お試しください。')
      }
    } finally {
      setIsLoading(false)
=======
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { signup } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setIsLoading(true)

        try {
            await signup(email, password)
            setSuccess('アカウントが作成されました。確認メールをご確認ください。')
            // 成功後、3秒後にログインページへリダイレクト
            setTimeout(() => router.push('/login'), 3000)
        } catch (error: any) {
            console.error('サインアップエラー:', error)
            if (error.message.includes('For security purposes, you can only request this after')) {
                setError('セキュリティのため、しばらく待ってから再度お試しください。')
            } else {
                setError('アカウントの作成に失敗しました。もう一度お試しください。')
            }
        } finally {
            setIsLoading(false)
        }
>>>>>>> 87e720237d2951c9c18452385551de5fb0fd2b49
    }
  }

<<<<<<< HEAD
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>アカウント作成</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">名前</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '処理中...' : 'アカウント作成'}
            </Button>
            <Link href="/login" className="text-sm text-blue-600 hover:underline">
              ログイン
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

=======
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>アカウント作成</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="mb-4">
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">名前</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">メールアドレス</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">パスワード</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? '処理中...' : 'アカウント作成'}
                        </Button>
                        <Link href="/login" className="text-sm text-blue-600 hover:underline">
                            ログイン
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
>>>>>>> 87e720237d2951c9c18452385551de5fb0fd2b49
