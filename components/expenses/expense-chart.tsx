"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getExpensesByCategory } from '@/lib/expenses'
import { Skeleton } from '@/components/ui/skeleton'

interface ExpenseChartProps {
  userId: string
  startDate: string
  endDate: string
}

export function ExpenseChart({ userId, startDate, endDate }: ExpenseChartProps) {
  const [data, setData] = useState<{ name: string; amount: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const chartData = await getExpensesByCategory(userId, startDate, endDate)
        setData(chartData)
      } catch (error) {
        console.error('Error loading expense chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId, startDate, endDate])

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-2 mb-4">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-[300px] w-full" />
      </Card>
    )
  }

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-medium">Spending by Category</h2>
          <p className="text-sm text-muted-foreground">
            Add some expenses to see your spending breakdown
          </p>
        </div>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No data to display
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-lg font-medium">Spending by Category</h2>
        <p className="text-sm text-muted-foreground">
          View your expenses breakdown
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Amount']}
            />
            <Bar 
              dataKey="amount" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
