import { RequestOption } from './index.types';
export default class Request<ApiExtendConfig, OtherConfig, Payload, Data> {
    private readonly uuid;
    private readonly runtime;
    private readonly config;
    private readonly cache;
    constructor({ runtime, config, }: RequestOption<ApiExtendConfig, OtherConfig, Payload, Data>);
    cacheResult(ctx: any): any;
    mockResult(ctx: any): Promise<unknown>;
    httpResult(ctx: any): Promise<unknown>;
    send(payload: any, config: any): any;
    private response;
}
