# @shushu.pro/easyapi

前端开发 API 系统，支持数据适配器，mock 生成器，支持 RESTFul 方式接口，可以普遍在 vue 或者 react 的 api 相关模块中使用

# 接口管理

## 前言

接口是前后端交互的核心工作，是业务的基础，接口的定义直接影响前端功能的开发和数据的使用，为了更好的进行接口管理，满足前端对接口使用的各种便利操作，特通过此模块完成对接口的各种管理

## 功能描述

1. 接口命名空间
1. 接口全局拦截处理
   1. 请求拦截
   1. 响应拦截
   1. 错误拦截
1. 接口成功后的自动提示
1. 接口错误后的自动提示
1. 请求数据/响应数据自动适配转化
1. 接口响应数据 mock
1. 接口签名支持，满足数据校验/开发自动提示
1. 接口缓存支持
1. 接口调试日志

## 使用方式

1. 设置拦截器
2. 声明接口
3. 使用接口

### 设置拦截器

```tsx
import './adapter';

import adapter from '@shushu.pro/adapter';
import easyapi from '@shushu.pro/easyapi';
import { message } from 'antd';

import { GatewayBasePath, NODE_ENV } from '@/config';

import { CustomConfig, OtherConfig } from './config.types';

let token = null;

const { define } = easyapi<CustomConfig, OtherConfig>({
  env: NODE_ENV as null,
  forceMock: true,
  axios: {
    baseURL: `${GatewayBasePath}api/`,
  },

  // 对响应的数据做处理
  resolver(ctx) {
    return ctx.responseObject.data?.data || ctx.responseObject.data?.resData;
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

    // 加登录状态token
    if (token) {
      ctx.setHeader('token', token);
    }

    if (config.beforeRequest) {
      config.beforeRequest(ctx);
    }
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
      message.success('操作成功');
    } else if (typeof showSuccess === 'string') {
      message.success(showSuccess);
    }
  },

  // 错误响应拦截器
  failure(ctx) {
    const { error, config, responseObject } = ctx;
    const responseData = responseObject.data;

    // 将数据信息挂到error的data属性下
    error.data = responseData.data;

    // 阻止默认的错误处理
    if (config.showError === false) {
      return;
    }

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
```

### 声明接口

```tsx
import { define } from '@/api';

// 请求参数签名
interface RequestParams {
  page: number;
  pageSize: number;
}

// 响应数据签名
interface ResponseData {
  list: Array<{
    id: number;
  }>;
}

// 导出接口
export const getSomeList = define<RequestParams, ResponseData>({
  url: 'api/getSomeList',
  method: 'post',
});
```

### 使用接口

```tsx
import { getSomeList } from '@/api';

getSomeList({ page: 1, pageSize: 20 }).then((data) => {
  //..
});
```

### 模板文件

> 请修改 template 目录下的文件使用
