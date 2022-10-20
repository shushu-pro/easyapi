import { config } from '@shushu.pro/rollup-config';
import external from './external.prod';

export default config({
  preset: 'client',
  input: './src/index.ts',
  plugins: {
    // terser: false,
  },

  output: {
    cjs: { exports: 'named' },
    umd: {
      name: 'easyapi',
      exports: 'named',
      globals: {
        axios: 'axiosLib',
        lodash: 'lodash',
      },
      //   sourcemap: true,
    },
  },
  external,
});
