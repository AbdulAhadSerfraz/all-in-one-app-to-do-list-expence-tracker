// Removed Supabase auth callback, using localStorage auth instead
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  
  // With localStorage auth, we don't need code exchange
  // Just redirect to dashboard
  
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
}
