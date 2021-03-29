import easyapi from '../src/index';
// import easyapi from '../dist/index.esm';

let i = 0;

const api = easyapi({
  env: 'development',
  configs: {
    test: {
      method: 'post',
      url: 'xxx',
      // cache: {
      //   maxAge: 1000,
      //   expire(config) {
      //     return Math.random();
      //   },
      // },
      cache: true,
      errorIgnore: true,
      mock: () =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            if (i++ === 0) {
              reject(Error('xx'));
            } else {
              resolve('2');
            }
          }, 1000);
        }),
      // mock() {
      //   // return {
      //   //   v: 8,
      //   // };
      //   return new Promise((resolve) => {
      //     setTimeout(() => {
      //       resolve({ v: Math.random() });
      //     }, 100);
      //   });
      // },
    },
  },
});

document.getElementById('btn').onclick = function getData() {
  Promise.all([
    api.test(),
    api.test(),
    // api.test({ a: 2 }),
    // api.test(),
    // api.test({ a: 3 }),
  ]).then((datas) => {
    console.info(datas.map((item) => item.data));
  });
};
