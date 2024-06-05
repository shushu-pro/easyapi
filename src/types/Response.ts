import { AxiosResponse } from 'axios';

/**
 * @description 接口响应的对象
 * */
export type ResponseObject<GBizData> = AxiosResponse<ResponseBody<GBizData>>;

/**
 * @description 接口响应的body
 * */
export interface ResponseBody<GBizData> {
  code: number;
  data?: GBizData extends unknown ? any : GBizData;
  message?: string;
  [key: string]: any;
}
