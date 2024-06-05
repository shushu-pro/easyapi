import { AxiosRequestConfig } from 'axios';
import merge from 'lodash.merge';

import { ResponseError } from './ResponseError';
import {
  BaseConfig,
  CompositeConfig,
  ContextOption,
  ResponseObject,
  Runtime,
} from './types';

export class Context<
  GExtendConfig,
  GExtendMeta = unknown,
  GPayload = unknown,
  GBizData = unknown,
> {
  url: BaseConfig['url'];

  /**
   * @description 接口请求参数，根据method决定查询的类型，get|option将赋值给query，其他赋值给body
   */
  payload: GPayload;

  /**
   * @description 接口请求query参数
   */
  query: BaseConfig['query'];

  /**
   * @description 接口请求url路径参数
   */
  params: BaseConfig['params'];

  /**
   * @description 接口请求body
   */
  data: BaseConfig['data'];

  /**
   * @description 接口响应的错误
   */
  error: ResponseError<GBizData> | null;

  /**
   *  @description 接口响应的对象
   */
  responseObject: ResponseObject<GBizData> | null;

  /**
   *  @description 合成的接口配置项
   */
  readonly config: CompositeConfig<
    GExtendConfig,
    GExtendMeta,
    GPayload,
    GBizData
  >;

  /**
   * @description 配置元数据
   */
  readonly meta: GExtendMeta;

  /**
   * @description axios请求配置选项
   */
  readonly axios: AxiosRequestConfig;

  /**
   * @description 运行环境变量
   */
  readonly runtime: Runtime<GExtendConfig, GExtendMeta>;

  /** @description 获取axios的配置项 */
  get axiosConfig(): AxiosRequestConfig {
    const config = {
      ...this.axios,
      url: this.url,
    };

    // payload为请求数据，根据请求方式设置对应的参数
    const { payload } = this;
    if (payload) {
      if (/^(get|option)$/i.test((this.axios.method as string) || 'get')) {
        config.params = merge({}, this.payload, this.query || {});
      }
      // FormData
      else if (typeof FormData === 'object' && payload instanceof FormData) {
        config.data = payload;
      }
      // payload为 key-value对象，与data进行合并
      else if (typeof payload === 'object' && !Array.isArray(payload)) {
        config.data = merge({}, this.payload, this.data || {});
      }
      // 数组，字符串
      else {
        config.data = this.payload;
      }
    } else {
      config.data = this.data;
      config.params = this.query;
    }

    // if (config.data && Object.keys(config.data).length === 0) {
    //   config.data = null;
    // }

    // if (
    //   String(this.axios.headers['Content-Type']).includes(
    //     'application/x-www-form-urlencoded'
    //   )
    // ) {
    //   config.data = this.payload || this.data;
    // }

    return config;
  }

  constructor({
    runtime,
    defineConfig,
    instanceConfig,
    payload,
  }: ContextOption<GExtendConfig, GExtendMeta, GPayload, GBizData>) {
    this.url = defineConfig.url;
    this.payload = payload;
    this.runtime = runtime;
    this.query = instanceConfig.query;
    this.data = instanceConfig.data;
    this.params = instanceConfig.params;
    this.responseObject = null;
    this.error = null;
    this.meta = runtime.meta;
    this.config = merge(
      {},
      runtime.globalConfig,
      defineConfig,
      instanceConfig,
      {
        axios: {
          headers: defineConfig.headers,
          timeout: defineConfig.timeout,
          method: defineConfig.method,
        },
      },
      {
        axios: {
          headers: instanceConfig.headers,
          timeout: instanceConfig.timeout,
        },
      }
    );
    this.axios = this.config.axios;
  }

  /**
   * @description 设置请求头
   */
  setHeader(key: string, value: string) {
    this.axios.headers[key] = value;
  }

  setError(err: string | Error, data?) {
    this.error = new ResponseError(err, data);
  }

  throwError(err: string | Error, data?) {
    this.setError(err, data);
    throw this.error;
  }

  /**
   * @description 请求前进行一些转化工作
   */
  beforeRequest() {
    this.convertRESTful();
  }

  /**
   * @description 转化restful
   */
  private convertRESTful() {
    const { payload, params, url } = this;
    const RESTFulParams = params || payload;

    // 无参数，则不进行转化
    if (
      !RESTFulParams ||
      typeof RESTFulParams !== 'object' ||
      Object.keys(RESTFulParams).length === 0
    ) {
      return;
    }

    const usePayload = !params;
    const MatchedParams = usePayload && {};

    const urlSplits = url.split('?');
    let baseUrl = urlSplits.shift() as string;
    const queryString = urlSplits.join('?');

    // /api/:param1/:param2
    if (/(^|\/)(:\w+)(?=\/|$)/.test(baseUrl)) {
      baseUrl = baseUrl.replace(
        /(\/|^)(:\w+)(?=\/|$)/g,
        (all, prefix, match) => {
          const key = match.replace(/[^\w]/g, '');
          if (key && key in RESTFulParams) {
            MatchedParams && (MatchedParams[key] = true);
            return prefix + RESTFulParams[key];
          }
          return all;
        }
      );
    }

    // 从payload中匹配了params的，则从payload中移除
    if (
      usePayload &&
      !Array.isArray(payload) &&
      Object.keys(MatchedParams).length > 0
    ) {
      const nextPayload = {};

      Object.keys(payload as object).forEach((key) => {
        if (!MatchedParams[key]) {
          nextPayload[key] = payload[key];
        }
      });

      this.payload = nextPayload as GPayload;
    }

    this.url = baseUrl + (queryString ? `?${queryString}` : '');
  }
}
