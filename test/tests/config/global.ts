import tests from '@ijest';

tests('config.global', (test, assert, { http }) => {
  test('config.global:baseURL', () => {
    const api = http.create(200, {
      baseURL: `${http.baseURL}abc/`,
      response({ responseObject }) {
        assert.isBe(responseObject.config.baseURL, `${http.baseURL}abc/`);
      },
    });
    return api.test();
  });

  test('config.global:timeout', () => {
    const api = http.create(999, {
      timeout: 100,
    });

    return api.test().catch((error) => {
      assert.isBe(error.message, 'timeout of 100ms exceeded');
    });
  });

  test('config.global:responseType', () => {
    const api = http.create(200, {
      response({ config }) {
        assert.isBe(config.responseType, 'text');
      },
    });
    return api.test(null, {
      responseType: 'text',
    });
  });

  test('config.global:env', () => {
    const api1 = http.create(200, {
      config: {
        mockData() {
          return {
            data: 'MOCK',
          };
        },
      },
      response({ responseObject }) {
        assert.isUndefined(responseObject.data.data);
      },
    });
    const api2 = http.create(200, {
      env: 'development',
      config: {
        mockBody() {
          return {
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

  test('config.global:resolver', () => {
    const api1 = http.create(200, {
      env: 'development',
      config: {
        mockBody() {
          return {
            data: 'MOCK',
          };
        },
      },
      resolver: ({ responseObject }) => responseObject.data.data,
    });
    const api2 = http.create(200, {
      env: 'development',
      config: {
        mockBody() {
          return {
            data: 'MOCK',
          };
        },
      },
      resolver: ({ responseObject }) => responseObject.data,
      errorIgnore: true,
    });
    return Promise.all([
      api1.test().then((data) => {
        assert.isEqual(data, 'MOCK');
      }),
      api2.test().then((data) => {
        assert.isEqual(data, { data: 'MOCK' });
      }),
    ]);
  });
});
