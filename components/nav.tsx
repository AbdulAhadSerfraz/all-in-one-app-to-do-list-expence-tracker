"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "lib/utils"
import { Button } from "components/ui/button"
import { 
  LayoutDashboard, 
  ListTodo, 
  Receipt, 
  Moon, 
  Utensils, 
  BookOpen,
  BarChart3,
  Settings,
  UserCircle2
} from "lucide-react"

export function Nav() {
  const pathname = usePathname()
  
  const mainRoutes = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/tasks/new",
      label: "Tasks",
      icon: ListTodo,
    },
    {
      href: "/expenses",
      label: "Expenses",
      icon: Receipt,
    },
    {
      href: "/sleep",
      label: "Sleep",
      icon: Moon,
    },
    {
      href: "/calories",
      label: "Calories",
      icon: Utensils,
    },
    {
      href: "/journal",
      label: "Journal",
      icon: BookOpen,
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
  ]

  const bottomRoutes = [
    {
      href: "/profile",
      label: "Profile",
      icon: UserCircle2,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true
    if (href !== "/" && pathname?.startsWith(href)) return true
    return false
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <span className="font-bold text-xl">HabitSync</span>
      </div>
      <div className="flex-1 py-4 px-3">
        <div className="space-y-1">
          {mainRoutes.map((route) => (
            <Link key={route.href} href={route.href}>
              <Button
                variant={isActive(route.href) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2 font-normal",
                  isActive(route.href) && "bg-muted"
                )}
                size="sm"
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <div className="p-3 border-t">
        {bottomRoutes.map((route) => (
          <Link key={route.href} href={route.href}>
            <Button
              variant={isActive(route.href) ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2 font-normal mb-1",
                isActive(route.href) && "bg-muted"
              )}
              size="sm"
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}
