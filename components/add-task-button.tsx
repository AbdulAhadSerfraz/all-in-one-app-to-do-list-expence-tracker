import React, { useState } from "react";
import { createTask } from "@/lib/services/database";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AddTaskButton({ priority, onTaskAdded }: { priority: "high" | "medium" | "low"; onTaskAdded: (task: any) => void }) {
  const { user } = useAuth();
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.id || !title.trim()) return;
    setLoading(true);
    const newTask = await createTask({
      title: title.trim(),
      description: "",
      due_date: null,
      priority,
      status: "todo",
      user_id: user.id,
    });
    onTaskAdded(newTask);
    setTitle("");
    setShowInput(false);
    setLoading(false);
  }

  if (!user?.id) return null;

  return showInput ? (
    <form onSubmit={handleAddTask} className="flex gap-2 mt-3">
      <label htmlFor="task-title-input" className="sr-only">Task title</label>
      <Input
        id="task-title-input"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 text-sm"
        disabled={loading}
        placeholder="Enter task title"
        aria-label="Task title"
      />
      <Button type="submit" size="sm" disabled={loading || !title.trim()} aria-label="Add task">
        Add
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setShowInput(false)} disabled={loading} aria-label="Cancel adding task">
        Cancel
      </Button>
    </form>
  ) : (
    <button
      className="mt-4 w-full py-1.5 text-sm rounded-xl border border-dashed border-gray-300 bg-white hover:bg-gray-100 text-gray-500 transition"
      onClick={() => setShowInput(true)}
      title="Add a new task to this column"
    >
      + Add task
    </button>
  );
}
