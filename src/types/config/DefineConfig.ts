import { BaseConfig } from './BaseConfig';

/**
 * @description 接口定义配置选项
 */
export type DefineConfig<
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
  | 'label'
  | 'method'
  | 'mockBody'
  | 'mockData'
  | 'mockHeaders'
  | 'url'
  | 'mockForce'
> &
  GExtendConfig & { meta?: GExtendMeta };
