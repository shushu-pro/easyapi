import { easyapi, expect, test } from './helper';

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
    resolveType: 'fully',
  });
  return api.test().then(({ data, headers }) => {
    expect(data).toEqual(mockResponseObject.data);
    expect(headers).toEqual(mockResponseObject.headers);
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
    resolveType: 'data',
  });
  return api.test().then((data) => {
    expect(data).toEqual(mockData);
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
    resolveType: 'fully',
    response() {
      throw Error('xx');
    },
  });
  return api
    .test()
    .then(({ data, headers }) => {
      expect(data).toEqual(mockData);
      expect(headers).toEqual({});
    })
    .catch((err) => {
      expect(err.message).toBe('xx');
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
    resolveType: 'fully',
  });
  return api.test().then((responseObject) => {
    expect(responseObject.headers).toEqual(mockHeader);
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
    resolveType: 'fully',
  });
  return api.test().then((responseObject) => {
    expect(responseObject.data).toEqual(mockBody);
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
    resolveType: 'fully',
  });
  return api.test().then((responseObject) => {
    expect(responseObject.data.data).toEqual(mockData);
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
    resolveType: 'fully',
  });
  return api.test().then((responseObject) => {
    expect(responseObject.headers).toEqual(mockHeader.default);
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
    resolveType: 'fully',
  });
  return api.test().then((responseObject) => {
    expect(responseObject.data).toEqual(mockBody.default);
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
    resolveType: 'fully',
  });
  return api.test().then((responseObject) => {
    expect(responseObject.data.data).toEqual(mockData.default);
  });
});
