import { BaseConfig } from './BaseConfig';

/**
 * @description 全局的接口配置项
 */
export type GlobalConfig<
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
  | 'mockForce'
> & {
  meta?: GExtendMeta;
};
