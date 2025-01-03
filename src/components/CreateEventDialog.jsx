import React, { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { useEvents } from '../contexts/EventContext'
import { useNotification } from '../contexts/NotificationContext'
import IconSelector from './IconSelector'
import LabelSelector from './LabelSelector'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { PRIORITY_LEVELS } from '../constants/priorities'

function CreateEventDialog({ event: initialEvent, onClose }) {
  const { addEvent, updateEvent } = useEvents()
  const { showNotification } = useNotification()
  const [event, setEvent] = useState({
    title: '',
    time: new Date().toISOString(),
    description: '',
    reminder: false,
    icon: '📅',
    completed: false,
    subtasks: [],
    labels: [],
    priority: 'low'
  })

  useEffect(() => {
    if (initialEvent) {
      console.log('Initial Event:', initialEvent);
      setEvent({
        ...initialEvent,
        time: initialEvent.time ? new Date(initialEvent.time).toISOString() : new Date().toISOString(),
        subtasks: initialEvent.subtasks || [],
        labels: initialEvent.labels || []
      })
    }
  }, [initialEvent])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setEvent(prevEvent => ({
      ...prevEvent,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleTimeChange = (e) => {
    const newTime = e.target.value
    setEvent(prevEvent => ({
      ...prevEvent,
      time: new Date(newTime).toISOString()
    }))
  }

  const handleIconSelect = (icon) => {
    setEvent(prevEvent => ({ ...prevEvent, icon }))
  }

  const handleLabelToggle = (label) => {
    setEvent(prevEvent => {
      const newLabels = prevEvent.labels.includes(label)
        ? prevEvent.labels.filter(l => l !== label)
        : [...prevEvent.labels, label]
      return { ...prevEvent, labels: newLabels }
    })
  }

  const handleSubtaskChange = (index, e) => {
    const { value } = e.target
    setEvent(prevEvent => {
      const newSubtasks = [...prevEvent.subtasks]
      newSubtasks[index] = { ...newSubtasks[index], title: value }
      return { ...prevEvent, subtasks: newSubtasks }
    })
  }

  const handleAddSubtask = () => {
    setEvent(prevEvent => ({
      ...prevEvent,
      subtasks: [...prevEvent.subtasks, { title: '', completed: false }]
    }))
  }

  const handleRemoveSubtask = (index) => {
    setEvent(prevEvent => ({
      ...prevEvent,
      subtasks: prevEvent.subtasks.filter((_, i) => i !== index)
    }))
  }

  const handlePriorityChange = (priority) => {
    setEvent(prevEvent => {
      const updatedEvent = { ...prevEvent, priority };
      console.log('Priority updated:', updatedEvent.priority);
      return updatedEvent;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (event.title.trim() === '') {
      showNotification('Title is required', 'error')
      return
    }

    const eventToSubmit = {
      ...event,
      time: new Date(event.time).toISOString()
    }

    if (initialEvent) {
      await updateEvent(eventToSubmit)
      showNotification('Task updated successfully!', 'success')
    } else {
      await addEvent(eventToSubmit)
      showNotification('Task added successfully!', 'success')
    }
    onClose()
  }

  return (
    <>
      <div className="dialog-overlay" onClick={onClose} />
      <div className="dialog-content">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100">
            {initialEvent ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Task Name
            </label>
            <input
              type="text"
              name="title"
              value={event.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter task name"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Icon
            </label>
            <IconSelector selectedIcon={event.icon} onSelectIcon={handleIconSelect} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date and Time
            </label>
            <input
              type="datetime-local"
              name="time"
              value={format(parseISO(event.time), "yyyy-MM-dd'T'HH:mm")}
              onChange={handleTimeChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              name="description"
              value={event.description}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter task description"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subtasks
            </label>
            <div className="space-y-2">
              {event.subtasks && event.subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={subtask.title}
                    onChange={(e) => handleSubtaskChange(index, e)}
                    className="form-input flex-1"
                    placeholder="Enter subtask"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(index)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSubtask}
                className="btn-secondary"
              >
                Add Subtask
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reminder
            </label>
            <input
              type="checkbox"
              name="reminder"
              checked={event.reminder}
              onChange={handleChange}
              className="form-checkbox"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(PRIORITY_LEVELS).map(([key, level]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePriorityChange(key)}
                  className={`px-2 py-1 rounded-full text-xs font-medium border transition-all
                    flex items-center gap-1.5`}
                >
                  <span className={`w-2 h-2 rounded-full ${level.dot}`} />
                  {level.name}
                </button>
              ))}
            </div>
          </div>
          <LabelSelector selectedLabels={event.labels || []} onLabelToggle={handleLabelToggle} />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initialEvent ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreateEventDialog
