import { easyapi, test } from './helper';

test('postNull', () => {
  const { define } = easyapi({
    success(ctx) {
      // ctx.responseObject.data.data = { name: 'aaa' };
    },
  });

  const request = define({
    method: 'post',
    url: '?cmd=http200',
  });

  return request();
});

test('postArray', () => {
  const { define } = easyapi({
    success(ctx) {
      // ctx.responseObject.data.data = { name: 'aaa' };
    },
  });

  const request = define({
    method: 'post',
    url: '?cmd=http200',
  });

  return request([]);
});

test('postString', () => {
  const { define } = easyapi({
    success(ctx) {
      // console.info(ctx);
    },
  });

  const request = define({
    method: 'post',
    url: '?cmd=http200',
  });

  return request('aaa=2');
});
