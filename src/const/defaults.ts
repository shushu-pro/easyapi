import { AxiosRequestConfig } from 'axios';

import { GlobalConfig } from '../types/config';

/** @description axios默认配置项 */
const AxiosDefaults: AxiosRequestConfig = {
  method: 'get',
  responseType: 'json',
  headers: {},
};

/**
 * @description easyapi默认配置项
 * */
const GlobalDefaults: Pick<
  GlobalConfig,
  'delay' | 'errorIgnore' | 'logger' | 'mockOff' | 'mockForce' | 'resolveType'
> = {
  delay: 300,

  errorIgnore: false,

  logger: false,

  mockOff: false,

  mockForce: false,

  resolveType: 'data',
};

export { AxiosDefaults, GlobalDefaults };
