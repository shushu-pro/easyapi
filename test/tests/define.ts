import tests from '@ijest';

tests('api.define', (test, assert, { easyapi }) => {
  test('api.define(option)', () => {
    const { define } = easyapi({
      dataFormat(ctx) {
        return ctx.responseObject.data.data;
      },
      success(ctx) {
        ctx.responseObject.data.data = { name: 'aaa' };
      },
    });

    const request = define<{ id: number }, { name: string }>({
      url: '?cmd=http200',
    });
    return request({ id: 222 }).then((data) => {
      assert.isBe(data.name, 'aaa');
    });
  });
});
