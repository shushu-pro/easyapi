import easyapi from '@dev/easyapi';
// import easyapi from '../../dist/index.esm';

const i = 0;

type ApiExtendConfig = {
  requestAdapter?: number;
};

type OtherConfig = {
  kkk: number;
};

const api = easyapi<ApiExtendConfig, OtherConfig>({
  env: 'development',
  logger: true,
  success(ctx) {
    ctx.dataset.kk = 8;
  },
  other: {
    kkk: 9,
  },
  failure(ctx) {
    // console.info(ctx.error.data);
  },
});

export const test = api.define<
  {
    id: number;
  },
  {
    name: string;
  }
>({
  url: '',
  requestAdapter: null,
  mockData(ctx) {
    // ctx.payload.id;
    return {
      name: 'jjj',
    };
  },
  mockBody({ payload }) {
    return {
      code: 0,
      message: '',
      data: {
        name: 'jjj',
        // ..
      },
    };
  },
  cache: true,
  // ..
});

const testPayload = api.define({
  url: 'aaa/{myname}?myname=111444',
  method: 'post',
});

document.body.innerHTML = `<div>
    <button id="btn">发送请求</button>
</div>`;

document.getElementById('btn').onclick = function getData() {
  Promise.all([
    test(),
    test(),
    // api.test({ a: 2 }),
    // api.test(),
    // api.test({ a: 3 }),
  ]).then((datas) => {
    console.warn({ datas });
    // console.info(datas.map((item) => item.data));
  });
};

// testPayload({ myname: 222, kkk: 222 }, { query: { myname: 333 } });
testPayload([1, 2]).catch((err) => {
  console.warn('#####jjj', err, err.response);
});
