import React from 'react'
import { LABEL_COLORS } from '../constants/labels'

function LabelSelector({ selectedLabels, onLabelToggle }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Categories
      </label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(LABEL_COLORS).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => onLabelToggle(key)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition-all
              ${selectedLabels.includes(key)
                ? `${label.bg} ${label.text} ${label.border}`
                : 'bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500'
              }`}
          >
            {label.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LabelSelector
