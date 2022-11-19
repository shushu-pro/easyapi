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

  test('config.mock.mockHeader.promise', () => {
    const mockHeader = {
      name: '张三',
      age: '12',
    };
    const mockHeaderPromise = Promise.resolve(mockHeader);
    const api = easyapi({
      mode: 'development',
      config: {
        mockHeaders: () => mockHeaderPromise,
      },
      dataFormat: (ctx) => ctx.responseObject,
    });
    return api.test().then((responseObject) => {
      assert.isEqual(responseObject.headers, mockHeader);
    });
  });

  test('config.mock.mockBody.promise', () => {
    const mockBody = {
      code: 0,
      message: 'xx',
      data: {
        name: '张三',
        age: '12',
      },
    };
    const mockBodyPromise = Promise.resolve(mockBody);
    const api = easyapi({
      mode: 'development',
      config: {
        mockBody: () => mockBodyPromise,
      },
      dataFormat: (ctx) => ctx.responseObject,
    });
    return api.test().then((responseObject) => {
      assert.isEqual(responseObject.data, mockBody);
    });
  });

  test('config.mock.mockData.promise', () => {
    const mockData = {
      name: '张三',
      age: '12',
    };
    const mockDataPromise = Promise.resolve(mockData);
    const api = easyapi({
      mode: 'development',
      config: {
        mockData: () => mockDataPromise,
      },
      dataFormat: (ctx) => ctx.responseObject,
    });
    return api.test().then((responseObject) => {
      assert.isEqual(responseObject.data.data, mockData);
    });
  });

  test('config.mock.mockHeader.promise.esModule', () => {
    const mockHeader = {
      __esModule: true,
      default: {
        name: '张三',
        age: '12',
      },
    };
    const mockHeaderPromise = Promise.resolve(mockHeader);
    const api = easyapi({
      mode: 'development',
      config: {
        mockHeaders: () => mockHeaderPromise,
      },
      dataFormat: (ctx) => ctx.responseObject,
    });
    return api.test().then((responseObject) => {
      assert.isEqual(responseObject.headers, mockHeader.default);
    });
  });

  test('config.mock.mockBody.promise.esModule', () => {
    const mockBody = {
      __esModule: true,
      default: {
        code: 0,
        message: 'xx',
        data: {
          name: '张三',
          age: '12',
        },
      },
    };
    const mockBodyPromise = Promise.resolve(mockBody);
    const api = easyapi({
      mode: 'development',
      config: {
        mockBody: () => mockBodyPromise,
      },
      dataFormat: (ctx) => ctx.responseObject,
    });
    return api.test().then((responseObject) => {
      assert.isEqual(responseObject.data, mockBody.default);
    });
  });

  test('config.mock.mockData.promise.esModule', () => {
    const mockData = {
      __esModule: true,
      default: {
        name: '张三',
        age: '12',
      },
    };
    const mockDataPromise = Promise.resolve(mockData);
    const api = easyapi({
      mode: 'development',
      config: {
        mockData: () => mockDataPromise,
      },
      dataFormat: (ctx) => ctx.responseObject,
    });
    return api.test().then((responseObject) => {
      assert.isEqual(responseObject.data.data, mockData.default);
    });
  });
});
