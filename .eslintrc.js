const path = require('path');

const resolve = (dir) => path.resolve(__dirname, dir);

const { eslintAlias } = require('./tsinfo');

module.exports = {
  root: true,
  extends: ['./npm/shushu.pro/eslint-config-base'],
  ignorePatterns: [
    '/node_modules/',
    'temp',
    'npm',
    'dist',
    '/public/cdn',
    '**/vendor/*.js',
  ],
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

    // // 设置扩展名是否省略和忽略校验
    // 'import/extensions': [
    //   'error',
    //   'always',
    //   {
    //     json: 'always',
    //   },
    // ],

    'import/no-import-module-exports': [
      'error',
      {
        exceptions: ['**/src/index.ts'],
      },
    ],

    // 允许方法重载
    'no-dupe-class-members': 'off',
  },
  globals: {
    JSX: true,
    React: true,
    qiankunStarted: true,
    MODE: true,
  },
  settings: {
    'import/resolver': {
      // 别名配置
      // https://www.npmjs.com/package/eslint-import-resolver-alias
      alias: {
        map: eslintAlias,
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['webpack/**/*', 'rollup/**/*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },

    // 通过require自动加载文档资源
    {
      files: [
        'src/app/doc/view/*/*/index.tsx',
        // 'src/app/doc/component/DocView/createProps/index.ts',
      ],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-dynamic-require': 'off',
        'import/no-webpack-loader-syntax': 'off',
        'import/no-unresolved': 'off',
        'global-require': 'off',
      },
    },
  ],
  // ..
};
