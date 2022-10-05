import tests from '@ijest';

tests('default.config', (test, assert, { easyapi, http }) => {
  test('default.config:baseURL', () => {
    const api = easyapi({
      axios: {
        baseURL: `${http.baseURL}abc/`,
      },
      response({ responseObject }) {
        assert.isBe(responseObject.config.baseURL, `${http.baseURL}abc/`);
      },
    });
    return api.test();
  });

  test('default.config:timeout', () => {
    const api = easyapi(
      {
        axios: {
          timeout: 100,
        },
      },
      999
    );

    return api.test().catch((error) => {
      assert.isBe(error.message, 'timeout of 100ms exceeded');
    });
  });

  test('default.config:responseType', () => {
    const api = easyapi({
      response({ responseObject }) {
        assert.isBe(responseObject.config.responseType, 'text');
      },
    });
    return api.test(null, {
      axios: {
        responseType: 'text',
      },
    });
  });

  test('default.config:mode', () => {
    const api1 = easyapi({
      config: {
        mockData() {
          return {
            data: 'MOCK',
          };
        },
      },
      response({ responseObject }) {
        assert.isEqual(responseObject.data.data, { cmd: 'http200' });
      },
    });
    const api2 = easyapi({
      mode: 'development',
      config: {
        mockBody(ctx) {
          return {
            code: 0,
            data: 'MOCK',
          };
        },
      },
      response({ responseObject }) {
        assert.isBe(responseObject.data.data, 'MOCK');
      },
    });
    return Promise.all([api1.test(), api2.test()]);
  });

  test('default.config:dataFormat', () => {
    const api1 = easyapi({
      mode: 'development',
      config: {
        mockBody() {
          return {
            code: 0,
            data: 'MOCK',
          };
        },
      },
      dataFormat: ({ responseObject }) => responseObject.data.data,
    });
    const api2 = easyapi({
      mode: 'development',
      config: {
        mockBody() {
          return {
            code: 0,
            data: 'MOCK',
          };
        },
      },
      dataFormat: ({ responseObject }) => responseObject.data,
      errorIgnore: true,
    });
    return Promise.all([
      api1.test().then((data) => {
        assert.isEqual(data, 'MOCK');
      }),
      api2.test().then((data) => {
        assert.isEqual(data, { code: 0, data: 'MOCK' });
      }),
    ]);
  });
  test('default.config.mockForce', () => {
    const api1 = easyapi({
      mode: 'development',
      config: {
        mockData() {
          return 'MOCK';
        },
      },
    });
    const api2 = easyapi({
      mode: 'production',
      config: {
        mockData() {
          return 'MOCK';
        },
      },
    });
    const api3 = easyapi({
      mode: 'production',
      mockForce: true,
      config: {
        mockData() {
          return 'MOCK';
        },
      },
    });
    return Promise.all([
      api1.test().then((data) => {
        assert.isBe(data, 'MOCK');
      }),
      api2.test().then((data) => {
        assert.isTrue(data !== 'MOCK');
      }),
      api3.test().then((data) => {
        assert.isBe(data, 'MOCK');
      }),
    ]);
  });
});
