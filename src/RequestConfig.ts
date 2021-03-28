import { CancelToken } from 'axios';
import { EasyapiAPIConfig, EasyapiContext } from './typing';
import defaults from './defaultConfigs';

class RequestConfig {
  meta: EasyapiAPIConfig & {
    params: Record<string, any>;
    url: string;
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

  axios() {
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
}

export default RequestConfig;
