import { assert, easyapi, expect, test } from './helper';

test('config.defaults: method, logger, delay, errorIgnore, baseURL, headers, responseType, resolveType', () => {
  const api = easyapi({
    response({ axios, config }) {
      assert.isFalse(config.logger);
      assert.isFalse(config.errorIgnore);

      expect(config.delay).toBe(300);
      expect(axios.method).toBe('get');
      expect(axios.headers).toEqual({});
      expect(axios.responseType).toBe('json');
      expect(config.resolveType).toBe('data');
    },
  });
  return api.test({ a: 22 });
});
