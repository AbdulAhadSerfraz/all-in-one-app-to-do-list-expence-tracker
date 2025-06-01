"use client"

import { useState, useEffect } from "react"
import { 
  format, 
  subDays, 
  addDays, 
  differenceInMinutes, 
  parse, 
  startOfWeek,
  parseISO
} from "date-fns"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Plus, Trash2, Moon, Sun } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'

interface SleepEntry {
  id: string
  date: Date
  startTime: string
  endTime: string
  duration: number
  quality: 'poor' | 'fair' | 'good' | 'excellent'
  notes?: string
}

const QUALITY_COLORS = {
  poor: '#ef4444',
  fair: '#f59e0b',
  good: '#10b981',
  excellent: '#3b82f6'
}

export default function SleepPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [startTime, setStartTime] = useState("22:00")
  const [endTime, setEndTime] = useState("06:00")
  const [quality, setQuality] = useState<SleepEntry['quality']>("good")
  const [notes, setNotes] = useState("")
  const [entries, setEntries] = useState<SleepEntry[]>([])
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [qualityDistribution, setQualityDistribution] = useState<any[]>([])

  useEffect(() => {
    // Calculate weekly sleep patterns
    const startOfCurrentWeek = startOfWeek(new Date())
    const weeklyStats = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(startOfCurrentWeek, i)
      const dayEntries = entries.filter(entry => 
        format(new Date(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      
      return {
        date: format(day, 'EEE'),
        hours: dayEntries.reduce((sum, entry) => sum + (entry.duration / 60), 0)
      }
    })

    setWeeklyData(weeklyStats)

    // Calculate quality distribution
    const qualityStats = ['poor', 'fair', 'good', 'excellent'].map(q => ({
      name: q.charAt(0).toUpperCase() + q.slice(1),
      value: entries.filter(e => e.quality === q).length,
      color: QUALITY_COLORS[q as keyof typeof QUALITY_COLORS]
    }))

    setQualityDistribution(qualityStats)
  }, [entries])

  const calculateDuration = (start: string, end: string): number => {
    const startDate = parse(start, "HH:mm", new Date())
    const endDate = parse(end, "HH:mm", new Date())
    let duration = differenceInMinutes(endDate, startDate)
    if (duration < 0) duration += 24 * 60 // Add 24 hours if end time is next day
    return duration
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!startTime || !endTime) return

    const duration = calculateDuration(startTime, endTime)

    const newEntry: SleepEntry = {
      id: Math.random().toString(),
      date,
      startTime,
      endTime,
      duration,
      quality,
      notes: notes.trim()
    }

    setEntries([newEntry, ...entries])
    setNotes("")
    setQuality("good")
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  const totalSleepHours = entries.reduce((sum, entry) => sum + (entry.duration / 60), 0)
  const averageSleepHours = entries.length 
    ? Math.round((totalSleepHours / entries.length) * 10) / 10
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sleep Tracker</h1>
        <p className="text-muted-foreground">
          Track your sleep patterns and quality
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Total Entries</h3>
          <p className="text-2xl font-bold">{entries.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Total Sleep</h3>
          <p className="text-2xl font-bold">{Math.round(totalSleepHours)}h</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Average Sleep</h3>
          <p className="text-2xl font-bold">{averageSleepHours}h</p>
        </Card>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-4">
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

            <div className="flex gap-4">
              <div className="w-32">
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full"
                />
              </div>
              <span className="self-center">to</span>
              <div className="w-32">
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Select value={quality} onValueChange={(value: SleepEntry['quality']) => setQuality(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sleep quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="poor">Poor</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-20"
          />

          <Button type="submit" className="w-full md:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Add Sleep Entry
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Sleep Pattern</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value.toFixed(1)} hours`, 'Sleep Duration']} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="hours"
                  name="Sleep Duration"
                  stroke="#6366f1"
                  fill="#818cf8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Sleep Quality Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={qualityDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {qualityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} entries`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Sleep Log</h2>
        <div className="space-y-4">
          {entries.map(entry => (
            <Card key={entry.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), "PPP")}
                    </span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {entry.startTime} - {entry.endTime}
                    </span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(entry.duration / 60 * 10) / 10}h
                    </span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span 
                      className={cn(
                        "text-sm capitalize",
                        {
                          "text-red-600": entry.quality === "poor",
                          "text-yellow-600": entry.quality === "fair",
                          "text-green-600": entry.quality === "good",
                          "text-blue-600": entry.quality === "excellent",
                        }
                      )}
                    >
                      {entry.quality}
                    </span>
                  </div>
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground">{entry.notes}</p>
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
              No sleep entries yet. Start tracking your sleep!
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
