import { easyapi, expect, test } from './helper';

test('api.define(option)', () => {
  const { define } = easyapi({
    success(ctx) {
      ctx.responseObject.data.data = { name: 'aaa' };
    },
  });
  const request = define<{ id: number }, { name: string }>({
    url: '?cmd=http200',
  });

  return request({ id: 222 }).then((data) => {
    expect(data.name).toBe('aaa');
  });
});
