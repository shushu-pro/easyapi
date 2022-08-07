import axiosLib from 'axios';

import { IgnoreErrorNameSymbol } from './const';
import defaults from './const/defaults';
import {
  ApiPrivateConfig,
  ApiShareConfig,
  EasyapiOption,
  Runtime,
} from './index.types';
import Request from './Request';

export default class Easyapi<ApiExtendConfig, OtherConfig = unknown> {
  /** @description上下文环境 */
  private runtime: Runtime<ApiExtendConfig, OtherConfig>;

  constructor(option: EasyapiOption<ApiExtendConfig, OtherConfig>) {
    this.initRuntime(option);
    this.initIgnoreError();
  }

  /** @description 初始化上下文 */
  private initRuntime({
    env = 'production',
    logger = defaults.easyapi.logger,
    delay = defaults.easyapi.delay,
    baseURL,
    timeout,
    ignoreError,
    resolver = defaults.easyapi.resolver,
    rejecter = defaults.easyapi.rejecter,
    request,
    response,
    success,
    failure,

    // 缓存策略配置项
    cache = false,

    // axios配置项
    axios,

    other,

    // 是否强制开启mock
    forceMock = false,
  }: EasyapiOption<ApiExtendConfig, OtherConfig>) {
    const axiosAll = { ...defaults.axios, baseURL, timeout, ...axios };
    this.runtime = {
      isDevelopment: env !== 'production',
      forceMock,
      handlers: {
        request,
        response,
        success,
        failure,
      },
      globalConfig: {
        delay,
        logger,
        axios: axiosAll,
        resolver,
        rejecter,
        ignoreError,
        cache,
        other,
      },
      cacheStorage: {},
      axiosInstance: axiosLib.create(axiosAll),
    };

    if (!this.runtime.isDevelopment && forceMock) {
      console.warn('easyapi: 生产模式下启用了mock功能，请知晓');
    }
  }

  /** @description 设置忽略抛出错误 */
  private initIgnoreError() {
    // 浏览器环境，隐藏处理promise错误信息
    if (
      typeof window === 'object' &&
      typeof window.addEventListener === 'function'
    ) {
      window.addEventListener('unhandledrejection', (event) => {
        event.reason.name === IgnoreErrorNameSymbol && event.preventDefault();
      });
    }
  }

  define<Payload = any, Data = any>(
    shareConfig: ApiShareConfig<ApiExtendConfig, OtherConfig, Payload, Data>
  ) {
    const request = new Request<ApiExtendConfig, OtherConfig, Payload, Data>({
      runtime: this.runtime,
      config: shareConfig,
    });

    return (
      payload?: Payload,
      config?: ApiPrivateConfig<ApiExtendConfig, OtherConfig, Payload, Data>
    ): Promise<Data> => request.send(payload, config);
  }
}
