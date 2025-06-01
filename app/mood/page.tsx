"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format, subDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
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
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts'

interface MoodEntry {
  id: string
  date: Date
  mood: number // 1-5
  energy: number // 1-5
  notes: string
}

const MOOD_LABELS = {
  1: 'Very Low',
  2: 'Low',
  3: 'Neutral',
  4: 'Good',
  5: 'Excellent'
}

const ENERGY_LABELS = {
  1: 'Exhausted',
  2: 'Tired',
  3: 'Moderate',
  4: 'Energetic',
  5: 'Very Energetic'
}

export default function MoodPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [mood, setMood] = useState<number>(3)
  const [energy, setEnergy] = useState<number>(3)
  const [notes, setNotes] = useState("")
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [trendData, setTrendData] = useState<any[]>([])
  const [correlationData, setCorrelationData] = useState<any[]>([])

  useEffect(() => {
    // Calculate trends over time
    const today = new Date()
    const trendStats = Array.from({ length: 7 }, (_, i) => {
      const day = subDays(today, 6 - i)
      const dayEntries = entries.filter(entry => 
        format(new Date(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      
      return {
        date: format(day, 'EEE'),
        mood: dayEntries.length ? dayEntries[0].mood : null,
        energy: dayEntries.length ? dayEntries[0].energy : null
      }
    })

    setTrendData(trendStats)

    // Calculate mood-energy correlation
    const correlationStats = entries.map(entry => ({
      mood: entry.mood,
      energy: entry.energy,
      z: 1,
      date: format(new Date(entry.date), 'MMM dd')
    }))

    setCorrelationData(correlationStats)
  }, [entries])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) return

    const newEntry: MoodEntry = {
      id: Math.random().toString(),
      date,
      mood,
      energy,
      notes: notes.trim()
    }

    setEntries([newEntry, ...entries])
    setMood(3)
    setEnergy(3)
    setNotes("")
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  const averageMood = entries.length 
    ? entries.reduce((acc, entry) => acc + entry.mood, 0) / entries.length 
    : 0

  const averageEnergy = entries.length 
    ? entries.reduce((acc, entry) => acc + entry.energy, 0) / entries.length 
    : 0

  const moodEnergyCorrelation = entries.length > 1
    ? entries.reduce((acc, entry) => acc + (entry.mood * entry.energy), 0) / entries.length
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mood & Energy Tracker</h1>
        <p className="text-muted-foreground">
          Monitor your daily mood and energy levels
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Average Mood</h3>
          <p className="text-2xl font-bold">{averageMood.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground">{MOOD_LABELS[Math.round(averageMood) as keyof typeof MOOD_LABELS]}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Average Energy</h3>
          <p className="text-2xl font-bold">{averageEnergy.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground">{ENERGY_LABELS[Math.round(averageEnergy) as keyof typeof ENERGY_LABELS]}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Total Entries</h3>
          <p className="text-2xl font-bold">{entries.length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            <Select 
              value={mood.toString()} 
              onValueChange={(value) => setMood(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MOOD_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={energy.toString()} 
              onValueChange={(value) => setEnergy(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select energy" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ENERGY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Add notes about your day..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />

          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Entry
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Weekly Trends</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  domain={[1, 5]} 
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(value) => {
                    if (value === 1) return 'Very Low'
                    if (value === 2) return 'Low'
                    if (value === 3) return 'Neutral'
                    if (value === 4) return 'Good'
                    if (value === 5) return 'Excellent'
                    return value
                  }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    const label = name === 'mood' ? MOOD_LABELS[value as keyof typeof MOOD_LABELS] : ENERGY_LABELS[value as keyof typeof ENERGY_LABELS]
                    return [label, name.charAt(0).toUpperCase() + name.slice(1)]
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#8884d8" 
                  name="Mood"
                  connectNulls
                  dot={true}
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#82ca9d" 
                  name="Energy"
                  connectNulls
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Mood-Energy Correlation</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="mood" 
                  name="Mood" 
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(value) => MOOD_LABELS[value as keyof typeof MOOD_LABELS].split(' ')[0]}
                />
                <YAxis 
                  dataKey="energy" 
                  name="Energy" 
                  domain={[1, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tickFormatter={(value) => ENERGY_LABELS[value as keyof typeof ENERGY_LABELS].split(' ')[0]}
                />
                <ZAxis 
                  dataKey="z" 
                  range={[50, 400]} 
                  name="frequency" 
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value: any, name: string) => {
                    if (name === 'Mood') return MOOD_LABELS[value as keyof typeof MOOD_LABELS]
                    if (name === 'Energy') return ENERGY_LABELS[value as keyof typeof ENERGY_LABELS]
                    return value
                  }}
                />
                <Legend />
                <Scatter 
                  name="Mood-Energy Pairs" 
                  data={correlationData} 
                  fill="#8884d8"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Mood Journal</h2>
        <div className="space-y-4">
          {entries.map(entry => (
            <Card key={entry.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="font-medium">Mood: </span>
                      <span>{MOOD_LABELS[entry.mood as keyof typeof MOOD_LABELS]}</span>
                    </div>
                    <div>
                      <span className="font-medium">Energy: </span>
                      <span>{ENERGY_LABELS[entry.energy as keyof typeof ENERGY_LABELS]}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{format(new Date(entry.date), "PPP")}</span>
                  </div>
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
              No entries yet. Start tracking your mood and energy!
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
