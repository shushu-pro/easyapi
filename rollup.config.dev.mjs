import { defineConfig } from '@shushu.pro/rollup';

export default defineConfig({
  input: './demo/index.ts',
  dev: 'browser',
  plugins: {
    swc: { minify: false },
  },
});
