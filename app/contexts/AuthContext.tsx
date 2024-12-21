/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Session, User, AuthError } from '@supabase/supabase-js'

interface AuthContextType {
    user: User | null
    session: Session | null
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    signup: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClientComponentClient()

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // セッションの取得
                const { data: { session }, error } = await supabase.auth.getSession()
                if (error) throw error

                if (session) {
                    setSession(session)
                    setUser(session.user)
                }
            } catch (error) {
                console.error('Error initializing auth:', error)
            } finally {
                setLoading(false)
            }
        }

        initializeAuth()

        // Auth状態の変更を監視
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session)
            setSession(session)
            setUser(session?.user ?? null)

            // セッションが切れた場合の処理
            if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
                setSession(null)
                setUser(null)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [supabase.auth])

    const login = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) throw error

            // ログイン成功時の処理
            setSession(data.session)
            setUser(data.user)
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            // ログアウト成功時の処理
            setSession(null)
            setUser(null)
        } catch (error) {
            console.error('Logout error:', error)
            throw error
        }
    }

    const signup = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error

            // サインアップ成功の処理
            console.log('Signup successful:', data)
        } catch (error) {
            console.error('Signup error:', error)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, session, login, logout, signup }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

