import tests from '@ijest';

tests('config.mockOff', (test, assert, { easyapi }) => {
  const mockObject = {
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

  test('config.mockOff.unset', () => {
    const api = easyapi({
      mode: 'development',
      config: {
        mockBody: () => mockObject.data,
        mockHeaders: () => mockObject.headers,
      },
      dataFormat: (ctx) => ctx.responseObject,
    });
    return api.test().then(({ data, headers }) => {
      assert.isEqual(data, mockObject.data);
      assert.isEqual(headers, mockObject.headers);
    });
  });

  test('default.config.mockOff=true', () => {
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
    const api = easyapi({
      mode: 'development',
      mockOff: true,
      config: {
        mockBody: () => mockObject.data,
        mockHeaders: () => mockObject.headers,
      },
      dataFormat: (ctx) => ctx.responseObject,
    });
    return api.test().then(({ data, headers }) => {
      assert.isEqual(data.data, { cmd: 'http200' });
      assert.isEqual(headers.token, undefined);
    });
  });

  test('define.config.mockOff=true', () => {
    const api = easyapi({
      mode: 'development',
      config: {
        mockOff: true,
        mockBody: () => mockObject.data,
        mockHeaders: () => mockObject.headers,
      },
      dataFormat: (ctx) => ctx.responseObject,
    });
    return api.test(null, {}).then(({ data, headers }) => {
      assert.isEqual(data.data, { cmd: 'http200' });
      assert.isEqual(headers.token, undefined);
    });
  });

  test('request.config.mockOff=true', () => {
    const api = easyapi({
      mode: 'development',
      config: {
        mockBody: () => mockObject.data,
        mockHeaders: () => mockObject.headers,
      },
      dataFormat: (ctx) => ctx.responseObject,
    });
    return api
      .test(null, {
        mockOff: true,
      })
      .then(({ data, headers }) => {
        assert.isEqual(data.data, { cmd: 'http200' });
        assert.isEqual(headers.token, undefined);
      });
  });
});
