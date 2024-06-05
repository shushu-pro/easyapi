import { easyapi, expect, test } from './helper';

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
    resolveType: 'fully',
  });

  return api.test().then(({ data, headers }) => {
    expect(data).toEqual(mockObject.data);
    expect(headers).toEqual(mockObject.headers);
  });
});

test('default.config.mockOff=true', () => {
  const api = easyapi({
    mode: 'development',
    mockOff: true,
    config: {
      mockBody: () => mockObject.data,
      mockHeaders: () => mockObject.headers,
    },
    resolveType: 'fully',
  });
  return api.test().then(({ data, headers }) => {
    expect(data.data).toEqual({ cmd: 'http200' });
    expect(headers.token).toEqual(undefined);
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
    resolveType: 'fully',
  });
  return api.test(null, {}).then(({ data, headers }) => {
    expect(data.data).toEqual({ cmd: 'http200' });
    expect(headers.token).toEqual(undefined);
  });
});

test('request.config.mockOff=true', () => {
  const api = easyapi({
    mode: 'development',
    config: {
      mockBody: () => mockObject.data,
      mockHeaders: () => mockObject.headers,
    },
    resolveType: 'fully',
  });
  return api
    .test(null, {
      mockOff: true,
    })
    .then(({ data, headers }) => {
      expect(data.data).toEqual({ cmd: 'http200' });
      expect(headers.token).toEqual(undefined);
    });
});
