import { ApiInstanceConfig, ApiPresetConfig, ApiShareConfig, RequestContextOption, ResponseBody, Runtime } from './index.types';
export default class RequestContext<ApiExtendConfig, OtherConfig = unknown, Payload = any, Data = any> {
    url: ApiShareConfig['url'];
    payload: Payload;
    query: any;
    data: any;
    params: any;
    responseObject: {
        headers: ApiPresetConfig['headers'];
        config: ApiPresetConfig['axios'];
        data: ResponseBody<Data>;
        responseType: string;
    };
    error: Error & {
        data?: Data;
    };
    readonly axios: ApiPresetConfig['axios'];
    readonly config: ApiInstanceConfig<ApiExtendConfig, OtherConfig, Payload, Data>;
    setAbort: (abort: any) => void;
    private cancelToken;
    readonly dataset: Record<string, any>;
    readonly runtime: Runtime<ApiExtendConfig, OtherConfig>;
    constructor({ payload, shareConfig, privateConfig, runtime, }: RequestContextOption<ApiExtendConfig, OtherConfig, Payload, Data>);
    /** @description 设置取消请求的钩子 */
    private initAbortConfig;
    /** @description 获取axios的配置项 */
    get axiosConfig(): {
        url: string;
        cancelToken: any;
        data: any;
        params: any;
        method?: string;
        baseURL?: string;
        transformRequest?: import("axios").AxiosRequestTransformer | import("axios").AxiosRequestTransformer[];
        transformResponse?: import("axios").AxiosResponseTransformer | import("axios").AxiosResponseTransformer[];
        headers?: import("axios").AxiosRequestHeaders;
        paramsSerializer?: (params: any) => string;
        timeout?: number;
        timeoutErrorMessage?: string;
        withCredentials?: boolean;
        adapter?: import("axios").AxiosAdapter;
        auth?: import("axios").AxiosBasicCredentials;
        responseType?: import("axios").ResponseType;
        responseEncoding?: string;
        xsrfCookieName?: string;
        xsrfHeaderName?: string;
        onUploadProgress?: (progressEvent: any) => void;
        onDownloadProgress?: (progressEvent: any) => void;
        maxContentLength?: number;
        validateStatus?: (status: number) => boolean;
        maxBodyLength?: number;
        maxRedirects?: number;
        beforeRedirect?: (options: Record<string, any>, responseDetails: {
            headers: Record<string, string>;
        }) => void;
        socketPath?: string;
        httpAgent?: any;
        httpsAgent?: any; /** @description 转化restful */
        proxy?: false | import("axios").AxiosProxyConfig;
        decompress?: boolean;
        transitional?: import("axios").TransitionalOptions;
        signal?: AbortSignal;
        insecureHTTPParser?: boolean;
        env?: {
            FormData?: new (...args: any[]) => object;
        };
    };
    /** @description 请求前会进行一些转化工作 */
    beforeRequest(): void;
    /** @description 转化restful */
    private convertRESTful;
    /** @description 转化payload，或根据method的不同转成不同类型的请求参数 */
    private convertPayload;
    /** @description 设置请求头 */
    setHeader(key: string, value: string): void;
}
