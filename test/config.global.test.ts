import { easyapi, expect, test, baseURL } from './helper';

test('config.global:baseURL', () => {
  const api = easyapi({
    axios: {
      baseURL: `${baseURL}abc/`,
    },
    response({ responseObject }) {
      expect(responseObject.config.baseURL).toBe(`${baseURL}abc/`);
    },
  });
  return api.test();
});

test('config.global:timeout', () => {
  const api = easyapi(
    {
      axios: {
        timeout: 100,
      },
    },
    999
  );

  return api.test().catch((error) => {
    expect(error.message).toBe('timeout of 100ms exceeded');
  });
});

test('config.global:responseType', () => {
  const api = easyapi({
    response({ responseObject }) {
      expect(responseObject.config.responseType).toBe('text');
    },
  });
  return api.test(null, {
    axios: {
      responseType: 'text',
    },
  });
});

test('config.global:mode', () => {
  const api1 = easyapi({
    config: {
      mockData() {
        return {
          data: 'MOCK',
        };
      },
    },
    response({ responseObject }) {
      expect(responseObject.data.data).toEqual({ cmd: 'http200' });
    },
  });
  const api2 = easyapi({
    mode: 'development',
    config: {
      mockBody(ctx) {
        return {
          code: 0,
          data: 'MOCK',
        };
      },
    },
    response({ responseObject }) {
      expect(responseObject.data.data).toBe('MOCK');
    },
  });
  return Promise.all([api1.test(), api2.test()]);
});

test('config.global:resolveType', () => {
  const api1 = easyapi({
    mode: 'development',
    config: {
      mockBody() {
        return {
          code: 0,
          data: 'MOCK',
        };
      },
    },
    resolveType: 'fully',
  });
  const api2 = easyapi({
    mode: 'development',
    config: {
      mockBody() {
        return {
          code: 0,
          data: 'MOCK',
        };
      },
    },
    resolveType: 'body',
    errorIgnore: true,
  });
  return Promise.all([
    api1.test().then((responseObject) => {
      expect(responseObject.data).toEqual({ code: 0, data: 'MOCK' });
    }),
    api2.test().then((data) => {
      expect(data).toEqual({ code: 0, data: 'MOCK' });
    }),
  ]);
});

test('config.global.mockForce', () => {
  const api1 = easyapi({
    mode: 'development',
    config: {
      mockData() {
        return 'MOCK';
      },
    },
  });
  const api2 = easyapi({
    mode: 'production',
    config: {
      mockData() {
        return 'MOCK';
      },
    },
  });
  const api3 = easyapi({
    mode: 'production',
    mockForce: true,
    config: {
      mockData() {
        return 'MOCK';
      },
    },
  });
  return Promise.all([
    api1.test().then((data) => {
      expect(data).toBe('MOCK');
    }),
    api2.test().then((data) => {
      expect(data).not.toBe('MOCK');
    }),
    api3.test().then((data) => {
      expect(data).toBe('MOCK');
    }),
  ]);
});
