# React Native Monorepo

A modern React Native monorepo setup with shared packages for components, themes, hooks, and internationalization.

## Project Structure

```
monorepo-rn/
├── apps/
│   └── chatApp/          # Main React Native application
├── packages/
│   ├── components/       # Shared UI components
│   ├── hooks/           # Shared React hooks
│   ├── theme/           # Theme configuration and utilities
│   └── i18n/            # Internationalization setup
```

## Features

- 📱 React Native mobile application
- 🎨 Shared UI components
- 🌈 Theming support
- 🌍 Internationalization (i18n) with English and Arabic support
- 🪝 Reusable React hooks
- 📦 Yarn workspaces for package management

## Prerequisites

- Node.js >= 18
- Yarn >= 4.9.1
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS dependencies)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd monorepo-rn
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Install iOS dependencies:
   ```bash
   yarn chatApp:install-pods
   ```

4. Start the app:
   - iOS:
     ```bash
     yarn chatApp:run-ios
     ```
   - Android:
     ```bash
     yarn chatApp:run-android
     ```

## Available Scripts

### Root Directory
- `yarn install` - Install all dependencies
- `yarn build` - Build all packages

### Chat App
- `yarn chatApp:run-ios` - Run the iOS app
- `yarn chatApp:run-android` - Run the Android app
- `yarn chatApp:install-pods` - Install iOS dependencies
- `yarn chatApp:start` - Start the Metro bundler

## Packages

### Components
Shared UI components with theme support.

### Theme
Theme configuration and utilities for consistent styling across apps.

### Hooks
Collection of reusable React hooks.

### i18n
Internationalization setup with:
- English and Arabic language support
- RTL support for Arabic
- Easy language switching
- Translation management

## Development

### Adding a New Package
1. Create a new directory in `packages/`
2. Initialize with `package.json`
3. Add to workspace dependencies where needed
4. Run `yarn install` to update dependencies

### Metro Configuration
The monorepo uses `react-native-monorepo-tools` for Metro bundler configuration, enabling:
- Workspace package resolution
- Hot reloading
- Asset management
- Android path resolution

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT
