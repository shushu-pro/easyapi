import { easyapi, expect, test } from './helper';

test('config.payload ', () => {
  const api = easyapi({
    mode: 'development',
    response(ctx) {
      expect(ctx.payload).toEqual({ name: 11 });
    },
  });

  return api.test({ name: 11 }, { query: { kk: 22 } }).then((data) => {
    // ..
  });
});
