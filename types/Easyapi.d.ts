import { ApiPrivateConfig, ApiShareConfig, EasyapiOption } from './index.types';
export default class Easyapi<ApiExtendConfig, OtherConfig = unknown> {
    /** @description上下文环境 */
    private runtime;
    constructor(option: EasyapiOption<ApiExtendConfig, OtherConfig>);
    /** @description 初始化上下文 */
    private initRuntime;
    /** @description 设置忽略抛出错误 */
    private initIgnoreError;
    define<Payload = any, Data = any>(shareConfig: ApiShareConfig<ApiExtendConfig, OtherConfig, Payload, Data>): (payload?: Payload, config?: ApiPrivateConfig<ApiExtendConfig, OtherConfig, Payload, Data>) => Promise<Data>;
}
