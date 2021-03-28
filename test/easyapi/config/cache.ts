export default function ({ http }, { tests, test, assert }) {
  tests('config.cache', () => {
    test('config.cache: true', () => {
      const api = http.create({
        env: 'development',
        config: {
          cache: true,
          mock: () =>
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

    test('config.cache: () => any', () => {
      const api = http.create({
        env: 'development',
        config: {
          cache: () => 12,
          mock: () =>
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
      const api = http.create({
        env: 'development',
        config: {
          cache: {
            maxAge: 100,
          },
          mock: () =>
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
  });
}
