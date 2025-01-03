import React, { useState } from 'react'
import { useEvents } from '../contexts/EventContext'
import { format, isToday, isTomorrow, isPast } from 'date-fns'
import { 
  PencilIcon, 
  TrashIcon, 
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'
import TaskLabel from './TaskLabel'
import PriorityBadge from './PriorityBadge'
import DeleteConfirmDialog from './DeleteConfirmDialog'
import { useNotification } from '../contexts/NotificationContext'

function EventList({ onEditEvent, activeFilters }) {
  const { events, dispatch, loading } = useEvents()
  const [deleteEventId, setDeleteEventId] = useState(null)
  const { showNotification } = useNotification();
  
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

  const confirmDelete = () => {
    dispatch({ type: 'DELETE_EVENT', payload: deleteEventId, context: { showNotification } })
    setDeleteEventId(null)
  }

  const toggleComplete = (eventId, e) => {
    e.stopPropagation()
    dispatch({ type: 'TOGGLE_COMPLETE', payload: eventId, context: { showNotification } })
  }

  const getTimeStatus = (time) => {
    const date = new Date(time)
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isPast(date)) return 'Past'
    return format(date, 'MMM d')
  }

  const groupedEvents = sortedEvents.reduce((acc, event) => {
    const status = getTimeStatus(event.time)
    if (!acc[status]) {
      acc[status] = []
    }
    acc[status].push(event)
    return acc
  }, {})

  // Ensure specific order of sections
  const sections = ['Past', 'Today', 'Tomorrow', ...Object.keys(groupedEvents)
    .filter(key => !['Past', 'Today', 'Tomorrow'].includes(key))]

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div className="p-2 md:p-6 space-y-6">
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
                      <tr className="h-10">
                        <th className="text-center w-1/12 py-2"></th>
                        <th className="text-center w-1/12 py-2">Icon</th>
                        <th className="text-left w-2/12 py-2">Task Name</th>
                        <th className="text-center w-1/12 py-2">Priority</th>
                        <th className="text-center w-2/12 py-2">Due</th>
                        <th className="text-left w-3/12 py-2">Description</th>
                        <th className="text-center w-1/12 py-2">Categories</th>
                        <th className="text-center w-1/12 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`text-sm dark:text-gray-100 ${index === 2 ? 'h-10' : ''}`}>
                        <td className="py-2 text-center">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={(e) => toggleComplete(event.id, e)}
                              className={`focus:outline-none p-1 text-gray-400 rounded-full ${
                                !event.completed ? 'hover:text-[var(--primary)] hover:bg-[var(--hover)]' : ''
                              }`}
                            >
                              {event.completed ? (
                                <CheckCircleSolidIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                              ) : (
                                <CheckCircleIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-2 text-center">
                          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center mx-auto transition-all
                            ${event.completed 
                              ? 'bg-gray-200 dark:bg-gray-600' 
                              : 'bg-[var(--primary)] bg-opacity-20'}`}
                          >
                            <span className={`text-lg md:text-lg transition-opacity ${event.completed ? 'opacity-40' : ''}`}>
                              {event.icon || '📅'}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 text-left">
                          <div className={`flex items-center gap-2 ${event.completed ? 'opacity-50' : ''}`}>
                            <span className={`text-sm ${event.completed ? 'line-through dark:text-gray-400' : 'font-medium dark:text-gray-100'}`}>
                              {event.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 text-center">
                          <PriorityBadge priority={event.priority} />
                        </td>
                        <td className="py-2 text-center">
                          <div className="flex items-center justify-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <ClockIcon className="w-4 h-4" />
                            {format(new Date(event.time), 'h:mm a')}
                            {isPast(new Date(event.time)) && !event.completed && (
                              <div className="flex items-center gap-1 text-red-500">
                                <ExclamationCircleIcon className="w-4 h-4" />
                                Overdue
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-2 text-left">
                          {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </td>
                        <td className="py-2 text-center">
                          {event.labels?.length > 0 && (
                            <div className="flex flex-wrap gap-1 justify-center">
                              {event.labels.map(label => (
                                <TaskLabel key={label} label={label} />
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-2 text-center">
                          <div className="flex space-x-1 justify-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                onEditEvent(event)
                              }}
                              className="p-1 text-gray-400 hover:text-[var(--primary)] rounded-full hover:bg-[var(--hover)]"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(event.id, e)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {index === 2 && <tr className="h-2"><td colSpan="8"> </td></tr>}
                      <tr className="h-2"></tr>
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
        />
      )}
    </div>
  )
}

export default EventList
