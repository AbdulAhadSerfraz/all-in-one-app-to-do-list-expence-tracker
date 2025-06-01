"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getTasks, deleteAllTasks, createTask } from "@/lib/services/database";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import TaskKanbanBoard from "./task-kanban-board";
import TaskStatusKanbanBoard from "./task-status-kanban-board";
import TaskCalendar from './task-calendar';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TaskForm } from './task-form';

export function TaskBoards() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      getTasks(user.id).then(setTasks);
    }
  }, [user?.id]);

  const handleDeleteAll = async () => {
    if (!user?.id) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete ALL tasks? This cannot be undone.');
    if (!confirmDelete) return;
    
    try {
      setIsDeletingAll(true);
      await deleteAllTasks(user.id);
      setTasks([]);
    } catch (error) {
      console.error('Failed to delete all tasks:', error);
    } finally {
      setIsDeletingAll(false);
    }
  };

  // Utility to generate a unique id
  function generateId(prefix = 'id') {
    return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
  }

  const handleTaskSubmit = async (task: {
    title: string;
    description?: string;
    start_date: Date;
    end_date?: Date;
    priority?: 'low' | 'medium' | 'high';
  }) => {
    if (!user?.id) return;
    
    const newTask = {
      id: generateId('task'),
      title: task.title,
      description: task.description ?? "", // Ensure always a string
      start_date: task.start_date.toISOString(),
      end_date: task.end_date ? task.end_date.toISOString() : "",
      priority: task.priority ?? "medium",
      user_id: user.id,
      created_at: new Date().toISOString(),
      status: 'todo' // Default status
    };


    
    await createTask(newTask);
    setIsDialogOpen(false);
    getTasks(user.id).then(setTasks);
  };

  return (
    <div className="space-y-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">+ New Task</Button>
        </DialogTrigger>
        <DialogContent>
          <TaskForm
            onSubmit={async (task) => {
              if (!user?.id) return;
              const newTask = {
                id: generateId('task'),
                title: task.title,
                description: task.description ?? "",
                start_date: task.start_date.toISOString(),
                end_date: task.end_date ? task.end_date.toISOString() : "",
                priority: task.priority ?? "medium",
                user_id: user.id,
                created_at: new Date().toISOString(),
                status: 'todo'
              };
              await createTask(newTask);
              setIsDialogOpen(false);
              getTasks(user.id).then(setTasks);
            }}
          />
        </DialogContent>
      </Dialog>
      <Tabs defaultValue="priority" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="priority">Priority Board</TabsTrigger>
          <TabsTrigger value="progress">Progress Board</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="priority">
          <TaskKanbanBoard />
        </TabsContent>
        <TabsContent value="progress">
          <TaskStatusKanbanBoard />
        </TabsContent>
        <TabsContent value="calendar">
          <TaskCalendar />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <button
          onClick={handleDeleteAll}
          disabled={isDeletingAll}
          className={`
            px-4 py-2 rounded-md font-medium
            ${isDeletingAll 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-black hover:bg-red-600 text-white'}
            transition-colors duration-200
            flex items-center gap-2
          `}
        >
          {isDeletingAll ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Delete All Tasks
        </button>
      </div>
    </div>
  );
}
