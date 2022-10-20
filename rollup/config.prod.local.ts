import { config } from '@shushu.pro/rollup-config';
import external from './external.prod';

export default config({
  preset: 'es',
  input: './src/index.ts',
  plugins: {
    // terser: false,
  },
  output: {
    es: {
      exports: 'named',
      file: './dist-local/index.js',
    },
  },
  external,
});
