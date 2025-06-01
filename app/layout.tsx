import './globals.css'
import { Inter as FontSans } from 'next/font/google'
import { Toaster } from 'sonner'
import { ThemeProvider } from "components/theme-provider"
import { AuthProvider } from "contexts/auth-context"
import { ProfileProvider } from "contexts/profile-context"
import { AppLayout } from "components/app-layout"

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'HabitSync',
  description: 'Track your habits, expenses, and daily activities all in one place',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fontSans.variable} suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans antialiased ${fontSans.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ProfileProvider>
              <AppLayout>
                {children}
              </AppLayout>
              <Toaster />
            </ProfileProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
