import tests from '@ijest';

tests('config.mock', (test, assert, { http }) => {
  test('config.mock:fully', () => {
    const mockResponseObject = {
      headers: {
        token: 'abcd',
      },
      data: {
        code: 200,
        data: {
          name: '张三',
        },
      },
    };
    const api = http.create({
      env: 'development',
      config: {
        mockBody: () => mockResponseObject.data,
        mockHeaders: () => mockResponseObject.headers,
      },
      resolver: (ctx) => ctx.responseObject,
    });
    return api.test().then(({ data, headers }) => {
      assert.isEqual(data, mockResponseObject.data);
      assert.isEqual(headers, mockResponseObject.headers);
    });
  });

  test('config.mock.mockData', () => {
    const mockData = {
      code: 200,
      data: {
        name: '张三',
      },
    };
    const api = http.create({
      env: 'development',
      config: {
        mockBody: () => mockData,
      },
      resolver: (ctx) => ctx.responseObject,
    });
    return api.test().then(({ data, headers }) => {
      assert.isEqual(data, mockData);
      assert.isEqual(headers, {});
    });
  });

  test('config.mock:error', () => {
    const mockData = {
      code: 200,
      data: {
        name: '张三',
      },
    };
    const api = http.create({
      env: 'development',
      config: {
        mockBody: () => mockData,
      },
      response() {
        throw Error('xx');
      },
    });
    return api
      .test()
      .then(({ data, headers }) => {
        assert.isEqual(data, mockData);
        assert.isEqual(headers, {});
      })
      .catch((err) => {
        assert.isBe(err.message, 'xx');
      });
  });
});
