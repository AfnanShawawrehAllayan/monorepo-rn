# E2E Testing Setup for Chat App

This document describes the end-to-end (E2E) testing setup for the Chat App using Detox.

## Prerequisites

- Node.js >= 18
- Yarn
- Xcode (for iOS testing)
- Android Studio (for Android testing)
- An iOS Simulator or Android Emulator

## Setup

1. Install dependencies:

```bash
yarn install
```

2. For iOS, install CocoaPods:

```bash
cd ios && pod install && cd ..
```

## Running Tests

### iOS

1. Build the app for testing:

```bash
yarn e2e:build:ios
```

2. Run the tests:

```bash
yarn e2e:test:ios
```

### Android

1. Build the app for testing:

```bash
yarn e2e:build:android
```

2. Run the tests:

```bash
yarn e2e:test:android
```

## Test Structure

The E2E tests are located in the `e2e` directory:

- `e2e/chatApp.test.js`: Main test suite for the chat app
- `e2e/jest.config.js`: Jest configuration for E2E tests
- `.detoxrc.js`: Detox configuration file

## Test Cases

The test suite includes the following test cases:

1. Chat List Screen:

   - Verifies that the chat list is visible on launch
   - Tests navigation to chat room when tapping a chat item

2. Chat Room Screen:
   - Verifies that the chat room screen loads correctly
   - Tests message input and sending functionality

## CI Integration

E2E tests are automatically run in CI using GitHub Actions:

- Tests run on both iOS and Android platforms
- Triggered on push to main branch and pull requests
- Configuration located in `.github/workflows/e2e.yml`

## Adding New Tests

When adding new test cases:

1. Add unique testID props to components you want to test
2. Use Detox matchers to find elements:

   ```javascript
   await element(by.id('testID')).tap();
   await expect(element(by.id('testID'))).toBeVisible();
   ```

3. Group related tests using describe blocks
4. Add appropriate assertions using Detox expectations

## Troubleshooting

Common issues and solutions:

1. iOS build fails:

   - Clean the build: `cd ios && xcodebuild clean && cd ..`
   - Reinstall pods: `cd ios && pod install && cd ..`

2. Android build fails:

   - Clean the build: `cd android && ./gradlew clean && cd ..`
   - Check that your Android emulator matches the one in `.detoxrc.js`

3. Tests are flaky:
   - Increase timeouts in test configuration
   - Add appropriate wait conditions
   - Ensure stable test IDs
