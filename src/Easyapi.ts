import axiosLib from 'axios';

import { AxiosDefaults, ErrorIgnoreSymbol, GlobalDefaults } from './const';
import Request from './Request';
import { DefineConfig, EasyapiOption, InstanceConfig, Runtime } from './types';

export class Easyapi<GExtendConfig, GExtendMeta = unknown> {
  /**
   * @description上下文环境
   */
  private runtime: Runtime<GExtendConfig, GExtendMeta>;

  constructor(option: EasyapiOption<GExtendConfig, GExtendMeta>) {
    this.initRuntime(option);
    this.initErrorIgnore();
  }

  define<GPayload = any, GBizData = any>(
    defineConfig: DefineConfig<GExtendConfig, GExtendMeta, GPayload, GBizData>
  ) {
    const request = new Request<GExtendConfig, GExtendMeta, GPayload, GBizData>(
      {
        runtime: this.runtime,
        config: defineConfig,
      }
    );
    return (
      payload?: GPayload,
      config?: InstanceConfig<GExtendConfig, GExtendMeta, GPayload, GBizData>
    ): Promise<GBizData> => request.send(payload, config);
  }

  /**
   * @description 初始化上下文
   */
  private initRuntime({
    mode = 'production',
    mockForce = GlobalDefaults.mockForce,
    resolveType = GlobalDefaults.resolveType,
    mockOff = GlobalDefaults.mockOff,
    logger = GlobalDefaults.logger,
    delay = GlobalDefaults.delay,
    errorIgnore = GlobalDefaults.errorIgnore,

    cache = false,
    axios,

    dataNormalizer,

    request,
    response,
    success,
    failure,
    meta = {} as GExtendMeta,
  }: EasyapiOption<GExtendConfig, GExtendMeta>) {
    const isDevelopment = mode === 'development';
    const isProduction = !isDevelopment;
    const axiosAll = { ...AxiosDefaults, ...axios };
    this.runtime = {
      axiosInstance: axiosLib.create(axiosAll),
      isDevelopment,
      isProduction,
      cacheStore: {},
      request,
      response,
      success,
      failure,
      meta,
      globalConfig: {
        axios: axiosAll,
        cache,
        delay,
        mockForce,
        resolveType,
        mockOff,
        logger,
        errorIgnore,
        dataNormalizer,
      },
    };
    this.runtime.axiosInstance.defaults.headers.post['Content-Type'] =
      'application/json';
    if (isProduction && mockForce) {
      console.warn('globalConfig: 生产模式下启用了mock功能，请知晓');
    }
  }

  /**
   * @description 设置忽略抛出错误
   */
  private initErrorIgnore() {
    // 浏览器环境，隐藏处理promise错误信息
    if (
      typeof window === 'object' &&
      typeof window.addEventListener === 'function'
    ) {
      window.addEventListener('unhandledrejection', (event) => {
        event.reason.name === ErrorIgnoreSymbol && event.preventDefault();
      });
    }
  }
}

export type Define<GExtendConfig, GExtendMeta> = Easyapi<
  GExtendConfig,
  GExtendMeta
>['define'];
