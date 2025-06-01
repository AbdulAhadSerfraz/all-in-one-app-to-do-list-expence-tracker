"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card } from '@/components/ui/card'
import { BarChart, TrendingUp } from 'lucide-react'

import { useEffect, useState } from "react";
import { getMoodEntries, getSleepEntries } from "@/lib/services/database";
import { useAuth } from "@/contexts/auth-context";

export function TrendsChart() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      const mood = await getMoodEntries(user.id);
      const sleep = await getSleepEntries(user.id);
      // Merge by date (assume mood and sleep have 'date' fields)
      const byDate: Record<string, any> = {};
      mood.forEach((m: any) => {
        byDate[m.date] = { date: m.date, mood: m.value, energy: m.energy };
      });
      sleep.forEach((s: any) => {
        if (!byDate[s.date]) byDate[s.date] = { date: s.date };
        byDate[s.date].sleep = s.hours_slept;
      });
      setData(Object.values(byDate).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) return <div className="p-6">Loading trends...</div>;


  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Weekly Trends</h3>
          <p className="text-sm text-muted-foreground">
            Track your mood, energy, and sleep patterns
          </p>
        </div>
        <div className="flex items-center gap-4">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <BarChart className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#8884d8"
              name="Mood"
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#82ca9d"
              name="Energy"
            />
            <Line
              type="monotone"
              dataKey="sleep"
              stroke="#ffc658"
              name="Sleep"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
