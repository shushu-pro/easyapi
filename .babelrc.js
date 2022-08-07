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
          '@ijest': './test/index.ts'
        },
      },
    ],
    // '@babel/plugin-transform-runtime'
  ],
};
