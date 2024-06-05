import { DefineConfig, InstanceConfig } from './config';
import { Runtime } from './Runtime';

export type ContextOption<
  GExtendConfig = unknown,
  GExtendMeta = unknown,
  GPayload = unknown,
  GBizData = unknown,
> = {
  payload: GPayload;
  defineConfig: DefineConfig<GExtendConfig, GExtendMeta, GPayload, GBizData>;
  instanceConfig: InstanceConfig<
    GExtendConfig,
    GExtendMeta,
    GPayload,
    GBizData
  >;
  runtime: Runtime<GExtendConfig, GExtendMeta>;
};
