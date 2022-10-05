import { AxiosInstance } from 'axios';

import Context from '../Context';
import { DefaultApiConfig } from './ApiConfig';

/** @description 运行环境变量 */
export type Runtime<
  GExtendApiConfig = unknown,
  GExtendEasyapiOption = unknown,
  GContext = Context<GExtendApiConfig, GExtendEasyapiOption>
> = {
  /** @description 环境是否是开发模式 */
  isDevelopment: boolean;

  /** @description 环境是否是生产模式 */
  isProduction: boolean;

  /** @description 是否开启强制mock */
  mockForce: boolean;

  /** @description 请求拦截器 */
  request?: (this: GContext, ctx: GContext) => void;

  /** @description 响应拦截器 */
  response?: (this: GContext, ctx: GContext) => void;

  /** @description 成功拦截器 */
  success?: (this: GContext, ctx: GContext) => void;

  /** @description 失败拦截器 */
  failure?: (this: GContext, ctx: GContext) => void;

  /** @description 接口默认配置项 */
  defaultConfig: DefaultApiConfig<GExtendApiConfig, GExtendEasyapiOption>;

  /** @description 接口缓存数据 */
  cacheStore: {
    [k: string]: Record<string, any>;
  };

  /** @description axios实例对象 */
  axiosInstance: AxiosInstance;

  /** @description 扩展配置项 */
  easyapi: GExtendEasyapiOption;
};
