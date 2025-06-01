"use client"

import React, { useEffect, useState } from "react";
import { useDroppable } from "@dnd-kit/core";

// Column component for Priority Board
function Column({ id, children, count }: { id: string; children: React.ReactNode; count: number }) {
  const { setNodeRef } = useDroppable({ id });
  const priorityColor = PRIORITY_COLORS[id as keyof typeof PRIORITY_COLORS];

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 flex flex-col h-full p-4 rounded-xl border ${priorityColor} min-w-[280px] min-h-[350px] bg-white`}
    >
      <div className="flex items-center gap-3 mb-4">
        <h3 className={`font-semibold text-base`}>{PRIORITY_LABELS[id as keyof typeof PRIORITY_LABELS]}</h3>
        <span className="ml-auto text-sm text-gray-400 bg-white px-2 py-0.5 rounded-full">
          {count} tasks
        </span>
      </div>
      <div className="flex flex-col gap-4 flex-1 min-h-[100px] justify-start">
        {children}
      </div>
    </div>
  );
}

import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAuth } from "@/contexts/auth-context";
import { getTasks, updateTask, deleteTask } from "@/lib/services/database";
import { KanbanSortableTask } from "@/components/kanban-sortable-task";
import { AddTaskButton } from "@/components/add-task-button";

const PRIORITIES = ["high", "medium", "low"] as const;
const PRIORITY_LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
};
const PRIORITY_COLORS = {
  high: "bg-red-50 border-red-200",
  medium: "bg-yellow-50 border-yellow-200",
  low: "bg-green-50 border-green-200",
};

export default function TaskKanbanBoard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!user?.id) return null;

  useEffect(() => {
    getTasks(user.id).then(setTasks);
  }, [user]);

  // Group tasks by priority
  const columns = PRIORITIES.map((priority) => ({
    priority,
    tasks: tasks.filter((t) => t.priority === priority),
  }));

  // Drag and drop handlers
  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  function findTaskById(id: string) {
    return tasks.find((t) => t.id === id);
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    // Get priority from droppable container
    const priority = PRIORITIES.find(p => over.id === p || 
      over.data.current?.sortable.containerId === p);

    if (!priority || !user?.id) {
      setActiveId(null);
      return;
    }

    const updatedTasks = tasks.map(task => {
      if (task.id === active.id) {
        return { ...task, priority };
      }
      return task;
    });

    setTasks(updatedTasks);
    
    try {
      await updateTask(active.id, { priority, user_id: user.id });
    } catch (error) {
      console.error("Failed to update task:", error);
      setTasks(tasks); // Revert on error
    }
    
    setActiveId(null);
  }

  return (
    <div className="flex gap-5 w-full items-start h-full min-h-[400px]">
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {columns.map((col) => (
          <Column key={col.priority} id={col.priority} count={col.tasks.length}>
            <SortableContext
              id={col.priority}
              items={col.tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {col.tasks.map((task) => (
                <KanbanSortableTask
                  key={task.id}
                  task={task}
                  onDelete={async (id) => {
                    await deleteTask(id, user.id);
                    setTasks((prev) => prev.filter((t) => t.id !== id));
                  }}
                />
              ))}
            </SortableContext>
            <AddTaskButton priority={col.priority as "high" | "medium" | "low"} onTaskAdded={(task) => setTasks((prev) => [...prev, task])} />
          </Column>
        ))}
        <DragOverlay>
          {activeId ? (
            <KanbanSortableTask task={findTaskById(activeId)!} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
