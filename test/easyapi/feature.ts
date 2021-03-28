export default function ({ http, adapter }, { tests, test, assert }) {
  // tests('feature', () => {
  //   test('feature.===', () => {

  //   })
  // })
  tests('cache', () => {
    test('cache.always', () => {
      const api = http.create({
        cache: true,
      });

      return Promise.all([api.test(), api.test()]).then(([data1, data2]) => {
        assert.isBe(data1.data, data2.data);
      });
    });
  });
}
