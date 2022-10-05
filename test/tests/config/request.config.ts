import tests from '@ijest';

tests('config.request', (test, assert, { easyapi }) => {
  test('config.request.headers', () => {
    const api = easyapi({
      config: {
        axios: {
          headers: { a: 1, b: 2 },
        },
      },
      response({ axios }) {
        assert.isBe(axios.headers.a, 11);
        assert.isBe(axios.headers.b, 2);
        assert.isBe(axios.headers.c, 22);
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
      assert.isBe(error.message, 'timeout of 222ms exceeded');
    });
  });

  test('config.request.delay', () => {
    const now = Date.now();
    const api1 = easyapi({
      success({ config }) {
        assert.isBe(config.delay, 300);
      },
    });
    const api2 = easyapi({
      mode: 'development',
      config: { delay: 100 },
      success({ config }) {
        assert.isBe(config.delay, 1000);
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
        assert.isEqual(data, requestMock.body);
        assert.isEqual(headers, {});
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
        assert.isBe(logger, true);
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
  //       assert.isBe(config.error.message, errorMessage);
  //     },
  //   });

  //   setTimeout(() => {
  //     abort.trigger(errorMessage);
  //   }, 20);

  //   return api.test(payload, requestConfig).catch(() => {
  //     // ..
  //   });
  // });
});
