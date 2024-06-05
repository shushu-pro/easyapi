import { DefineConfig } from './config';
import { Runtime } from './Runtime';

export interface RequestOption<
  GExtendConfig = unknown,
  GExtendMeta = unknown,
  GPayload = unknown,
  GBizData = unknown,
> {
  runtime: Runtime<GExtendConfig, GExtendMeta>;
  config: DefineConfig<GExtendConfig, GExtendMeta, GPayload, GBizData>;
}
