import { GlobalConfig } from './config';
import { Runtime } from './Runtime';

/**
 * @description 组件配置项
 */
export type EasyapiOption<
  GExtendConfig,
  GExtendMeta = Record<string, unknown>,
> = {
  /**
   * @description 运行环境
   */
  mode?: 'development' | 'production';
} & Partial<
  unknown &
    Pick<
      Runtime<GExtendConfig, GExtendMeta>,
      'request' | 'response' | 'success' | 'failure' | 'meta'
    > &
    GlobalConfig<GExtendConfig, GExtendMeta>
>;
