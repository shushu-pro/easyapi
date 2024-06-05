import { easyapi, expect, test } from './helper';

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
    expect(datas[0]).toBe(datas[1]);
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
    expect(datas[0]).toBe(datas[1]);
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
      expect(datas[0]).toBe(datas[1]);
    }),

    Promise.all([
      api.test(),
      new Promise((resolve) => {
        setTimeout(() => {
          api.test().then(resolve);
        }, 66);
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          api.test().then(resolve);
        }, 88);
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          api.test().then(resolve);
        }, 120);
      }),
    ]).then((datas) => {
      expect(datas[0]).toBe(datas[1]);
      expect(datas[0]).toBe(datas[2]);
      expect(datas[0]).not.toBe(datas[3]);
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
    api.test().catch(() => {}),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          api.test().then((data) => {
            expect(data).toBe('2');
          })
        );
      }, 2005);
    }),
  ]);
});
