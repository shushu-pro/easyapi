import { AxiosRequestConfig } from 'axios';

import { Context } from '../../Context';
import { CacheConfig } from '../Cache';
import { ResponseBody } from '../Response';

type MockData<T> = T | Promise<T | { __esModule: boolean; default: T }>;

/**
 * @description 基础接口配置项
 */
export interface BaseConfig<
  GExtendConfig = unknown,
  GExtendMeta = unknown,
  GPayload = unknown,
  GBizData = unknown,
> {
  /**
   * @description 接口描述
   */
  label?: string;

  /**
   * @description 开启控制台日志，仅在开发模式下生效，默认`false`
   */
  logger?: boolean;

  /**
   * @description 响应延迟，仅在`mock`时生效，默认`300`ms
   */
  delay?: number;

  /**
   * @description 开启忽略异常，默认`false`
   */
  errorIgnore?: boolean;

  /**
   * @description 强制生产也开启mock，默认`false`
   */
  mockForce?: boolean;

  /**
   * @description 关闭`mock`，仅在存在`mock`字段的时候生效，默认`false`，当开启`mockOff`时`mock`将不再生效
   */
  mockOff?: boolean;

  /**
   * @description 开启缓存配置，值为true时，则会启用永久缓存，除非刷新页面
   */
  cache?:
    | boolean
    | CacheConfig<GExtendConfig, GExtendMeta, GPayload, GBizData>
    | CacheConfig<GExtendConfig, GExtendMeta, GPayload, GBizData>['expire'];

  /**
   * @description 设置then的数据类型，默认是业务数据data，fully则返回{header,config,data}
   */
  resolveType?: 'fully' | 'headers' | 'body' | 'data';

  /**
   * @description 查询参数
   */
  query?: Record<string, string | number | undefined | null>;

  /**
   * @description 路径参数
   */
  params?: Record<string, string | number | undefined | null>;

  /**
   * @description 请求体
   */
  data?: any;

  /**
   * @description 接口地址
   */
  url: string;

  /**
   * @description 响应数据标准化处理器，统一转成满足接口{code,data,message,original}
   */
  dataNormalizer?: (
    ctx: Context<GExtendConfig, GExtendMeta, GPayload, GBizData>
  ) => void;

  /**
   * @description mock响应头，仅在开发模式下生效
   */
  mockHeaders?: (
    ctx: Context<GExtendConfig, GExtendMeta, GPayload, GBizData>
  ) => MockData<Record<string, string>>;

  /**
   * @description mock响应数据，仅在开发模式下生效
   */
  mockData?: (
    ctx: Context<GExtendConfig, GExtendMeta, GPayload, GBizData>
  ) => MockData<GBizData>;

  /**
   * @description mockBody数据，仅在开发模式下生效
   */
  mockBody?: (
    ctx: Context<GExtendConfig, GExtendMeta, GPayload, GBizData>
  ) => MockData<ResponseBody<GBizData>>;

  /**
   * @description axios请求配置项
   */
  axios?: AxiosRequestConfig;

  /**
   * @description 接口请求方式
   */
  method?: AxiosRequestConfig['method'];

  /**
   * @description 设置请求头
   */
  headers?: AxiosRequestConfig['headers'];

  /**
   *  @description 接口超时时间
   */
  timeout?: AxiosRequestConfig['timeout'];
}
