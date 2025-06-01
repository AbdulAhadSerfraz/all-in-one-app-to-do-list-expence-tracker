"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "components/ui/card"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Textarea } from "components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover"
import { cn } from "lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select"
import { useToast } from "components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs"
import TaskAnalytics from "components/task-analytics"
import TaskKanbanBoard from "components/task-kanban-board"
import TaskStatusKanbanBoard from "components/task-status-kanban-board"
import { TaskBoards } from "components/task-boards";
import { TaskForm } from "components/task-form";
import { createTask } from "lib/services/database"
import { useAuth } from "@/contexts/auth-context"

export default function NewTaskPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date>()
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [status, setStatus] = useState<"todo" | "in_progress" | "done">("todo")
  const [activeTab, setActiveTab] = useState("create")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create tasks",
        variant: "destructive"
      })
      return
    }
    
    try {
      // Save the task to localStorage using the database service
      await createTask({
        title,
        description,
        due_date: dueDate ? dueDate.toISOString() : null,
        priority,
        status: status as "todo" | "in_progress" | "done",
        user_id: user.id
      })
      
      toast({
        title: "Success",
        description: "Task created successfully"
      })
      
      // Clear form
      setTitle("")
      setDescription("")
      setDueDate(undefined)
      setPriority("medium")
      setStatus("todo")
      
      // Switch to analytics tab
      setActiveTab("analytics")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive"
      })
      console.error("Error creating task:", error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="text-muted-foreground">Create and manage your tasks</p>
      </div>
      
      <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="create">Create Task</TabsTrigger>
          <TabsTrigger value="analytics">Task Analytics</TabsTrigger>
          <TabsTrigger value="board">Board</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create">
          <Card className="p-6">
            <TaskForm
              onSubmit={async (task) => {
                if (!user?.id) {
                  toast({
                    title: "Error",
                    description: "You must be logged in to create tasks",
                    variant: "destructive"
                  });
                  return;
                }
                
                try {
                  await createTask({
                    title: task.title,
                    description: task.description,
                    start_date: task.start_date.toISOString(),
                    end_date: task.end_date?.toISOString(),
                    priority: task.priority,
                    status: 'todo',
                    user_id: user.id
                  });
                  
                  toast({
                    title: "Success",
                    description: "Task created successfully"
                  });
                  
                  setActiveTab("analytics");
                } catch (error) {
                  toast({
                    title: "Error",
                    description: "Failed to create task. Please try again.",
                    variant: "destructive"
                  });
                  console.error("Error creating task:", error);
                }
              }}
            />
          </Card>

        </TabsContent>
        
        <TabsContent value="analytics">
          <TaskAnalytics />
        </TabsContent>

        <TabsContent value="board">
          <TaskBoards />
        </TabsContent>
      </Tabs>
    </div>
  )
}
