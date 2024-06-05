import easyapi from '@shushu.pro/easyapi';
// import Cookies from 'js-cookie';

import adapter from './adapter';
import { ExtendConfig, ExtendMeta } from './types';

export const { define, request, createAbort } = easyapi<
  ExtendConfig,
  ExtendMeta
>({
  mode: 'development',
  axios: {
    baseURL: '.',
  },
  logger: true,
  delay: 300,
  mockForce: true,

  resolveType: 'data',

  // 请求拦截器
  request(ctx) {
    adapter.request(ctx);

    const { config } = ctx;

    // // 启动mockjson
    // if (typeof config.mockjson === 'string') {
    //   config.mockBody = () => {
    //     return mockJSON(config.mockjson, ctx.payload);
    //   };
    // }

    // 加认证状态token
    // const csrfToken = Cookies.get('token');
    // if (csrfToken) {
    //   ctx.setHeader('x-csrf-token', csrfToken);
    // }

    // 请求前置拦截器,主要用于不同接口满足不同的处理需求
    config.beforeRequest?.(ctx);
  },

  // 响应拦截器
  response(ctx) {
    const { responseObject } = ctx;

    // 二进制数据，不对响应数据进行处理
    if (responseObject.config.responseType === 'arraybuffer') {
      return;
    }

    // 响应前的拦截器
    ctx.config.beforeResponse?.(ctx);

    // 对响应的数据做处理
    const { data, headers } = responseObject;
    const { code } = data;

    // // 储存鉴权码
    // if (headers?.token) {
    //   token = headers.token;
    // }

    // 其他错误
    if (code !== 200 && code !== 0) {
      throw Error(data.message || data.msg);
    }
  },

  // 成功响应拦截器
  success(ctx) {
    adapter.success(ctx);

    const { config } = ctx;
    const { showSuccess } = config;
    const { data } = ctx.responseObject.data;

    if (showSuccess === true) {
      // console.info(data.message || '操作成功');
    } else if (typeof showSuccess === 'string') {
      // console.info(showSuccess);
    }
  },

  // 错误响应拦截器
  failure(ctx) {
    const { error, config, responseObject } = ctx;
    const responseData = responseObject?.data;

    // 将数据信息挂到error的data属性下
    // error.data = responseData?.data;

    ctx.setError(error, responseData?.data);

    // 阻止默认的错误处理
    if (config.showError === false) {
      return;
    }

    // 自定义的错误信息
    if (typeof config.showError === 'string') {
      // message.error(config.showError);
    }
    // 常规的错误处理，显示错误信息
    else {
      // message.error(error.message.substr(0, 100));
    }
  },
});
