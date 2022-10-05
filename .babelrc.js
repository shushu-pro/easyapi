// jest babel 配置项

module.exports = {
  presets: [
    ['@babel/preset-env', { loose: true }],
    ['@babel/preset-typescript'],
  ],
  plugins: [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@dev/easyapi': ['./src/index.ts'],
          '@dev/easyapi/*': ['./src/*'],
          '@ijest': ['./test/index.ts'],
        },
      },
    ],
    // '@babel/plugin-transform-runtime'
  ],
};
