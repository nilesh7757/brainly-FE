import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleToggle = () => {
    console.log('ThemeToggle clicked, current theme:', theme);
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <Sun 
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
            theme === 'light' 
              ? 'text-yellow-500 opacity-100 rotate-0' 
              : 'text-gray-400 opacity-0 -rotate-90'
          }`}
        />
        {/* Moon Icon */}
        <Moon 
          className={`absolute inset-0 w-6 h-6 transition-all duration-500 ${
            theme === 'dark' 
              ? 'text-blue-400 opacity-100 rotate-0' 
              : 'text-gray-400 opacity-0 rotate-90'
          }`}
        />
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default ThemeToggle; 