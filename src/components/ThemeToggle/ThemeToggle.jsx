import React from 'react';
import { BsSun, BsMoon } from 'react-icons/bs';
import './ThemeToggle.scss';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <BsMoon /> : <BsSun />}
    </button>
  );
};

export default ThemeToggle;