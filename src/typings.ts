import { AxiosInstance } from 'axios';
import Easyapi from './Easyapi';
import RequestConfig from './RequestConfig';

interface EasyapiOption {
  // 运行环境
  env?: 'development' | 'production';

  // axios配置项
  axios?: any;

  // 接口配置项
  configs: EasyapiAPIConfigs;

  logger?: EasyapiAPIConfig['logger'];

  cache?: EasyapiAPIConfig['cache'];

  // 事件钩子
  request?: (config: RequestConfig) => void;
  response?: (config: RequestConfig) => void;
  success?: (config: RequestConfig) => void;
  failure?: (config: RequestConfig) => void;
}

interface EasyapiContext {
  // 是否处于开发模式
  isDevelopment: boolean;

  self: Easyapi;

  handlers: {
    request: EasyapiOption['request'];
    response: EasyapiOption['response'];
    success: EasyapiOption['success'];
    failure: EasyapiOption['failure'];
  };
  apiConfig: {
    logger: EasyapiOption['logger'];
    axios: EasyapiOption['axios'];
    cache: EasyapiOption['cache'];
  };
  apiConfigCaches: {
    [k: string]: EasyapiAPIConfig;
  };
  apiResultCaches: {
    [k: string]: any;
  };
  axiosInstance: AxiosInstance;
  [k: string]: any;
}

type EasyapiAPIConfigs =
  | EasyapiAPIConfig
  | {
      [k: string]: EasyapiAPIConfigs;
    };

interface EasyapiAPIConfig {
  // 唯一码
  uuid?: number;

  // 接口地址
  url: string;

  // 接口描述
  label?: string;

  // 缓存策略配置项
  cache?:
    | boolean
    | {
        // 缓存有效时间
        maxAge?: number;

        // 失效判断
        expire?: (config?: RequestConfig) => any;
      }
    | ((config?: RequestConfig) => any);

  // 是否开启日志输出
  logger?: boolean;

  // 请求方法
  method?: 'get' | 'post' | 'options' | 'delete' | 'head' | 'put';

  // 请求头
  headers?: Record<string, string>;

  // 模拟数据
  mock?: (context: {
    config: RequestConfig['meta'];
    headers: EasyapiAPIConfig['headers'];
    sendData: RequestConfig['sendData'];
  }) => MockResponse | MockData;

  // 是否忽略错误
  errorIgnore?: boolean;

  // 接口延迟响应
  delay?: number;

  resolve?: (responseObject: RequestConfig['responseObject']) => any;
}

interface MockResponse {
  $header?: Record<string, any>;
  $body?: MockData;
}

type MockData = Record<string, any>;

export { EasyapiOption, EasyapiContext, EasyapiAPIConfig };
