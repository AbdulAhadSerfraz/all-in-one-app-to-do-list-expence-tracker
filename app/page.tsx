"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      const isLoggedIn = typeof window !== 'undefined' && 
        localStorage.getItem('current_user') !== null;
      
      router.replace(isLoggedIn ? '/dashboard' : '/login');
    } catch (err) {
      console.error('Navigation error:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      // Fallback to login page if there's an error
      router.replace('/login');
    }
  }, [router])

  // Show an error state instead of white screen
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-red-600">Something went wrong:</h2>
          <pre className="p-3 mb-4 overflow-auto text-sm bg-gray-100 rounded">
            {error.message}
          </pre>
          <button
            onClick={() => router.replace('/login')}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Loading state instead of null
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to HabitSync</h1>
        <p className="mt-2 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
