import { createAbort, easyapi, expect, test } from './helper';

test('config.abort.cancelToken', () => {
  const api = easyapi(
    {
      mode: 'development',
      errorIgnore: true,
      config: {},
      axios: {
        // abort无法中止服务器，固此处直接设置超时
        timeout: 1000,
      },
    },
    999
  );

  const abort = createAbort();

  setTimeout(() => {
    abort.dispatch('取消请求');
  }, 100);

  return api
    .test(null, {
      axios: {
        cancelToken: abort.token,
      },
    })
    .catch((err) => {
      expect(err.message).toBe('取消请求');
    });
});
