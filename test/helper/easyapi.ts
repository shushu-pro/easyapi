import {
  easyapi as rawEasyapi,
  EasyapiOption,
  DefineApiConfig,
} from '../../src';

import { port } from './const';

export const baseURL = `http://localhost:${port}/`;
export function easyapi(
  option: EasyapiOption<unknown> & {
    config?: Omit<DefineApiConfig, 'url'> & { url?: string };
  },
  code: 200 | 404 | 999 = 200
) {
  const { config: defineConfig, ...easyapiOption } = option;
  const { define } = rawEasyapi({
    resolveType: 'data',
    ...easyapiOption,
    axios: {
      baseURL,
      ...easyapiOption.axios,
    },
  });

  const test = define({
    url: `?cmd=http${code}`,
    ...defineConfig,
  } as any);

  return { test, define };
}

export { createAbort, ErrorIgnoreSymbol } from '../../src';
