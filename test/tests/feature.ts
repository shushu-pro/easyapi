import tests from '@ijest';

tests('feature', (test, assert, { easyapi }) => {
  test('feature', () => {
    const api = easyapi({
      // ..
    });

    return api.test().then((data) => {
      assert.isObject(data);
    });
  });
});
