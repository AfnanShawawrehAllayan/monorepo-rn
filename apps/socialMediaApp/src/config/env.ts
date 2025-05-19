import { Platform } from 'react-native';

export const ENV = {
  // App
  APP_NAME: 'SocialMediaApp',
  APP_ENV: __DEV__ ? 'development' : 'production',

  // Platform
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',

  // API
  API_URL: __DEV__ ? 'http://localhost:3001' : 'https://api.socialmedia.com',
  API_TIMEOUT: 30000,

  // Feature Flags
  ENABLE_ANALYTICS: !__DEV__,
  ENABLE_CRASH_REPORTING: !__DEV__,

  // Storage Keys
  STORAGE_KEYS: {
    LANGUAGE: '@social_app_language',
    THEME: '@social_app_theme',
    USER: '@social_app_user',
    POSTS: '@social_app_posts',
    PROFILE: '@social_app_profile',
    SETTINGS: '@social_app_settings',
  },

  // Debugging
  DEBUG_MODE: __DEV__,
  API_DEBUG_MODE: __DEV__,

  // Social Media Specific
  MAX_POST_LENGTH: 280,
  MAX_MEDIA_ATTACHMENTS: 4,
  SUPPORTED_MEDIA_TYPES: ['image/jpeg', 'image/png', 'video/mp4'],
  CACHE_DURATION: 3600000, // 1 hour in milliseconds
} as const;

// Type for environment configuration
export type Environment = typeof ENV;

// Helper function to get environment variables with type safety
export const getEnvVar = <K extends keyof Environment>(key: K): Environment[K] => ENV[key];

// Helper function to get storage keys with type safety
export const getStorageKey = <K extends keyof typeof ENV.STORAGE_KEYS>(
  key: K,
): (typeof ENV.STORAGE_KEYS)[K] => ENV.STORAGE_KEYS[key];
