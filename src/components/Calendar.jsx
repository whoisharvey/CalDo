import React, { useState } from 'react'
import {  } from 'date-fns'
import EventList from './EventList'
import CreateEventDialog from './CreateEventDialog'
import FilterBar from './FilterBar'
import FloatingActionButton from './FloatingActionButton'
import StatsDashboard from './StatsDashboard'
import CalendarView from './CalendarView'
import CalendarHeader from './CalendarHeader'
import WeekDays from './WeekDays'

function Calendar() {
  const [editingEvent, setEditingEvent] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({ labels: [], priority: null })
  const [view, setView] = useState('list')
  const today = new Date()

  const renderView = () => {
    switch (view) {
      case 'calendar':
        return <CalendarView />
      case 'stats':
        return <StatsDashboard />
      default:
        return (
          <>
            {view === 'list' && <FilterBar activeFilters={activeFilters} onFilterChange={setActiveFilters} />}
            <EventList onEditEvent={setEditingEvent} activeFilters={activeFilters} />
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="sticky top-0 z-10 bg-[var(--primary)] dark:bg-[var(--primary-dark)]">
          <CalendarHeader 
            today={today}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            view={view}
            setView={setView}
          />
          {view !== 'calendar' && <WeekDays today={today} />}
        </div>
        
        {renderView()}

        <FloatingActionButton onClick={() => setIsDialogOpen(true)} />

        {(editingEvent || isDialogOpen) && (
          <CreateEventDialog 
            event={editingEvent}
            onClose={() => {
              setEditingEvent(null)
              setIsDialogOpen(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

export default Calendar
