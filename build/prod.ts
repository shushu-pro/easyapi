import { config } from '@shushu.pro/rollup-config';

export default config({
  preset: 'client',
  input: './src/index.ts',
  output: {
    cjs: { exports: 'named' },
    umd: {
      name: 'easyapi',
      exports: 'named',
      globals: {
        axios: 'axiosLib',
        lodash: '_',
      },
      //   sourcemap: true,
    },
  },
  plugins: {
    terser: false,
  },
  external: ['axios', 'lodash'],
});
