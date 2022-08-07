module.exports = {
  root: true,
  extends: ['../eslint-config-base'],
  plugins: ['react'],
  rules: {
    // https://www.npmjs.com/package/eslint-plugin-react
    // 关闭props类型检测
    'react/prop-types': 'off',

    // 允许匿名组件
    'react/display-name': 'off',

    // 检测缺少key的jsx
    'react/jsx-key': ['warn', { checkFragmentShorthand: true }],

    // 强制要求转译html特殊字符
    'react/no-unescaped-entities': ['error', { forbid: ['>', '<'] }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
