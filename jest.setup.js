/* eslint-disable no-undef */
import '@testing-library/jest-native/extend-expect';

// Declare global type for reanimated worklet
declare global {
  var __reanimatedWorkletInit: jest.Mock;
}

// Mock react-native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  return {
    ...RN,
    Platform: {
      ...RN.Platform,
      OS: 'ios',
      select: jest.fn(obj => obj.ios),
    },
    StyleSheet: {
      ...RN.StyleSheet,
      create: jest.fn(styles => styles),
    },
    Animated: {
      ...RN.Animated,
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        interpolate: jest.fn(),
      })),
      timing: jest.fn(() => ({
        start: jest.fn(cb => cb && cb()),
      })),
    },
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
}));

// Mock theme
jest.mock('theme', () => ({
  useTheme: () => ({
    colors: {
      primary: '#007AFF',
      secondary: '#5856D6',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      text: '#000000',
      textSecondary: '#666666',
      textOnPrimary: '#FFFFFF',
      disabled: '#999999',
      error: '#FF3B30',
      success: '#34C759',
    },
    spacing: {
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 32,
    },
    typography: {
      h1: { fontSize: 32, fontWeight: 'bold' },
      h2: { fontSize: 24, fontWeight: 'bold' },
      body: { fontSize: 16 },
      caption: { fontSize: 12 },
    },
  }),
}));

// Mock gesture handler
jest.mock('react-native-gesture-handler', () => {
  const RN = jest.requireActual('react-native');
  return {
    PanGestureHandler: RN.View,
    TapGestureHandler: RN.View,
    State: {},
    gestureHandlerRootHOC: jest.fn(component => component),
  };
});

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  return {
    ...Reanimated,
    default: {
      ...Reanimated.default,
      call: jest.fn(),
    },
  };
});

// Global beforeAll
beforeAll(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
});

// Global beforeEach
beforeEach(() => {
  // Clear all timers before each test
  jest.useFakeTimers();
});

// Global afterEach
afterEach(() => {
  // Run all timers to completion
  jest.runAllTimers();
  // Clear any mocked timers
  jest.useRealTimers();
});
