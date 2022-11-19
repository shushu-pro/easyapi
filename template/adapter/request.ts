import adapter from  '@shushu.pro/adapter';

import { Context } from '../types';

/** @description 转化请求payload */
export default function request(ctx: Context) {
  const { payload } = ctx;
  const { requestAdapter } = ctx.config;

  if (!payload || !requestAdapter) {
    return;
  }

  // 适配器是函数
  if (typeof requestAdapter === 'function') {
    ctx.payload = requestAdapter(payload, adapter);
  }
  // 适配器是对象
  else if (typeof requestAdapter === 'object') {
    ctx.payload = adapter(requestAdapter, payload);
  }
}
