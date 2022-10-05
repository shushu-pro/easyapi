import tests from '@ijest';

tests('config.dataFormat', (test, assert, { easyapi }) => {
  const mockBody = {
    code: 0,
    data: {
      name: 'zx',
      list: [{ a: 1 }],
    },
  };

  // 取默认的
  test('config.default.dataFormat', () => {
    const api = easyapi({
      mode: 'development',
      dataFormat: false,
      config: {
        mockBody: () => mockBody,
      },
    });
    return api.test().then((responseObject) => {
      assert.isEqual(responseObject.data, mockBody);
    });
  });

  // 取定义的
  test('config.define.dataFormat', () => {
    const api = easyapi({
      mode: 'development',
      config: {
        dataFormat: (context) => context.responseObject.data.data.name,
        mockBody: () => mockBody,
      },
    });
    return api.test().then((data) => {
      assert.isEqual(data, mockBody.data.name);
    });
  });

  // 取请求的
  test('config.request.dataFormat', () => {
    const api = easyapi({
      mode: 'development',
      config: {
        dataFormat: (context) => context.responseObject.data.data.name,
        mockBody: () => mockBody,
      },
    });
    return api.test(null, { dataFormat: false }).then((responseObject) => {
      assert.isEqual(responseObject.data.data, mockBody.data);
    });
  });
});
