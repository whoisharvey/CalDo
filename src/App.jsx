import React from 'react'
import Calendar from './components/Calendar'
import { useTheme } from './contexts/ThemeContext'
import Notification from './components/Notification'
import { NotificationProvider } from './contexts/NotificationContext'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Settings from './components/Settings';

function App() {
  const { theme } = useTheme()
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Notification />
        <Router>
          <Routes>
            <Route path="/" element={
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <Calendar />
              </div>
            } />
            <Route path="/settings" element={
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <Settings />
              </div>
            } />
          </Routes>
        </Router>
      </div>
    </NotificationProvider>
  )
}

export default App
