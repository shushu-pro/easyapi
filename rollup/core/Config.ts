import alias from '@rollup/plugin-alias';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import html from '@rollup/plugin-html';
import livereload from 'rollup-plugin-livereload'; // 热更新;
import serve from 'rollup-plugin-serve'; // serve服务;

import Basic from './Basic';

class Config extends Basic {
  initOutput(output) {
    const { es, cjs, umd, iife } = output;

    if (es) {
      this.output.push({
        file: 'dist/index.es.js',
        format: 'es',
        ...(typeof es === 'object' ? es : {}),
      });
    }

    if (cjs) {
      this.output.push({
        file: 'dist/index.cjs.js',
        format: 'cjs',
        exports: 'named',
        ...(typeof cjs === 'object' ? cjs : {}),
      });
    }

    if (umd) {
      this.output.push({
        file: 'dist/index.umd.js',
        format: 'umd',
        exports: 'named',
        ...(typeof umd === 'object' ? umd : {}),
      });
    }

    if (iife) {
      this.output.push({
        file: 'dist/index.iife.js',
        format: 'iife',
        exports: 'named',
        ...(typeof iife === 'object' ? iife : {}),
      });
    }
  }

  initPlugins() {
    this.initReplacePlugin();
    this.initAliasPlugin();
    this.initCommonjsPlugin();
    this.initNodeResolve();
    this.initTypescriptPlugin();
    this.initBabelPlugin();
    // this.initPostcssPlugin();

    this.initJSONPlugin();

    if (this.env.mode === 'development') {
      this.initHTMLPlugin();
      this.initServePlugin();
      this.initLiverloadPlugn();
    } else {
      this.initTerserPlugin();
    }
  }

  // https://www.npmjs.com/package/@rollup/plugin-replace
  initReplacePlugin() {
    this.plugins.push(
      replace({
        // objectGuards: true,
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify(this.env.mode),
          ROLLUP__ENV: JSON.stringify(this.env),
        },
      })
    );
  }

  initAliasPlugin() {
    // eslint-disable-next-line import/no-unresolved
    const { webpackAlias } = require('../tsrc/index');

    this.plugins.push(
      alias({
        entries: webpackAlias,
        // entries: [
        //   { find: 'utils', replacement: '../../../utils' },
        //   { find: 'batman-1.0.0', replacement: './joker-1.5.0' },
        // ],
      })
    );
  }

  // 将CommonJS模块转换成ES6，防止他们在Rollup中失效;
  initCommonjsPlugin() {
    this.plugins.push(commonjs());
  }

  initNodeResolve() {
    this.plugins.push(
      nodeResolve({
        extensions: this.extensions,
        browser: true,
      })
    );
  }

  // https://www.npmjs.com/package/rollup-plugin-typescript2
  initTypescriptPlugin() {
    if (this.env.mode === 'development') {
      return;
    }

    this.plugins.push(
      typescript({
        // tsconfig: resolveFile('./tsconfig.json'), // 本地ts配置
      })
    );
  }

  initBabelPlugin() {
    this.plugins.push(
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
          // ['@babel/preset-react'],
          ['@babel/preset-typescript', {}],
        ],
        plugins: [
          // 'lodash',
          [
            '@babel/plugin-proposal-decorators',
            { version: 'legacy' },
            // { legacy: false, decoratorsBeforeExport: true },
          ],
          ['@babel/plugin-proposal-class-properties', { loose: true }],
        ],
        extensions: this.extensions,
        exclude: 'node_modules/**', // 只编译源代码
      })
    );
  }

  initPostcssPlugin() {
    this.plugins.push(
      postcss({
        modules: true,
        plugins: [],
      })
    );
  }

  // https://github.com/terser/terser#minify-options
  initTerserPlugin() {
    if (this.env.mode === 'development') {
      return;
    }
    this.plugins.push(terser());
  }

  initJSONPlugin() {
    this.plugins.push(json());
  }

  initHTMLPlugin() {
    this.plugins.push(
      html({
        publicPath: '/',
        title: 'shushu',
      })
    );
  }

  initLiverloadPlugn() {
    this.plugins.push(
      livereload({
        watch: ['./temp/'], // 监听文件夹
      })
    );
  }

  initServePlugin() {
    this.plugins.push(
      serve({
        open: true,
        contentBase: ['./temp/'], // 启动文件夹;
        host: 'localhost', // 设置服务器;
        port: '8003', // 端口号;
      })
    );
  }
}

export default Config;
