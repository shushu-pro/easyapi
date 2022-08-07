import http from 'http';
import querystring from 'querystring';

// import type { EasyapiResult } from '../src/index.types';
import easyapi from '../src/easyapi';

const port = 8899;
const baseURL = `http://localhost:${port}/`;
const server = http.createServer((req, res) => {
  const outJSON = (data) => res.end(JSON.stringify(data == null ? {} : data));
  const params = querystring.parse(
    String(req.url).match(/^[^?]*\?(.*)/)?.[1] || ''
  );
  setTimeout(() => {
    switch (params.cmd) {
      case 'http200': {
        return outJSON(params);
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
  http: {
    start,
    close,
    create,
    baseURL,
  },
};

function start() {
  server.listen(port);
}

function close() {
  server.close();
}

function create(code, option) {
  let nextCode = code;
  let nextOption = option;

  if (option === undefined) {
    nextOption = code;
    nextCode = 200;
  }

  const { define } = easyapi<{
    // ..
  }>({
    baseURL,
    ...nextOption,
    // configs: {
    //   test: { url: `?cmd=http${code}`, ...option.config },
    //   ...option.configs,
    // },
  });

  const test = define<any, any>({
    url: `?cmd=http${nextCode}`,
    ...nextOption.config,
  });

  return { test, define };
}

export interface Context {
  http: {
    start: () => void;
    close: () => void;
    create: (...args) => {
      test: (payload?, config?) => Promise<any>;
      define: any;
    };
    baseURL: string;
  };
}
