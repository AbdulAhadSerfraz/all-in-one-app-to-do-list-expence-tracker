"use client"

import { useState, useEffect } from "react"
import { format, startOfWeek, addDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

interface CalorieEntry {
  id: string
  date: Date
  calories: number
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  notes?: string
}

const MEAL_COLORS = {
  breakfast: '#f97316',
  lunch: '#22c55e',
  dinner: '#3b82f6',
  snack: '#8b5cf6'
}

export default function CaloriesPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [calories, setCalories] = useState("")
  const [mealType, setMealType] = useState<CalorieEntry['mealType']>("breakfast")
  const [notes, setNotes] = useState("")
  const [entries, setEntries] = useState<CalorieEntry[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [mealDistribution, setMealDistribution] = useState<any[]>([])

  useEffect(() => {
    // Calculate weekly calorie intake
    const startOfCurrentWeek = startOfWeek(new Date())
    const weeklyStats = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(startOfCurrentWeek, i)
      const dayEntries = entries.filter(entry => 
        format(new Date(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      
      return {
        date: format(day, 'EEE'),
        calories: dayEntries.reduce((sum, entry) => sum + entry.calories, 0)
      }
    })

    setWeeklyData(weeklyStats)

    // Calculate meal type distribution
    const mealStats = ['breakfast', 'lunch', 'dinner', 'snack'].map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: entries.filter(e => e.mealType === type).reduce((sum, entry) => sum + entry.calories, 0),
      color: MEAL_COLORS[type as keyof typeof MEAL_COLORS]
    }))

    setMealDistribution(mealStats)
  }, [entries])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!calories || isNaN(Number(calories))) return

    const newEntry: CalorieEntry = {
      id: Math.random().toString(),
      date,
      calories: Number(calories),
      mealType,
      notes: notes.trim() || undefined
    }

    setEntries([newEntry, ...entries])
    setCalories("")
    setMealType("breakfast")
    setNotes("")
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0)
  const averageCalories = entries.length 
    ? Math.round(totalCalories / entries.length) 
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calorie Tracker</h1>
        <p className="text-muted-foreground">
          Monitor your daily calorie intake
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Total Calories</h3>
          <p className="text-2xl font-bold">{totalCalories}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Average per Entry</h3>
          <p className="text-2xl font-bold">{averageCalories}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Total Entries</h3>
          <p className="text-2xl font-bold">{entries.length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Calories</label>
              <Input
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="Enter calories"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Meal Type</label>
              <Select value={mealType} onValueChange={(value: CalorieEntry['mealType']) => setMealType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes..."
            />
          </div>

          <div className="flex gap-4">
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
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button type="submit" className="flex-1">
              <Plus className="mr-2 h-4 w-4" /> Add Entry
            </Button>
          </div>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Calorie Intake</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value} calories`, 'Calories']} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="calories"
                  name="Calories"
                  stroke="#6366f1"
                  fill="#8884d8"
                  dot={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Meal Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mealDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {mealDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} calories`, 'Calories']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Calorie Log</h2>
        <div className="space-y-4">
          {entries.map(entry => (
            <Card key={entry.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{entry.calories} calories</span>
                    <span className="text-sm text-muted-foreground capitalize">• {entry.mealType}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(entry.date), "PPP")}
                  </p>
                  {entry.notes && (
                    <p className="mt-2 text-sm">{entry.notes}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEntry(entry.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          {entries.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No calorie entries yet. Start tracking your meals!
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
