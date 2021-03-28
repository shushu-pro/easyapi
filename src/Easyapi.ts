import axiosLib from 'axios';
import createExports from './createExports';
import { EasyapiOption, EasyapiContext } from './typings';
import defaults from './defaultConfigs';

const IgnoreErrorName = Symbol('IgnoreErrorName');

class Easyapi {
  exports: any = {};

  constructor(option: EasyapiOption) {
    const {
      // 是否开发环境
      env = 'production',
      logger = false,

      // 拦截器钩子
      // init,
      request,
      response,
      success,
      failure,

      // axios配置项
      axios,

      // 接口配置项
      configs = {},

      // 缓存策略配置项
      cache = false,

      // 剩余的其他配置项
      ...rest
    } = option;

    const context: EasyapiContext = {
      rest,
      isDevelopment: env !== 'production',
      self: this,
      handlers: {
        request,
        response,
        success,
        failure,
      },
      apiConfig: {
        logger,
        axios,
        cache,
      },
      apiConfigCaches: {},
      apiResultCaches: {},
      axiosInstance: axiosLib.create({ ...defaults.axios, ...axios }),
    };

    this.exports = createExports(configs, [], context);

    // 浏览器环境，隐藏处理promise错误信息
    if (
      typeof window === 'object' &&
      typeof window.addEventListener === 'function'
    ) {
      window.addEventListener('unhandledrejection', (event) => {
        event.reason.name === IgnoreErrorName && event.preventDefault();
      });
    }
  }
}

export default Easyapi;
export { IgnoreErrorName };
