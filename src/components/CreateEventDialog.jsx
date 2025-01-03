import React, { useState, useEffect } from 'react'
import { format, parse } from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { useEvents } from '../contexts/EventContext'
import { CheckIcon } from '@heroicons/react/24/outline'
import IconSelector from './IconSelector'
import LabelSelector from './LabelSelector'
import { PRIORITY_LEVELS } from '../constants/priorities'
import { useNotification } from '../contexts/NotificationContext'

function CreateEventDialog({ event, onClose }) {
  const { addEvent, updateEvent } = useEvents()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    reminder: false,
    icon: '📅',
    completed: false,
    labels: [],
    priority: 'low'
  })
  const { showNotification } = useNotification();

  useEffect(() => {
    if (event) {
      const zonedTime = utcToZonedTime(event.time, Intl.DateTimeFormat().resolvedOptions().timeZone);
      setFormData({
        title: event.title,
        description: event.description,
        time: format(zonedTime, "yyyy-MM-dd'T'HH:mm"),
        reminder: event.reminder || false,
        icon: event.icon || '📅',
        completed: event.completed || false,
        labels: event.labels || [],
        priority: event.priority || 'low'
      })
    }
  }, [event])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const localTime = parse(formData.time, "yyyy-MM-dd'T'HH:mm", new Date());
    const utcTime = zonedTimeToUtc(localTime, Intl.DateTimeFormat().resolvedOptions().timeZone);

    const eventData = {
      ...formData,
      time: utcTime.toISOString(),
      labels: formData.labels || [],
      priority: formData.priority || 'low'
    }

    if (event) {
      await updateEvent({ ...event, ...eventData })
      showNotification('Task updated successfully!');
    } else {
      await addEvent(eventData)
      showNotification('Task created successfully!');
    }
    onClose()
  }

  const handleLabelToggle = (label) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter(l => l !== label)
        : [...(prev.labels || []), label]
    }))
  }

  return (
    <>
      <div className="dialog-overlay" onClick={onClose} />
      <div className="dialog-content max-w-[90%] md:max-w-md max-h-[90vh] dark:bg-gray-700">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-700 dark:text-gray-100">
          {event ? 'Edit Task' : 'Create a Task'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon
              </label>
              <IconSelector 
                selectedIcon={formData.icon}
                onSelectIcon={(icon) => setFormData(prev => ({ ...prev, icon }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                placeholder="Task title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="form-input dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="form-input dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.time}
                onChange={e => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="form-input dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PRIORITY_LEVELS).map(([key, level]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: key }))}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border flex items-center gap-2
                      transition-all
                      ${formData.priority === key
                        ? `${level.bg} ${level.text} ${level.border}`
                        : 'bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500'
                      }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${level.dot}`} />
                    {level.name}
                  </button>
                ))}
              </div>
            </div>

            <LabelSelector
              selectedLabels={formData.labels || []}
              onLabelToggle={handleLabelToggle}
            />
            
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.reminder}
                  onChange={e => setFormData(prev => ({ ...prev, reminder: e.target.checked }))}
                  className="form-checkbox"
                />
                <span className="text-gray-700 dark:text-gray-300">Set reminder</span>
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-center sticky bottom-0 bg-white dark:bg-gray-700 py-3">
            <button
              type="submit"
              className="w-12 h-12 btn-primary"
            >
              <CheckIcon className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateEventDialog
