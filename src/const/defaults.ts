import { AxiosRequestConfig } from 'axios';

/** @description axios默认配置项 */
const axiosDefaults: AxiosRequestConfig = {
  method: 'get',
  responseType: 'json',
  headers: {},
};

/** @description easyapi默认配置项 */
const easyapiDefaults = {
  /** @description 模拟延迟接口响应 */
  delay: 300,

  /** @description 是否启用日志，默认否 */
  logger: false,

  /** @description 开启强制mock */
  mockForce: false,

  /** @description 关闭mock */
  mockOff: false,

  /** @description 处理响应数据，并传递到then里使用 */
  dataFormat: (ctx) => ctx.responseObject,

  errorIgnore: false,
};

export default {
  axios: axiosDefaults,
  easyapi: easyapiDefaults,
};
