export default function ({ http }, { tests, test, assert }) {
  tests('globalConfig', () => {
    test('globalConfig.configs', () => {
      const api = http.create(200, {
        logger: false,
        resolve: (responseObject) => responseObject.data,
        configs: {
          test1: {
            url: '?cmd=http200&id=test1',
          },
          test2: {
            url: '?cmd=http200&id=test2',
          },
          group1: {
            test3: {
              url: '?cmd=http200&id=test3',
            },
            test4: {
              url: '?cmd=http200&id=test4',
            },
          },
          group2: {
            test5: {
              url: '?cmd=http200&id=test5',
            },
          },
        },
      })

      return Promise.all([
        api.test1(),
        api.test2(),
        api.group1.test3(),
        api.group1.test4(),
        api.group2.test5(),
      ]).then((data) => {
        assert.isEqual(data.map((data) => data.id), [ 'test1', 'test2', 'test3', 'test4', 'test5' ])
      })
    })

    test('globalConfig.baseURL', () => {
      const api = http.create(200, {
        baseURL: 'http://localhost:4444/abc/',
        response (config) {
          assert.isBe(config.meta.baseURL, 'http://localhost:4444/abc/')
        },
      })
      return api.test()
    })

    test('globalConfig.timeout', () => {
      const api = http.create(999, {
        timeout: 100,
      })

      return api.test().catch(error => {
        assert.isBe(error.message, 'timeout of 100ms exceeded')
      })
    })

    test('globalConfig.responseType', () => {
      const api = http.create(200, {
        responseType: 'text',
        response ({ meta }) {
          assert.isBe(meta.responseType, 'text')
        },
      })
      return api.test()
    })

    test('globalConfig.env', () => {
      const api1 = http.create(200, {
        config: {
          mock () {
            return {
              data: 'MOCK',
            }
          },
        },
        response ({ responseObject }) {
          assert.isUndefined(responseObject.data.data)
        },
      })
      const api2 = http.create(200, {
        env: 'development',
        config: {
          mock () {
            return {
              data: 'MOCK',
            }
          },
        },
        response ({ responseObject }) {
          assert.isBe(responseObject.data.data, 'MOCK')
        },
      })
      return Promise.all([ api1.test(), api2.test() ])
    })

    test('globalConfig.resolve', () => {
      const api1 = http.create(200, {
        env: 'development',
        config: {
          mock () {
            return {
              data: 'MOCK',
            }
          },
        },
        resolve: (responseObject) => responseObject.data,
      })
      const api2 = http.create(200, {
        env: 'development',
        config: {
          mock () {
            return {
              data: 'MOCK',
            }
          },
        },
        resolve: (responseObject) => responseObject.data,
        errorIgnore: true,
      })
      return Promise.all([
        api1.test().then((data) => {
          assert.isEqual(data, { data: 'MOCK' })
        }),
        api2.test().then((data) => {
          assert.isEqual(data, { data: 'MOCK' })
        }),
      ])
    })
  })
}
