import { AxiosInstance, AxiosRequestConfig } from 'axios';

import Cache from './Cache';
import RequestContext from './RequestContext';

/** @description 组件配置项 */
export type EasyapiOption<
  ApiExtendConfig,
  OtherConfig = Record<string, any>,
  Context = RequestContext<ApiExtendConfig, OtherConfig>
> = {
  /** @description 运行环境 */
  env?: 'development' | 'production';

  /** @description 是否强制开启mock，一般production模式下都会关闭mock */
  forceMock?: boolean;

  /** @description 基础路径 */
  baseURL?: string;

  /** @description 请求拦截器 */
  request?: (this: Context, ctx: Context) => void;

  /** @description 响应拦截器 */
  response?: (this: Context, ctx: Context) => void;

  /** @description 成功拦截器 */
  success?: (this: Context, ctx: Context) => void;

  /** @description 失败拦截器 */
  failure?: (this: Context, ctx: Context) => void;

  /** @description 其他配置 */
  other?: OtherConfig;
} & Partial<
  Pick<
    ApiPresetConfig<ApiExtendConfig, OtherConfig>,
    | 'axios'
    | 'logger'
    | 'timeout'
    | 'ignoreError'
    | 'cache'
    | 'resolver'
    | 'rejecter'
    | 'delay'
  >
>;

/** @description 运行环境变量 */
export interface Runtime<ApiExtendConfig, OtherConfig> {
  /** @description 环境是否是开发模式 */
  isDevelopment: boolean;

  forceMock: boolean;

  /** @description 自身引用 */
  //   self: Easyapi<ApiExtendConfig>;

  /** @description 拦截器 */
  handlers: {
    request: EasyapiOption<ApiExtendConfig, OtherConfig>['request'];
    response: EasyapiOption<ApiExtendConfig, OtherConfig>['response'];
    success: EasyapiOption<ApiExtendConfig, OtherConfig>['success'];
    failure: EasyapiOption<ApiExtendConfig, OtherConfig>['failure'];
  };

  /** @description api全局配置项 */
  globalConfig: Pick<
    ApiPresetConfig<ApiExtendConfig, OtherConfig>,
    | 'axios'
    | 'cache'
    | 'delay'
    | 'ignoreError'
    | 'logger'
    | 'resolver'
    | 'rejecter'
  > & {
    other: EasyapiOption<ApiExtendConfig, OtherConfig>['other'];
  };

  /** @description 接口缓存数据 */
  cacheStorage: {
    [k: string]: Record<string, CacheStorage>;
  };

  /** @description axios实例对象 */
  axiosInstance: AxiosInstance;
}

export type CacheStorage = {
  data: any;
  expireValue: any;
  activeTime: number;
  state: 'init' | 'pending' | 'done';
  waits: Array<(data) => void>;
};

/** @description 预设的配置项 */
export type ApiPresetConfig<
  ApiExtendConfig = unknown,
  OtherConfig = unknown,
  Payload = any,
  Data = any
> = {
  /** @description 是否开启控制台日志，仅在开发模式下生效 */
  logger: boolean;

  /** @description 设置延迟响应，仅在开发模式下生效 */
  delay: number;

  /** @description 接口超时时间 */
  timeout: AxiosRequestConfig['timeout'];

  /** @description 忽略抛出异常 */
  ignoreError: boolean;

  /** @description 设置请求头 */
  headers: Record<string, string>;

  /** @description 处理then输出的data数据，默认responseObject.data.data */
  resolver: (
    ctx: RequestContext<ApiExtendConfig, OtherConfig, Payload, Data>
  ) => Data | undefined;

  /** @description 处理reject输出的error */
  rejecter: (
    ctx: RequestContext<ApiExtendConfig, OtherConfig, Payload, Data>
  ) => void;

  /** @description 开启缓存配置，值为true时，则会启用永久缓存，除非刷新页面 */
  cache:
    | boolean
    | CacheConfig<ApiExtendConfig, OtherConfig, Payload, Data>
    | CacheConfig<ApiExtendConfig, OtherConfig, Payload, Data>['expire'];

  /** @description axios请求配置项 */
  axios: AxiosRequestConfig;

  /** @description mock响应头，仅在开发模式下生效 */
  mockHeaders?: (
    ctx: RequestContext<ApiExtendConfig, OtherConfig, Payload, Data>
  ) => Record<string, string>;

  /** @description mock响应数据，仅在开发模式下生效 */
  mockData?: (
    ctx: RequestContext<ApiExtendConfig, OtherConfig, Payload, Data>
  ) => Data;

  /** @description mockBody数据，仅在开发模式下生效 */
  mockBody?: (
    ctx: RequestContext<ApiExtendConfig, OtherConfig, Payload, Data>
  ) => ResponseBody<Data>;

  other?: OtherConfig;
};

export interface CacheConfig<
  ApiExtendConfig,
  OtherConfig,
  Payload = any,
  Data = any
> {
  /** @description 设置缓存有效时间 */
  maxAge?: number;

  /** @description 设置缓存失效条件 */
  expire?: (
    ctx?: RequestContext<ApiExtendConfig, OtherConfig, Payload, Data>
  ) => CacheStorage['expireValue'];
}

/** @description 响应的数据 */
export interface ResponseBody<Data = any> {
  code: number;
  message?: string;
  data: Data;
}

export interface RequestOption<ApiExtendConfig, OtherConfig, Payload, Data> {
  runtime: Runtime<ApiExtendConfig, OtherConfig>;
  config: ApiShareConfig<ApiExtendConfig, OtherConfig, Payload, Data>;
}

/** @description 共享配置项 */
export type ApiShareConfig<
  ApiExtendConfig = unknown,
  OtherConfig = unknown,
  Payload = any,
  Data = any
> = ApiExtendConfig &
  Partial<ApiPresetConfig<ApiExtendConfig, OtherConfig, Payload, Data>> & {
    /** @description 接口地址 */
    url: AxiosRequestConfig['url'];

    /** @description 接口描述 */
    label?: string;

    /** @description 接口请求方式 */
    method?: AxiosRequestConfig['method'];
  };

/** @description 私有配置项 */
export type ApiPrivateConfig<
  ApiExtendConfig = unknown,
  OtherConfig = unknown,
  Payload = any,
  Data = any
> = ApiExtendConfig &
  Partial<ApiPresetConfig<ApiExtendConfig, OtherConfig, Payload, Data>> & {
    /** @description 查询参数 */
    query?: any;

    /** @description 请求体 */
    data?: any;

    /** @description 路径参数 */
    params?: any;

    /** @description 取消请求 */
    setAbort?: (abort: (message) => void) => void;
  };

export type ApiInstanceConfig<
  ApiExtendConfig = unknown,
  OtherConfig = unknown,
  Payload = any,
  Data = any
> = ApiShareConfig<ApiExtendConfig, OtherConfig, Payload, Data> &
  ApiPrivateConfig<ApiExtendConfig, OtherConfig, Payload, Data>;

export type RequestContextOption<ApiExtendConfig, OtherConfig, Payload, Data> =
  {
    payload: Payload;
    shareConfig: ApiShareConfig<ApiExtendConfig, OtherConfig, Payload, Data>;
    privateConfig: ApiPrivateConfig<
      ApiExtendConfig,
      OtherConfig,
      Payload,
      Data
    >;
    runtime: Runtime<ApiExtendConfig, OtherConfig>;
  };

export { RequestContext };
