'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Session, User, AuthError } from '@supabase/supabase-js'
import { Database } from '../../types/supabase'

export interface UserProfile {
  id: string
  email: string
  name?: string
  bio?: string
  avatar_url?: string
  emailNotifications?: boolean
}

interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: UserProfile | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  getUserProfile: () => Promise<void>
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<UserProfile | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (session) {
          setSession(session)
          setUser(session.user)
          await getUserProfile()
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session)
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await getUserProfile()
      } else {
        setUserProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      setSession(data.session)
      setUser(data.user)
      await getUserProfile()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setSession(null)
      setUser(null)
      setUserProfile(null)
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

      console.log('Signup successful:', data)
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const getUserProfile = async () => {
    try {
      if (!user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setUserProfile(data as UserProfile)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      if (!user) return null

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      const updatedProfile = data as UserProfile
      setUserProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      console.error('Error updating user profile:', error)
      return null
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, userProfile, login, logout, signup, getUserProfile, updateUserProfile }}>
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

