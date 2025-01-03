import React, { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { THEMES } from '../constants/themes'
import { SwatchIcon, MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'

function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [systemTheme, setSystemTheme] = useState(null)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'system') {
      setIsDarkMode(prefersDark)
      setSystemTheme('system')
      document.documentElement.classList.toggle('dark', prefersDark)
    } else if (savedTheme === 'dark') {
      setIsDarkMode(true)
      setSystemTheme(null)
      document.documentElement.classList.add('dark')
    } else {
      setIsDarkMode(false)
      setSystemTheme(null)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = (mode) => {
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(prefersDark)
      setSystemTheme('system')
      localStorage.setItem('theme', 'system')
      document.documentElement.classList.toggle('dark', prefersDark)
    } else {
      const newMode = mode === 'dark'
      setIsDarkMode(newMode)
      setSystemTheme(null)
      localStorage.setItem('theme', newMode ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', newMode)
    }
  }

  return (
    <div className="relative group" style={{ zIndex: 40 }}>
      <button 
        onClick={() => toggleDarkMode(isDarkMode ? 'light' : 'dark')}
        className="p-1 rounded-full hover:bg-white/20 transition-colors"
        title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        type="button"
      >
        {isDarkMode ? (
          <SunIcon className="w-6 h-6 text-white" />
        ) : (
          <MoonIcon className="w-6 h-6 text-white" />
        )}
      </button>
      
      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
        <div className="flex flex-col gap-1 min-w-[120px]">
          <button
            onClick={() => toggleDarkMode('system')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 dark:text-gray-300
              ${systemTheme === 'system' ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-600'}`}
            type="button"
          >
            <ComputerDesktopIcon className="w-4 h-4" />
            System
          </button>
          {Object.entries(THEMES).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 dark:text-gray-300
                ${theme === key ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              type="button"
            >
              <span 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: value.primary }}
              />
              {value.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector
