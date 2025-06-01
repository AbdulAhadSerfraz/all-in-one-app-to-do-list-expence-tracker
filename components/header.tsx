"use client"

import { Bell, LogOut } from 'lucide-react'
import { Button } from "components/ui/button"
import { useAuth } from "contexts/auth-context"

export function Header() {
  const { logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 h-14 border-b bg-background z-50">
      <div className="container h-full flex items-center justify-between">
        <h2 className="font-semibold">Welcome back!</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
