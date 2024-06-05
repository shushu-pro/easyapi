import { assert, easyapi, expect, test } from './helper';

test('config.request.headers', () => {
  const api = easyapi({
    config: {
      axios: {
        headers: { a: 1, b: 2 },
      },
    },
    response({ axios }) {
      expect(axios.headers.a).toBe(11);
      expect(axios.headers.b).toBe(2);
      expect(axios.headers.c).toBe(22);
    },
  });

  return api.test(null, {
    axios: {
      headers: { a: 11, c: 22 },
    },
  });
});

test('config.request.timeout', () => {
  const api = easyapi(
    {
      config: { timeout: 189 },
    },
    999
  );
  return api.test(null, { timeout: 222 }).catch((error) => {
    expect(error.message).toBe('timeout of 222ms exceeded');
  });
});

test('config.request.delay', () => {
  const api1 = easyapi({
    success({ config }) {
      expect(config.delay).toBe(300);
    },
  });
  const api2 = easyapi({
    mode: 'development',
    config: { delay: 100 },
    success({ config }) {
      expect(config.delay).toBe(1000);
    },
  });
  return Promise.all([api1.test(), api2.test(null, { delay: 1000 })]);
});

test('config.request: mockBody, mockHeaders', () => {
  const defineMock = {
    headers: { a: '1', b: '2' },
    body: {
      code: 0,
      data: 'this is define mock',
    },
  };

  const requestMock = {
    body: {
      code: 0,
      data: 'this is request mock',
    },
  };

  const api = easyapi({
    mode: 'development',
    config: {
      mockBody() {
        return defineMock.body;
      },
      mockHeaders() {
        return defineMock.headers;
      },
    },
    response({ responseObject: { data, headers } }) {
      expect(data).toEqual(requestMock.body);
      expect(headers).toEqual({});
    },
  });

  return api.test(null, {
    mockBody() {
      return requestMock.body;
    },
    mockHeaders() {
      return {};
    },
  });
});

test('config.request.logger', () => {
  const api = easyapi({
    config: {
      logger: false,
    },
    response({ config: { logger } }) {
      assert.isTrue(logger);
    },
  });

  return api.test(null, {
    logger: true,
  });
});

// test('config.request.abort', () => {
//   const abort: any = {};
//   const payload = { id: 'GX-001', ms: 100 };
//   const errorMessage = '取消产生的错误';
//   const requestConfig = {
//     method: 'get',
//     abort,
//     errorIgnore: true,
//   };
//   const api = easyapi({
//     failure(config) {
//       expect(config.error.message).toBe(errorMessage);
//     },
//   });

//   setTimeout(() => {
//     abort.trigger(errorMessage);
//   }, 20);

//   return api.test(payload, requestConfig).catch(() => {
//     // ..
//   });
// });
