/// 请求对象

import { merge } from 'lodash';

import Cache from './Cache';
import { ErrorIgnoreName } from './const';
import Context from './Context';
import { DefineApiConfig } from './types/ApiConfig';
import { RequestOption } from './types/RequestOption';
import { Runtime } from './types/Runtime';

let uuid = 0;
const createUUID = () => ++uuid;

export default class Request<
  GExtendApiConfig = unknown,
  GExtendEasyapiOption = unknown,
  GPayload = any,
  GResponseData = any
> {
  private readonly uuid: number;

  private readonly runtime: Runtime<GExtendApiConfig, GExtendEasyapiOption>;

  private readonly config: DefineApiConfig<
    GExtendApiConfig,
    GExtendEasyapiOption,
    GPayload,
    GResponseData
  >;

  private readonly cache: Cache<
    GExtendApiConfig,
    GExtendEasyapiOption,
    GPayload,
    GResponseData
  >;

  constructor({
    runtime,
    config,
  }: RequestOption<
    GExtendApiConfig,
    GExtendEasyapiOption,
    GPayload,
    GResponseData
  >) {
    this.uuid = createUUID();
    this.runtime = runtime;
    this.config = merge({}, runtime.defaultConfig, config);
    this.cache = new Cache({
      store: (runtime.cacheStore[this.uuid] = {}),
    });
  }

  cacheResult(ctx) {
    return this.cache.pending(ctx);
  }

  mockResult(
    ctx: Context<
      GExtendApiConfig,
      GExtendEasyapiOption,
      GPayload,
      GResponseData
    >
  ) {
    // 生产模式关闭mock
    if (this.runtime.isProduction && !this.runtime.mockForce) {
      return;
    }

    const { config } = ctx;

    // 关闭mock
    if (config.mockOff) {
      return;
    }

    const { mockHeaders, mockBody, mockData } = config;

    // 不存在mock配置
    if (!mockHeaders && !mockBody && !mockData) {
      return;
    }

    const promiseResult = new Promise((resolve, reject) => {
      let body = null;
      if (mockBody) {
        body = mockBody(ctx);
      } else if (mockData) {
        body = Promise.resolve(mockData(ctx)).then((data) => ({
          code: 0,
          message: null,
          data,
        }));
      }

      Promise.all([
        // mockHeaders
        Promise.resolve(mockHeaders?.(ctx) || {}),
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
    const ctx = new Context<
      GExtendApiConfig,
      GExtendEasyapiOption,
      GPayload,
      GResponseData
    >({
      runtime: this.runtime,
      defineConfig: this.config,
      requestConfig: config || {},
      payload,
    });

    const { request } = this.runtime;

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

  private response(
    ctx: Context<
      GExtendApiConfig,
      GExtendEasyapiOption,
      GPayload,
      GResponseData
    >,
    promiseResult: Promise<any>
  ) {
    const { config } = ctx;
    const { isDevelopment, mockForce, response, success, failure } =
      this.runtime;

    let nextPromiseResult = promiseResult
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

        return typeof config.dataFormat === 'function'
          ? config.dataFormat(ctx)
          : ctx.responseObject;
      })
      .catch((error) => {
        ctx.error = error;
        ctx.error.data = ctx.responseObject;

        try {
          // 异常处理
          if (typeof failure === 'function') {
            failure.call(ctx, ctx);
          }
          throw ctx.error;
        } catch (err) {
          ctx.error = err;
          ctx.error.data = ctx.responseObject;
          throw ctx.error;
        }
      })
      .finally(() => {
        if (isDevelopment && ctx.config.logger) {
          console.warn('=== easyapi.info ===\n', { ctx });
        }
      });

    // 配置了忽略错误，则设置错误的name，通过浏览器全局拦截器拦截错误信息
    if (ctx.config.errorIgnore) {
      nextPromiseResult = nextPromiseResult.catch((error) => {
        error.name = ErrorIgnoreName;
        throw error;
      });
    }

    // 开发模式下，模拟delay效果
    if ((isDevelopment || mockForce) && config.delay) {
      const promiseResult = nextPromiseResult;
      nextPromiseResult = new Promise((resolve, reject) => {
        promiseResult
          .then((data) => {
            setTimeout(() => {
              resolve(data);
            }, config.delay);
          })
          .catch((err) => {
            setTimeout(() => {
              reject(err);
            }, config.delay);
          });
      });
    }

    // 队列中的进行延迟执行
    Promise.resolve().then(() => {
      this.cache.resolves(ctx, nextPromiseResult);
    });

    return nextPromiseResult;
  }

  private response2(
    ctx: Context<
      GExtendApiConfig,
      GExtendEasyapiOption,
      GPayload,
      GResponseData
    >,
    promiseResult: Promise<any>
  ) {
    const { config } = ctx;
    const { isDevelopment, mockForce, response, success, failure } =
      this.runtime;

    let nextPromiseResult = new Promise((resolve, reject) => {
      // 开发模式下，模拟delay效果
      if (isDevelopment || mockForce === true) {
        setTimeout(dispatchPromiseResult, config.delay || 0);
      } else {
        dispatchPromiseResult();
      }

      function dispatchPromiseResult() {
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
              typeof config.dataFormat === 'function'
                ? config.dataFormat(ctx)
                : ctx.responseObject
            );
          })
          .catch((error) => {
            ctx.error = error;
            ctx.error.data = ctx.responseObject;

            try {
              // 异常处理
              if (typeof failure === 'function') {
                failure.call(ctx, ctx);
              }

              return reject(ctx.error);
            } catch (err) {
              ctx.error = error;
              ctx.error.data = ctx.responseObject;
              reject(ctx.error);
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
    if (ctx.config.errorIgnore) {
      nextPromiseResult = nextPromiseResult.catch((error) => {
        error.name = ErrorIgnoreName;
        throw error;
      });
    }

    this.cache.resolves(ctx, nextPromiseResult);

    return nextPromiseResult;
  }
}
