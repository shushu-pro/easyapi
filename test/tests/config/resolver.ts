import tests from '@ijest';

tests('config.resolver', (test, assert, { http }) => {
  const mockData = {
    data: {
      name: 'zx',
      list: [{ a: 1 }],
    },
  };
  test('config.global.resolver', () => {
    const api = http.create({
      env: 'development',
      resolver: (context) => context.responseObject.data,
      config: {
        mockBody: () => mockData,
      },
    });
    return api.test().then((data) => {
      assert.isEqual(data, mockData);
    });
  });

  test('config.share.resolver', () => {
    const api = http.create({
      env: 'development',
      config: {
        resolver: (context) => context.responseObject.data,
        mockBody: () => mockData,
      },
    });
    return api.test().then((data) => {
      assert.isEqual(data, mockData);
    });
  });

  test('config.private.resolver', () => {
    const api = http.create({
      env: 'development',
      config: {
        resolver: (context) => context.responseObject.data,
        mockBody: () => mockData,
      },
    });
    return api.test(null, { resolver: false }).then((data) => {
      assert.isEqual(data, mockData.data);
    });
  });
});
