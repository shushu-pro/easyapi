/* eslint-disable global-require */
import alias from '@rollup/plugin-alias';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import livereload from 'rollup-plugin-livereload'; // 热更新;
import serve from 'rollup-plugin-serve'; // serve服务;
import { terser } from 'rollup-plugin-terser';

import defines from './defines';
import external from './external';

const { webpackAlias } = require('../tsinfo');

const extensions = ['.js', '.ts'];

export default {
  input: 'src/playground/index.ts',
  output: {
    file: './temp/index.bundle.js',
    format: 'iife',
    name: 'playground',
    sourcemap: !true,
    globals: {
      axiosLib: 'axios',
    },
  },
  // external,
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
    // terser(),

    serve({
      open: true,
      contentBase: ['./temp/'], // 启动文件夹;
      host: 'localhost', // 设置服务器;
      port: 8003, // 端口号;
    }),

    livereload({
      watch: ['./temp/'], // 监听文件夹
    }),

    html({
      publicPath: '/',
      title: 'shushu',
    }),
  ],
};
