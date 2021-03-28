import { compile } from 'path-to-regexp';
import RequestConfig from './RequestConfig';

function convertRESTful(config: RequestConfig) {
  const { sendData, meta } = config;
  const { params, url } = meta;

  const RESTFulParams = { ...params, ...sendData };

  const urlSplits = url.split('?');
  let baseUrl = urlSplits.shift();
  const queryString = urlSplits.join('?');

  // /api/${id}
  if (/\{\w+\}/.test(baseUrl)) {
    baseUrl = baseUrl.replace(/\{(\w+)\}/g, (match, key) => {
      if (key in RESTFulParams) {
        return RESTFulParams[key];
      }
      return match;
    });
  }

  // /api/:id
  if (/:\w+/.test(baseUrl)) {
    baseUrl = compile(baseUrl, { encode: encodeURIComponent })(RESTFulParams);
  }

  meta.url = baseUrl + (queryString ? `?${queryString}` : '');
}

export default convertRESTful;
