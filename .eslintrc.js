module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react-native/all',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native', 'prettier', 'import'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
  },
  env: {
    'react-native/react-native': true,
    node: true,
    es2022: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        project: ['./tsconfig.json', './apps/*/tsconfig.json', './packages/*/tsconfig.json'],
        alwaysTryTypes: true,
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      alias: {
        map: [
          ['@components', './packages/components/src'],
          ['@theme', './packages/theme/src'],
          ['@hooks', './packages/hooks/src'],
          ['@i18n', './packages/i18n/src'],
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        pathGroups: [
          {
            pattern: '@components/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@theme/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@hooks/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '@i18n/**',
            group: 'internal',
            position: 'before',
          },
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
      },
    },
  ],
};
