const { eslintAlias } = require('@shushu.pro/tsconfig');

module.exports = {
  root: true,
  extends: ['@shushu.pro/base'],
  ignorePatterns: ['dist'],
  rules: {},
  settings: {
    'import/resolver': {
      alias: {
        map: eslintAlias({ base: __dirname }),
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    },
  },
};
