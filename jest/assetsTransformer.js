const path = require('path');

/**
 * @typedef {Object} TransformResult
 * @property {string} code - The transformed code
 */

/**
 * @param {string} src - The source code
 * @param {string} filename - The filename
 * @returns {TransformResult} The transformed result
 */
module.exports = {
  process(src, filename) {
    return {
      code: `module.exports = ${JSON.stringify(path.basename(filename))};`,
    };
  },
}; 