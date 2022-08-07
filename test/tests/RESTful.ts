import tests from '@ijest';

tests('RESTful', (test, assert, { http }) => {
  test('RESTful.get', () => {
    const api = http.create({
      response() {
        assert.isBe(this.url, 'goods/1001?cmd=http200');
        assert.isEqual(this.query, {});
      },
      config: {
        url: '{type}/{id}?cmd=http200',
      },
    });

    return api.test({ type: 'goods', id: 1001 });
  });

  test('RESTful.post', () => {
    const api = http.create({
      response() {
        assert.isBe(this.url, 'goods/1001?cmd=http200');
        assert.isEqual(this.data, {});
      },
      config: {
        method: 'post',
        url: '{type}/{id}?cmd=http200',
      },
    });
    return api.test({ type: 'goods', id: 1001 });
  });

  test('RESTful.style-colon', () => {
    const api = http.create({
      response() {
        assert.isBe(this.url, 'goods/1001?cmd=http200');
        assert.isEqual(this.data, {});
      },
      config: {
        method: 'post',
        url: ':type/:id?cmd=http200',
      },
    });
    return api.test({ type: 'goods', id: 1001 });
  });

  test('RESTful.no-matchs', () => {
    const api = http.create({
      response() {
        assert.isBe(this.url, 'goods/:id/{id}?cmd=http200');
        assert.isEqual(this.data, { value: '888' });
      },
      config: {
        method: 'post',
        url: ':type/:id/{id}?cmd=http200',
      },
    });
    return api.test({ type: 'goods', value: '888' });
  });
});
