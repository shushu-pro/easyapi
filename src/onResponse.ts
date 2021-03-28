import { IgnoreErrorName } from './Easyapi';
import RequestConfig from './RequestConfig';

function onResponse(asyncResponseObject, config: RequestConfig) {
  const { logger } = config.meta;
  const { isDevelopment } = config.context;
  const promise = new Promise((resolve, reject) => {
    // 开发模式下，模拟delay效果
    if (isDevelopment) {
      setTimeout(asyncResponseCall, config.meta.delay || 0);
    } else {
      asyncResponseCall();
    }

    function asyncResponseCall() {
      const { response, success, failure } = config.context.handlers;

      asyncResponseObject
        .then((responseObject) => {
          config.responseObject = responseObject;
          if (typeof response === 'function') {
            response(config);
          }

          if (typeof success === 'function') {
            success(config);
          }

          if (isDevelopment && logger) {
            console.warn('=== easyapi.response ===\n', { config });
          }
          resolve(config.responseObject);
        })
        .catch((error) => {
          try {
            if (typeof failure === 'function') {
              config.error = error;
              failure(config);
              return reject(config.error);
            }
            reject(error);
          } catch (error) {
            reject(error);
          } finally {
            if (isDevelopment && logger) {
              console.warn('=== easyapi.error ===\n', { config });
            }
          }
        });
    }
  });

  let nextPromise = promise;
  // 忽略错误
  if (config.meta.errorIgnore) {
    nextPromise = nextPromise.catch((error) => {
      error.name = IgnoreErrorName;
      throw error;
    });
  }

  return nextPromise.then((responseObject) =>
    config.meta.resolve ? config.meta.resolve(responseObject) : responseObject
  );
}

export default onResponse;
