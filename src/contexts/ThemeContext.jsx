import React, { createContext, useContext, useState, useEffect } from 'react'
import { THEMES } from '../constants/themes'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('calendar-theme')
    return saved || 'violet'
  })

  useEffect(() => {
    localStorage.setItem('calendar-theme', theme)
    
    const root = document.documentElement
    const colors = THEMES[theme]
    
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--primary-dark', colors.primaryDark)
    root.style.setProperty('--primary-light', colors.primaryLight)
    root.style.setProperty('--accent', colors.accent)
    root.style.setProperty('--background', colors.background)
    root.style.setProperty('--surface', colors.surface)
    root.style.setProperty('--border', colors.border)
    root.style.setProperty('--hover', colors.hover)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
