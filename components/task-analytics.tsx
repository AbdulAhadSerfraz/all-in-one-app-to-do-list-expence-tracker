"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Line
} from 'recharts'
import { getTasks } from '@/lib/services/database'
import { useAuth } from '@/contexts/auth-context'

// Colors for charts
const PRIORITY_COLORS = {
  high: '#ef4444',   // Red
  medium: '#f59e0b', // Amber
  low: '#10b981'     // Green
}

const STATUS_COLORS = {
  todo: '#3b82f6', // Blue
  in_progress: '#8b5cf6', // Purple
  done: '#10b981'    // Green
}

// Date formatting helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// Group dates into weeks
const getWeekLabel = (date: Date) => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 7) return 'This Week'
  if (diffDays <= 14) return 'Next Week'
  if (diffDays <= 30) return 'This Month'
  return 'Later'
}

export default function TaskAnalytics() {
  const { user } = useAuth()
  const [priorityData, setPriorityData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [timelineData, setTimelineData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTaskAnalytics() {
      if (!user?.id) return
      
      try {
        const tasks = await getTasks(user.id)
        
        // Process priority data
        const priorityCounts = tasks.reduce((acc: any, task: any) => {
          const priority = task.priority || 'medium'
          acc[priority] = (acc[priority] || 0) + 1
          return acc
        }, {})
        
        const priorityChartData = Object.entries(priorityCounts).map(([name, value]) => ({
          name,
          value
        }))
        
        // Process status data
        const statusCounts = tasks.reduce((acc: any, task: any) => {
          const status = task.status || 'todo'
          acc[status] = (acc[status] || 0) + 1
          return acc
        }, {})
        
        const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
          name,
          value
        }))
        
        // Process timeline data (tasks by due date)
        const timeGroups: Record<string, number> = {}
        
        tasks.forEach((task: any) => {
          if (!task.due_date) return
          
          const dueDate = new Date(task.due_date)
          const weekLabel = getWeekLabel(dueDate)
          
          timeGroups[weekLabel] = (timeGroups[weekLabel] || 0) + 1
        })
        
        const timelineChartData = [
          { name: 'This Week', value: timeGroups['This Week'] || 0 },
          { name: 'Next Week', value: timeGroups['Next Week'] || 0 },
          { name: 'This Month', value: timeGroups['This Month'] || 0 },
          { name: 'Later', value: timeGroups['Later'] || 0 }
        ]
        
        setPriorityData(priorityChartData)
        setStatusData(statusChartData)
        setTimelineData(timelineChartData)
      } catch (error) {
        console.error("Error loading task analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    
    loadTaskAnalytics()
  }, [user])

  if (loading) {
    return <div className="text-center py-8">Loading task analytics...</div>
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Task Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Tasks by Priority</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={PRIORITY_COLORS[entry.name as keyof typeof PRIORITY_COLORS] || '#ccc'} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Status Distribution */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Tasks by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || '#ccc'} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
        {/* Modern Task Timeline */}
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Tasks Timeline</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={timelineData}
                margin={{
                  top: 10,
                  right: 15,
                  left: -10,
                  bottom: 30,
                }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.1}
                  vertical={false}
                />
                
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  tickLine={false}
                />
                
                <YAxis 
                  hide
                  tick={{ fontSize: 12 }}
                />
                
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      const data = payload[0].payload
                      return (
                        <div className="bg-background border rounded-lg shadow-lg p-2 min-w-[120px]">
                          <p className="text-sm font-medium">{data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Tasks: <span className="font-medium">{data.value}</span>
                          </p>
                          <div className="mt-1 h-1 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${(data.value / Math.max(...timelineData.map(d => d.value))) * 100}%` }}
                            />
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                
                <Bar
                  dataKey="value"
                  radius={[10, 10, 0, 0]}
                  barSize={24}
                  className="transition-all duration-300"
                >
                  {timelineData.map((entry, index) => {
                    const isPeak = entry.value === Math.max(...timelineData.map(d => d.value))
                    return (
                      <Cell 
                        key={`cell-${index}`}
                        fill={isPeak ? "url(#peakGradient)" : "url(#barGradient)"}
                      />
                    )
                  })}
                  
                  {/* Percentage indicators */}
                  <LabelList
                    dataKey="value"
                    position="top"
                    offset={8}
                    fontSize={11}
                    formatter={(value: number, _: any, __: any, ___, entry) => {
                      const isPeak = entry.value === Math.max(...timelineData.map(d => d.value))
                      return isPeak ? '🔴' : `${value}`
                    }}
                    content={(props) => {
                      const { x, y, width, value } = props
                      const isPeak = Number(value) === Math.max(...timelineData.map(d => d.value))
                      
                      return (
                        <text
                          x={x! + width! / 2}
                          y={y! - 4}
                          textAnchor="middle"
                          fontSize={11}
                          fontWeight={isPeak ? 'bold' : 'normal'}
                          fill={isPeak ? "#ec4899" : "#8b5cf6"}
                        >
                          {isPeak ? "🔥" : value}
                        </text>
                      )
                    }}
                  />
                </Bar>
                
                <defs>
                  {/* Main bar gradient */}
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  
                  {/* Peak activity gradient */}
                  <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full bg-gradient-to-b from-purple-500 to-purple-500/0 mr-1"></div>
              <span>Daily Activity</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gradient-to-b from-pink-500 to-pink-500/0 mr-1"></div>
              <span>Peak Activity</span>
            </div>
          </div>
        </Card>
    </div>
  )
}
