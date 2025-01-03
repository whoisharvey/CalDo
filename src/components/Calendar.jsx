import React, { useState } from 'react'
import { format, startOfWeek, addDays } from 'date-fns'
import { 
  CalendarIcon, 
  PlusIcon, 
  ChartBarIcon, 
  ListBulletIcon 
} from '@heroicons/react/24/outline'
import EventList from './EventList'
import CreateEventDialog from './CreateEventDialog'
import FilterBar from './FilterBar'
import ThemeSelector from './ThemeSelector'
import FloatingActionButton from './FloatingActionButton'
import StatsDashboard from './StatsDashboard'
import CalendarView from './CalendarView'

function Calendar() {
  const [editingEvent, setEditingEvent] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState({ labels: [], priority: null })
  const [view, setView] = useState('list')
  const today = new Date()
  const startOfCurrentWeek = startOfWeek(today)

  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(startOfCurrentWeek, index)
    return {
      dayName: format(date, 'EEE'),
      date: format(date, 'd'),
      isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
    }
  })

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

  const toggleView = () => {
    setView(view === 'list' ? 'calendar' : 'list')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="sticky top-0 z-10">
          <div className="calendar-header p-6 bg-[var(--primary)] dark:bg-[var(--primary-dark)] text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-6xl font-bold">{format(today, 'dd')}</div>
                <div className="text-xl">{format(today, 'EEEE, MMM yyyy')}</div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsDialogOpen(true)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  title="Add task"
                  type="button"
                >
                  <PlusIcon className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={toggleView}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  title={view === 'list' ? "Show calendar" : "Show list"}
                  type="button"
                >
                  {view === 'list' ? (
                    <CalendarIcon className="w-8 h-8 text-white" />
                  ) : (
                    <ListBulletIcon className="w-8 h-8 text-white" />
                  )}
                </button>
                <button
                  onClick={() => setView('stats')}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  title="Show statistics"
                  type="button"
                >
                  <ChartBarIcon className="w-8 h-8 text-white" />
                </button>
                <ThemeSelector />
              </div>
            </div>
            
            {view !== 'calendar' && (
              <div className="grid grid-cols-7 gap-2 mt-6">
                {weekDays.map(({ dayName, date, isToday }) => (
                  <div
                    key={dayName}
                    className={`calendar-day text-center p-2 rounded-lg ${
                      isToday ? 'bg-white bg-opacity-20' : ''
                    }`}
                  >
                    <div className="text-sm">{dayName}</div>
                    <div className="text-lg font-semibold">{date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
