"use client"

import React, { useState } from 'react';
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useAuth } from '@/contexts/auth-context'
import { getExpenses, getJournalEntries, getTasks } from '@/lib/services/database'

interface AnalyticsData {
  expenses: Array<{
    date: string
    amount: number
  }>
  mood: Array<{
    date: string
    mood: string
    energy: number
  }>
  tasks: {
    todo: number
    inProgress: number
    done: number
  }
}

const COLORS = ['#4CAF50', '#FFA726', '#EF5350']

interface DateRangeFilterProps {
  onChange: (type: 'start' | 'end', value: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ onChange }) => (
  <div className="flex gap-4 mb-6">
    <input 
      type="date" 
      onChange={(e) => onChange('start', e.target.value)}
      className="border rounded p-2"
    />
    <input 
      type="date" 
      onChange={(e) => onChange('end', e.target.value)}
      className="border rounded p-2"
    />
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
    <p className="text-lg font-medium text-gray-600">No data available</p>
    <p className="text-sm text-gray-500">Start tracking to see analytics</p>
  </div>
);

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<AnalyticsData>({
    expenses: [],
    mood: [],
    tasks: {
      todo: 0,
      inProgress: 0,
      done: 0
    }
  })
  const [dateRange, setDateRange] = React.useState({
    start: '',
    end: ''
  });

  // Add debug logs
  React.useEffect(() => {
    console.log('Auth state:', { user, isAuthenticated: !!user })
  }, [user])

  React.useEffect(() => {
    async function fetchData() {
      if (!user) {
        console.log('No user found, skipping data fetch')
        return
      }

      try {
        setLoading(true)
        console.log('Fetching data for user:', user.id)
        
        // Fetch expenses
        const expenses = await getExpenses(user.id);
        console.log('Fetched expenses:', expenses?.length || 0);

        // Fetch journal entries for mood data
        const journalEntries = await getJournalEntries(user.id);
        console.log('Fetched journal entries:', journalEntries?.length || 0);

        // Fetch tasks
        const tasksArr = await getTasks(user.id);
        console.log('Fetched tasks:', tasksArr?.length || 0);

        setData({
          expenses: expenses || [],
          mood: journalEntries?.map((entry: any) => ({
            date: entry.date,
            mood: entry.mood || 'neutral',
            energy: entry.energy || 0
          })) || [],
          tasks: {
            todo: tasksArr?.filter((t: any) => t.status === 'todo').length || 0,
            inProgress: tasksArr?.filter((t: any) => t.status === 'in_progress').length || 0,
            done: tasksArr?.filter((t: any) => t.status === 'done').length || 0
          }
        })
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const filteredExpenses = data.expenses.filter(item => {
    const itemDate = new Date(item.date);
    const start = dateRange.start ? new Date(dateRange.start) : null;
    const end = dateRange.end ? new Date(dateRange.end) : null;
    
    if (start && end) {
      return itemDate >= start && itemDate <= end;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-[300px] bg-gray-100 rounded animate-pulse mt-4" />
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View insights and trends from your data
        </p>
      </div>

      <DateRangeFilter onChange={handleDateRangeChange} />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Expenses Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Expense Trends</h2>
          {filteredExpenses.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#8884d8"
                    name="Amount ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState />
          )}
        </Card>

        {/* Mood & Energy Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Mood & Energy Levels</h2>
          {data.mood.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.mood}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#8884d8"
                    name="Mood"
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="#82ca9d"
                    name="Energy"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState />
          )}
        </Card>

        {/* Task Status Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Task Status Distribution</h2>
          {data.tasks.todo > 0 || data.tasks.inProgress > 0 || data.tasks.done > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'To Do', value: data.tasks.todo },
                      { name: 'In Progress', value: data.tasks.inProgress },
                      { name: 'Done', value: data.tasks.done }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState />
          )}
        </Card>
      </div>
    </div>
  )
}
