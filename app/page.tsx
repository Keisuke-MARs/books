'use client'

import Link from 'next/link'
import { FC } from 'react'

const Home: FC = () => {
  return (
    <div className='space-y-6 p-4'>
      <h1 className='text-2xl sm:text-3xl font-bold text-center'>
        オンライン読書記録システムへようこそ
      </h1>
      <div className='grid gap-4 md:grid-cols-2 max-w-4xl mx-auto'>
        <div className='bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-xl hover:scale-105'>
          <h2 className='text-lg sm:text-xl font-semibold mb-2'>書籍管理</h2>
          <p className='mb-4 text-sm sm:text-base'>あなたの読書リストを管理します</p>
          <Link
            href="/books"
            className='text-blue-600 hover:text-blue-800 hover:underline transition duration-300 ease-in-out'
          >
            書籍一覧を見る →
          </Link>
        </div>
        <div className='bg-white p-6 rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-xl hover:scale-105'>
          <h2 className='text-lg sm:text-xl font-semibold mb-2'>読書記録</h2>
          <p className='mb-4 text-sm sm:text-base'>あなたの読書の進捗を記録します</p>
          <Link
            href="/reading-records"
            className='text-blue-600 hover:text-blue-800 hover:underline transition duration-300 ease-in-out'
          >
            読書記録を管理する →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

