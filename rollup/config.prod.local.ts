import config from './core';
import external from './external.prod';

export default config({
  env: {
    mode: 'production',
  },
  input: 'src/index.ts',
  output: {
    es: {
      file: 'easyapi-local/index.js',
      format: 'es',
      sourcemap: true,
    },
  },
  extensions: ['.js', '.ts'],
  external,
});
