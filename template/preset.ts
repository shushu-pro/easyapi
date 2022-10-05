import easyapi, {
  DefineApiConfig,
  RequestApiConfig,
} from '@shushu.pro/easyapi';
import { define } from './config';
import { ExtendApiConfig, ExtendEasyapiOption } from './types';

export function request<GPayload = any, GData = any>(
  option: DefineApiConfig &
    RequestApiConfig &
    ExtendApiConfig & { easyapi?: ExtendEasyapiOption } & { payload?: GPayload }
) {
  const { payload, query, params, data, ...defineConfig } = option;
  return define<GPayload, GData>(defineConfig)(payload, {
    query,
    params,
    data,
  });
}

export const { abort } = easyapi;

export { define };
