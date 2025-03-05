'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/app/contexts/AuthContext'
import { Menu, X, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function NavBar() {
  const { user, userProfile, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="bg-blue-600 text-white">
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl sm:text-2xl font-bold">
            読書記録アプリ
          </Link>

          {/* ハンバーガーメニューボタン */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニュー"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* デスクトップメニュー */}
          <ul className="hidden md:flex space-x-4 items-center">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile?.avatar_url || ''} alt={userProfile?.name || user.email} />
                        <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userProfile?.name || user.email}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">ダッシュボード</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/books">書籍一覧</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/books/search">書籍検索</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/reading-records">読書記録</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/reading-goals">読書目標</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/mypage">マイページ</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      ログアウト
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <li><Link href="/login" className="hover:underline">ログイン</Link></li>
                <li><Link href="/signup" className="hover:underline">サインアップ</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden">
            <ul className="py-4 space-y-2">
              {user ? (
                <>
                  <li>
                    <Link 
                      href="/dashboard" 
                      className="block py-2 hover:bg-blue-700 px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ダッシュボード
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/books" 
                      className="block py-2 hover:bg-blue-700 px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      書籍一覧
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/books/search" 
                      className="block py-2 hover:bg-blue-700 px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      書籍検索
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/reading-records" 
                      className="block py-2 hover:bg-blue-700 px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      読書記録
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/reading-goals" 
                      className="block py-2 hover:bg-blue-700 px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      読書目標
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/mypage" 
                      className="block py-2 hover:bg-blue-700 px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      マイページ
                    </Link>
                  </li>
                  <li className="px-2 py-2">
                    <span className="block text-sm mb-2">{userProfile?.name || user.email}</span>
                    <Button 
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      variant="secondary"
                      className="w-full bg-white text-blue-600 hover:bg-blue-100"
                    >
                      ログアウト
                    </Button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/login" 
                      className="block py-2 hover:bg-blue-700 px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/signup" 
                      className="block py-2 hover:bg-blue-700 px-2 rounded"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      サインアップ
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  )
}

