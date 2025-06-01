'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

type TaskFormProps = {
  onSubmit: (task: {
    title: string;
    description?: string;
    start_date: Date;
    end_date?: Date;
    priority?: 'low' | 'medium' | 'high';
  }) => void;
  initialValues?: {
    title?: string;
    description?: string;
    start_date?: Date;
    end_date?: Date;
    priority?: 'low' | 'medium' | 'high';
  };
};

const TaskForm = ({ onSubmit, initialValues }: TaskFormProps) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [startDate, setStartDate] = useState<Date | undefined>(initialValues?.start_date || new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(initialValues?.end_date);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialValues?.priority || 'medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate) return;
    
    onSubmit({
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      priority
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                required
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>End Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <Label>Priority</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={priority === 'low' ? 'default' : 'outline'}
            onClick={() => setPriority('low')}
          >
            Low
          </Button>
          <Button
            type="button"
            variant={priority === 'medium' ? 'default' : 'outline'}
            onClick={() => setPriority('medium')}
          >
            Medium
          </Button>
          <Button
            type="button"
            variant={priority === 'high' ? 'default' : 'outline'}
            onClick={() => setPriority('high')}
          >
            High
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Task
      </Button>
    </form>
  );
}

export { TaskForm };
