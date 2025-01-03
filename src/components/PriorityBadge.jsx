import React from 'react'
import { 
  ExclamationCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline'

function PriorityBadge({ priority }) {
  const config = {
    high: {
      icon: ExclamationCircleIcon,
      bg: 'bg-red-100',
      text: 'text-red-700',
      label: 'High'
    },
    medium: {
      icon: ExclamationTriangleIcon,
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      label: 'Medium'
    },
    low: {
      icon: InformationCircleIcon,
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      label: 'Low'
    }
  }

  const settings = config[priority]
  if (!settings) return null
  
  const Icon = settings.icon
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
      ${settings.bg} ${settings.text}`}
    >
      <Icon className="w-3 h-3" />
      {settings.label}
    </span>
  )
}

export default PriorityBadge
