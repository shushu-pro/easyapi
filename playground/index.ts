import easyapi from '../src/index';
// import easyapi from '../dist/index.esm';

const api = easyapi({
  env: 'development',
  configs: {
    a: {
      url: 'xx',
      // errorIgnore: true,
      // mock() {
      //   return {
      //     code: 200,
      //     data: null,
      //   };
      // },
    },
  },
});

api.a({ name: 2 }).then((data) => {
  console.info({ data });
});
// .catch((err) => {
//   console.info({ err });
// });
