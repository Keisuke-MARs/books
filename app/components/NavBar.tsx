'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useAuth } from '@/app/contexts/AuthContext'

export function NavBar() {
    const { user, logout } = useAuth()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <header className="bg-blue-600 p-4 text-white">
            <nav className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">書籍管理</Link>
                <ul className="flex space-x-4 items-center">
                    {user ? (
                        <>
                            <li><Link href="/dashboard" className="hover:underline">ダッシュボード</Link></li>
                            <li><Link href="/books" className="hover:underline">書籍一覧</Link></li>
                            <li><Link href="/books/search" className="hover:underline">書籍検索</Link></li>
                            <li><Link href="/reading-records" className="hover:underline">読書記録</Link></li>
                            <li><Link href="/reading-goals" className="hover:underline">読書目標</Link></li>
                            <li>
                                <span className="mr-4">{user.email}</span>
                            </li>
                            <li>
                                <Button
                                    onClick={logout}
                                    variant="secondary"
                                    className="bg-white text-blue-600 hover:bg-blue-100"
                                >
                                    ログアウト
                                </Button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link href="/login" className="hover:underline">ログイン</Link></li>
                            <li><Link href="/signup" className="hover:underline">サインアップ</Link></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    )
}

