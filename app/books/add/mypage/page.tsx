'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from '@/app/contexts/AuthContext'
import { getReadingStatistics, ReadingStatistics } from '@/lib/reading-statistics'

export default function MyPage() {
  const [statistics, setStatistics] = useState<ReadingStatistics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user, userProfile, updateUserProfile } = useAuth()

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        router.push('/login')
        return
      }
      try {
        setIsLoading(true)
        setError(null)
        const fetchedStatistics = await getReadingStatistics(user.id)
        setStatistics(fetchedStatistics)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました。')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [user, router])

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user || !userProfile) return
    try {
      setIsLoading(true)
      setError(null)
      const updatedProfile = await updateUserProfile(userProfile)
      if (updatedProfile) {
        alert('プロフィールが更新されました。')
      } else {
        throw new Error('プロフィールの更新に失敗しました。')
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err instanceof Error ? err.message : 'プロフィールの更新に失敗しました。')
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
  if (!userProfile || !statistics) return <div className="text-center mt-8">データが見つかりません。</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">マイページ</h1>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">プロフィール</TabsTrigger>
          <TabsTrigger value="statistics">読書統計</TabsTrigger>
          <TabsTrigger value="settings">設定</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>プロフィール情報</CardTitle>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">名前</Label>
                  <Input
                    id="name"
                    value={userProfile.name || ''}
                    onChange={(e) => updateUserProfile({...userProfile, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => updateUserProfile({...userProfile, email: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">自己紹介</Label>
                  <Input
                    id="bio"
                    value={userProfile.bio || ''}
                    onChange={(e) => updateUserProfile({...userProfile, bio: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">更新</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>読書統計</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>総読書冊数: {statistics.totalBooks}</p>
              <p>今月の読了本: {statistics.booksThisMonth}</p>
              <p>平均読書時間: {statistics.averageReadingTime} 分/日</p>
              <p>最も読んだジャンル: {statistics.topGenre}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>アカウント設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={userProfile.emailNotifications || false}
                  onChange={(e) => updateUserProfile({...userProfile, emailNotifications: e.target.checked})}
                  className="form-checkbox"
                />
                <Label htmlFor="emailNotifications">メール通知を受け取る</Label>
              </div>
              <Button
                onClick={() => {/* パスワ���ド変更ロジック */}}
                variant="outline"
              >
                パスワードを変更
              </Button>
              <Button
                onClick={() => {/* アカウント削除ロジック */}}
                variant="destructive"
              >
                アカウントを削除
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

