import { assert, easyapi, expect, test } from './helper';

test('handlers.request(ctx)', () => {
  const payload = { id: 'GX-001' };
  const api1 = easyapi({
    request(ctx) {
      expect(ctx.payload).toEqual(payload);
      ctx.payload.id = 'GX-002';
    },
    response({ responseObject: { config } }) {
      expect(config.params.id).toBe('GX-002');
    },
  });
  const api2 = easyapi({
    request() {
      this.payload = { id: 'GX-002' };
      this.axios.timeout = 12345;
    },
    response({ responseObject: { config } }) {
      expect(config.params.id).toBe('GX-002');
      expect(config.timeout).toBe(12345);
    },
  });

  return Promise.all([api1.test(payload), api2.test(payload)]);
});

test('handlers.response(ctx)', () => {
  const api = easyapi({
    mode: 'development',
    response({ responseObject }) {
      assert.isObject(responseObject);
      assert.isObject(responseObject.config);
      assert.instanceOf(responseObject.headers, Object);
      responseObject.data.data = 1;
    },
    success({ responseObject }) {
      expect(responseObject.data.data).toBe(1);
    },
  });

  return Promise.all([
    api.test(),
    // api.test(null, {
    //   mockData() {
    //     return {
    //       data: {},
    //     };
    //   },
    // }),
  ]);
});

test('handlers.success(ctx)', () => {
  const api = easyapi({
    success({ responseObject }) {
      const responseBody = responseObject.data;
      assert.isObject(responseBody.data);
      assert.isObject(responseObject.config);
      expect(responseBody.data.cmd).toBe('http200');
      responseBody.data = { a: 1 };
    },
  });

  return api.test().then((data) => {
    expect(data).toEqual({ a: 1 });
  });
});

test('handlers.failure(config)', () => {
  const api1 = easyapi({
    response() {
      throw Error('xxx');
    },
    failure(config) {
      assert.instanceOf(config.error, Error);
      assert.isObject(config);
      expect(config.error.message).toBe('xxx');

      config.setError(Error('xyz'));
    },
  });

  const api2 = easyapi(
    {
      axios: {
        timeout: 123,
      },
      failure(config) {
        assert.instanceOf(config.error, Error);
        assert.isObject(config);
      },
    },
    999
  );

  return Promise.all([
    api1.test().catch((error) => {
      assert.instanceOf(error, Error);
      expect(error.message).toBe('xyz');
    }),
    api2.test().catch((error) => {
      assert.instanceOf(error, Error);
      expect(error.message).toBe('timeout of 123ms exceeded');
    }),
  ]);
});
