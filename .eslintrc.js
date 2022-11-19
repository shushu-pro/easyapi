const { eslintAlias } = require('@shushu.pro/tsconfig');

module.exports = {
  root: true,
  extends: ['@shushu.pro/base'],
  ignorePatterns: ['temp', 'dist', '/public', '**/vendor/*.js', 'dist-local'],
  rules: {
    // 允许多重三元运算符
    'no-nested-ternary': 'off',

    // FIXME:允许函数重载语法
    'no-redeclare': 'off',

    /** @description 设置同名变量规则 */
    '@typescript-eslint/no-shadow': [
      'warn',
      {
        builtinGlobals: false,
        hoist: 'functions',
        allow: ['data', 'option', 'value'],
      },
    ],

    'import/no-import-module-exports': [
      'error',
      {
        exceptions: ['**/src/index.ts'],
      },
    ],

    // 允许方法重载
    'no-dupe-class-members': 'off',

    // 'simple-import-sort/imports': 'error',
    // 'simple-import-sort/exports': 'error',
    // 'import/first': 'off',
    // 'import/newline-after-import': 'error',
    // 'import/no-duplicates': 'error',
  },
  globals: {
    JSX: true,
    React: true,
    qiankunStarted: true,
    env: true,
    requirePublic: true,
    ROLLUP__ENV: true,
  },
  settings: {
    'import/resolver': {
      // 别名配置
      // https://www.npmjs.com/package/eslint-import-resolver-alias
      alias: {
        map: eslintAlias(),
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['webpack/**/*', 'build/**/*', './template/**/*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
        'import/no-dynamic-require': 'off',
        'global-require': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
