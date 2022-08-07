import tests from '@ijest';

tests('api.call', (test, assert, { http }) => {
  test('api.call()', () => {
    const api = http.create({
      success(ctx) {
        ctx.responseObject.data = { code: 0, data: 888 };
      },
    });

    return api.test().then((data) => {
      assert.isBe(data, 888);
    });
  });

  test('api.call(payload)', () => {
    const payload = { id: 'GX-001', type: 2 };
    const api1 = http.create({
      response(ctx) {
        assert.isEqual(ctx.query, payload);
      },
    });
    const api2 = http.create({
      config: {
        method: 'post',
      },
      response(ctx) {
        assert.isEqual(ctx.data, payload);
      },
    });
    return Promise.all([api1.test(payload), api2.test(payload)]);
  });

  test('api.call(payload, config)', () => {
    const payload = { id: 'GX-001', type: 2 };
    const api = http.create({
      response({ axios }) {
        assert.isEqual(this.query, payload);
        assert.isBe(axios.headers.a, 1);
      },
    });
    return api.test(payload, { headers: { a: 1 } });
  });
});
