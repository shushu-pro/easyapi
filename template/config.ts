import './adapter';

import adapter from '@shushu.pro/adapter';
import easyapi from '@shushu.pro/easyapi';
import mockJSON from '@util/mock-json';
import { message } from 'antd';
import Cookies from 'js-cookie';

import { apiBasepath, NODE_ENV } from '@/config';

import { CustomConfig, OtherConfig } from './config.types';

let token = null;

const { define } = easyapi<CustomConfig, OtherConfig>({
  env: NODE_ENV as null,
  forceMock: true,
  axios: {
    baseURL: `${apiBasepath}`,
  },

  logger: true,

  delay: 1000,

  // 对响应的数据做处理
  resolver(ctx) {
    return ctx.responseObject?.data?.data || ctx.responseObject?.data?.resData;
  },

  // 请求拦截器
  request(ctx) {
    const { config, payload } = ctx;
    const { requestAdapter, easymock, url } = config;

    // 请求适配器
    if (typeof requestAdapter === 'function') {
      ctx.payload = requestAdapter(payload, adapter);
    } else if (requestAdapter && typeof requestAdapter === 'object') {
      ctx.payload = adapter(requestAdapter, payload);
    }

    // 开启连接在线mock接口
    if (
      ctx.runtime.isDevelopment &&
      easymock === true &&
      !/^\/?mockapi\//.test(url)
    ) {
      ctx.url = `/mockapi/${url}`.replace(/\/+/g, '/');
    }

    if (typeof config.mockjson === 'string') {
      config.mockBody = () => {
        return mockJSON(config.mockjson, ctx.payload);
      };
    }

    // if (config.mockOff) {
    //   config.mockBody = config.mockData = config.mockHeaders = null;
    // }

    // console.info(document.cookie, Cookies.get('Authorization'));

    // 加认证状态token
    const csrfToken = Cookies.get('_tb_token_');
    if (csrfToken) {
      ctx.setHeader('x-csrf-token', csrfToken);
    }

    if (config.beforeRequest) {
      config.beforeRequest(ctx);
    }

    // console.info('cookie', document.cookie);
  },

  // 响应拦截器
  response(ctx) {
    const { responseObject } = ctx;

    // 二进制数据，不对响应数据进行处理
    if (responseObject.responseType === 'arraybuffer') {
      return;
    }

    const { beforeResponse } = ctx.config;

    // 响应前的拦截器
    if (beforeResponse) {
      beforeResponse(ctx);
    }

    // 对响应的数据做处理
    const { data, headers } = responseObject;
    const { code } = data;

    // 储存鉴权码
    if (headers?.token) {
      token = headers.token;
    }

    // 未登录
    if (code === 500) {
      // throw Error('NO-LOGIN');
    }

    // 其他错误
    if (code !== 200 && code !== 0) {
      throw Error(data.message || data.msg);
    }
  },

  // 成功响应拦截器
  success(ctx) {
    const { config, responseObject } = ctx;
    const { data } = responseObject;
    const { responseAdapter, showSuccess } = config;

    // 业务数据进行适配转化
    const bizData = data.data;

    if (typeof responseAdapter === 'function') {
      data.data = responseAdapter(bizData, adapter);
    } else if (responseAdapter && typeof responseAdapter === 'object') {
      data.data = adapter(responseAdapter, bizData);
    }

    if (showSuccess === true) {
      message.success(data.message || data.msg || '操作成功');
    } else if (typeof showSuccess === 'string') {
      message.success(showSuccess);
    }
  },

  // 错误响应拦截器
  failure(ctx) {
    const { error, config, responseObject } = ctx;
    const responseData = responseObject?.data;

    // 将数据信息挂到error的data属性下
    error.data = responseData?.data;

    // 阻止默认的错误处理
    if (config.showError === false) {
      return;
    }

    // if (error.message === 'NO-LOGIN') {
    //   Modal.confirm({
    //     title: '确定重新登录',
    //     content: '登录信息已失效，点击取消继续留在该页面，或者重新登录',
    //     okText: '重新登录',
    //     width: 500,
    //     centered: true,
    //     onOk () {
    //       window.location.href = '/login';
    //     },
    //     onCancel () { },
    //   });
    //   return;
    // }

    // 自定义的错误信息
    if (typeof config.showError === 'string') {
      message.error(config.showError);
    }
    // 常规的错误处理，显示错误信息
    else {
      message.error(error.message.substr(0, 100));
    }
  },
});

export { define };
