import Easyapi from './Easyapi';
import { EasyapiOption } from './index.types';
declare function easyapi<ApiExtendConfig, OtherConfig = unknown>(option: EasyapiOption<ApiExtendConfig, OtherConfig>): {
    define: <Payload = any, Data = any>(shareConfig: import("./index.types").ApiShareConfig<ApiExtendConfig, OtherConfig, Payload, Data>) => (payload?: Payload, config?: import("./index.types").ApiPrivateConfig<ApiExtendConfig, OtherConfig, Payload, Data>) => Promise<Data>;
};
declare const version = "0.1.18";
export default easyapi;
export { Easyapi, version };
