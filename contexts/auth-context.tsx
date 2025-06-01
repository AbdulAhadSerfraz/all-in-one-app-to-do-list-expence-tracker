"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// import { supabase } from '../lib/supabase' // Commented out Supabase
// import { Session } from '@supabase/supabase-js' // Commented out Supabase
import { toast } from 'sonner'

type User = {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
}

type AuthContextType = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<{ success: boolean, error?: string }>
  signOut: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper functions for localStorage
const USERS_KEY = 'app_users'
const CURRENT_USER_KEY = 'current_user'

function getUsers(): { [email: string]: { password: string, user: User } } {
  if (typeof window === 'undefined') return {}
  return JSON.parse(localStorage.getItem(USERS_KEY) || '{}')
}

function saveUsers(users: { [email: string]: { password: string, user: User } }) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null
  const userJson = localStorage.getItem(CURRENT_USER_KEY)
  return userJson ? JSON.parse(userJson) : null
}

function saveCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state from localStorage
  useEffect(() => {
    setLoading(true)
    const savedUser = getCurrentUser()
    if (savedUser) {
      setUser(savedUser)
      router.replace('/dashboard')
    }
    setLoading(false)
  }, [router])

  const signIn = async (email: string, password: string) => {
    console.log('[AuthContext] Attempting sign in...')
    try {
      const users = getUsers()
      const userRecord = users[email]

      if (!userRecord || userRecord.password !== password) {
        throw new Error('Invalid email or password')
      }

      setUser(userRecord.user)
      saveCurrentUser(userRecord.user)
      toast.success('Successfully signed in!')
      router.replace('/dashboard')
    } catch (error) {
      console.error('[AuthContext] Sign in error:', error)
      toast.error('Error signing in: ' + (error as Error).message)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const users = getUsers()
      if (users[email]) {
        throw new Error('Email already registered')
      }

      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        name: null,
        avatar_url: null
      }

      users[email] = { password, user: newUser }
      saveUsers(users)
      setUser(newUser)
      saveCurrentUser(newUser)

      toast.success('Account created successfully!')
      router.replace('/dashboard')
      return { success: true }
    } catch (error) {
      const errorMessage = (error as Error).message
      toast.error('Error signing up: ' + errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      setUser(null)
      saveCurrentUser(null)
      router.replace('/login')
    } catch (error) {
      toast.error('Error signing out: ' + (error as Error).message)
      throw error
    }
  }

  const logout = signOut

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
