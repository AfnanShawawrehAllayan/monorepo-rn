module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@theme': '../../packages/theme',
          '@components': '../../packages/components',
          '@i18n': '../../packages/i18n',
        },
      },
    ],
  ],
};
