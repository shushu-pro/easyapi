import { Context } from '../Context';

export interface CacheConfig<
  GExtendConfig = unknown,
  GExtendMeta = unknown,
  GPayload = unknown,
  GBizData = unknown,
> {
  /**
   * @description 设置缓存有效时间，超出时间则缓存失效，单位为ms
   * */
  maxAge?: number;

  /**
   * @description 设置缓存策略，
   * */
  expire?: (
    ctx?: Context<GExtendConfig, GExtendMeta, GPayload, GBizData>
  ) => CacheStore['expireValue'];
}

export type CacheStore = {
  /**
   * @description 缓存状态
   */
  state: 'init' | 'pending' | 'done';

  /**
   * @description 等待队列
   */
  waits: Array<(data) => void>;

  /**
   * @description 缓存激活时间
   */
  activeTime: number;

  /**
   * @description 缓存控制状态
   */
  expireValue: unknown;

  /**
   * @description 缓存数据
   */
  data: unknown;
};
