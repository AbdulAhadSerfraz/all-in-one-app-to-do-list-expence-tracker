"use client";
import React, { useEffect, useState } from "react";
import { DndContext, closestCenter, DragOverlay, useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useAuth } from "@/contexts/auth-context";
import { getTasks, updateTask, deleteTask } from "@/lib/services/database";
import { KanbanSortableTask } from "@/components/kanban-sortable-task";

const STATUSES = ["todo", "in_progress", "done"] as const;
const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "Work In Progress",
  done: "Completed",
};
const STATUS_COLORS = {
  todo: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-600",
    icon: "text-gray-400"
  },
  in_progress: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-600",
    icon: "text-blue-400"
  },
  done: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-600",
    icon: "text-green-400"
  },
};

function Column({ id, children, count }: { id: string; children: React.ReactNode; count: number }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const statusColor = STATUS_COLORS[id as keyof typeof STATUS_COLORS];
  
  return (
    <div 
      ref={setNodeRef}
      className={`flex-1 p-4 rounded-xl border ${statusColor.bg} ${statusColor.border} min-w-[280px] transition-colors ${isOver ? 'ring-2 ring-blue-400' : ''}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${statusColor.icon}`} />
        <h3 className={`font-semibold ${statusColor.text}`}>
          {STATUS_LABELS[id as keyof typeof STATUS_LABELS]}
        </h3>
        <span className="ml-auto text-sm text-gray-400 bg-white px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>
      <div className="space-y-3 min-h-[100px]">
        {children || (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
            <div className="text-sm mb-1">No tasks here</div>
            <div className="text-xs">Drag tasks to add</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TaskStatusKanbanBoard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!user?.id) return null;

  useEffect(() => {
    getTasks(user.id).then(setTasks);
  }, [user]);

  const columns = STATUSES.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status),
  }));

  function handleDragStart(event: any) {
    setActiveId(event.active.id);
  }

  async function handleDragEnd(event: any) {
    if (!user?.id) {
      setActiveId(null);
      return;
    }

    const { active, over } = event;
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const status = getStatusFromDroppableId(over.id) || 
                  getStatusFromDroppableId(over.data.current?.sortable.containerId);
    
    if (!status) {
      setActiveId(null);
      return;
    }

    const updatedTasks = tasks.map(task => {
      if (task.id === active.id) {
        return { ...task, status };
      }
      return task;
    });

    setTasks(updatedTasks);
    
    try {
      await updateTask(active.id, { status, user_id: user.id });
    } catch (error) {
      console.error("Failed to update task:", error);
      setTasks(tasks); // Revert on error
    }
    
    setActiveId(null);
  }

  function findTaskById(id: string) {
    return tasks.find((t) => t.id === id);
  }

  function getStatusFromDroppableId(droppableId: string): "todo" | "in_progress" | "done" | null {
    if (STATUSES.includes(droppableId as any)) return droppableId as any;
    return null;
  }

  return (
    <div className="w-full mt-12">
      <h2 className="text-2xl font-bold text-center mb-8 tracking-tight">Task Progress</h2>
      <DndContext 
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 w-full overflow-x-auto pb-6 px-1">
          {columns.map(({ status, tasks }) => (
            <Column key={status} id={status} count={tasks.length}>
              <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                {tasks.length > 0 ? (
                  tasks.map((task) => (
                    <KanbanSortableTask 
                      key={task.id} 
                      task={task} 
                      onDelete={async (id) => {
                        if (!user?.id) return;
                        await deleteTask(id, user.id);
                        setTasks(tasks.filter(t => t.id !== id));
                      }}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-sm text-gray-400">
                    Drop tasks here
                  </div>
                )}
              </SortableContext>
            </Column>
          ))}
        </div>
        
        <DragOverlay>
          {activeId ? (
            <KanbanSortableTask 
              task={findTaskById(activeId)} 
              style={{ transform: 'scale(1.05)' }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
