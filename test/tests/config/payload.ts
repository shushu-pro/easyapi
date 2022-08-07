import tests from '@ijest';

tests('config.payload', (test, assert, { http }) => {
  test('config.payload ', () => {
    const api = http.create({
      env: 'development',
      config: {
        // ..
        response(ctx) {
          console.info(ctx.config);
        },
      },
    });

    return api.test({ name: 11 }, { query: { kk: 22 } }).then((data) => {
      // ..
    });
  });
});
