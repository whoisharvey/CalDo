import React from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'

function FloatingActionButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 btn-primary shadow-lg"
      title="Add new task"
    >
      <PlusIcon className="w-6 h-6" />
    </button>
  )
}

export default FloatingActionButton
