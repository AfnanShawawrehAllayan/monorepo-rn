/**
 * @typedef {Object} Package
 * @property {string} [main] - Main entry point
 * @property {string} [module] - ES module entry point
 * @property {string} ['jsnext:main'] - Legacy ES module entry point
 * @property {string} [browser] - Browser entry point
 */

/**
 * @typedef {Object} ResolverOptions
 * @property {function} defaultResolver - Default resolver function
 */

/**
 * @param {string} path - Module path to resolve
 * @param {ResolverOptions} options - Resolver options
 */
module.exports = (path, options) => {
  // Call the defaultResolver, so we leverage its cache, error handling, etc.
  return options.defaultResolver(path, {
    ...options,
    // Use packageFilter to process parsed `package.json` before the resolution (see https://www.npmjs.com/package/resolve#resolveid-opts-cb)
    packageFilter: /** @param {Package} pkg */ (pkg) => {
      // This is a workaround for https://github.com/facebook/jest/issues/2535
      //
      // We're trying to resolve the 'main' field of some packages that use module or jsnext:main instead
      const main = pkg.main || pkg.module || pkg['jsnext:main'] || pkg.browser;
      
      if (main) {
        pkg.main = main;
      }

      return pkg;
    },
  });
}; 