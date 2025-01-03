import React, { useMemo } from 'react'
import { useEvents } from '../contexts/EventContext'
import { format, isToday, isThisWeek, isThisMonth } from 'date-fns'
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ChartBarIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline'
import { PRIORITY_LEVELS } from '../constants/priorities'
import { LABEL_COLORS } from '../constants/labels'

function StatsDashboard() {
  const { events } = useEvents()

  const stats = useMemo(() => {
    const total = events.length
    const completed = events.filter(e => e.completed).length
    const completionRate = total ? Math.round((completed / total) * 100) : 0

    const todayTasks = events.filter(e => isToday(new Date(e.time))).length
    const weekTasks = events.filter(e => isThisWeek(new Date(e.time))).length
    const monthTasks = events.filter(e => isThisMonth(new Date(e.time))).length

    const priorityStats = Object.keys(PRIORITY_LEVELS).reduce((acc, priority) => {
      acc[priority] = events.filter(e => e.priority === priority).length
      return acc
    }, {})

    const labelStats = Object.keys(LABEL_COLORS).reduce((acc, label) => {
      acc[label] = events.filter(e => e.labels.includes(label)).length
      return acc
    }, {})

    return {
      total,
      completed,
      pending: total - completed,
      completionRate,
      todayTasks,
      weekTasks,
      monthTasks,
      priorityStats,
      labelStats
    }
  }, [events])

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700
    hover:shadow-md hover:border-[var(--primary-light)] dark:hover:border-[var(--primary-light)]
    transition-all duration-200 ease-in-out
    transform hover:-translate-y-0.5
    cursor-pointer">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm text-gray-600 dark:text-gray-300">{title}</h3>
          <p className="text-xl font-semibold dark:text-gray-100">{value}</p>
        </div>
      </div>
    </div>
  )

  const ProgressBar = ({ value, color }) => (
    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
      {value > 0 && (
        <div 
          className={`h-full ${color}`}
          style={{ width: `${value}%` }}
        />
      )}
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Tasks" 
          value={stats.total}
          icon={ChartBarIcon}
          color="bg-[var(--primary)]"
        />
        <StatCard 
          title="Completed Tasks" 
          value={stats.completed}
          icon={CheckCircleIcon}
          color="bg-green-500"
        />
        <StatCard 
          title="Pending Tasks" 
          value={stats.pending}
          icon={ClockIcon}
          color="bg-yellow-500"
        />
        <StatCard 
          title="Today's Tasks" 
          value={stats.todayTasks}
          icon={CalendarIcon}
          color="bg-blue-500"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700
      hover:shadow-md hover:border-[var(--primary-light)] dark:hover:border-[var(--primary-light)]
      transition-all duration-200 ease-in-out
      transform hover:-translate-y-0.5
      cursor-pointer">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-100">Task Completion Rate</h3>
        <ProgressBar value={stats.completionRate} color="bg-[var(--primary)]" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {stats.completionRate}% of all tasks completed
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700
      hover:shadow-md hover:border-[var(--primary-light)] dark:hover:border-[var(--primary-light)]
      transition-all duration-200 ease-in-out
      transform hover:-translate-y-0.5
      cursor-pointer">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-100">Priority Distribution</h3>
        <div className="space-y-3">
          {Object.entries(PRIORITY_LEVELS).map(([key, level]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">{level.name}</span>
                <span className="font-medium dark:text-gray-100">{stats.priorityStats[key]}</span>
              </div>
              <ProgressBar 
                value={(stats.priorityStats[key] / stats.total) * 100} 
                color={`bg-${level.dot.split('-')[1]}-500`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-100 dark:border-gray-700
      hover:shadow-md hover:border-[var(--primary-light)] dark:hover:border-[var(--primary-light)]
      transition-all duration-200 ease-in-out
      transform hover:-translate-y-0.5
      cursor-pointer">
        <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-100">Label Distribution</h3>
        <div className="space-y-3">
          {Object.entries(LABEL_COLORS).map(([key, label]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">{label.name}</span>
                <span className="font-medium dark:text-gray-100">{stats.labelStats[key]}</span>
              </div>
              <ProgressBar 
                value={(stats.labelStats[key] / stats.total) * 100} 
                color={label.bg}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatsDashboard
