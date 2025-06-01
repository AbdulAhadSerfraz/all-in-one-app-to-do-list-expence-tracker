"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart,
  Calendar,
  DollarSign,
  Home,
  Moon,
  Pencil,
  Timer,
  ListTodo
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Expenses', href: '/expenses', icon: DollarSign },
  { name: 'Sleep', href: '/sleep', icon: Moon },
  { name: 'Mood & Energy', href: '/mood', icon: Timer },
  { name: 'Calories', href: '/calories', icon: Calendar },
  { name: 'Journal', href: '/journal', icon: Pencil },
  { name: 'To-Do', href: '/todo', icon: ListTodo },
  { name: 'Insights', href: '/insights', icon: BarChart },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-semibold">HabitSync</h1>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md
                ${isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
