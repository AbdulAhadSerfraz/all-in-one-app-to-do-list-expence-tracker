import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CalendarIcon, GripVertical, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Task {
  id: string
  title: string
  description?: string | null
  due_date?: string | null
  completed: boolean
  created_at: string
  user_id: string
}

interface TaskCardProps {
  task: Task
  onStatusChange: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

const STATUS_COLORS = {
  todo: 'border-orange-500',
  done: 'border-green-500'
}

const PRIORITY_COLORS = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700'
}

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn("p-4 border-l-4", task.completed ? STATUS_COLORS.done : STATUS_COLORS.todo)}
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className={cn("font-medium leading-none", task.completed && "line-through text-muted-foreground")}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {task.due_date && (
              <div className="flex items-center text-muted-foreground">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {format(new Date(task.due_date), "PPP")}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onStatusChange(task.id, !task.completed)}
            >
              {task.completed ? 'Mark as To Do' : 'Mark as Done'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
