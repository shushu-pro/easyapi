import tests from '@ijest';

tests('api.call', (test, assert, { easyapi }) => {
  test('api.call()', () => {
    const api = easyapi({
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
    const api1 = easyapi({
      response(ctx) {
        assert.isEqual(ctx.responseObject.config.params, payload);
      },
    });
    const api2 = easyapi({
      config: {
        method: 'post',
      },
      response(ctx) {
        assert.isEqual(ctx.responseObject.config.data, JSON.stringify(payload));
      },
    });
    return Promise.all([api1.test(payload), api2.test(payload)]);
  });

  test('api.call(payload, config)', () => {
    const payload = { id: 'GX-001', type: 2 };
    const api = easyapi({
      response({ responseObject }) {
        assert.isBe(responseObject.config.headers.a, '1');
      },
    });
    return api.test(payload, { headers: { a: '1' } });
  });
});
