import type { RequestContext } from '@shushu.pro/easyapi';

export interface CustomConfig {
  /** @description 请求拦截适配器 */
  requestAdapter?:
    | Record<string, any>
    | ((payload, adapter) => Record<string, any>);

  /** @description 成功响应拦截适配器 */
  responseAdapter?:
    | Record<string, any>
    | ((resolveData, adapter) => Record<string, any>);

  /** @description 关闭默认错误处理 */
  preventDefaultError?: boolean;

  /** @description 启用在线mock */
  easymock?: boolean;

  /** @description 快速mock数据 */
  mockjson?: string;

  /** @description 开启成功反馈，当值为字符串时，则反馈信息为字符串的内容 */
  showSuccess?: boolean | string;

  /** @description 关闭默认的错误信息，默认都会显示错误信息，假如不需要，请设置为false */
  showError?: boolean;

  /** @description 请求前拦截器，在发起请求前，迟于requestAdapter */
  beforeRequest?: (ctx: RequestContext<CustomConfig, OtherConfig>) => void;

  /** @description 响应前拦截器，在完成响应时，早于responseAdapter */
  beforeResponse?: (ctx: RequestContext<CustomConfig, OtherConfig>) => void;

  /** @description 是否关闭mock */
  mockOff?: boolean;
}

export interface OtherConfig {
  test: string;
}
