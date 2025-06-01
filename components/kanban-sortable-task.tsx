import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Trash2, Clock, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export function KanbanSortableTask({ 
  task, 
  onDelete,
  style: propStyle = {}
}: { 
  task: any; 
  onDelete?: (id: string) => void;
  style?: React.CSSProperties;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: task.id });

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.9 : 1,
    boxShadow: isDragging
      ? "0 4px 24px rgba(0,0,0,0.12), 0 0 0 2px #6366f1"
      : "0 2px 8px rgba(0,0,0,0.08)",
    zIndex: isDragging ? 10 : 1,
    background: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    cursor: isDragging ? "grabbing" : "grab",
    position: "relative" as const,
    ...propStyle
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onDelete) return;
    
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;
    
    try {
      setIsDeleting(true);
      await onDelete(task.id);
    } catch (error) {
      console.error("Failed to delete task:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={`p-5 pt-8 flex flex-col gap-2 group relative transition-colors ${isOver ? 'bg-blue-50' : ''}`}>
        <button
          type="button"
          aria-label="Delete task"
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 z-20 disabled:opacity-50"
        >
          {isDeleting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
        
        <div className="font-medium text-[15px] text-gray-900">{task.title}</div>
        
        {task.description && (
          <div className="text-sm text-gray-600 line-clamp-2">{task.description}</div>
        )}
        
        {(task.due_date || task.priority) && (
          <div className="flex items-center gap-3 mt-2 text-xs">
            {task.due_date && (
              <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
                <Clock size={14} />
                {new Date(task.due_date).toLocaleDateString()}
                {isOverdue && <AlertCircle size={14} className="ml-1" />}
              </span>
            )}
            {task.priority && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                task.priority === 'high' ? 'bg-red-100 text-red-800' :
                task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.priority}
              </span>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
