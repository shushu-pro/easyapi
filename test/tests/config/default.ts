import tests from '@ijest';

tests('config.defaults', (test, assert, { http }) => {
  test('config.defaults: method, logger, delay, baseURL, headers, responseType', () => {
    const api = http.create(200, {
      response({ axios, config }) {
        assert.isBe(config.logger, false);
        assert.isBe(config.delay, 0);
        assert.isBe(axios.method, 'get');
        assert.isEqual(axios.headers, {});
        assert.isBe(axios.responseType, 'json');
      },
    });
    return api.test({ a: 22 });
  });
});
