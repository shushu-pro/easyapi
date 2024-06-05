import { easyapi, expect, test } from './helper';

const mockBody = {
  code: 0,
  data: {
    name: 'zx',
    list: [{ a: 1 }],
  },
};

// 取默认的
test('config.default.resolveType', () => {
  const api = easyapi({
    mode: 'development',
    config: {
      mockBody: () => mockBody,
    },
  });
  return api.test().then((data) => {
    expect(data).toEqual(mockBody.data);
  });
});

// 取定义的
test('config.define.resolveType', () => {
  const api = easyapi({
    mode: 'development',
    config: {
      resolveType: 'body',
      mockBody: () => mockBody,
    },
  });
  return api.test().then((data) => {
    expect(data).toEqual(mockBody);
  });
});

// 取请求的
test('config.request.resolveType', () => {
  const api = easyapi({
    mode: 'development',
    config: {
      resolveType: 'fully',
      mockBody: () => mockBody,
    },
  });
  return api.test(null, {}).then((responseObject) => {
    expect(responseObject.data).toEqual(mockBody);
  });
});
