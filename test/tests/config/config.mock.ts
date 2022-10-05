import tests from '@ijest';

tests('config.mock', (test, assert, { easyapi }) => {
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
    const api = easyapi({
      mode: 'development',
      config: {
        mockBody: () => mockResponseObject.data,
        mockHeaders: () => mockResponseObject.headers,
      },
      dataFormat: (ctx) => ctx.responseObject,
    });
    return api.test().then(({ data, headers }) => {
      assert.isEqual(data, mockResponseObject.data);
      assert.isEqual(headers, mockResponseObject.headers);
    });
  });

  test('config.mock.mockData', () => {
    const mockData = {
      name: '张三',
    };
    const api = easyapi({
      mode: 'development',
      config: {
        mockData: () => mockData,
      },
    });
    return api.test().then((data) => {
      assert.isEqual(data, mockData);
    });
  });

  test('config.mock:error', () => {
    const mockData = {
      code: 200,
      data: {
        name: '张三',
      },
    };
    const api = easyapi({
      mode: 'development',
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
