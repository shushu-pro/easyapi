import { Runtime } from './Runtime';

/** @description 组件配置项 */
export type EasyapiOption<
  GExtendApiConfig,
  GExtendEasyapiOption = Record<string, unknown>
> = {
  /** @description 运行环境 */
  mode?: 'development' | 'production';
} & Partial<
  unknown &
    Pick<
      Runtime<GExtendApiConfig, GExtendEasyapiOption>,
      'request' | 'response' | 'success' | 'failure' | 'mockForce' | 'easyapi'
    > &
    Pick<
      Runtime<GExtendApiConfig, GExtendEasyapiOption>['defaultConfig'],
      | 'axios'
      | 'cache'
      | 'delay'
      | 'errorIgnore'
      | 'logger'
      | 'mockOff'
      | 'dataFormat'
    >
>;
