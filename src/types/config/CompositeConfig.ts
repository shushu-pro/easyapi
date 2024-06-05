import { BaseConfig } from './BaseConfig';

/**
 * @description 合成的接口配置选项
 */
export type CompositeConfig<
  GExtendConfig = unknown,
  GExtendMeta = unknown,
  GPayload = unknown,
  GBizData = unknown,
> = unknown &
  BaseConfig<GExtendConfig, GExtendMeta, GPayload, GBizData> &
  GExtendConfig & {
    meta?: GExtendMeta;
  };
