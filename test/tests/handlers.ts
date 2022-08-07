import tests from '@ijest';

tests('handlers', (test, assert, { http }) => {
  test('handlers.request(ctx)', () => {
    const payload = { id: 'GX-001' };
    const api1 = http.create({
      request(ctx) {
        assert.isEqual(ctx.payload, payload);
        ctx.payload.id = 'GX-002';
      },
      response({ responseObject: { config } }) {
        assert.isBe(config.params.id, 'GX-002');
      },
    });
    const api2 = http.create({
      request() {
        this.payload = { id: 'GX-002' };
        this.axios.timeout = 12345;
      },
      response({ responseObject: { config } }) {
        assert.isBe(config.params.id, 'GX-002');
        assert.isBe(config.timeout, 12345);
      },
    });

    return Promise.all([api1.test(payload), api2.test(payload)]);
  });

  test('handlers.response(ctx)', () => {
    const api = http.create({
      env: 'development',
      response({ responseObject }) {
        assert.isObject(responseObject);
        assert.isObject(responseObject.config);
        assert.isObject(responseObject.headers);
        responseObject.data = { a: 1 };
      },
      success({ responseObject }) {
        assert.isEqual(responseObject.data, { a: 1 });
      },
    });

    return Promise.all([
      api.test(),
      api.test(null, {
        mockData() {
          return {
            data: {},
          };
        },
      }),
    ]);
  });

  test('handlers.success(ctx)', () => {
    const api = http.create({
      success({ responseObject }) {
        assert.isObject(responseObject.data);
        assert.isBe(responseObject.data.cmd, 'http200');
        assert.isObject(responseObject.config);
        responseObject.data = { a: 1 };
      },
      resolver: (ctx) => ctx.responseObject.data,
    });

    return api.test().then((data) => {
      assert.isEqual(data, { a: 1 });
    });
  });

  test('handlers.failure(config)', () => {
    const api1 = http.create({
      response() {
        throw Error('xxx');
      },
      failure(config) {
        assert.isObject(config.error);
        assert.isObject(config);
        assert.isBe(config.error.message, 'xxx');
        config.error = new Error('xyz');
      },
    });

    const api2 = http.create(999, {
      timeout: 123,
      failure(config) {
        assert.isObject(config.error);
        assert.isObject(config);
      },
    });

    return Promise.all([
      api1.test().catch((error) => {
        assert.isObject(error);
        assert.isBe(error.message, 'xyz');
      }),
      api2.test().catch((error) => {
        assert.isObject(error);
        assert.isBe(error.message, 'timeout of 123ms exceeded');
      }),
    ]);
  });
});
