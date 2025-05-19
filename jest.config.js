/** @type {import('jest').Config} */
const sharedConfig = {
  preset: 'react-native',
  
  // تحويل الملفات
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
          'module:metro-react-native-babel-preset',
        ],
        plugins: [
          ['@babel/plugin-transform-flow-strip-types'],
          ['@babel/plugin-proposal-private-methods', { loose: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
          '@babel/plugin-transform-modules-commonjs',
          'react-native-reanimated/plugin',
        ],
      },
    ],
  },
  

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  

  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/build/',
    '\\.snap$',
    '/e2e/',
  ],
  

  rootDir: '.',
  

  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
  ],
  

  moduleNameMapper: {
    '^@chatApp/(.*)$': '<rootDir>/apps/chatApp/src/$1',
    '^@socialMediaApp/(.*)$': '<rootDir>/apps/socialMediaApp/src/$1',
    '^@components/(.*)$': '<rootDir>/packages/components/src/$1',
    '^@theme/(.*)$': '<rootDir>/packages/theme/src/$1',
    '^@hooks/(.*)$': '<rootDir>/packages/hooks/src/$1',
    '^@i18n/(.*)$': '<rootDir>/packages/i18n/src/$1',
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/jest/assetsTransformer.js',

    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },


  collectCoverageFrom: [
    'apps/*/src/**/*.{js,jsx,ts,tsx}',
    'packages/*/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/__mocks__/**',
  ],
  

  testEnvironment: 'node',
  

  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|native-base|react-native-reanimated|@react-native-async-storage/async-storage|@react-native-community/async-storage|@react-native-picker/picker|@react-native/.*|react-native-.*)/)',
  ],


  globals: {
    'ts-jest': {
      babelConfig: true,
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    },
    __DEV__: true,
  },


  moduleDirectories: ['node_modules', '<rootDir>/node_modules'],
  resolver: '<rootDir>/jest/resolver.js',
  

  prettierPath: null,
  
  
  setupFiles: [
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
  ],
};

module.exports = {
  ...sharedConfig,
  projects: [
    {
      ...sharedConfig,
      displayName: 'components',
      testMatch: ['<rootDir>/packages/components/**/*.test.{js,jsx,ts,tsx}'],
      rootDir: '.',
    },
    {
      ...sharedConfig,
      displayName: 'chatApp',
      testMatch: ['<rootDir>/apps/chatApp/**/*.test.{js,jsx,ts,tsx}'],
      rootDir: '.',
    },
    {
      ...sharedConfig,
      displayName: 'socialMediaApp',
      testMatch: ['<rootDir>/apps/socialMediaApp/**/*.test.{js,jsx,ts,tsx}'],
      rootDir: '.',
    },
  ],
}; 