// Supabase middleware removed. Placeholder for localStorage-based auth or other middleware logic.

// Example: Add localStorage-based auth checks here if needed in the future.

export default function middleware() {}

// Specify which routes to run the middleware on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
