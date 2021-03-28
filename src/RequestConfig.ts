import axiosLib, { AxiosRequestConfig } from 'axios';
import { EasyapiAPIConfig, EasyapiContext } from './typings';
import defaults from './defaultConfigs';

const { CancelToken } = axiosLib;

class RequestConfig {
  meta: EasyapiAPIConfig & {
    params: Record<string, any>;
    url: string;
    cacheMaxAge?: number;
    cacheExpire?: (context: RequestConfig) => any;
  };

  sendData: any;

  context: EasyapiContext;

  error: Error;

  responseObject: any;

  constructor({
    context,
    shareConfig,
    privateConfig,
    sendData,
  }: {
    context: EasyapiContext;
    shareConfig: EasyapiAPIConfig;
    privateConfig?: EasyapiAPIConfig;
    sendData?: any;
  }) {
    this.context = context;

    const config = {
      ...defaults.axios,
      ...defaults.easyapi,
      ...context.rest,
      logger: context.apiConfig.logger,
      ...shareConfig,
      ...privateConfig,
      headers: {
        ...shareConfig.headers,
        ...privateConfig.headers,
      },
    };
    config.method = (config.method || defaults.axios.method).toUpperCase(); // 请求方式

    this.meta = config;

    const { cache } = config;

    let expire;
    let maxAge;
    if (typeof cache === 'function') {
      expire = cache;
    } else if (typeof cache === 'object') {
      ({ expire, maxAge } = cache);
    } else {
      expire = maxAge = null;
    }

    config.cacheMaxAge = maxAge;
    config.cacheExpire = expire;

    // this.state = 0 // 0:INIT, 1:RESPONSE, 2:RESOLVE, 3:REJECT, 4:FINNALY, 6:RESOLVEDATA
    this.sendData = sendData;
    this.error = null;
    this.responseObject = null;

    // 放入取消请求的钩子
    const { abort } = config;
    if (abort && typeof abort === 'object') {
      const source = CancelToken.source();
      config.cancelToken = source.token;
      abort.trigger = (message) => {
        source.cancel(message);
      };
    }
    // console.info(this);
  }

  axios(): AxiosRequestConfig {
    let data = null;
    let params = null;

    const { sendData, meta } = this;

    if (/^GET$/i.test(meta.method)) {
      params = sendData;
    } else if (/^(POST|PUT)$/i.test(meta.method)) {
      data = sendData;
    }

    return {
      ...meta,
      data,
      params: {
        ...meta.params,
        ...params,
      },
    };
  }

  // 启用缓存
  useCache() {
    const { context, meta } = this;
    const { apiResultCaches } = context;

    // 无缓存策略
    if (!meta.cache) {
      return;
    }

    // 初始化缓存对象
    let cacheResults = apiResultCaches[meta.uuid];
    if (!cacheResults) {
      cacheResults = apiResultCaches[meta.uuid] = {};
    }

    // 初始化缓存数据
    const cacheKey = JSON.stringify(this.sendData);
    let cacheResult = cacheResults[cacheKey];
    if (!cacheResult) {
      cacheResult = cacheResults[cacheKey] = {
        state: 'Pending',
      };
    }

    // 直接缓存中返回
    if (cacheResult.state === 'Done') {
      // 尚未过期
      if (notExpire()) {
        cacheResult.activityTime = Date.now();
        return cacheResult.result;
      }

      // 已过期
      cacheResult.state = 'Pending';
    }

    // 插入到等待队列
    if (cacheResult.state === 'Loading') {
      return new Promise((resolve) => {
        cacheResult.waits.push((result) => {
          resolve(result);
        });
      });
    }

    // 设置为加载中
    if (cacheResult.state === 'Pending') {
      cacheResult.waits = [];
      cacheResult.state = 'Loading';
    }

    // console.info('cacheResult', this);

    function notExpire() {
      const { cache } = meta;

      if (cache === true) {
        return true;
      }

      const { cacheMaxAge, cacheExpire } = meta;

      // 缓存已经超时过期
      if (cacheMaxAge && Date.now() - cacheResult.activityTime > cacheMaxAge) {
        return false;
      }

      // 判断上一次的缓存状态
      if (cacheExpire && cacheExpire(this) !== cacheResult.expireValue) {
        return false;
      }

      return true;
    }
  }

  // 消费缓存队列
  consumeCache(result) {
    const { meta } = this;
    if (!meta.cache) {
      return;
    }
    const cacheKey = JSON.stringify(this.sendData);
    const { apiResultCaches } = this.context;

    const cacheResult = apiResultCaches[meta.uuid][cacheKey];

    cacheResult.state = 'Done';
    cacheResult.result = result;
    cacheResult.activityTime = Date.now();
    cacheResult.expireValue = meta.cacheExpire ? meta.cacheExpire(this) : null;

    let current;
    while ((current = cacheResult.waits.shift())) {
      current(result);
    }
  }
}

export default RequestConfig;
