/**
 * @descirption 接口响应的错误
 * */
export class ResponseError<GBizData> extends Error {
  readonly data?: any;

  constructor(message: string | Error, data?: any) {
    super(message instanceof Error ? message.message : message);
    this.name = '=== easyapi.error.response ===';
    this.data = data;
  }
}
