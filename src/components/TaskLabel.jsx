import React from 'react'
import { LABEL_COLORS } from '../constants/labels'

function TaskLabel({ label }) {
  const labelStyle = LABEL_COLORS[label]
  
  if (!labelStyle) return null
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
      ${labelStyle.bg} ${labelStyle.text} ${labelStyle.border}`}>
      {labelStyle.name}
    </span>
  )
}

export default TaskLabel
