import { AxiosRequestConfig } from 'axios';
declare const _default: {
    axios: AxiosRequestConfig<any>;
    easyapi: {
        /** @description 延迟响应，仅development下生效 */
        delay: number;
        /** @description 是否启用日志，默认否 */
        logger: boolean;
        resolver: (ctx: any) => any;
        rejecter: (ctx: any) => void;
    };
};
export default _default;
