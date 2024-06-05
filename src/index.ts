import axios from 'axios';

import { Define, Easyapi } from './Easyapi';
import { CompositeConfig, EasyapiOption } from './types';

const { CancelToken } = axios;

function createAbort() {
  const source = CancelToken.source();
  return {
    token: source.token,
    dispatch(message?: string) {
      source.cancel(message);
    },
  };
}

export function easyapi<GExtendConfig, GExtendMeta = unknown>(
  option: EasyapiOption<GExtendConfig, GExtendMeta>
) {
  const ea = new Easyapi<GExtendConfig, GExtendMeta>(option);
  const define = ea.define.bind(ea) as Define<GExtendConfig, GExtendMeta>;

  return {
    define,
    request,
    createAbort,
  };

  function request<GPayload = null, GBizData = null>(
    compositeConfig: CompositeConfig<
      GExtendConfig,
      GExtendMeta,
      GPayload,
      GBizData
    > & {
      payload?: GPayload;
      meta?: GExtendMeta;
    }
  ) {
    const { payload, query, params, data, meta, ...defineConfig } =
      compositeConfig;
    return define<GPayload, GBizData>(defineConfig as null)(payload, {
      params,
      query,
      data,
    } as null);
  }
}

export { createAbort, Easyapi };
export { ErrorIgnoreSymbol } from './const';
export { type Context } from './Context';
export { type BaseConfig } from './types';
export default easyapi;
