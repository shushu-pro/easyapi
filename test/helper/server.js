import http from 'node:http';
import qs from 'qs';

import { port } from './const';

const server = http.createServer((req, res) => {
  const outJSON = (data) => res.end(JSON.stringify(data == null ? {} : data));
  const params = qs.parse(String(req.url).match(/^[^?]*\?(.*)/)?.[1] || '');
  setTimeout(
    () => {
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
    },
    Number(params.ms) || 0
  );
});

server.listen(port, () => {
  console.info(`server start at:${port}`);
});
