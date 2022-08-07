/* eslint-disable global-require */
import alias from '@rollup/plugin-alias';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

import defines from './defines';
import external from './external';

const { webpackAlias } = require('../tsinfo');

const extensions = ['.js', '.ts'];

export default {
  input: 'src/easyapi/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      //   sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      //   sourcemap: true,
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'easyapi',
      exports: 'named',
      //   sourcemap: true,
      globals: {
        axios: 'axios',
        lodash: 'lodash',
      },
    },
  ],
  external,
  plugins: [
    // https://www.npmjs.com/package/@rollup/plugin-replace
    replace({
      preventAssignment: true,
      values: defines,
    }),

    alias({
      entries: webpackAlias,
      // entries: [
      //   { find: 'utils', replacement: '../../../utils' },
      //   { find: 'batman-1.0.0', replacement: './joker-1.5.0' },
      // ],
    }),

    // 将CommonJS模块转换成ES6，防止他们在Rollup中失效;
    commonjs(),

    nodeResolve({
      extensions,
      browser: true,
    }),

    babel({
      babelHelpers: 'bundled',
      // runtimeHelpers: true,
      presets: [
        [
          '@babel/preset-env',
          {
            loose: true,
            useBuiltIns: 'entry', // or "usage"
            // useBuiltIns: false,
            corejs: 3,
          },
        ],
        ['@babel/preset-typescript', {}],
      ],
      plugins: [
        // 'lodash',
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
      extensions,
      exclude: 'node_modules/**', // 只编译源代码
    }),

    // https://github.com/terser/terser#minify-options
    terser(),
  ],
};
