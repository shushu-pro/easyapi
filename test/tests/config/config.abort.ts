import tests from '@ijest';

tests('config.abort', (test, assert, { easyapi }) => {
  test('config.abort.cancelToken', () => {
    const api = easyapi(
      {
        mode: 'development',
        errorIgnore: true,
        config: {},
      },
      999
    );

    const abort = easyapi.abort();

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
