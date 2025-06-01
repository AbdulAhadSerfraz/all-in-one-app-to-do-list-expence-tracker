"use client"

import { useState, useEffect } from "react"
import { format, startOfWeek, addDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Plus, Trash2, Search } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

interface JournalEntry {
  id: string
  date: Date
  content: string
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'anxious'
  wordCount: number
}

const MOOD_COLORS = {
  happy: '#22c55e',
  neutral: '#64748b',
  sad: '#64748b',
  excited: '#f59e0b',
  anxious: '#ef4444'
}

export default function JournalPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [content, setContent] = useState("")
  const [mood, setMood] = useState<JournalEntry['mood']>("neutral")
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [moodDistribution, setMoodDistribution] = useState<any[]>([])

  useEffect(() => {
    // Calculate weekly writing activity
    const startOfCurrentWeek = startOfWeek(new Date())
    const weeklyStats = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(startOfCurrentWeek, i)
      const dayEntries = entries.filter(entry => 
        format(new Date(entry.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      
      return {
        date: format(day, 'EEE'),
        words: dayEntries.reduce((sum, entry) => sum + entry.wordCount, 0)
      }
    })

    setWeeklyData(weeklyStats)

    // Calculate mood distribution
    const moodStats = ['happy', 'neutral', 'sad', 'excited', 'anxious'].map(m => ({
      name: m.charAt(0).toUpperCase() + m.slice(1),
      value: entries.filter(e => e.mood === m).length,
      color: MOOD_COLORS[m as keyof typeof MOOD_COLORS]
    }))

    setMoodDistribution(moodStats)
  }, [entries])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const wordCount = content.trim().split(/\s+/).length

    const newEntry: JournalEntry = {
      id: Math.random().toString(),
      date,
      content: content.trim(),
      mood,
      wordCount
    }

    setEntries([newEntry, ...entries])
    setContent("")
    setMood("neutral")
  }

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id))
  }

  const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0)
  const averageWords = entries.length 
    ? Math.round(totalWords / entries.length) 
    : 0

  const filteredEntries = searchQuery
    ? entries.filter(entry => 
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.mood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        format(new Date(entry.date), "PPP").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : entries

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
        <p className="text-muted-foreground">
          Record your thoughts and track your mood
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Total Entries</h3>
          <p className="text-2xl font-bold">{entries.length}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Total Words</h3>
          <p className="text-2xl font-bold">{totalWords}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Average Words</h3>
          <p className="text-2xl font-bold">{averageWords}</p>
        </Card>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Journal Entry</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
              className="min-h-[200px]"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <Select value={mood} onValueChange={(value: JournalEntry['mood']) => setMood(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="happy">Happy</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="sad">Sad</SelectItem>
                  <SelectItem value="excited">Excited</SelectItem>
                  <SelectItem value="anxious">Anxious</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
          <h2 className="text-lg font-semibold mb-4">Writing Activity</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value} words`, 'Word Count']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="words"
                  name="Word Count"
                  stroke="#6366f1"
                  dot={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Mood Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {moodDistribution.map((entry, index) => (
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

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Journal Entries</h2>
          <div className="space-y-4">
            {filteredEntries.map(entry => (
              <Card key={entry.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(entry.date), "PPP")}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span 
                        className={cn(
                          "text-sm capitalize",
                          {
                            "text-green-600": entry.mood === "happy",
                            "text-slate-600": entry.mood === "neutral",
                            "text-slate-600": entry.mood === "sad",
                            "text-yellow-600": entry.mood === "excited",
                            "text-red-600": entry.mood === "anxious",
                          }
                        )}
                      >
                        {entry.mood}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {entry.wordCount} words
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{entry.content}</p>
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
            {filteredEntries.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                {searchQuery ? "No matching entries found." : "No journal entries yet. Start writing!"}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
