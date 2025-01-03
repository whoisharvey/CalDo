import React, { useMemo } from 'react'
import { useEvents } from '../contexts/EventContext'
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  parseISO,
  isPast
} from 'date-fns'
import { PRIORITY_LEVELS } from '../constants/priorities'

function CalendarView() {
  const { events } = useEvents()
  const today = new Date()
  
  const days = useMemo(() => {
    const start = startOfMonth(today)
    const end = endOfMonth(today)
    return eachDayOfInterval({ start, end })
  }, [])

  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
      const dateKey = format(parseISO(event.time), 'yyyy-MM-dd')
      if (!acc[dateKey]) {
        acc[dateKey] = []
      }
      acc[dateKey].push(event)
      return acc
    }, {})
  }, [events])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-gray-500 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd')
          const dayEvents = eventsByDate[dateKey] || []
          const sortedEvents = [...dayEvents].sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 }
            return priorityOrder[a.priority] - priorityOrder[b.priority]
          })
          
          return (
            <div
              key={day.toString()}
              className={`min-h-[120px] p-2 rounded-lg transition-all
                ${!isSameMonth(day, today) ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}
                ${isToday(day) ? 'border-[var(--primary)] border-2' : 'border border-gray-200 dark:border-gray-600'}
                hover:shadow-md hover:border-[var(--primary-light)] dark:hover:border-[var(--primary-light)]
                transform hover:-translate-y-0.5
                cursor-pointer`}
            >
              <div className={`text-sm font-medium mb-2
                ${!isSameMonth(day, today) ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-100'}
                ${isToday(day) ? 'text-[var(--primary)]' : ''}`}
              >
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {sortedEvents.map(event => {
                  const isOverdue = isPast(parseISO(event.time)) && !event.completed
                  
                  return (
                    <div
                      key={event.id}
                      className={`text-xs p-1.5 rounded-md relative overflow-hidden group
                        ${event.completed 
                          ? 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400' 
                          : 'bg-white dark:bg-gray-800 border shadow-sm hover:shadow-md transition-shadow dark:border-gray-700'}`}
                    >
                      <div className={`absolute left-0 top-0 bottom-0 w-1 
                        ${getPriorityColor(event.priority)}`} 
                      />
                      <div className="pl-2 flex items-center gap-1">
                        <span className="text-base">{event.icon || '📅'}</span>
                        <div>
                          <div className={`font-medium ${event.completed ? 'line-through dark:text-gray-400' : 'dark:text-gray-100'}`}>
                            {format(parseISO(event.time), 'h:mm a')} {event.title}
                          </div>
                          {isOverdue && !event.completed && (
                            <div className="text-red-500">Overdue</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarView
