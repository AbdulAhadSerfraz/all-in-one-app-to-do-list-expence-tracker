import { db } from './db'

export interface Expense {
  id: string
  description: string
  amount: number
  date: string
  category?: string
  userId: string
}

export function getExpenses(userId: string): Expense[] {
  if (typeof window === 'undefined') return []
  const expenses = localStorage.getItem(`expenses_${userId}`)
  return expenses ? JSON.parse(expenses) : []
}

export function addExpense(data: Omit<Expense, 'id' | 'date'>): Expense {
  const expense = {
    ...data,
    id: crypto.randomUUID(),
    date: new Date().toISOString()
  }

  const expenses = getExpenses(data.userId)
  expenses.push(expense)
  localStorage.setItem(`expenses_${data.userId}`, JSON.stringify(expenses))
  
  return expense
}

export function updateExpense(id: string, userId: string, data: Partial<Omit<Expense, 'id' | 'userId'>>): Expense | null {
  const expenses = getExpenses(userId)
  const index = expenses.findIndex(e => e.id === id)
  
  if (index === -1) return null
  
  expenses[index] = {
    ...expenses[index],
    ...data
  }
  
  localStorage.setItem(`expenses_${userId}`, JSON.stringify(expenses))
  return expenses[index]
}

export function deleteExpense(id: string, userId: string): boolean {
  const expenses = getExpenses(userId)
  const filtered = expenses.filter(e => e.id !== id)
  
  if (filtered.length === expenses.length) return false
  
  localStorage.setItem(`expenses_${userId}`, JSON.stringify(filtered))
  return true
}

export function getExpensesByCategory(userId: string): { category: string; total: number }[] {
  const expenses = getExpenses(userId)
  const categories = new Map<string, number>()
  
  expenses.forEach(expense => {
    const category = expense.category || 'Uncategorized'
    categories.set(
      category,
      (categories.get(category) || 0) + expense.amount
    )
  })
  
  return Array.from(categories.entries()).map(([category, total]) => ({
    category,
    total
  }))
}