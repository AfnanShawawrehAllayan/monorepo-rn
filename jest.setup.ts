/* eslint-disable no-undef */
import '@testing-library/jest-native/extend-expect';
import React from 'react';

// Declare global type for reanimated worklet
declare global {
  var __reanimatedWorkletInit: jest.Mock;
}

// Create base component mock factory
const createComponentMock = (name: string) => {
  const component = ({ children, ...props }: any) => {
    return React.createElement(name, props, children);
  };
  component.displayName = name;
  return component;
};

// Mock react-native
jest.mock('react-native', () => {
  const View = createComponentMock('View');
  const Text = createComponentMock('Text');
  const TouchableOpacity = createComponentMock('TouchableOpacity');
  const TextInput = createComponentMock('TextInput');
  const Image = createComponentMock('Image');
  const ScrollView = createComponentMock('ScrollView');

  return {
    Platform: {
      OS: 'ios',
      select: jest.fn((obj: any) => obj.ios),
    },
    StyleSheet: {
      create: jest.fn((styles: any) => styles),
      flatten: jest.fn((style: any) => {
        if (Array.isArray(style)) {
          return Object.assign({}, ...style);
        }
        return style;
      }),
      compose: jest.fn((style1: any, style2: any) => [style1, style2]),
      hairlineWidth: 1,
      absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
      absoluteFillObject: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
    },
    Animated: {
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        interpolate: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
      timing: jest.fn(() => ({
        start: jest.fn((cb?: () => void) => cb && cb()),
      })),
      spring: jest.fn(() => ({
        start: jest.fn((cb?: () => void) => cb && cb()),
      })),
      View: createComponentMock('Animated.View'),
      Text: createComponentMock('Animated.Text'),
      ScrollView: createComponentMock('Animated.ScrollView'),
      createAnimatedComponent: jest.fn((component: any) => component),
    },
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    useColorScheme: jest.fn(() => 'light'),
    StatusBar: {
      setBarStyle: jest.fn(),
      currentHeight: 20,
    },
    Colors: {
      primary: '#007AFF',
      white: '#FFFFFF',
      lighter: '#F3F3F3',
      light: '#DAE1E7',
      dark: '#444',
      darker: '#222',
      black: '#000000',
    },
    DebugInstructions: 'Debug instructions',
    ReloadInstructions: 'Reload instructions',
    LearnMoreLinks: [],
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
      textDisabled: '#999999',
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
jest.mock('react-native-gesture-handler', () => ({
  PanGestureHandler: createComponentMock('PanGestureHandler'),
  TapGestureHandler: createComponentMock('TapGestureHandler'),
  State: {},
  gestureHandlerRootHOC: jest.fn((component: any) => component),
}));

// Mock reanimated
jest.mock('react-native-reanimated', () => ({
  default: {
    View: createComponentMock('Reanimated.View'),
    createAnimatedComponent: jest.fn((component: any) => component),
    call: jest.fn(),
  },
  useAnimatedStyle: jest.fn(() => ({})),
  withSpring: jest.fn(),
  withTiming: jest.fn(),
  useSharedValue: jest.fn(() => ({ value: 0 })),
}));

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
