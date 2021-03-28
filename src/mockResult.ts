import onResponse from './onResponse';
import RequestConfig from './RequestConfig';

// 使用本地mock响应
function mockResult(config: RequestConfig) {
  const { context, meta } = config;

  // console.info('mockResult');

  // 生产模式，或者无mock配置项，则不执行mock数据
  if (!context.isDevelopment || !meta.mock) {
    return;
  }

  const mockDataResult = new Promise((resolve, reject) => {
    const responseObject = meta.mock({
      sendData: config.sendData,
      headers: meta.headers,
      config: config.meta,
    });

    if (responseObject instanceof Promise) {
      responseObject
        .then((responseObject) => {
          resolveResponseObject(responseObject);
        })
        .catch(reject);
    } else {
      resolveResponseObject(responseObject);
    }

    function resolveResponseObject(responseObject: any = {}) {
      if (!responseObject || typeof responseObject !== 'object') {
        return resolve({
          data: responseObject,
          headers: {},
          config: config.meta,
        });
      }

      const { $body, $headers } = responseObject;
      // 返回的即body
      if (!$body && !$headers) {
        return resolve({
          data: responseObject,
          headers: {},
          config: config.meta,
        });
      }

      resolve({
        data: $body || null,
        headers: $headers || {},
        config: config.meta,
      });
    }
  });

  return onResponse(mockDataResult, config);
}

export default mockResult;
