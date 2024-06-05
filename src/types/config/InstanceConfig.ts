import { BaseConfig } from './BaseConfig';

/**
 * @description 接口实例配置选项
 */
export type InstanceConfig<
  GExtendConfig = unknown,
  GExtendMeta = unknown,
  GPayload = unknown,
  GBizData = unknown,
> = Pick<
  BaseConfig<GExtendConfig, GExtendMeta, GPayload, GBizData>,
  | 'axios'
  | 'cache'
  | 'dataNormalizer'
  | 'delay'
  | 'errorIgnore'
  | 'headers'
  | 'logger'
  | 'mockOff'
  | 'resolveType'
  | 'timeout'
  | 'mockBody'
  | 'mockData'
  | 'mockHeaders'
  | 'data'
  | 'params'
  | 'query'
  | 'mockForce'
> &
  GExtendConfig & { meta?: GExtendMeta };
