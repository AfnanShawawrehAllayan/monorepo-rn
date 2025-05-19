import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useColorScheme, StatusBar } from 'react-native';

import { lightTheme, darkTheme, Theme } from './theme';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (mode: 'light' | 'dark') => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
}) => {
  const colorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    defaultTheme === 'system'
      ? colorScheme === 'dark'
        ? 'dark'
        : 'light'
      : (defaultTheme as 'light' | 'dark'),
  );

  useEffect(() => {
    if (defaultTheme === 'system') {
      setThemeMode(colorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [colorScheme, defaultTheme]);

  const toggleTheme = useCallback(() => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((mode: 'light' | 'dark') => {
    setThemeMode(mode);
  }, []);

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;
  const isDark = themeMode === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      {children}
    </ThemeContext.Provider>
  );
};
