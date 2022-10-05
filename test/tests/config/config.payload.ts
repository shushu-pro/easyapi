import tests from '@ijest';

tests('config.payload', (test, assert, { easyapi }) => {
  test('config.payload ', () => {
    const api = easyapi({
      mode: 'development',
      response(ctx) {
        assert.isEqual(ctx.payload, { name: 11 });
      },
    });

    return api.test({ name: 11 }, { query: { kk: 22 } }).then((data) => {
      // ..
    });
  });
});
