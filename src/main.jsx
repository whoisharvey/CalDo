import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { EventProvider } from './contexts/EventContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { NotificationProvider } from './contexts/NotificationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <NotificationProvider>
        <EventProvider>
          <App />
        </EventProvider>
      </NotificationProvider>
    </ThemeProvider>
  </React.StrictMode>
)
