import tests from '@ijest';

tests('config.define', (test, assert, { easyapi, http }) => {
  test('config.define.url', () => {
    const api = easyapi({
      config: {
        url: '?cmd=http200&seturl=1',
      },
      response({ config }) {
        assert.isMatch(config.url, /\?cmd=http200&seturl=1$/);
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
        assert.isBe(axios.headers.a, 1);
        assert.isBe(axios.headers.b, 2);
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
    return api
      .test()
      .then(() => {
        // ..
      })
      .catch((error) => {
        assert.isBe(error.message, 'timeout of 189ms exceeded');
      });
  });

  test('config.define.delay', () => {
    const api1 = easyapi({
      success() {
        assert.isBe(this.config.delay, 300);
      },
    });
    const api2 = easyapi({
      config: { delay: 2000 },
      success() {
        assert.isBe(this.config.delay, 2000);
      },
    });
    const api3 = easyapi({
      mode: 'development',
      config: { delay: 2000 },
      success({ config }) {
        assert.isBe(2000, config.delay);
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
      dataFormat: false,
      config: {
        mockBody() {
          return mock.body;
        },
        mockHeaders() {
          return mock.headers;
        },
      },
      response({ responseObject: { data, headers } }) {
        assert.isEqual(data, mock.body);
        assert.isEqual(headers, mock.headers);
      },
    });

    return api.test();
  });

  test('config.define.logger', () => {
    const api1 = easyapi({
      response() {
        assert.isBe(this.config.logger, true);
      },
      config: {
        logger: true,
      },
    });
    const api2 = easyapi({
      response() {
        assert.isBe(this.config.logger, false);
      },
      config: {},
    });

    return Promise.all([api1.test(), api2.test()]);
  });
});
