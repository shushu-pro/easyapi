import Context from '../Context';

export interface CacheConfig<
  GExtendApiConfig = unknown,
  GExtendEasyapiOption = unknown,
  GPayload = any,
  GResponseData = any
> {
  /** @description 设置缓存有效时间 */
  maxAge?: number;

  /** @description 设置缓存失效条件 */
  expire?: (
    ctx?: Context<
      GExtendApiConfig,
      GExtendEasyapiOption,
      GPayload,
      GResponseData
    >
  ) => CacheStore['expireValue'];
}

export type CacheStore = {
  data: any;
  expireValue: any;
  activeTime: number;
  state: 'init' | 'pending' | 'done';
  waits: Array<(data) => void>;
};
