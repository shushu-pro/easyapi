import { DefineApiConfig, RequestApiConfig } from './ApiConfig';
import { Runtime } from './Runtime';

export type ContextOption<
  GExtendApiConfig = unknown,
  GExtendEasyapiOption = unknown,
  GPayload = any,
  GResponseData = any
> = {
  payload: GPayload;
  defineConfig: DefineApiConfig<
    GExtendApiConfig,
    GExtendEasyapiOption,
    GPayload,
    GResponseData
  >;
  requestConfig: RequestApiConfig<
    GExtendApiConfig,
    GExtendEasyapiOption,
    GPayload,
    GResponseData
  >;
  runtime: Runtime<GExtendApiConfig, GExtendEasyapiOption>;
};
