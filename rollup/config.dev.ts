import config from './core';

export default config({
  env: {
    mode: 'development',
  },
  input: 'playground/index.ts',
  output: {
    iife: {
      file: 'temp/index.js',
      sourcemap: true,
      globals: {
        // axiosLib: 'axios',
      },
    },
  },
  extensions: ['.js', '.ts'],
});
