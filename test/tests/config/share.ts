import tests from '@ijest';

tests('config.share', (test, assert, { http }) => {
  test('config.share.url', () => {
    const api = http.create({
      config: {
        url: '?cmd=http200&seturl=1',
      },
      response({ config }) {
        assert.isMatch(config.url, /\?cmd=http200&seturl=1$/);
      },
    });
    return api.test();
  });

  test('config.share.method', () => {
    const pps = ['get', 'post', 'put', 'delete', 'patch'].map((method) =>
      http
        .create({
          config: { method },
          response({ config }) {
            // ..
          },
        })
        .test()
    );

    return Promise.all(pps);
  });

  test('config.share.headers', () => {
    const api = http.create({
      config: {
        headers: { a: 1, b: 2 },
      },
      response({ axios }) {
        assert.isBe(axios.headers.a, 1);
        assert.isBe(axios.headers.b, 2);
      },
    });
    return api.test();
  });

  test('config.share.timeout', () => {
    const api = http.create(999, {
      config: { timeout: 189 },
    });
    return api
      .test()
      .then(() => {
        // ..
      })
      .catch((error) => {
        assert.isBe(error.message, 'timeout of 189ms exceeded');
      });
  });

  test('config.share.delay', () => {
    const api1 = http.create({
      success() {
        assert.isBe(this.config.delay, 0);
      },
    });
    const api2 = http.create({
      config: { delay: 2000 },
      success() {
        assert.isBe(this.config.delay, 2000);
      },
    });
    const api3 = http.create({
      env: 'development',
      config: { delay: 2000 },
      success({ config }) {
        assert.isBe(2000, config.delay);
      },
    });
    return Promise.all([api1.test(), api2.test(), api3.test()]);
  });

  test('config.share.mock', () => {
    const mock = {
      headers: { a: 1, b: 2 },
      data: 'this is mock',
    };
    const api = http.create({
      env: 'development',
      config: {
        mockBody() {
          return 'this is mock';
        },
        mockHeaders() {
          return { a: 1, b: 2 };
        },
      },
      response({ responseObject: { data, headers } }) {
        assert.isEqual(data, mock.data);
        assert.isEqual(headers, mock.headers);
      },
    });

    return api.test();
  });

  test('config.share.logger', () => {
    const api1 = http.create({
      response() {
        assert.isBe(this.config.logger, true);
      },
      config: {
        logger: true,
      },
    });
    const api2 = http.create({
      response() {
        assert.isBe(this.config.logger, false);
      },
      config: {},
    });

    return Promise.all([api1.test(), api2.test()]);
  });
});
