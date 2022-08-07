import { CacheConfig, CacheStorage } from './index.types';
import RequestContext from './RequestContext';

export default class Cache<
  ApiExtendConfig = unknown,
  OtherConfig = unknown,
  Payload = unknown,
  Data = unknown
> {
  private readonly storage: Record<string, CacheStorage>;

  constructor({ storage }) {
    this.storage = storage;
  }

  private key(ctx) {
    return JSON.stringify({
      payload: ctx.payload,
      query: ctx.query,
      data: ctx.data,
      params: ctx.params,
    });
  }

  /** @description 是否已过期 */
  private isExpired(ctx) {
    if (ctx.cache === true) {
      return false;
    }

    const { maxAge, expire } = this.config(ctx);
    const { storage } = this;
    const cacheKey = this.key(ctx);
    const cacheResult = storage[cacheKey];

    // 缓存已经超时过期
    if (maxAge && Date.now() - cacheResult.activeTime > maxAge) {
      return true;
    }

    // 判断上一次的缓存状态
    if (expire && expire(ctx) !== cacheResult.expireValue) {
      return true;
    }

    return false;
  }

  private config(
    ctx: RequestContext<ApiExtendConfig, OtherConfig, Payload, Data>
  ): CacheConfig<ApiExtendConfig, OtherConfig, Payload, Data> {
    const { cache } = ctx.config;

    let maxAge;
    let expire;

    if (typeof cache === 'object') {
      maxAge = cache.maxAge;
      expire = cache.expire;
    } else if (typeof cache === 'function') {
      expire = cache;
    }

    return { maxAge, expire };
  }

  /** @description 异步方式等待获取缓存 */
  pending(ctx) {
    // 无缓存策略
    if (!ctx.config.cache) {
      return;
    }

    const { storage } = this;
    const cacheKey = this.key(ctx);
    const cacheResult = storage[cacheKey];

    if (!cacheResult || cacheResult.state === 'init') {
      storage[cacheKey] = {
        state: 'pending',
        waits: [],
        data: null,
        expireValue: null,
        activeTime: null,
      };

      return;
    }

    // 直接缓存中返回
    if (cacheResult.state === 'done') {
      // 已过期
      if (this.isExpired(ctx)) {
        cacheResult.state = 'pending';
        return;
      }

      // 尚未过期
      cacheResult.activeTime = Date.now();
      return cacheResult.data;
    }

    // 插入到等待队列
    if (cacheResult.state === 'pending') {
      return new Promise((resolve) => {
        cacheResult.waits.push(resolve);
      });
    }
  }

  resolves(ctx, promiseResult) {
    if (!ctx.config.cache) {
      return;
    }

    const cacheKey = this.key(ctx);
    const cacheResult = this.storage[cacheKey];

    const { expire } = this.config(ctx);

    cacheResult.state = 'done';
    cacheResult.data = promiseResult;
    cacheResult.activeTime = Date.now();
    cacheResult.expireValue = expire?.(ctx) ?? null;

    // 失败的情况下设置缓存状态为pending
    promiseResult.catch(() => {
      cacheResult.state = 'init';
    });

    let current;
    while ((current = cacheResult.waits.shift())) {
      current(promiseResult);
    }
  }
}
