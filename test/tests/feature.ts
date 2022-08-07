import tests from '@ijest';

tests('feature', (test, assert, { http }) => {
  test('feature', () => {
    const api = http.create({
      // ..
    });

    return api.test();
  });
});
