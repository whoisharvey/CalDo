import React from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useNotification } from '../contexts/NotificationContext'

function DeleteConfirmDialog({ onConfirm, onCancel }) {
  const { showNotification } = useNotification();
  return (
    <>
      <div className="dialog-overlay" onClick={onCancel} />
      <div className="dialog-content max-w-md max-h-md dark:bg-gray-700">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-200" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-100">Delete Task</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
          
          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                console.log('Confirm delete clicked');
                onConfirm();
                showNotification('Task deleted successfully!', 'warning');
              }}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteConfirmDialog
