import tests from '@ijest';

tests('config.defaults', (test, assert, { easyapi }) => {
  test('config.defaults: method, logger, delay, errorIgnore, baseURL, headers, responseType', () => {
    const api = easyapi({
      response({ axios, config }) {
        assert.isBe(config.logger, false);
        assert.isBe(config.delay, 300);
        assert.isBe(config.errorIgnore, false);
        assert.isBe(axios.method, 'get');
        assert.isEqual(axios.headers, {});
        assert.isBe(axios.responseType, 'json');
      },
    });
    return api.test({ a: 22 });
  });
});
