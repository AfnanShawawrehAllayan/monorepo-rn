const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const {
  getMetroTools,
  getMetroAndroidAssetsResolutionFix,
} = require('react-native-monorepo-tools');

const monorepoMetroTools = getMetroTools();
const androidAssetsResolutionFix = getMetroAndroidAssetsResolutionFix();

// Add workspace packages to watch folders
const workspacePackages = [
  path.resolve(__dirname, '../../packages/theme'),
  path.resolve(__dirname, '../../packages/components'),
  path.resolve(__dirname, '../../packages/i18n'),
];

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  transformer: {
    publicPath: androidAssetsResolutionFix.publicPath,
  },
  server: {
    enhanceMiddleware: middleware => {
      return androidAssetsResolutionFix.applyMiddleware(middleware);
    },
    securityHeaders: false,
  },
  watchFolders: [...monorepoMetroTools.watchFolders, ...workspacePackages],
  resolver: {
    extraNodeModules: {
      ...monorepoMetroTools.extraNodeModules,
      '@theme': path.resolve(__dirname, '../../packages/theme'),
      '@components': path.resolve(__dirname, '../../packages/components'),
      '@i18n': path.resolve(__dirname, '../../packages/i18n'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
