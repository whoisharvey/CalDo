import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES } from '../constants/themes';
import CalendarHeader from './CalendarHeader';
import WeekDays from './WeekDays';

function Settings() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const today = new Date()

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setSelectedTheme(newTheme);
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
          
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(THEMES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className={`px-3 py-2 rounded-full text-sm font-medium border transition-all
                    flex items-center gap-2
                    ${selectedTheme === key
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-500'
                      : 'bg-gray-50 dark:bg-gray-600 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500'
                    }`}
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
      </div>
    </div>
  );
}

export default Settings;
