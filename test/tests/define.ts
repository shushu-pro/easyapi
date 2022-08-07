import tests from '@ijest';

tests('api.define', (test, assert, { http }) => {
  test('api.define(option)', () => {
    const api = http.create({
      success(ctx) {
        ctx.responseObject.data = 'aaa';
      },
      resolver: (ctx) => ctx.responseObject.data,
    });

    const some = api.define<{ id: number }, { name: string }>({
      url: '?cmd=http200',
    });

    return some({ id: 222 }).then((data) => {
      assert.isBe(data, 'aaa');
    });
  });
});
