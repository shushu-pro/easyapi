module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended',
    'plugin:promise/recommended',
    'airbnb-base',
    'prettier',
  ],
  plugins: ['prettier', '@typescript-eslint', 'promise', 'simple-import-sort'],
  rules: {
    'prettier/prettier': 'error',

    // 数组首尾空格和prettier冲突了
    // 'array-bracket-spacing': [ 'error', 'always' ],

    // 允许单句箭头函数包含括号
    'arrow-body-style': 'off',

    // 允许累计运算符，++，--
    'no-plusplus': 0,

    // 允许直接使用new而不需要赋值给变量
    'no-new': 'off',

    // 允许使用console.warn和console.error
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // 允许函数定义在后面
    'no-use-before-define': 'off',

    // 允许使用hasOwnProperty,isPrototypeOf
    'no-prototype-builtins': 'off',

    // 允许修改对象型参数的属性
    'no-param-reassign': ['warn', { props: false }],

    // 允许多重赋值
    'no-multi-assign': 'off',

    // 允许赋值返回值，在惰性加载重写函数的情况下特别有用
    'no-return-assign': ['error', 'except-parens'],

    // 允许使用逗号运算符
    'no-sequences': 'off',

    // 允许for in操作
    'guard-for-in': 'off',

    // 不允许使用with语法
    'no-restricted-syntax': ['error', 'WithStatement'],

    // 允许表达式调用
    'no-unused-expressions': [
      'error',
      {
        // 允许使用逻辑短路运算符
        allowShortCircuit: true,

        // 允许使用三元运算符
        allowTernary: true,

        // 允许使用标记的模板文字
        allowTaggedTemplates: true,
      },
    ],

    // 允许switch没有default
    'default-case': 'off',

    // 允许方法中不使用this
    'class-methods-use-this': 'off',

    // 允许函数返回不一致的值
    'consistent-return': 'off',

    // 允许文件中有多个类声明
    'max-classes-per-file': 'off',

    // 允许使用下划线定义变量名称
    camelcase: 'off',

    // 结构赋值控制
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // 解决ts中enum中的错误提示
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'warn',

    // 关闭已在eslint中定义过的规则
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // 解决ts中enum中的错误提示
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { args: 'none', ignoreRestSiblings: true },
    ],

    // 允许promise没有返回值
    'promise/always-return': 'off',

    // 允许错误没有返回值
    'promise/catch-or-return': 'off',

    // 导入省略扩展名
    'import/extensions': [
      'error',
      {
        // js: 'never',
        // jsx: 'never',
        // ts: 'never',
        // tsx: 'never',
        json: 'ignorePackages',
        // css: 'ignorePackages',
      },
    ],

    // 允许模块不导出default
    'import/prefer-default-export': 'off',

    // 'import/order': [
    //   'error',
    //   {
    //     groups: [
    //       'builtin',
    //       'external',
    //       'internal',
    //       'parent',
    //       'sibling',
    //       'index',
    //       'object',
    //       'type',
    //     ],
    //     pathGroups: [
    //       {
    //         pattern: '@/**',
    //         group: 'parent',
    //       },
    //     ],
    //   },
    // ],

    // 导入排序
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },

    // 忽略导入类型错误提示
    // 'import/ignore': [/\.(scss|less|css)$/],
  },
  overrides: [
    {
      files: ['*.jsx', '*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
