import React from 'react'
import { addDays, format, startOfWeek } from 'date-fns'

function WeekDays({ today }) {
  const startOfCurrentWeek = startOfWeek(today)

  const weekDays = React.useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = addDays(startOfCurrentWeek, index)
      return {
        dayName: format(date, 'EEE'),
        date: format(date, 'd'),
        isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
      }
    })
  }, [today, startOfCurrentWeek])

  return (
    <div className="grid grid-cols-7 gap-2 mt-6 pb-4">
      {weekDays.map(({ dayName, date, isToday }) => (
        <div
          key={dayName}
          className={`calendar-day text-center p-2 rounded-lg ${
            isToday ? 'bg-white bg-opacity-20' : ''
          }`}
        >
          <div className="text-sm md:text-sm" style={{ color: 'white' }}>{dayName}</div>
          <div className="text-lg font-semibold" style={{ color: 'white' }}>{date}</div>
        </div>
      ))}
    </div>
  )
}

export default WeekDays
