import { assert, easyapi, expect, test } from './helper';

test('config.define.url', () => {
  const api = easyapi({
    config: {
      url: '?cmd=http200&seturl=1',
    },
    response({ config }) {
      assert.match(config.url, /\?cmd=http200&seturl=1$/);
    },
  });
  return api.test();
});

test('config.define.method', () => {
  const pps = ['get', 'post', 'put', 'delete', 'patch'].map((method) =>
    easyapi({
      config: { method },
      response({ config }) {
        // ..
      },
    }).test()
  );

  return Promise.all(pps);
});

test('config.define.headers', () => {
  const api = easyapi({
    config: {
      axios: {
        headers: { a: 1, b: 2 },
      },
    },
    response({ axios }) {
      expect(axios.headers.a).toBe(1);
      expect(axios.headers.b).toBe(2);
    },
  });
  return api.test();
});

test('config.define.timeout', () => {
  const api = easyapi(
    {
      config: { timeout: 189 },
    },
    999
  );
  return api.test().catch((error) => {
    expect(error.message).toBe('timeout of 189ms exceeded');
  });
});

test('config.define.delay', () => {
  const api1 = easyapi({
    success() {
      expect(this.config.delay).toBe(300);
    },
  });
  const api2 = easyapi({
    config: { delay: 2000 },
    success() {
      expect(this.config.delay).toBe(2000);
    },
  });
  const api3 = easyapi({
    mode: 'development',
    config: { delay: 2000 },
    success({ config }) {
      expect(config.delay).toBe(2000);
    },
  });
  return Promise.all([api1.test(), api2.test(), api3.test()]);
});

test('config.define.mock', () => {
  const mock = {
    headers: { a: '1', b: '2' },
    body: { code: 0, data: 'this is mock' },
  };
  const api = easyapi({
    mode: 'development',
    config: {
      mockBody() {
        return mock.body;
      },
      mockHeaders() {
        return mock.headers;
      },
    },
    response({ responseObject: { data, headers } }) {
      expect(data).toEqual(mock.body);
      expect(headers).toEqual(mock.headers);
    },
  });

  return api.test();
});

test('config.define.logger', () => {
  const api1 = easyapi({
    response() {
      assert.isTrue(this.config.logger);
    },
    config: {
      logger: true,
    },
  });
  const api2 = easyapi({
    response() {
      assert.isFalse(this.config.logger);
    },
    config: {},
  });

  return Promise.all([api1.test(), api2.test()]);
});
