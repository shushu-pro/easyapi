import { easyapi, expect, test } from './helper';

const mockBody = {
  code: 0,
  resData: {
    name: 'zx',
    list: [{ a: 1 }],
  },
  msg: 'xxx',
};

const normalizerBody = {
  code: mockBody.code,
  data: mockBody.resData,
  message: mockBody.msg,
};

function dataNormalizer(ctx) {
  const original = ctx.responseObject.data;
  ctx.responseObject.data = {
    code: original.code,
    data: original.resData,
    message: original.msg,
  };
}

// 取默认的
test('config.global.dataNormalizer', () => {
  const api = easyapi({
    mode: 'development',
    config: {
      mockBody: () => mockBody,
    },
    resolveType: 'body',
    dataNormalizer,
  });
  return api.test().then((data) => {
    expect(data).toEqual(normalizerBody);
  });
});

// 取定义的
test('config.define.dataNormalizer', () => {
  const api = easyapi({
    mode: 'development',
    config: {
      mockBody: () => mockBody,
      dataNormalizer,
    },
    resolveType: 'body',
  });
  return api.test().then((data) => {
    expect(data).toEqual(normalizerBody);
  });
});

// 取请求的
test('config.request.dataNormalizer', () => {
  const api = easyapi({
    mode: 'development',
    config: {
      mockBody: () => mockBody,
    },
    resolveType: 'body',
  });
  return api
    .test(null, {
      dataNormalizer,
    })
    .then((data) => {
      expect(data).toEqual(normalizerBody);
    });
});
