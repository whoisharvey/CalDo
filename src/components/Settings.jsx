import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES } from '../constants/themes';
import CalendarHeader from './CalendarHeader';
import WeekDays from './WeekDays';
import { MoonIcon, SunIcon, ListBulletIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { ClockIcon } from '@heroicons/react/24/solid';

function Settings() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [defaultView, setDefaultView] = useState(localStorage.getItem('defaultView') || 'list');
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
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

  const handleDefaultViewChange = (newView) => {
    setDefaultView(newView);
    localStorage.setItem('defaultView', newView);
  };

  const handleTimeZoneChange = (e) => {
    const newTimeZone = e.target.value;
    setTimeZone(newTimeZone);
    localStorage.setItem('timeZone', newTimeZone);
  };

  const getViewIcon = (view) => {
    switch (view) {
      case 'list':
        return <ListBulletIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />;
      case 'calendar':
        return <CalendarIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />;
      case 'stats':
        return <ChartBarIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />;
      default:
        return null;
    }
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
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Default View</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDefaultViewChange('list')}
                  className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${defaultView === 'list' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  title="Switch to list view"
                >
                  {getViewIcon('list')}
                </button>
                <button
                  onClick={() => handleDefaultViewChange('calendar')}
                  className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${defaultView === 'calendar' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  title="Switch to calendar view"
                >
                  {getViewIcon('calendar')}
                </button>
                <button
                  onClick={() => handleDefaultViewChange('stats')}
                  className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${defaultView === 'stats' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                  title="Switch to stats view"
                >
                  {getViewIcon('stats')}
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Time Zone</h3>
              <select
                value={timeZone}
                onChange={handleTimeZoneChange}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-100 text-sm transition-all duration-200 ease-in-out outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20"
              >
                {Intl.supportedValuesOf('timeZone').map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
