'use client';

import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Task, getTasks, saveTask, updateTask, deleteTask } from 'src/lib/taskService';

export default function TaskCalendar() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [userId] = useState('default-user'); // Replace with actual user ID from auth

  useEffect(() => {
    setTaskList(getTasks(userId));
  }, [userId]);

  const handleEventAdd = (eventInfo: any) => {
    const newTask: Task = {
      id: eventInfo.event.id,
      title: eventInfo.event.title,
      start: eventInfo.event.startStr,
      end: eventInfo.event.endStr,
      color: eventInfo.event.backgroundColor,
      allDay: eventInfo.event.allDay,
      priority: 'medium'
    };
    saveTask(userId, newTask);
    setTaskList([...taskList, newTask]);
  };

  const handleEventChange = (eventInfo: any) => {
    updateTask(userId, eventInfo.event.id, {
      start: eventInfo.event.startStr,
      end: eventInfo.event.endStr
    });
    setTaskList(getTasks(userId));
  };

  const handleEventRemove = (eventInfo: any) => {
    deleteTask(userId, eventInfo.event.id);
    setTaskList(taskList.filter(t => t.id !== eventInfo.event.id));
  };

  return (
    <div className="p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={taskList}
        editable={true}
        selectable={true}
        eventAdd={handleEventAdd}
        eventChange={handleEventChange}
        eventRemove={handleEventRemove}
        height="auto"
        contentHeight="auto"
        eventDisplay="block"
      />
    </div>
  );
}
