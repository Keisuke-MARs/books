/* eslint-disable @typescript-eslint/no-unused-vars */
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { AuthProvider } from '@/app/contexts/AuthContext'
import { NavBar } from '@/app/components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'オンライン書籍管理システム',
  description: '書籍の管理と読書記録を簡単に',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <NavBar />
          <main className="container mx-auto mt-8 px-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}

