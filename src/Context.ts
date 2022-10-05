import { AxiosResponse } from 'axios';
import { merge } from 'lodash';

import {
  ContextApiConfig,
  DefineApiConfig,
  ResponseBody,
} from './types/ApiConfig';
import { ContextOption } from './types/ContextOption';
import { Runtime } from './types/Runtime';

export default class Context<
  GExtendApiConfig,
  GExtendEasyapiOption = unknown,
  GPayload = any,
  GResponseData = any
> {
  url: DefineApiConfig['url'];

  payload: GPayload;

  query: Record<string, string>;

  params: Record<string, string>;

  body: Record<string, any>;

  error: Error & { data?: AxiosResponse<ResponseBody<GResponseData>> };

  responseObject: AxiosResponse<ResponseBody<GResponseData>>;

  readonly config: ContextApiConfig<
    GExtendApiConfig,
    GExtendEasyapiOption,
    GPayload,
    GResponseData
  >;

  readonly axios: ContextApiConfig['axios'];

  readonly runtime: Runtime<GExtendApiConfig, GExtendEasyapiOption>;

  readonly easyapi: Runtime<GExtendApiConfig, GExtendEasyapiOption>['easyapi'];

  /** @description 获取axios的配置项 */
  get axiosConfig() {
    const config = {
      ...this.axios,
      url: this.url,
    };

    // payload为请求数据，根据请求方式设置对应的参数
    if (this.payload) {
      // 以下几种请求类型，payload为data
      if (/^(POST|PUT|PATCH)$/i.test(this.axios.method)) {
        config.data = merge({}, this.payload, this.body || {});
      } else {
        config.params = merge({}, this.payload, this.query || {});
      }
    } else {
      config.data = this.body;
      config.params = this.query;
    }

    if (config.data && Object.keys(config.data).length === 0) {
      config.data = null;
    }

    return config;
  }

  constructor({
    runtime,
    defineConfig,
    requestConfig,
    payload,
  }: ContextOption<
    GExtendApiConfig,
    GExtendEasyapiOption,
    GPayload,
    GResponseData
  >) {
    this.url = defineConfig.url;
    this.payload = payload;
    this.runtime = runtime;
    this.query = requestConfig.query ?? null;
    this.body = requestConfig.data ?? null;
    this.params = requestConfig.params ?? null;
    this.responseObject = null;
    this.error = null;
    this.easyapi = runtime.easyapi;
    this.config = merge(
      {},
      runtime.defaultConfig,
      defineConfig,
      requestConfig,
      {
        axios: {
          headers: defineConfig.headers,
          timeout: defineConfig.timeout,
          method: defineConfig.method,
        },
      },
      {
        axios: {
          headers: requestConfig.headers,
          timeout: requestConfig.timeout,
        },
      }
    );
    this.axios = this.config.axios;
    // this.setAbort = requestConfig.setAbort;
  }

  /** @description 设置请求头 */
  setHeader(key: string, value: string) {
    this.axios.headers[key] = value;
  }

  /** @description 请求前会进行一些转化工作 */
  beforeRequest() {
    this.convertRESTful();
    // this.initAbortConfig();
  }

  /** @description 转化restful */
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
    let baseUrl = urlSplits.shift();
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

      Object.keys(payload).forEach((key) => {
        if (!MatchedParams[key]) {
          nextPayload[key] = payload[key];
        }
      });

      this.payload = nextPayload as GPayload;
    }

    this.url = baseUrl + (queryString ? `?${queryString}` : '');
  }

  // /** @description 设置取消请求的钩子 */
  // private initAbortConfig() {
  //   if (this.setAbort) {
  //     const source = CancelToken.source();

  //     this.axios.cancelToken = source.token;

  //     this.setAbort((message) => source.cancel(message));
  //   }
  // }
}
