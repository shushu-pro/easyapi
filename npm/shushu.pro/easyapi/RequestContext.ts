import axios from 'axios';
import { merge } from 'lodash';

import {
  ApiInstanceConfig,
  ApiPresetConfig,
  ApiShareConfig,
  RequestContextOption,
  ResponseBody,
  Runtime,
} from './index.types';

const { CancelToken } = axios;

export default class RequestContext<
  ApiExtendConfig,
  OtherConfig = unknown,
  Payload = any,
  Data = any
> {
  url: ApiShareConfig['url'];

  payload: Payload;

  query;

  data;

  params;

  responseObject: {
    headers: ApiPresetConfig['headers'];
    config: ApiPresetConfig['axios'];
    data: ResponseBody<Data>;
    responseType: string;
  };

  error: Error & { data?: Data };

  readonly axios: ApiPresetConfig['axios'];

  readonly config: ApiInstanceConfig<
    ApiExtendConfig,
    OtherConfig,
    Payload,
    Data
  >;

  setAbort: (abort) => void;

  private cancelToken;

  readonly dataset: Record<string, any>;

  readonly runtime: Runtime<ApiExtendConfig, OtherConfig>;

  constructor({
    payload,
    shareConfig,
    privateConfig,
    runtime,
  }: RequestContextOption<ApiExtendConfig, OtherConfig, Payload, Data>) {
    this.runtime = runtime;
    this.url = shareConfig.url;
    this.payload = payload;
    this.query = privateConfig.query ?? null;
    this.data = privateConfig.data ?? null;
    this.params = privateConfig.params ?? null;
    this.responseObject = null;
    this.error = null;
    this.config = merge(
      {},
      shareConfig,
      privateConfig,
      {
        axios: {
          headers: shareConfig.headers,
          timeout: shareConfig.timeout,
          method: shareConfig.method,
        },
      },
      {
        axios: {
          headers: privateConfig.headers,
          timeout: privateConfig.timeout,
        },
      }
    );
    this.axios = this.config.axios;
    this.dataset = {};
    this.setAbort = privateConfig.setAbort;
    this.initAbortConfig();
  }

  /** @description 设置取消请求的钩子 */
  private initAbortConfig() {
    if (this.setAbort) {
      const source = CancelToken.source();

      this.cancelToken = source.token;

      this.setAbort((message) => source.cancel(message));
    }
  }

  /** @description 获取axios的配置项 */
  get axiosConfig() {
    return {
      ...this.axios,
      url: this.url,
      cancelToken: this.cancelToken,
      data: this.data,
      params: this.query,
    };
  }

  /** @description 请求前会进行一些转化工作 */
  beforeRequest() {
    this.convertRESTful();
    this.convertPayload();
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

    const isPayload = !params;
    const MatchedParams = isPayload && {};

    const urlSplits = url.split('?');
    let baseUrl = urlSplits.shift();
    const queryString = urlSplits.join('?');

    // /api/${id}
    // /api/:id
    if (/(^|\/)(\{\w+\}|:\w+)(?=\/|$)/.test(baseUrl)) {
      baseUrl = baseUrl.replace(
        /(\/|^)(\{\w+\}|:\w+)(?=\/|$)/g,
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
    if (isPayload) {
      const nextPayload = {};

      Object.keys(payload).forEach((key) => {
        if (!MatchedParams[key]) {
          nextPayload[key] = payload[key];
        }
      });

      this.payload = nextPayload as Payload;
    }

    this.url = baseUrl + (queryString ? `?${queryString}` : '');
  }

  /** @description 转化payload，或根据method的不同转成不同类型的请求参数 */
  private convertPayload() {
    let data;
    let query;
    const { payload } = this;

    // payload为请求数据，根据请求方式设置对应的参数
    if (payload) {
      // 以下几种请求类型，payload为data
      if (/^(POST|PUT|PATCH)$/i.test(this.axios.method)) {
        data = payload;
      } else {
        query = payload;
      }
    }

    // 已声明的data优先级高于payload
    if (this.data != null) {
      data = this.data;
    }

    // 已声明的query优先级高于payload
    if (this.query != null) {
      query = this.query;
    }

    this.data = data;
    this.query = query;
  }

  /** @description 设置请求头 */
  setHeader(key: string, value: string) {
    this.axios.headers[key] = value;
  }
}
