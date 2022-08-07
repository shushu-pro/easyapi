/// 请求对象

import { merge } from 'lodash';

import Cache from './Cache';
import { IgnoreErrorNameSymbol } from './const';
import defaults from './const/defaults';
import { ApiInstanceConfig, RequestOption, Runtime } from './index.types';
import RequestContext from './RequestContext';

let uuid = 0;
const createUUID = () => ++uuid;

export default class Request<ApiExtendConfig, OtherConfig, Payload, Data> {
  private readonly uuid: number;

  private readonly runtime: Runtime<ApiExtendConfig, OtherConfig>;

  private readonly config: ApiInstanceConfig<
    ApiExtendConfig,
    OtherConfig,
    Payload,
    Data
  >;

  private readonly cache: Cache<ApiExtendConfig, OtherConfig, Payload, Data>;

  constructor({
    runtime,
    config,
  }: RequestOption<ApiExtendConfig, OtherConfig, Payload, Data>) {
    this.uuid = createUUID();
    this.runtime = runtime;
    this.config = merge({}, runtime.globalConfig, config);
    this.cache = new Cache({
      storage: (runtime.cacheStorage[this.uuid] = {}),
    });
  }

  cacheResult(ctx) {
    return this.cache.pending(ctx);
  }

  mockResult(ctx) {
    const { config } = ctx;

    // 非开发模式且未强制启用mock，则不执行mock逻辑
    if (!this.runtime.isDevelopment && this.runtime.forceMock === false) {
      return;
    }

    // 不存在mock配置
    if (!config.mockHeaders && !config.mockBody && !config.mockData) {
      return;
    }

    const promiseResult = new Promise((resolve, reject) => {
      let body = null;
      if (config.mockBody) {
        body = config.mockBody(ctx);
      } else if (config.mockData) {
        body = Promise.resolve(config.mockData(ctx)).then((data) => ({
          code: 0,
          message: null,
          data,
        }));
      }

      Promise.all([
        // mockHeaders
        Promise.resolve(config.mockHeaders?.(ctx) || {}),
        // mockBody
        Promise.resolve(body),
      ])
        .then(([headers, data]) => {
          resolve({
            data,
            headers,
            config: ctx.axiosConfig,
          });
        })
        .catch(reject);
    });

    // console.info('mockResult', ctx);

    return this.response(ctx, promiseResult);
  }

  httpResult(ctx) {
    return this.response(ctx, this.runtime.axiosInstance(ctx.axiosConfig));
  }

  send(payload, config) {
    const ctx = new RequestContext<ApiExtendConfig, OtherConfig, Payload, Data>(
      {
        payload,
        shareConfig: this.config,
        privateConfig: config || {},
        runtime: this.runtime,
      }
    );

    const { request } = this.runtime.handlers;

    // 请求拦截器中进行处理
    if (typeof request === 'function') {
      request.call(ctx, ctx);
    }

    ctx.beforeRequest();

    // 获取结果
    const promiseResult =
      this.cacheResult(ctx) || this.mockResult(ctx) || this.httpResult(ctx);

    return promiseResult;
  }

  private response(ctx, promiseResult) {
    const { config } = ctx;
    const { isDevelopment, handlers } = this.runtime;

    let nextPromiseResult = new Promise((resolve, reject) => {
      // 开发模式下，模拟delay效果
      if (isDevelopment || this.runtime.forceMock === true) {
        setTimeout(dispatchPromiseResult, ctx.config.delay || 0);
      } else {
        dispatchPromiseResult();
      }

      function dispatchPromiseResult() {
        const { response, success, failure } = handlers;
        promiseResult
          .then((responseObject) => {
            // 挂载响应对象
            ctx.responseObject = responseObject;

            // 执行响应拦截器
            if (typeof response === 'function') {
              response.call(ctx, ctx);
            }

            // 执行成功拦截器
            if (typeof success === 'function') {
              success.call(ctx, ctx);
            }

            resolve(
              config.resolver === false
                ? defaults.easyapi.resolver(ctx)
                : config.resolver(ctx)
            );
          })
          .catch((error) => {
            ctx.error = error;
            try {
              if (typeof failure === 'function') {
                failure.call(ctx, ctx);
                return reject(ctx.error);
              }
              reject(config.rejecter(ctx) || ctx.error);
            } catch (error) {
              ctx.error = error;
              reject((ctx.error = config.rejecter(ctx) ?? ctx.error));
            }
          })
          .finally(() => {
            if (isDevelopment && ctx.config.logger) {
              console.warn('=== easyapi.info ===\n', { ctx });
            }
          });
      }
    });

    // 配置了忽略错误，则设置错误的name，通过浏览器全局拦截器拦截错误信息
    if (ctx.config.ignoreError) {
      nextPromiseResult = nextPromiseResult.catch((error) => {
        error.name = IgnoreErrorNameSymbol;
        throw error;
      });
    }

    this.cache.resolves(ctx, nextPromiseResult);

    return nextPromiseResult;
  }
}
