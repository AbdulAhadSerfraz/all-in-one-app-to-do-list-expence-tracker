"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
// import { supabase } from '@/lib/supabase'

type DashboardData = {
  tasks: {
    total: number
    completed: number
    urgent: number
  }
  expenses: {
    today: number
    budget: number
    remaining: number
  }
  sleep: {
    lastNight: number
    target: number
  }
  calories: {
    today: number
    target: number
    remaining: number
  }
  recentTasks: Array<{
    id: string
    title: string
    due: string
    priority: 'high' | 'medium' | 'low'
  }>
  upcomingExpenses: Array<{
    id: string
    title: string
    amount: number
    due: string
  }>
}

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return

      try {
        // Fetch tasks
        // const { data: tasks } = await supabase
        //   .from('tasks')
        //   .select('*')
        //   .eq('userId', user.id)
        //   .order('due', { ascending: true })
        //   .limit(3)

        // Fetch expenses
        // const { data: expenses } = await supabase
        //   .from('expenses')
        //   .select('*')
        //   .eq('userId', user.id)
        //   .order('date', { ascending: true })
        //   .limit(2)

        // Transform data
        const dashboardData: DashboardData = {
          tasks: {
            total: 0,
            completed: 0,
            urgent: 0
          },
          expenses: {
            today: 0,
            budget: 0,
            remaining: 0
          },
          sleep: {
            lastNight: 0,
            target: 0
          },
          calories: {
            today: 0,
            target: 0,
            remaining: 0
          },
          recentTasks: [],
          upcomingExpenses: []
        }

        // Only update with real data if we have it
        // if (tasks) {
        //   dashboardData.tasks = {
        //     total: tasks.length,
        //     completed: tasks.filter(t => t.completed).length,
        //     urgent: tasks.filter(t => t.priority === 'high').length
        //   }
        //   dashboardData.recentTasks = tasks.map(task => ({
        //     id: task.id,
        //     title: task.title,
        //     due: new Date(task.due).toLocaleDateString(),
        //     priority: task.priority
        //   }))
        // }

        // if (expenses) {
        //   const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
        //   dashboardData.expenses = {
        //     today: totalExpenses,
        //     budget: 0,
        //     remaining: 0
        //   }
        //   dashboardData.upcomingExpenses = expenses.map(expense => ({
        //     id: expense.id,
        //     title: expense.description,
        //     amount: expense.amount,
        //     due: new Date(expense.date).toLocaleDateString()
        //   }))
        // }

        setData(dashboardData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (authLoading || loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="mt-4">
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-2 w-full bg-gray-200 rounded animate-pulse mt-4" />
                <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mt-4" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your daily overview and quick actions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Tasks Progress</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold">{data.tasks.completed}/{data.tasks.total}</p>
            <Progress value={data.tasks.total ? (data.tasks.completed / data.tasks.total) * 100 : 0} className="mt-2" />
          <p className="mt-2 text-sm text-muted-foreground">
            {data.tasks.urgent} 'urgent tasks remaining'
          </p>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Today's Budget</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold">${data.expenses.remaining}</p>
            <Progress value={data.expenses.budget ? (data.expenses.remaining / data.expenses.budget) * 100 : 0} className="mt-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              Spent ${data.expenses.today} today
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Sleep Goal</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold">{data.sleep.lastNight}h</p>
            <Progress value={data.sleep.target ? (data.sleep.lastNight / data.sleep.target) * 100 : 0} className="mt-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              Target: {data.sleep.target}h per night
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Calories Today</h3>
          <div className="mt-2">
            <p className="text-2xl font-bold">{data.calories.remaining}</p>
            <Progress value={data.calories.target ? ((data.calories.target - data.calories.remaining) / data.calories.target) * 100 : 0} className="mt-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              {data.calories.today} of {data.calories.target} consumed
            </p>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Recent Tasks</h3>
            <Link href="/tasks">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {data.recentTasks.length > 0 ? (
              data.recentTasks.map(task => (
                <div key={task.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {task.due}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No tasks yet</p>
            )}
            <Button
              asChild
              className="w-full mt-4 gap-2"
            >
              <Link href="/tasks">
                <Plus className="h-4 w-4" />
                Add New Task
              </Link>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Upcoming Expenses</h3>
            <Link href="/expenses">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {data.upcomingExpenses.length > 0 ? (
              data.upcomingExpenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{expense.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {expense.due}</p>
                  </div>
                  <p className="font-medium">${expense.amount}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No expenses yet</p>
            )}
            <Button
              asChild
              className="w-full mt-4 gap-2"
            >
              <Link href="/expenses">
                <Plus className="h-4 w-4" />
                Add New Expense
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
