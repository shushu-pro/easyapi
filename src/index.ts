import axios from 'axios';

import Easyapi from './Easyapi';
import { EasyapiOption } from './types/EasyapiOption';

function easyapi<GExtendApiConfig, GExtendEasyapiOption = unknown>(
  option: EasyapiOption<GExtendApiConfig, GExtendEasyapiOption>
) {
  const ea = new Easyapi<GExtendApiConfig, GExtendEasyapiOption>(option);
  return {
    define: ea.define.bind(ea) as Easyapi<
      GExtendApiConfig,
      GExtendEasyapiOption
    >['define'],
  };
}

easyapi.abort = abort;

const { CancelToken } = axios;

function abort() {
  const source = CancelToken.source();
  return {
    cancelToken: source.token,
    dispatch(message?: string) {
      source.cancel(message);
    },
  };
}

const version = '0.1.18';

export default easyapi;
export { easyapi };
export { Easyapi, version };
export { ErrorIgnoreName } from './const';
export { default as Context } from './Context';
export * from './types';
