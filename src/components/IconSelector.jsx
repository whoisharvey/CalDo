import React from 'react'

const ICONS = {
  "📅": "Default",
  "🐕": "Dog",
  "🏃": "Exercise",
  "🍽️": "Food",
  "💼": "Work",
  "📚": "Study",
  "🎮": "Gaming",
  "🎵": "Music",
  "🏠": "Home",
  "🛒": "Shopping",
  "💪": "Gym",
  "🎨": "Art",
  "🤝": "Meeting",
  "✈️": "Travel",
  "🎉": "Party",
  "💤": "Sleep"
}

function IconSelector({ selectedIcon, onSelectIcon }) {
  return (
    <div className="grid grid-cols-6 md:grid-cols-8 gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
      {Object.entries(ICONS).map(([icon, label]) => (
        <button
          key={icon}
          type="button"
          onClick={() => onSelectIcon(icon)}
          className={`w-10 h-10 text-xl flex items-center justify-center rounded-lg 
            transition-all duration-200 ease-in-out
            ${selectedIcon === icon 
              ? 'bg-[var(--primary)] bg-opacity-20 shadow-sm' 
              : 'hover:bg-[var(--primary)] hover:bg-opacity-10 dark:hover:bg-gray-600'}`}
          title={label}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}

export default IconSelector
