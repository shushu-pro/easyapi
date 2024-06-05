import { easyapi, expect, test } from './helper';

test('api.call()', (ctx) => {
  const api = easyapi({
    success(ctx) {
      ctx.responseObject.data = { code: 0, data: 888 };
    },
  });

  return api.test().then((data) => {
    expect(data).toBe(888);
  });
});

test('api.call(payload)', () => {
  const payload = { id: 'GX-001', type: 2 };

  const api1 = easyapi({
    response(ctx) {
      expect(ctx.responseObject.config.params).toEqual(payload);
    },
  });

  const api2 = easyapi({
    config: {
      method: 'post',
    },
    response(ctx) {
      expect(ctx.responseObject.config.data).toEqual(JSON.stringify(payload));
    },
  });

  return Promise.all([api1.test(payload), api2.test(payload)]);
});

test('api.call(payload, config)', () => {
  const payload = { id: 'GX-001', type: 2 };
  const api = easyapi({
    response({ responseObject }) {
      expect(responseObject.config.headers.a).toBe('1');
    },
  });
  return api.test(payload, { headers: { a: '1' } });
});
