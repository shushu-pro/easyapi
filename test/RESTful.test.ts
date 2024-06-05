import { easyapi, expect, test } from './helper';

test('RESTful.get', () => {
  const api = easyapi({
    response() {
      expect(this.url).toBe('goods/1001?cmd=http200');
      expect(this.payload).toEqual({});
    },
    config: {
      url: ':type/:id?cmd=http200',
    },
  });

  return api.test({ type: 'goods', id: 1001 });
});

test('RESTful.post', () => {
  const api = easyapi({
    response() {
      expect(this.url).toBe('goods/1001?cmd=http200');
      expect(this.payload).toEqual({});
    },
    config: {
      method: 'post',
      url: ':type/:id?cmd=http200',
    },
  });
  return api.test({ type: 'goods', id: 1001 });
});

test('RESTful.no-matchs', () => {
  const api = easyapi({
    response() {
      expect(this.url).toBe('goods/:id?cmd=http200');
      expect(this.payload).toEqual({ value: '888' });
    },
    config: {
      method: 'post',
      url: ':type/:id?cmd=http200',
    },
  });
  return api.test({ type: 'goods', value: '888' });
});
