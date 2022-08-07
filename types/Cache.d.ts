export default class Cache<ApiExtendConfig = unknown, OtherConfig = unknown, Payload = unknown, Data = unknown> {
    private readonly storage;
    constructor({ storage }: {
        storage: any;
    });
    private key;
    /** @description 是否已过期 */
    private isExpired;
    private config;
    /** @description 异步方式等待获取缓存 */
    pending(ctx: any): any;
    resolves(ctx: any, promiseResult: any): void;
}
