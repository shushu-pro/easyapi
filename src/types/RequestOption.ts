import { DefineApiConfig } from './ApiConfig';
import { Runtime } from './Runtime';

export interface RequestOption<
  GExtendApiConfig = unknown,
  GExtendEasyapiOption = unknown,
  GPayload = any,
  GResponseData = any
> {
  runtime: Runtime<GExtendApiConfig, GExtendEasyapiOption>;
  config: DefineApiConfig<
    GExtendApiConfig,
    GExtendEasyapiOption,
    GPayload,
    GResponseData
  >;
}
