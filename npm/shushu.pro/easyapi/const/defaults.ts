import { AxiosRequestConfig } from 'axios';

/** @description axios默认配置项 */
const axiosDefaults: AxiosRequestConfig = {
  method: 'get',
  responseType: 'json',
  headers: {},
};

/** @description easyapi默认配置项 */
const easyapiDefaults = {
  /** @description 延迟响应，仅development下生效 */
  delay: 0,

  /** @description 是否启用日志，默认否 */
  logger: false,

  resolver: (ctx) => ctx.responseObject?.data?.data,

  rejecter: (ctx) => {
    if (ctx.error.data) {
      ctx.error.data = ctx.config.resolver(ctx);
    }
  },
};

export default {
  axios: axiosDefaults,
  easyapi: easyapiDefaults,
};
