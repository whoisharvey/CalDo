import React, { useState } from 'react'
import { useEvents } from '../contexts/EventContext'
import { format, isToday, isTomorrow, isPast, isSameDay } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'
import TaskLabel from './TaskLabel'
import PriorityBadge from './PriorityBadge'
import { useTheme } from '../contexts/ThemeContext'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import { useNotification } from '../contexts/NotificationContext'
import { styleLibrary } from '../styles/styleLibrary'

function EventList({ onEditEvent, activeFilters }) {
  const { events, dispatch, loading, toggleComplete } = useEvents()
  const [deleteEventId, setDeleteEventId] = useState(null)
  const { showNotification } = useNotification();
  const { theme } = useTheme()
  
  const filteredEvents = events.filter(event => {
    if (activeFilters.labels.length > 0) {
      const hasMatchingLabel = event.labels.some(label => 
        activeFilters.labels.includes(label)
      )
      if (!hasMatchingLabel) return false
    }

    if (activeFilters.priority && event.priority !== activeFilters.priority) {
      return false
    }

    return true
  })

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
    if (priorityDiff !== 0) return priorityDiff
    return new Date(a.time) - new Date(b.time)
  })

  const handleDelete = (eventId, e) => {
    e.stopPropagation()
    setDeleteEventId(eventId)
  }

  const confirmDelete = async () => {
    setDeleteEventId(null)
  }

  const handleToggleComplete = async (event, e) => {
    e.stopPropagation()
    await toggleComplete(event.id, event.completed)
  }

  const getTimeStatus = (time) => {
    const date = utcToZonedTime(time, Intl.DateTimeFormat().resolvedOptions().timeZone)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return 'Past'
    return format(date, 'MMM d')
  }

  const calculateSubtaskProgress = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
    return (completedSubtasks / subtasks.length) * 100;
  };

  const handleToggleSubtask = async (event, subtaskIndex) => {
    await toggleComplete(event.id, event.completed, subtaskIndex);
  };
  const groupedEvents = sortedEvents.reduce((acc, event) => {
    const status = getTimeStatus(event.time)
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(event)
    return acc
  }, {})

  const sections = ['Past', 'Today', 'Tomorrow', ...Object.keys(groupedEvents)
    .filter(key => !['Past', 'Today', 'Tomorrow'].includes(key))]

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div className="p-2 md:p-4 space-y-4 md:space-y-6">
      {sortedEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {events.length === 0 ? (
            "No tasks yet. Click the + button to add your first task!"
          ) : (
            "No tasks match your current filters."
          )}
        </div>
      ) : (
        sections.map(section => {
          if (!groupedEvents[section]?.length) return null
          
          return (
            <div key={section} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {section}
              </h3>
              {groupedEvents[section].map((event, index) => (
                <React.Fragment key={event.id}>
                  <table
                    onClick={() => onEditEvent(event)}
                    className={`task-card group relative w-full table-fixed ${
                      event.completed ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    <thead className="text-xs text-gray-500 dark:text-gray-400">
                      <tr className="h-8 md:h-10">
                        <th className="text-center w-[0.3/12] py-1 md:py-2"></th>
                        <th className="text-center w-[0.8/12] py-1 md:py-2">Icon</th>
                        <th className="text-center w-2/12 py-1 md:py-2">Task Name</th>
                        <th className="text-center w-1/12 py-1 md:py-2">Priority</th>
                        <th className="text-center w-2/12 py-1 md:py-2">Due</th>
                        <th className="text-center w-[1.5/12] py-1 md:py-2">Progress</th>
                        <th className="text-center w-[1/12] py-1 md:py-2">Categories</th>
                        <th className="text-center w-1/12 py-1 md:py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`text-sm dark:text-gray-100 ${index === 2 ? 'h-8 md:h-10' : ''}`}>
                        <td className="py-1 md:py-2 text-center">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={(e) => handleToggleComplete(event, e)}
                              className={`focus:outline-none p-1 text-gray-400 rounded-full ${
                                !event.completed ? 'hover:text-[var(--primary)] hover:bg-[var(--hover)]' : ''
                              }`}
                            >
                              {event.completed ? (
                                <CheckCircleSolidIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-400 dark:text-gray-500" />
                              ) : (
                                <CheckCircleIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-400 dark:text-gray-500" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-1 md:py-2 text-center">
                          <div className={` ${styleLibrary.icon.container}
                            ${event.completed 
                              ? 'bg-gray-200 dark:bg-gray-600' 
                              : 'bg-[var(--primary)] bg-opacity-20'}`}
                          >
                            <span className={`${styleLibrary.icon.text} ${event.completed ? 'opacity-40' : ''}`}>
                              {event.icon || '📅'}
                            </span>
                          </div>
                        </td>
                        <td className="py-1 md:py-2 text-center">
                          <div className={`flex items-center gap-2 ${event.completed ? 'opacity-50' : ''}`}>
                            <span className={`text-sm ${event.completed ? 'line-through dark:text-gray-400' : 'font-medium dark:text-gray-100'}`}>
                              {event.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-1 md:py-2 text-center">
                          <PriorityBadge priority={event.priority} />
                        </td>
                        <td className="py-1 md:py-2 text-center">
                          <div className={`flex items-center justify-center gap-1 text-sm ${styleLibrary.text.secondary}
                            ${isPast(utcToZonedTime(event.time, Intl.DateTimeFormat().resolvedOptions().timeZone)) && !event.completed ? 'text-red-500' : ''}`}
                          >
                            <ClockIcon className="w-3 h-3 md:w-4 md:h-4" />
                            {format(utcToZonedTime(event.time, Intl.DateTimeFormat().resolvedOptions().timeZone), 'h:mm a')}
                          </div>
                        </td>
                        <td className="py-1 md:py-2 text-center">
                          {event.subtasks && event.subtasks.length > 0 && (
                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden max-w-[100px] mx-auto">
                              <div className={`h-full bg-[var(--primary)]`} style={{ width: `${calculateSubtaskProgress(event.subtasks)}%` }} />
                            </div>
                          )}
                          {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </td>
                        <td className="py-1 md:py-2 text-center">
                          {event.labels?.length > 0 && (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {event.labels.map(label => (
                                <TaskLabel key={label} label={label} />
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-1 md:py-2 text-center">
                          <div className="flex space-x-1 justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onEditEvent(event)
                              }}
                              className={`p-1 text-gray-400 hover:text-[var(--primary)] rounded-full hover:bg-[var(--hover)] ${styleLibrary.focus.default}`}
                            >
                              <PencilIcon className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(event.id, e)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900"
                            >
                              <TrashIcon className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {index === 2 && <tr className="h-1 md:h-2"><td colSpan="8"> </td></tr>}
                      <tr className="h-1 md:h-2"></tr>
                    </tbody>
                  </table>
                </React.Fragment>
              ))}
            </div>
          )
        })
      )}
      {deleteEventId && (
        <DeleteConfirmDialog
          onConfirm={confirmDelete}
          onCancel={() => setDeleteEventId(null)}
          eventId={deleteEventId}
        />
      )}
    </div>
  )
}

export default EventList
