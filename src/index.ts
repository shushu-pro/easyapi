import Easyapi from './Easyapi';
import { EasyapiOption } from './typings';

function easyapi(option: EasyapiOption) {
  return new Easyapi(option).exports;
}

export default easyapi;
export { Easyapi };
