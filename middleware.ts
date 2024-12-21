import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // セッションの更新を試みる
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const isAuthPage = req.nextUrl.pathname.startsWith('/login') ||
        req.nextUrl.pathname.startsWith('/signup')
    const isPublicPage = req.nextUrl.pathname === '/'
    const isAuthCallback = req.nextUrl.pathname.startsWith('/auth/callback')

    // 認証コールバックページは常に許可
    if (isAuthCallback) {
        return res
    }

    // 未認証ユーザーの保護されたページへのアクセスを制限
    if (!session && !isAuthPage && !isPublicPage) {
        return NextResponse.redirect(new URL('/login', req.url))
    }

    // 認証済みユーザーの認証ページへのアクセスをリダイレクト
    if (session && isAuthPage) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    return res
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

