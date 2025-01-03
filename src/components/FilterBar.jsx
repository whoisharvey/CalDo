import React from 'react'
import { LABEL_COLORS } from '../constants/labels'
import { PRIORITY_LEVELS } from '../constants/priorities'
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'

function FilterBar({ activeFilters, onFilterChange }) {
  const { labels = [], priority = null } = activeFilters

  const toggleLabel = (label) => {
    const newLabels = labels.includes(label)
      ? labels.filter(l => l !== label)
      : [...labels, label]
    onFilterChange({ ...activeFilters, labels: newLabels })
  }

  const setPriority = (newPriority) => {
    onFilterChange({ 
      ...activeFilters, 
      priority: priority === newPriority ? null : newPriority 
    })
  }

  const clearFilters = () => {
    onFilterChange({ labels: [], priority: null })
  }

  const hasActiveFilters = labels.length > 0 || priority !== null

  return (
    <div className="p-2 md:p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <FunnelIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(LABEL_COLORS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleLabel(key)}
              className={`px-2 py-1 rounded-full text-xs font-medium border transition-all
                ${labels.includes(key)
                  ? `${label.bg} ${label.text} ${label.border}`
                  : 'bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500'
                }`}
            >
              {label.name}
            </button>
          ))}
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-600 mx-2" />

        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(PRIORITY_LEVELS).map(([key, level]) => (
            <button
              key={key}
              onClick={() => setPriority(key)}
              className={`px-2 py-1 rounded-full text-xs font-medium border transition-all
                flex items-center gap-1.5
                ${activeFilters.priority === key
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
    </div>
  )
}

export default FilterBar
