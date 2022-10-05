import config from './core';
import external from './external.prod';

export default config({
  env: {
    mode: 'production',
  },
  input: 'src/index.ts',
  output: {
    cjs: {
      file: 'dist/index.cjs.js',
      exports: 'named',
      // sourcemap: true,
    },
    es: {
      file: 'dist/index.es.js',
      format: 'es',
      //   sourcemap: true,
    },
    umd: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'libName',
      exports: 'named',
      globals: {
        axios: 'axiosLib',
        lodash: 'lodash',
      },
      //   sourcemap: true,
    },
  },
  extensions: ['.js', '.ts'],
  external,
});
