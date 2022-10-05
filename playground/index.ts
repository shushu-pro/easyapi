import api from '@api';

document.body.innerHTML = `
  <div>
    <button id="cache">测试缓存</button>
    <button id="abort">取消请求</button>
    <button id="adapter">测试适配器</button>
  </div>
`;

document.getElementById('cache').onclick = () => {
  const call = api.define({
    url: 'cache-test',
    cache: true,
    mockData() {
      return Math.random();
    },
  });

  Promise.all([
    call({ name: '1' }),
    call({ name: '1' }),
    call({ name: '1' }),
  ]).then((data) => {
    console.info(data[0] === data[1] && data[1] === data[2]);
  });
};

document.getElementById('abort').onclick = () => {
  const abort = api.abort();

  api
    .request({
      url: 'xxx',
      axios: {
        cancelToken: abort.cancelToken,
      },
    })
    .catch((err) => {
      console.info(err.message === '取消请求');
    });

  abort.dispatch('取消请求');
};

document.getElementById('adapter').onclick = () => {
  api.request({
    url: 'xlxx',
    payload: {
      isECS: 1,
    },
    mockData() {
      return null;
    },
    requestAdapter: {
      isECS: Boolean,
    },
  });
};
