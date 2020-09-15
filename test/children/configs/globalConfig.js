export default function ({ http }, { tests, test, assert }) {
  tests('globalConfig', () => {
    test('defaultConfig.configs', () => {
      const api = http.create(200, {
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

      return Promise.all('12345'.split('').map(i => {
        const name = `test${i}`
        return api[name]().then(({ data }) => {
          assert.isBe(data.id, name)
        })
      }))
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
  })
}
