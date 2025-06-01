"use client"

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Expense, getExpenses, subscribeToExpenses } from '@/lib/expenses'
import { Skeleton } from '@/components/ui/skeleton'

interface ExpenseListProps {
  userId: string
}

export function ExpenseList({ userId }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadExpenses() {
      try {
        const data = await getExpenses(userId)
        if (isMounted) {
          setExpenses(data)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error loading expenses:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadExpenses()

    // Subscribe to real-time updates
    const subscription = subscribeToExpenses(userId, (payload: any) => {
      console.log('Received real-time update:', payload)
      if (payload.eventType === 'INSERT') {
        setExpenses(prev => [payload.new as Expense, ...prev])
      } else if (payload.eventType === 'DELETE') {
        setExpenses(prev => prev.filter(exp => exp.id !== payload.old.id))
      }
    })

    return () => {
      isMounted = false
      subscription.then(sub => sub.unsubscribe())
    }
  }, [userId])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No expenses found. Add your first expense to get started!
      </div>
    )
  }

  return (
    <div className="divide-y">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="py-4 flex items-center justify-between"
        >
          <div>
            <p className="font-medium">{expense.title}</p>
            <p className="text-sm text-muted-foreground">{expense.category}</p>
            {expense.description && (
              <p className="text-sm text-muted-foreground mt-1">{expense.description}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-medium">-${expense.amount.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(expense.date), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
