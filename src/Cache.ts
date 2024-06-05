import { Context } from './Context';
import { CacheConfig, CacheStore } from './types';

export default class Cache<
  GExtendConfig = unknown,
  GExtendMeta = unknown,
  GPayload = unknown,
  GBizData = unknown,
> {
  private readonly store: Record<string, CacheStore>;

  constructor({ store }) {
    this.store = store;
  }

  /**
   * @description 异步方式等待获取缓存
   */
  pending(ctx: Context<GExtendConfig, GExtendMeta, GPayload, GBizData>) {
    // 无缓存策略
    if (!ctx.config.cache) {
      return;
    }

    const { store } = this;
    const cacheKey = this.key(ctx);
    const cacheResult = store[cacheKey];

    if (!cacheResult || cacheResult.state === 'init') {
      store[cacheKey] = {
        state: 'pending',
        waits: [],
        data: null,
        expireValue: null,
        activeTime: 0,
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
    const cacheResult = this.store[cacheKey];

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
    // eslint-disable-next-line no-cond-assign
    while ((current = cacheResult.waits.shift())) {
      current(promiseResult);
    }
  }

  private key(ctx: Context<GExtendConfig, GExtendMeta, GPayload>) {
    return JSON.stringify({
      payload: ctx.payload,
      query: ctx.query,
      data: ctx.data,
      params: ctx.params,
    });
  }

  /**
   * @description 缓存是否已过期
   */
  private isExpired(
    ctx: Context<GExtendConfig, GExtendMeta, GPayload, GBizData>
  ) {
    if (ctx.config.cache === true) {
      return false;
    }

    const { maxAge, expire } = this.config(ctx);
    const { store } = this;
    const cacheKey = this.key(ctx);
    const cacheResult = store[cacheKey];

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
    ctx: Context<GExtendConfig, GExtendMeta, GPayload, GBizData>
  ): CacheConfig<GExtendConfig, GExtendMeta, GPayload, GBizData> {
    const { cache } = ctx.config;

    let maxAge: number;
    let expire;

    if (typeof cache === 'object') {
      maxAge = cache.maxAge;
      expire = cache.expire;
    } else if (typeof cache === 'function') {
      expire = cache;
    }

    return { maxAge, expire };
  }
}
