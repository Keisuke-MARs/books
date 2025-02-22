import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/app/contexts/AuthContext'
import { NavBar } from '@/app/components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'オンライン読書記録システム',
  description: '書籍の管理と読書記録を簡単に',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="min-h-screen">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow container mx-auto py-8">
              {children}
            </main>
            <footer className="mt-auto py-4 text-center text-sm text-gray-600 border-t">
              <p>© 2024 オンライン読書記録システム</p>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

