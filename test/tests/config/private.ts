import tests from '@ijest';

tests('config.private', (test, assert, { http }) => {
  test('config.private.headers', () => {
    const api = http.create({
      config: {
        headers: { a: 1, b: 2 },
      },
      response({ axios }) {
        assert.isBe(axios.headers.a, 11);
        assert.isBe(axios.headers.b, 2);
        assert.isBe(axios.headers.c, 22);
      },
    });

    return api.test(null, {
      headers: { a: 11, c: 22 },
    });
  });

  test('config.private.timeout', () => {
    const api = http.create(999, {
      config: { timeout: 189 },
    });
    return api.test(null, { timeout: 222 }).catch((error) => {
      assert.isBe(error.message, 'timeout of 222ms exceeded');
    });
  });

  test('config.private.delay', () => {
    const now = Date.now();
    const api1 = http.create({
      success({ config }) {
        assert.isBe(config.delay, 0);
      },
    });
    const api2 = http.create({
      env: 'development',
      config: { delay: 100 },
      success({ config }) {
        assert.isBe(config.delay, 1000);
      },
    });
    return Promise.all([api1.test(), api2.test(null, { delay: 1000 })]);
  });

  test('config.private: mockBody, mockHeaders', () => {
    const shareMock = {
      headers: { a: 1, b: 2 },
      data: 'this is mock',
    };
    const privateMock = {
      data: 'this is private mock',
    };
    const api = http.create({
      env: 'development',
      config: {
        mockBody() {
          return shareMock.data;
        },
        mockHeaders() {
          return shareMock.headers;
        },
      },
      response({ responseObject: { data, headers } }) {
        assert.isEqual(data, privateMock.data);
        assert.isEqual(headers, {});
      },
    });

    return api.test(null, {
      mockBody() {
        return privateMock.data;
      },
      mockHeaders() {
        return {};
      },
    });
  });

  test('config.private.logger', () => {
    const api = http.create({
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

  // test('config.private.abort', () => {
  //   const abort: any = {};
  //   const payload = { id: 'GX-001', ms: 100 };
  //   const errorMessage = '取消产生的错误';
  //   const privateConfig = {
  //     method: 'get',
  //     abort,
  //     errorIgnore: true,
  //   };
  //   const api = http.create({
  //     failure(config) {
  //       assert.isBe(config.error.message, errorMessage);
  //     },
  //   });

  //   setTimeout(() => {
  //     abort.trigger(errorMessage);
  //   }, 20);

  //   return api.test(payload, privateConfig).catch(() => {
  //     // ..
  //   });
  // });
});
