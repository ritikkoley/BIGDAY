import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-20 items-center rounded-full bg-apple-gray-100 dark:bg-apple-gray-600/50 p-1 transition-colors duration-300 focus:outline-none"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div
        className={`absolute inset-y-1 left-1 h-8 w-8 transform rounded-full bg-white dark:bg-apple-gray-700 shadow-lg ring-0 transition-transform duration-300 ${
          isDark ? 'translate-x-10' : 'translate-x-0'
        }`}
      >
        {isDark ? (
          <Moon className="h-5 w-5 m-1.5 text-apple-gray-400" />
        ) : (
          <Sun className="h-5 w-5 m-1.5 text-apple-blue-500" />
        )}
      </div>
    </button>
  );
};