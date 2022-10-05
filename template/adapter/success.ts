import adapter from '@shushu.pro/adapter';

import { Context } from '@api/types';

/** @description 转化响应的业务数据bizData */
export default function success(ctx: Context) {
  const { responseAdapter } = ctx.config;
  const responseBody = ctx.responseObject.data;

  // 业务数据进行适配转化
  const bizData = responseBody.data;

  if (!bizData || !responseAdapter) {
    return;
  }

  // 函数类型
  if (typeof responseAdapter === 'function') {
    responseBody.data = responseAdapter(bizData, adapter);
  }
  // 对象类型
  else if (typeof responseAdapter === 'object') {
    responseBody.data = adapter(responseAdapter, bizData);
  }
}
