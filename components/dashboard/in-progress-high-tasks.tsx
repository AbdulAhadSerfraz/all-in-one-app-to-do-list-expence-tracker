"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getTasks } from "@/lib/services/database";
import { useAuth } from "@/contexts/auth-context";

export function InProgressHighTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    getTasks(user.id).then((all) => {
      setTasks(all.filter(t => t.status === "in_progress" && t.priority === "high"));
    });
  }, [user]);

  if (!user?.id) return null;

  return (
    <Card className="mb-6 p-4">
      <h3 className="text-lg font-bold mb-3 text-red-600">High Probability In Progress Tasks</h3>
      {tasks.length === 0 ? (
        <div className="text-gray-400 text-sm">No high probability tasks in progress.</div>
      ) : (
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="p-2 rounded bg-red-50 border border-red-200">
              <div className="font-semibold">{task.title}</div>
              {task.description && <div className="text-xs text-gray-500">{task.description}</div>}
              {task.due_date && <div className="text-xs text-gray-400">Due: {new Date(task.due_date).toLocaleDateString()}</div>}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
