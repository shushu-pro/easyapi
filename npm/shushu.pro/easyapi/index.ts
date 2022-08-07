import Easyapi from './Easyapi';
import { EasyapiOption } from './index.types';

function easyapi<ApiExtendConfig, OtherConfig = unknown>(
  option: EasyapiOption<ApiExtendConfig, OtherConfig>
) {
  const that = new Easyapi<ApiExtendConfig, OtherConfig>(option);
  return {
    define: that.define.bind(that) as Easyapi<
      ApiExtendConfig,
      OtherConfig
    >['define'],
  };
}

const version = '0.1.18';

export default easyapi;
export { Easyapi, version };
