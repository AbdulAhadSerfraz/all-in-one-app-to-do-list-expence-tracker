'use client'

import { createContext, useContext, useEffect, useState } from 'react'

// Temporary user type until we implement Supabase
interface TempUser {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: TempUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TempUser | null>(null)
  const [loading, setLoading] = useState(false)

  // Temporary authentication functions
  const signUp = async (email: string, password: string) => {
    // For now, just create a temporary user
    setUser({
      id: 'temp-id',
      email,
      name: email.split('@')[0]
    })
  }

  const signIn = async (email: string, password: string) => {
    // For now, just create a temporary user
    setUser({
      id: 'temp-id',
      email,
      name: email.split('@')[0]
    })
  }

  const signOut = async () => {
    setUser(null)
  }

  const signInWithGoogle = async () => {
    // Placeholder for Google sign-in
    console.log('Google sign-in not implemented yet')
  }

  const signInWithApple = async () => {
    // Placeholder for Apple sign-in
    console.log('Apple sign-in not implemented yet')
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithApple,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
