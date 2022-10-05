import tests from '@ijest';

tests('RESTful', (test, assert, { easyapi }) => {
  test('RESTful.get', () => {
    const api = easyapi({
      response() {
        assert.isBe(this.url, 'goods/1001?cmd=http200');
        assert.isEqual(this.payload, {});
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
        assert.isBe(this.url, 'goods/1001?cmd=http200');
        assert.isEqual(this.payload, {});
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
        assert.isBe(this.url, 'goods/:id?cmd=http200');
        assert.isEqual(this.payload, { value: '888' });
      },
      config: {
        method: 'post',
        url: ':type/:id?cmd=http200',
      },
    });
    return api.test({ type: 'goods', value: '888' });
  });
});
