# React Native Monorepo

A modern React Native monorepo setup using Yarn workspaces, featuring shared components, themes, and internationalization.

## 📁 Project Structure

```
monorepo-rn/
├── apps/
│   ├── chatApp/               # Chat application
│   └── socialMediaApp/        # Social media application
├── packages/
│   ├── components/           # Shared UI components
│   ├── theme/               # Theme definitions and utilities
│   ├── i18n/                # Internationalization
│   └── hooks/               # Shared React hooks
├── jest/                    # Jest configuration and utilities
└── package.json            # Root package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- Yarn (v1.22 or later)
- React Native development environment setup

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd monorepo-rn
```

2. Install dependencies:
```bash
yarn install
```

3. Start the Metro bundler:
```bash
cd apps/[app-name]
yarn start
```

4. Run on iOS/Android:
```bash
# iOS
yarn ios

# Android
yarn android
```

## 📦 Shared Packages

### Components (`@components`)
Reusable UI components following modern React Native practices:

#### Button
A customizable button component with various variants and sizes.

#### Input
A flexible text input component with built-in label and error handling.

#### Card
A container component that provides consistent elevation and styling:
- Customizable elevation
- Optional outline variant
- Configurable padding
- Shadow support for both iOS and Android

#### Spacer
A utility component for managing spacing in layouts:
- Supports both vertical and horizontal spacing
- Predefined sizes (xs, sm, md, lg, xl, xxl)
- Custom numeric sizes
- Responsive scaling

#### Text
A typography component with theme integration.

### Theme (`@theme`)
Consistent theming system across applications:
- Colors
- Typography
- Spacing
- Other design tokens

### i18n (`@i18n`)
Internationalization support:
- Multiple language support
- RTL handling
- Translation utilities

### Hooks (`@hooks`)
Custom React hooks for common functionality

## 🧪 Testing

We use Jest and React Native Testing Library for testing. Our testing approach follows modern best practices:

### Running Tests

```bash
# Run all tests
yarn test

# Run tests for a specific package/app
yarn test packages/components

# Run tests in watch mode
yarn test --watch

# Update snapshots
yarn test -u
```

### Testing Conventions

1. **Component Tests**
   - Co-located with components (`ComponentName.test.tsx`)
   - Use React Native Testing Library
   - Focus on user interaction and behavior
   - Organized by feature/behavior

2. **Test Structure**
   ```typescript
   describe('ComponentName', () => {
     describe('feature/behavior', () => {
       it('should do something specific', () => {
         // Test implementation
       });
     });
   });
   ```

3. **Best Practices**
   - Use `screen` queries
   - Prefer explicit assertions over snapshots
   - Test accessibility features
   - Use meaningful test IDs

## 📝 Development Guidelines

### Code Style

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for pre-commit hooks

### Component Development

1. **File Structure**
   ```
   ComponentName/
   ├── ComponentName.tsx
   ├── ComponentName.test.tsx
   └── index.ts
   ```

2. **Props Interface**
   ```typescript
   export interface ComponentProps {
     // Props definition
   }
   ```

3. **Testing Requirements**
   - Unit tests for all components
   - Integration tests for complex features
   - Accessibility testing
   - Performance testing for critical components

## 🔧 Configuration Files

- `jest.config.js` - Jest configuration
- `babel.config.js` - Babel configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.js` - ESLint rules
- `.prettierrc.js` - Prettier settings

## 🤝 Contributing

1. Create a new branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
