"use client";
import { TaskBoards } from "@/components/task-boards";

export default function BoardTab() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-4">Task Boards</h1>
      <TaskBoards />
    </div>
  );
}
