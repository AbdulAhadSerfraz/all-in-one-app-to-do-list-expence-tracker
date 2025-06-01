"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from "components/ui/card"
import { Button } from "components/ui/button"
import { getTasks } from "lib/services/todos"

export default function TaskPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<{ id: string; title: string; description: string; dueDate: string; priority: "low" | "medium" | "high" }[]>([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks()
        setTasks(data)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      }
    }
    fetchTasks()
  }, [])

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight">Your Tasks</h1>
      <div className="space-y-4">
          {tasks.map((task: { id: string; title: string; description: string; dueDate: string; priority: "low" | "medium" | "high" }) => (
          <Card key={task.id} className="p-4">
            <h2 className="text-lg font-semibold">{task.title}</h2>
            <p>{task.description}</p>
            <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
            <p className="text-sm text-gray-500">Priority: {task.priority}</p>
          </Card>
        ))}
      </div>
      <Button className="mt-4" onClick={() => router.push("/tasks/new")}>Add New Task</Button>
    </div>
  )
}
