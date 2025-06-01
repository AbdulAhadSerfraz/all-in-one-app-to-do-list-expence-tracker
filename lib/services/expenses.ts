// This file uses localStorage for all expense operations. No Supabase.
import { Expense } from '../supabase' // Keep the type definition

// Helper function to get expenses from localStorage
function getExpensesFromStorage(userId: string): Expense[] {
  // Safe check for server-side rendering
  if (typeof window === 'undefined') return []
  const expenses = localStorage.getItem(`expenses_${userId}`) || '[]'
  return JSON.parse(expenses)
}

// Helper function to save expenses to localStorage
function saveExpensesToStorage(userId: string, expenses: Expense[]) {
  // Safe check for server-side rendering
  if (typeof window === 'undefined') return
  localStorage.setItem(`expenses_${userId}`, JSON.stringify(expenses))
}

export async function getExpenses(userId: string) {
  const expenses = getExpensesFromStorage(userId)
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function addExpense(expense: Omit<Expense, 'id' | 'created_at'>) {
  const userId = expense.user_id
  const expenses = getExpensesFromStorage(userId)
  const newExpense: Expense = {
    ...expense,
    id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    created_at: new Date().toISOString()
  }
  
  expenses.push(newExpense)
  saveExpensesToStorage(userId, expenses)
  return newExpense
}

export async function updateExpense(id: string, expense: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>> & { user_id: string }) {
  const expenses = getExpensesFromStorage(expense.user_id)
  const index = expenses.findIndex(e => e.id === id)
  
  if (index === -1) throw new Error('Expense not found')
  
  expenses[index] = {
    ...expenses[index],
    ...expense,
  }
  
  saveExpensesToStorage(expenses[index].user_id, expenses)
  return expenses[index]
}

export async function deleteExpense(id: string) {
  // First find the expense to get the user_id
  let userId = ''
  // Safe check for server-side rendering
  if (typeof window === 'undefined') return
  const allStorageKeys = Object.keys(localStorage)
  for (const key of allStorageKeys) {
    if (key.startsWith('expenses_')) {
      const expenses = JSON.parse(localStorage.getItem(key) || '[]')
      const expense = expenses.find((e: Expense) => e.id === id)
      if (expense) {
        userId = expense.user_id
        break
      }
    }
  }
  
  if (!userId) throw new Error('Expense not found')
  
  const expenses = getExpensesFromStorage(userId)
  const filteredExpenses = expenses.filter(e => e.id !== id)
  saveExpensesToStorage(userId, filteredExpenses)
}

export async function getExpensesByCategory(userId: string, startDate?: string, endDate?: string) {
  let expenses = getExpensesFromStorage(userId)
  
  // Apply date filters if provided
  if (startDate || endDate) {
    expenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date).getTime()
      const start = startDate ? new Date(startDate).getTime() : -Infinity
      const end = endDate ? new Date(endDate).getTime() : Infinity
      return expenseDate >= start && expenseDate <= end
    })
  }

  // Aggregate expenses by category
  const categoryTotals = expenses.reduce((acc: { [key: string]: number }, expense) => {
    const category = expense.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + expense.amount
    return acc
  }, {})

  return Object.entries(categoryTotals).map(([category, total]) => ({
    category,
    total
  }))
}
