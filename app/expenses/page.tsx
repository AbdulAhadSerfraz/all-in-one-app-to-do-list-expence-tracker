"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subMonths } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts'

const CATEGORIES = [
  "Food & Drinks",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Other"
] as const

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9A77CF']

interface Expense {
  id: string
  description: string
  amount: number
  date: Date
  category: typeof CATEGORIES[number]
}

export default function ExpensesPage() {
  const [date, setDate] = useState<Date>()
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState<typeof CATEGORIES[number]>("Other")
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [dailyData, setDailyData] = useState<any[]>([])

  useEffect(() => {
    // Calculate monthly trends
    const now = new Date()
    const monthStart = startOfMonth(subMonths(now, 5))
    const monthEnd = endOfMonth(now)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const monthlyStats = days.reduce((acc: any[], day) => {
      const dayExpenses = expenses.filter(expense => 
        format(new Date(expense.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      
      const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      
      if (total > 0) {
        acc.push({
          date: format(day, 'MMM dd'),
          amount: total
        })
      }
      
      return acc
    }, [])

    setMonthlyData(monthlyStats)

    // Calculate category distribution
    const categoryStats = CATEGORIES.map(cat => {
      const catExpenses = expenses.filter(exp => exp.category === cat)
      return {
        name: cat,
        value: catExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      }
    }).filter(stat => stat.value > 0)

    setCategoryData(categoryStats)

    // Calculate daily spending patterns
    const dailyStats = Array.from({ length: 24 }, (_, hour) => {
      const hourExpenses = expenses.filter(exp => 
        new Date(exp.date).getHours() === hour
      )
      
      return {
        hour: `${hour}:00`,
        amount: hourExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      }
    })

    setDailyData(dailyStats)
  }, [expenses])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim() || !amount || !date) return

    const newExpense: Expense = {
      id: Math.random().toString(),
      description: description.trim(),
      amount: parseFloat(amount),
      date,
      category
    }

    setExpenses([newExpense, ...expenses])
    setDescription("")
    setAmount("")
    setDate(undefined)
    setCategory("Other")
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const averageExpense = expenses.length ? totalExpenses / expenses.length : 0
  const maxExpense = expenses.length ? Math.max(...expenses.map(exp => exp.amount)) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <p className="text-muted-foreground">
          Track and analyze your spending
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Total Expenses</h3>
          <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Average Expense</h3>
          <p className="text-2xl font-bold">${averageExpense.toFixed(2)}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Highest Expense</h3>
          <p className="text-2xl font-bold">${maxExpense.toFixed(2)}</p>
        </Card>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={category} onValueChange={(value: typeof CATEGORIES[number]) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: $${entry.value.toFixed(2)}`}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  name="Spending"
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Expenses</h2>
        <div className="space-y-4">
          {expenses.map(expense => (
            <Card key={expense.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{expense.description}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{format(new Date(expense.date), "PPP")}</span>
                    <span>•</span>
                    <span>{expense.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold">${expense.amount.toFixed(2)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteExpense(expense.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          {expenses.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No expenses yet. Add some expenses to see them here!
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
