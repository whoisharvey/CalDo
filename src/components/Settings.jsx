import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES } from '../constants/themes';
import CalendarHeader from './CalendarHeader';
import WeekDays from './WeekDays';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

function Settings() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const today = new Date()

  useEffect(() => {
    setSelectedTheme(theme);
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setSelectedTheme(newTheme);
  };

  const toggleDarkMode = (mode) => {
    setIsDarkMode(mode === 'dark');
    localStorage.setItem('theme', mode);
    document.documentElement.classList.toggle('dark', mode === 'dark');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="sticky top-0 z-10 bg-[var(--primary)] dark:bg-[var(--primary-dark)]">
          <CalendarHeader 
            today={today}
            isDialogOpen={false}
            setIsDialogOpen={() => {}}
            view={'settings'}
            setView={() => {}}
          />
          <WeekDays today={today} />
        </div>
        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100 mb-4">Settings</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Appearance</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleDarkMode('light')}
                  className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${!isDarkMode ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  title="Switch to light mode"
                >
                  <SunIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => toggleDarkMode('dark')}
                  className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isDarkMode ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  title="Switch to dark mode"
                >
                  <MoonIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Color Theme</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(THEMES).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    className={`p-1 rounded-full transition-all
                      flex items-center justify-center
                      ${selectedTheme === key
                        ? 'ring-2 ring-[var(--primary)]'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-500'
                      }`}
                  >
                    <span 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: value.primary }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
