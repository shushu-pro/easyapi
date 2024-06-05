import { AxiosInstance } from 'axios';

import { Context } from '../Context';
import { GlobalConfig } from './config';

/**
 * @description 运行环境变量
 */
export type Runtime<
  GExtendConfig = unknown,
  GExtendMeta = unknown,
  GContext = Context<GExtendConfig, GExtendMeta>,
> = {
  /**
   * @description 环境是否是开发模式
   */
  isDevelopment: boolean;

  /**
   * @description 环境是否是生产模式
   */
  isProduction: boolean;

  /**
   * @description 请求拦截器
   */
  request?: (this: GContext, ctx: GContext) => void;

  /**
   * @description 响应拦截器
   */
  response?: (this: GContext, ctx: GContext) => void;

  /**
   * @description 成功拦截器
   */
  success?: (this: GContext, ctx: GContext) => void;

  /**
   * @description 失败拦截器
   */
  failure?: (this: GContext, ctx: GContext) => void;

  /**
   * @description 接口默认配置项
   */
  globalConfig: GlobalConfig<GExtendConfig, GExtendMeta>;

  /**
   * @description 接口缓存数据
   */
  cacheStore: {
    [k: string]: Record<string, unknown>;
  };

  /**
   * @description axios实例对象
   */
  axiosInstance: AxiosInstance;

  /**
   * @description 扩展配置项
   */
  meta: GExtendMeta;
};
