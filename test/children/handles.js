export default function ({ http }, { tests, test, assert }) {
  tests('handles', () => {
    test('handles.request(config)', () => {
      const sendData = { id: 'GX-001' }
      const privateConfig = { method: 'POST' }
      const api1 = http.create({
        request (config) {
          assert.isEqual(config.sendData, sendData)
          assert.isBe(config.meta.method, privateConfig.method)

          config.sendData.id = 'GX-002'
          config.meta.method = 'GET'
        },
        response ({ responseObject: { config } }) {
          assert.isBe(config.method, 'get')
          assert.isBe(config.params.id, 'GX-002')
        },
      })
      const api2 = http.create({
        request (config) {
          config.sendData = { id: 'GX-002' }
          config.meta = {
            ...config.meta,
            method: 'GET',
            timeout: 12345,
          }
        },
        response ({ responseObject: { config } }) {
          assert.isBe(config.method, 'get')
          assert.isBe(config.params.id, 'GX-002')
          assert.isBe(config.timeout, 12345)
        },
      })

      return Promise.all([
        api1.test(sendData, privateConfig),
        api2.test(sendData, privateConfig),
      ])
    })

    test('handles.response(config)', () => {
      const api = http.create({
        env: 'development',
        response ({ responseObject }) {
          assert.isObject(responseObject)
          assert.isObject(responseObject.config)
          assert.isObject(responseObject.headers)
          responseObject.data = { a: 1 }
        },
        success ({ responseObject }) {
          assert.isEqual(responseObject.data, { a: 1 })
        },
      })

      return Promise.all([
        api.test(),
        api.test(null, {
          mock () {
            return {
              data: {},
            }
          },
        }),
      ])
    })

    test('handles.success(config)', () => {
      const api = http.create({
        success ({ responseObject }) {
          assert.isObject(responseObject.data)
          assert.isBe(responseObject.data.cmd, 'http200')
          assert.isObject(responseObject.config)
          responseObject.data = { a: 1 }
        },
      })

      return api.test().then(({ data }) => {
        assert.isEqual(data, { a: 1 })
      })
    })

    test('handles.failure(config)', () => {
      const api1 = http.create({
        response () {
          throw Error('xxx')
        },
        failure (config) {
          assert.isObject(config.error)
          assert.isObject(config)
          assert.isBe(config.error.message, 'xxx')
          config.error = new Error('xyz')
        },
      })

      const api2 = http.create(999, {
        timeout: 123,
        failure (config) {
          assert.isObject(config.error)
          assert.isObject(config)
        },
      })

      return Promise.all([
        api1.test().catch(error => {
          assert.isObject(error)
          assert.isBe(error.message, 'xyz')
        }),
        api2.test().catch(error => {
          assert.isObject(error)
          assert.isBe(error.message, 'timeout of 123ms exceeded')
        }),
      ])
    })
  })
}
