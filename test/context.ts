import http from 'http';
import qs from 'qs';

import easyapi from '@dev/easyapi';
import type { DefineApiConfig, EasyapiOption } from '@dev/easyapi/index';

// import type { EasyapiResult } from '../src/index.types';
import { ErrorIgnoreName } from '../src/const';

const port = 8899;
const baseURL = `http://localhost:${port}/`;
const server = http.createServer((req, res) => {
  const outJSON = (data) => res.end(JSON.stringify(data == null ? {} : data));
  const params = qs.parse(String(req.url).match(/^[^?]*\?(.*)/)?.[1] || '');
  setTimeout(() => {
    switch (params.cmd) {
      case 'http200': {
        return outJSON({ code: 0, data: params });
      }
      case 'http404': {
        res.statusCode = 404;
        return res.end();
      }
      case 'http999': {
        return;
      }
      default: {
        console.error(`unhandle request ${JSON.stringify(params)}`);
      }
    }
  }, Number(params.ms) || 0);
});

export default {
  easyapi: ieasyapi,
  http: {
    start,
    close,
    baseURL,
  },
  ErrorIgnoreName,
};

function start() {
  server.listen(port);
}

function close() {
  server.close();
}

function ieasyapi(
  option: EasyapiOption<unknown> & {
    config?: Omit<DefineApiConfig, 'url'> & { url?: string };
  },
  code: 200 | 404 | 999 = 200
) {
  const { config: defineConfig, ...easyapiOption } = option;
  const { define } = easyapi({
    dataFormat: (ctx) => ctx.responseObject?.data?.data,
    ...easyapiOption,
    axios: {
      baseURL,
      ...easyapiOption.axios,
    },
  });

  const test = define({
    url: `?cmd=http${code}`,
    ...defineConfig,
  });

  return { test, define };
}

ieasyapi.abort = easyapi.abort;
