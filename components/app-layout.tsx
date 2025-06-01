"use client"

import { useAuth } from '../contexts/auth-context' // Corrected import statement
import { usePathname, useRouter } from "next/navigation"
import { Nav } from './nav' // Corrected import statement
import { Header } from './header' // Corrected import statement
import { useEffect } from 'react'

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Redirect unauthenticated users to login page
  useEffect(() => {
    if (!loading && !isAuthenticated && pathname !== "/login") {
      router.replace("/login")
    }
  }, [isAuthenticated, loading, pathname, router])

  // Don't show nav/header on login page
  if (pathname === "/login") {
    return children
  }

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Show nav/header only when authenticated
  if (isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        <Header />
        <div className="flex">
          <aside className="fixed inset-y-0 left-0 w-64 mt-14 border-r bg-background">
            <Nav />
          </aside>
          <main className="flex-1 ml-64">
            <div className="container p-6 mt-14">
              {children}
            </div>
          </main>
        </div>
      </div>
    )
  }

  // This is a fallback, but should never be reached due to the redirect in useEffect
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p>Please log in to access this page</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => router.replace("/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  )
}
