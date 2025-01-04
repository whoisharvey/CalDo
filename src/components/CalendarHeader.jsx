import React from 'react'
import { format } from 'date-fns'
import { 
  CalendarIcon, 
  PlusIcon, 
  ChartBarIcon, 
  ListBulletIcon,
  MoonIcon,
  SunIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import ThemeSelector from './ThemeSelector'
import { useTheme } from '../contexts/ThemeContext'
import { Link } from 'react-router-dom';

function CalendarHeader({ today, isDialogOpen, setIsDialogOpen, view, setView }) {
  const toggleView = () => {
    setView(view === 'list' ? 'calendar' : 'list')
  }
  const { theme } = useTheme()
  const isDarkMode = theme === 'dark'

  return (
    <div className="p-4 md:p-4" style={{ color: 'white' }}>
      <div className="flex justify-between items-start">
        <div style={{ color: 'white' }}>
          <div className="text-4xl md:text-5xl font-bold" style={{ color: 'white' }}>{format(today, 'dd')}</div>
          <div className="text-lg" style={{ color: 'white' }}>{format(today, 'EEEE, MMM yyyy')}</div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            title="Add task"
            type="button"
          >
            <PlusIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
          <button
            onClick={toggleView}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            title={view === 'list' ? "Show calendar" : "Show list"}
            type="button"
          >
            {view === 'list' ? (
              <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            ) : (
              <ListBulletIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            )}
          </button>
          <button
            onClick={() => setView('stats')}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            title="Show statistics"
            type="button"
          >
            <ChartBarIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <ThemeSelector />
            <Link to="/settings" className="p-1 rounded-full hover:bg-white/20 transition-colors" title="Settings">
              <Cog6ToothIcon className="w-5 h-5 md:w-6 md:h-6 text-white" style={{ color: 'white' }}/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarHeader
