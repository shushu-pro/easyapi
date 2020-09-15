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
        response ({ responseObject }) {
          assert.isObject(responseObject)
          assert.isObject(responseObject.config)
          assert.isObject(responseObject.headers)
          responseObject.data = { a: 1 }
        },
        success (data) {
          assert.isEqual(data, { a: 1 })
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
  })
}

module.exports2 = function ({ ema, http200, http999 }, { tests, test, assert }) {
  tests('handles', () => {
    test('handles.success(data, config)', () => {
      const api = http.create({
        success (data, config) {
          assert.isObject(data)
          assert.isBe(data.cmd, 'http200')
          assert.isObject(config)
          return { a: 1 }
        },
      })

      return api.test().then((data) => {
        assert.isEqual(data, { a: 1 })
      })
    })

    test('handles.failure(error, config)', () => {
      const api1 = http.create({
        response () {
          throw Error('xxx')
        },
        failure (error, config) {
          assert.isObject(error)
          assert.isObject(config)
          assert.isBe(error.message, 'xxx')
          throw new Error('xyz')
        },
      })

      const api2 = ema(http999({
        timeout: 123,
        failure (error, config) {
          assert.isObject(error)
          assert.isObject(config)
          throw error
        },
      }))

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
