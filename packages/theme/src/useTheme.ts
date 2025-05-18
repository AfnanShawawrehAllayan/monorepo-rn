import { useContext } from 'react';

import { ThemeContext } from './ThemeProvider';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context.theme;
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  
  return {
    isDark: context.isDark,
    toggleTheme: context.toggleTheme,
    setTheme: context.setTheme,
  };
};