import tests from '@ijest';

tests('config.abort', (test, assert, { easyapi, createAbort }) => {
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
          cancelToken: abort.cancelToken,
        },
      })
      .catch((err) => {
        assert.isBe('取消请求', err.message);
      });
  });
});
