import tests from '@ijest';

tests('config.cache', (test, assert, { easyapi }) => {
  test('config.cache:true', () => {
    const api = easyapi({
      mode: 'development',
      config: {
        cache: true,
        mockData: () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ v: Math.random() });
            }, 1000);
          }),
      },
    });

    return Promise.all([api.test(), api.test()]).then((datas) => {
      assert.isBe(datas[0], datas[1]);
    });
  });

  test('config.cache:expire', () => {
    const api = easyapi({
      mode: 'development',
      config: {
        cache: () => 12,
        mockData: () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ v: Math.random() });
            }, 1000);
          }),
      },
    });

    return Promise.all([api.test(), api.test()]).then((datas) => {
      assert.isBe(datas[0], datas[1]);
    });
  });

  test('config.cache.maxAge', () => {
    const api = easyapi({
      mode: 'development',
      config: {
        cache: {
          maxAge: 100,
        },
        mockData: () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ v: Math.random() });
            }, 1000);
          }),
      },
    });

    return Promise.all([
      Promise.all([api.test(), api.test()]).then((datas) => {
        assert.isBe(datas[0], datas[1]);
      }),

      Promise.all([
        api.test(),
        new Promise((resolve) => {
          setTimeout(() => {
            api.test().then(resolve);
          }, 88);
        }),
        new Promise((resolve) => {
          setTimeout(() => {
            api.test().then(resolve);
          }, 166);
        }),
        new Promise((resolve) => {
          setTimeout(() => {
            api.test().then(resolve);
          }, 300);
        }),
      ]).then((datas) => {
        assert.isBe(datas[0], datas[1]);
        assert.isBe(datas[0], datas[2]);
        assert.isTrue(datas[0] !== datas[3]);
      }),
    ]);
  });

  test('config.cache.error', () => {
    let i = 0;
    const api = easyapi({
      mode: 'development',
      config: {
        cache: true,
        mockData: () =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              if (i++ === 0) {
                reject(Error('xx'));
              } else {
                resolve('2');
              }
            }, 1000);
          }),
      },
    });

    return Promise.all([
      api.test(),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            api.test().then(({ data }) => {
              assert.isBe(data, '2');
            })
          );
        }, 3005);
      }),
    ]).catch((e) => {
      //
    });
  });
});
