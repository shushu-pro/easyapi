import axiosLib from 'axios';

import { defaults, ErrorIgnoreName } from './const';
import Request from './Request';
import { DefineApiConfig, RequestApiConfig } from './types/ApiConfig';
import { EasyapiOption } from './types/EasyapiOption';
import { Runtime } from './types/Runtime';

export default class Easyapi<GExtendApiConfig, GExtendEasyapiOption = unknown> {
  /** @description上下文环境 */
  private runtime: Runtime<GExtendApiConfig, GExtendEasyapiOption>;

  constructor(option: EasyapiOption<GExtendApiConfig, GExtendEasyapiOption>) {
    this.initRuntime(option);
    this.initErrorIgnore();
  }

  /** @description 初始化上下文 */
  private initRuntime({
    mode = 'production',
    mockForce = defaults.easyapi.mockForce,

    dataFormat = defaults.easyapi.dataFormat,
    mockOff = defaults.easyapi.mockOff,
    logger = defaults.easyapi.logger,
    delay = defaults.easyapi.delay,
    errorIgnore = defaults.easyapi.errorIgnore,

    cache = false,
    axios,

    easyapi = {} as null,

    request,
    response,
    success,
    failure,
  }: EasyapiOption<GExtendApiConfig, GExtendEasyapiOption>) {
    const isDevelopment = mode === 'development';
    const isProduction = !isDevelopment;
    const axiosAll = { ...defaults.axios, ...axios };
    this.runtime = {
      axiosInstance: axiosLib.create(axiosAll),
      isDevelopment,
      isProduction,
      mockForce,
      cacheStore: {},
      easyapi: { ...easyapi },
      request,
      response,
      success,
      failure,
      defaultConfig: {
        axios: axiosAll,
        cache,
        delay,
        errorIgnore,
        logger,
        mockOff,
        dataFormat,
      },
    };
    if (isProduction && mockForce) {
      console.warn('easyapi: 生产模式下启用了mock功能，请知晓');
    }
  }

  /** @description 设置忽略抛出错误 */
  private initErrorIgnore() {
    // 浏览器环境，隐藏处理promise错误信息
    if (
      typeof window === 'object' &&
      typeof window.addEventListener === 'function'
    ) {
      window.addEventListener('unhandledrejection', (event) => {
        event.reason.name === ErrorIgnoreName && event.preventDefault();
      });
    }
  }

  define<GPayload = any, GResponseData = any>(
    defineConfig: DefineApiConfig<
      GExtendApiConfig,
      GExtendEasyapiOption,
      GPayload,
      GResponseData
    >
  ) {
    const request = new Request<
      GExtendApiConfig,
      GExtendEasyapiOption,
      GPayload,
      GResponseData
    >({
      runtime: this.runtime,
      config: defineConfig,
    });
    return (
      payload?: GPayload,
      config?: RequestApiConfig<
        GExtendApiConfig,
        GExtendEasyapiOption,
        GPayload,
        GResponseData
      >
    ): Promise<GResponseData> => request.send(payload, config);
  }
}
