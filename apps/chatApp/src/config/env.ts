import { Platform } from 'react-native';

export const ENV = {
  // App
  APP_NAME: 'ChatApp',
  APP_ENV: __DEV__ ? 'development' : 'production',

  // Platform
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',

  // API
  API_URL: __DEV__ ? 'http://192.168.8.3:4000' : 'https://api.production.com',
  API_TIMEOUT: 30000,

  // Feature Flags
  ENABLE_ANALYTICS: !__DEV__,
  ENABLE_CRASH_REPORTING: !__DEV__,

  // Storage Keys
  STORAGE_KEYS: {
    LANGUAGE: '@app_language',
    THEME: '@app_theme',
    USER: '@app_user',
  },

  // Debugging
  DEBUG_MODE: __DEV__,
  API_DEBUG_MODE: __DEV__,
} as const;

// Type for environment configuration
export type Environment = typeof ENV;

// Helper function to get environment variables with type safety
export const getEnvVar = <K extends keyof Environment>(key: K): Environment[K] => ENV[key];

// Helper function to get storage keys with type safety
export const getStorageKey = <K extends keyof typeof ENV.STORAGE_KEYS>(
  key: K,
): (typeof ENV.STORAGE_KEYS)[K] => ENV.STORAGE_KEYS[key];
