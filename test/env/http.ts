import http from 'http';
import querystring from 'querystring';
import easyapi from '../../src/index';

const port = 8899;
const baseURL = `http://localhost:${port}/`;
const server = http.createServer((req, res) => {
  const outJSON = (data) => res.end(JSON.stringify(data == null ? {} : data));
  const params = querystring.parse(req.url.match(/^[^?]*\?(.*)/)[1]);
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
  start,
  close,
  create,
  baseURL,
};

function start() {
  server.listen(port);
}

function close() {
  server.close();
}

function create(code, option) {
  if (option === undefined) {
    option = code;
    code = 200;
  }
  return easyapi({
    baseURL,
    ...option,
    configs: {
      test: { url: `?cmd=http${code}`, ...option.config },
      ...option.configs,
    },
  });
}
