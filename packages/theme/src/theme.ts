import { Platform } from 'react-native';

// Define the spacing using an 8-point grid system
const createSpacing = (base = 8) => ({
  xs: base / 2, // 4
  s: base, // 8
  m: base * 2, // 16
  l: base * 3, // 24
  xl: base * 4, // 32
  xxl: base * 6, // 48
});

// Define the color palettes
const palette = {
  // Primary colors
  blue: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  // Secondary colors
  teal: {
    50: '#E0F2F1',
    100: '#B2DFDB',
    200: '#80CBC4',
    300: '#4DB6AC',
    400: '#26A69A',
    500: '#009688',
    600: '#00897B',
    700: '#00796B',
    800: '#00695C',
    900: '#004D40',
  },
  // Accent colors
  orange: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800',
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },
  // Neutrals
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  // Status colors
  success: {
    50: '#E8F5E9',
    300: '#81C784',
    500: '#4CAF50',
    700: '#388E3C',
  },
  warning: {
    50: '#FFF8E1',
    300: '#FFD54F',
    500: '#FFC107',
    700: '#FFA000',
  },
  error: {
    50: '#FFEBEE',
    300: '#E57373',
    500: '#F44336',
    700: '#D32F2F',
  },
  info: {
    50: '#E3F2FD',
    300: '#64B5F6',
    500: '#2196F3',
    700: '#1976D2',
  },
  // Core colors
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',
};

// Typography
const typography = {
  fontFamily: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
  },
  fontSize: {
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
    body1: 16,
    body2: 14,
    caption: 12,
    button: 16,
  },
};

// Create the theme object
export const createTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';
  
  return {
    mode,
    colors: {
      // Core theme colors
      primary: palette.blue[500],
      primaryLight: palette.blue[300],
      primaryDark: palette.blue[700],
      
      secondary: palette.teal[500],
      secondaryLight: palette.teal[300],
      secondaryDark: palette.teal[700],
      
      accent: palette.orange[500],
      accentLight: palette.orange[300],
      accentDark: palette.orange[700],
      
      // Status colors
      success: palette.success[500],
      warning: palette.warning[500],
      error: palette.error[500],
      info: palette.info[500],
      
      // Background colors
      background: isDark ? palette.gray[900] : palette.white,
      surface: isDark ? palette.gray[800] : palette.white,
      card: isDark ? palette.gray[800] : palette.white,
      
      // Text colors
      text: isDark ? palette.gray[100] : palette.gray[900],
      textSecondary: isDark ? palette.gray[400] : palette.gray[600],
      textDisabled: isDark ? palette.gray[600] : palette.gray[400],
      textOnPrimary: palette.white,
      textOnSecondary: palette.white,
      
      // Border and divider
      border: isDark ? palette.gray[700] : palette.gray[300],
      divider: isDark ? palette.gray[700] : palette.gray[300],
      
      // Status
      disabled: isDark ? palette.gray[700] : palette.gray[300],
      
      // Utility
      backdrop: 'rgba(0, 0, 0, 0.5)',
      shadow: isDark ? palette.black : palette.gray[500],
    },
    typography,
    spacing: createSpacing(),
    // Add border radiuses
    borderRadius: {
      xs: 2,
      s: 4,
      m: 8,
      l: 16,
      xl: 24,
      round: 999,
    },
    // Add shadows
    shadows: {
      xs: {
        shadowColor: isDark ? palette.black : palette.gray[900],
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.8 : 0.2,
        shadowRadius: 2,
        elevation: 1,
      },
      s: {
        shadowColor: isDark ? palette.black : palette.gray[900],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.8 : 0.23,
        shadowRadius: 2.62,
        elevation: 4,
      },
      m: {
        shadowColor: isDark ? palette.black : palette.gray[900],
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.8 : 0.3,
        shadowRadius: 4.65,
        elevation: 8,
      },
      l: {
        shadowColor: isDark ? palette.black : palette.gray[900],
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: isDark ? 0.8 : 0.37,
        shadowRadius: 7.49,
        elevation: 12,
      },
      xl: {
        shadowColor: isDark ? palette.black : palette.gray[900],
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.8 : 0.44,
        shadowRadius: 10.32,
        elevation: 16,
      },
    },
  };
};

export const lightTheme = createTheme('light');
export const darkTheme = createTheme('dark');

export type Theme = ReturnType<typeof createTheme>;