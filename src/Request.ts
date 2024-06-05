/// 请求对象

import merge from 'lodash.merge';

import Cache from './Cache';
import { ErrorIgnoreSymbol } from './const';
import { Context } from './Context';
import { esModule } from './helper';
import { DefineConfig, RequestOption, Runtime } from './types';

let uuid = 0;
const createUUID = () => ++uuid;

export default class Request<
  GExtendConfig = unknown,
  GExtendMeta = unknown,
  GPayload = unknown,
  GBizData = unknown,
> {
  private readonly uuid: number;

  private readonly runtime: Runtime<GExtendConfig, GExtendMeta>;

  private readonly config: DefineConfig<
    GExtendConfig,
    GExtendMeta,
    GPayload,
    GBizData
  >;

  private readonly cache: Cache<GExtendConfig, GExtendMeta, GPayload, GBizData>;

  constructor({
    runtime,
    config,
  }: RequestOption<GExtendConfig, GExtendMeta, GPayload, GBizData>) {
    this.uuid = createUUID();
    this.runtime = runtime;
    this.config = merge({}, runtime.globalConfig, config);
    this.cache = new Cache({
      store: (runtime.cacheStore[this.uuid] = {}),
    });
  }

  cacheResult(ctx) {
    return this.cache.pending(ctx);
  }

  mockResult(ctx: Context<GExtendConfig, GExtendMeta, GPayload, GBizData>) {
    // 生产模式关闭mock
    if (this.runtime.isProduction && !this.config.mockForce) {
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
      let body: any = null;
      if (mockBody) {
        body = esModule(mockBody(ctx));
      } else if (mockData) {
        body = Promise.resolve(esModule(mockData(ctx))).then((data) => ({
          code: 0,
          data,
          message: null,
        }));
      }

      Promise.all([
        // mockHeaders
        Promise.resolve(esModule(mockHeaders?.(ctx)) || {}),
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
    const ctx = new Context<GExtendConfig, GExtendMeta, GPayload, GBizData>({
      runtime: this.runtime,
      defineConfig: this.config,
      instanceConfig: config || {},
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
    ctx: Context<GExtendConfig, GExtendMeta, GPayload, GBizData>,
    promiseResult: Promise<any>
  ) {
    const { config } = ctx;
    const { isDevelopment, response, success, failure } = this.runtime;

    let nextPromiseResult = promiseResult
      .then((responseObject) => {
        // 挂载响应对象
        ctx.responseObject = responseObject;

        // 标准化数据结构
        config.dataNormalizer?.(ctx);

        // 执行响应拦截器
        if (typeof response === 'function') {
          response.call(ctx, ctx);
        }

        // 执行成功拦截器
        if (typeof success === 'function') {
          success.call(ctx, ctx);
        }

        switch (config.resolveType) {
          case 'data': {
            return ctx.responseObject?.data.data;
          }
          case 'body': {
            return ctx.responseObject?.data;
          }
          case 'fully': {
            return ctx.responseObject;
          }
          case 'headers': {
            return ctx.responseObject?.headers;
          }
          default: {
            return ctx.responseObject?.data.data;
          }
        }
      })
      .catch((error) => {
        ctx.setError(error, error.response || ctx.responseObject);

        try {
          // 异常处理
          if (typeof failure === 'function') {
            failure.call(ctx, ctx);
          }
          throw ctx.error;
        } catch (err) {
          ctx.setError(err, ctx.responseObject);
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
        error.name = ErrorIgnoreSymbol;
        throw error;
      });
    }

    // 开发模式下，模拟delay效果
    if ((isDevelopment || config.mockForce) && config.delay) {
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

    return nextPromiseResult as any;
  }
}
