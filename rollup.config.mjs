import { defineConfig } from '@shushu.pro/rollup';

const isProd = !process.env.ROLLUP_WATCH;

export default defineConfig({
  output: {
    dts: true,
    es: true,
    cjs: true,
  },
  browser: true,
  plugins: {
    swc: {
      minify: isProd,
    },
  },
});
