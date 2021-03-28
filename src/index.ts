import Easyapi from './Easyapi';
import { EasyapiOption } from './typing';

function easyapi(option: EasyapiOption) {
  return new Easyapi(option).exports;
}

export default easyapi;
export { Easyapi };
