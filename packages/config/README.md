# Shared Configuration Package

This package contains shared configuration files for React Native projects in the monorepo.

## Contents

### ESLint Configuration

Located in `eslint/react-native.js`, this configuration includes:

- TypeScript support
- React and React Native specific rules
- Import sorting and validation
- Jest testing rules
- Prettier integration

Usage in your project's `.eslintrc.js`:

```javascript
module.exports = {
  extends: ['config/eslint/react-native'],
};
```

### TypeScript Configuration

Located in `typescript/react-native.json`, this configuration includes:

- React Native specific settings
- Strict type checking
- Module resolution settings
- Path aliases support
- Enhanced type safety options

Usage in your project's `tsconfig.json`:

```json
{
  "extends": "config/typescript/react-native.json",
  "include": ["src"]
}
```

### Babel Configuration

Located in `babel/react-native.js`, this configuration includes:

- React Native preset
- Module resolver for path aliases
- Reanimated plugin support
- Production optimizations

Usage in your project's `babel.config.js`:

```javascript
module.exports = {
  extends: 'config/babel/react-native',
};
```

## Installation

The package is available as a workspace package. Add it to your project's dependencies:

```json
{
  "dependencies": {
    "config": "workspace:^"
  }
}
```

## Dependencies

### Required Peer Dependencies

- typescript >= 4.0.0
- react-native-reanimated >= 3.0.0

### Included Dependencies

- ESLint and related plugins
- Babel preset and plugins
- TypeScript configuration

## Development

When making changes to configurations:

1. Consider backward compatibility
2. Test changes across all consuming projects
3. Update documentation for any new rules or options
4. Consider the impact on build times and developer experience

## Best Practices

### ESLint

- Keep rules consistent across projects
- Document any rule customizations
- Consider performance impact of rules

### TypeScript

- Maintain strict type checking
- Balance type safety with developer experience
- Keep module resolution consistent

### Babel

- Minimize transform plugins for better performance
- Keep aliases consistent across projects
- Test production builds after changes
