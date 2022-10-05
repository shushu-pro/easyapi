import { AxiosRequestConfig } from 'axios';

import Context from '../Context';
import { CacheConfig } from './CacheConfig';

/** @description 预设的配置项 */
type PresetApiConfig<
  GExtendApiConfig = unknown,
  GExtendEasyapiOption = unknown,
  GPayload = any,
  GResponseData = any
> = {
  /** @description 是否开启控制台日志，仅在开发模式下生效 */
  logger?: boolean;

  /** @description 设置延迟响应，仅在开发模式下生效 */
  delay?: number;

  /** @description 忽略抛出异常 */
  errorIgnore?: boolean;

  /** @description axios请求配置项 */
  axios?: AxiosRequestConfig;

  /** @description 设置请求头 */
  headers?: Record<string, string>;

  /** @description 接口超时时间 */
  timeout?: AxiosRequestConfig['timeout'];

  /** @description 开启缓存配置，值为true时，则会启用永久缓存，除非刷新页面 */
  cache?:
    | boolean
    | CacheConfig<
        GExtendApiConfig,
        GExtendEasyapiOption,
        GPayload,
        GResponseData
      >
    | CacheConfig<
        GExtendApiConfig,
        GExtendEasyapiOption,
        GPayload,
        GResponseData
      >['expire'];

  /** @description 处理then输出的data数据，默认responseObject.data.data */
  dataFormat?:
    | boolean
    | ((
        ctx: Context<
          GExtendApiConfig,
          GExtendEasyapiOption,
          GPayload,
          GResponseData
        >
      ) => GResponseData | undefined);

  /** @description 是否关闭mock */
  mockOff?: boolean;

  /** @description mock响应头，仅在开发模式下生效 */
  mockHeaders?: (
    ctx: Context<
      GExtendApiConfig,
      GExtendEasyapiOption,
      GPayload,
      GResponseData
    >
  ) => Record<string, string>;

  /** @description mock响应数据，仅在开发模式下生效 */
  mockData?: (
    ctx: Context<
      GExtendApiConfig,
      GExtendEasyapiOption,
      GPayload,
      GResponseData
    >
  ) => GResponseData;

  /** @description mockBody数据，仅在开发模式下生效 */
  mockBody?: (
    ctx: Context<
      GExtendApiConfig,
      GExtendEasyapiOption,
      GPayload,
      GResponseData
    >
  ) => ResponseBody<GResponseData>;
};

/** @description 响应的数据 */
export interface ResponseBody<GResponseData = any> {
  code: number;
  message?: string;
  data?: GResponseData;
}

export type DefaultApiConfig<
  GExtendApiConfig = unknown,
  GExtendEasyapiOption = unknown,
  GPayload = any,
  GResponseData = any
> = Pick<
  PresetApiConfig<
    GExtendApiConfig,
    GExtendEasyapiOption,
    GPayload,
    GResponseData
  >,
  | 'axios'
  | 'cache'
  | 'delay'
  | 'errorIgnore'
  | 'logger'
  | 'mockBody'
  | 'mockData'
  | 'mockHeaders'
  | 'mockOff'
  | 'dataFormat'
>;

/** @description 接口定义配置项 */
export type DefineApiConfig<
  GExtendApiConfig = unknown,
  GExtendEasyapiOption = unknown,
  GPayload = any,
  GResponseData = any
> = DefaultApiConfig<
  GExtendApiConfig,
  GExtendEasyapiOption,
  GPayload,
  GResponseData
> & {
  /** @description 接口地址 */
  url: AxiosRequestConfig['url'];

  /** @description 接口描述 */
  label?: string;

  /** @description 接口请求方式 */
  method?: AxiosRequestConfig['method'];

  headers?: PresetApiConfig['headers'];

  timeout?: PresetApiConfig['timeout'];
} & GExtendApiConfig;

/** @description 私有配置项 */
export type RequestApiConfig<
  GExtendApiConfig = unknown,
  GExtendEasyapiOption = unknown,
  GPayload = any,
  GResponseData = any
> = DefaultApiConfig<
  GExtendApiConfig,
  GExtendEasyapiOption,
  GPayload,
  GResponseData
> & {
  /** @description 查询参数 */
  query?: any;

  /** @description 请求体 */
  data?: any;

  /** @description 路径参数 */
  params?: any;

  // abortToken?: CancelToken;

  headers?: PresetApiConfig['headers'];

  timeout?: PresetApiConfig['timeout'];
} & GExtendApiConfig;

/** @description 接口上下文实例配置项 */
export type ContextApiConfig<
  GExtendApiConfig = unknown,
  GExtendEasyapiOption = unknown,
  GPayload = any,
  GResponseData = any
> = unknown &
  DefineApiConfig<
    GExtendApiConfig,
    GExtendEasyapiOption,
    GPayload,
    GResponseData
  > &
  RequestApiConfig<
    GExtendApiConfig,
    GExtendEasyapiOption,
    GPayload,
    GResponseData
  >;
