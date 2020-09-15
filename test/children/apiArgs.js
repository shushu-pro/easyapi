export default function ({ http }, { tests, test, assert }) {
  tests('apiArgs', () => {
    test('apiArgs(data)', () => {
      const data = { id: 'GX-001', type: 2 }
      const api1 = http.create({
        response ({ responseObject }) {
          assert.isEqual(responseObject.config.params, data)
        },
      })
      const api2 = http.create({
        config: {
          method: 'post',
        },
        response ({ responseObject }) {
          assert.isEqual(responseObject.config.data, JSON.stringify(data))
        },
      })
      return Promise.all([ api1.test(data), api2.test(data) ])
    })

    test('apiArgs(data, config)', () => {
      const data = { id: 'GX-001', type: 2 }
      const api = http.create({
        response ({ responseObject: { config } }) {
          assert.isEqual(config.params, data)
          assert.isBe(config.headers.a, 1)
        },
      })
      return api.test(data, { headers: { a: 1 } })
    })

    test('apiArgs(data, callback)', () => {
      const sendData = { id: 'GX-001' }
      const api = http.create({
        response ({ responseObject: { config } }) {
          assert.isEqual(config.params, sendData)
        },
      })

      return new Promise(resolve => {
        api.test(sendData, function ({ data }, error) {
          assert.isObject(data)
          assert.isBe(data.id, sendData.id)
          assert.isNull(error)
          resolve()
        })
      })
    })

    test('apiArgs(data, callback, config)', () => {
      const sendData = { id: 'GX-001' }
      const api = http.create({
        response ({ responseObject: { config } }) {
          assert.isEqual(config.params, sendData)
          assert.isBe(config.headers.a, 'abc')
        },
      })
      return new Promise(resolve => {
        api.test(sendData, function ({ data }, error) {
          assert.isObject(data)
          assert.isBe(data.id, sendData.id)
          assert.isNull(error)
          resolve()
        }, { headers: { a: 'abc' } })
      })
    })
  })
}
