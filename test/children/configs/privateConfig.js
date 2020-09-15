
export default function ({ http }, { tests, test, assert }) {
  tests('privateConfig', () => {
    test('privateConfig.headers', () => {
      const api = http.create({
        config: {
          headers: { a: 1, b: 2 },
        },
        response ({ meta }) {
          assert.isBe(meta.headers.a, 11)
          assert.isBe(meta.headers.b, 2)
          assert.isBe(meta.headers.c, 22)
        },
      })

      return api.test(null, {
        headers: { a: 11, c: 22 },
      })
    })

    test('privateConfig.timeout', () => {
      const api = http.create(999, {
        config: { timeout: 189 },
      })
      return api.test(null, { timeout: 222 }).catch((error) => {
        assert.isBe(error.message, 'timeout of 222ms exceeded')
      })
    })

    test('privateConfig.delay', () => {
      const now = Date.now()
      const api1 = http.create({
        success () {
          assert.isTrue(Date.now() - now < 100)
        },
      })
      const api2 = http.create({
        config: { delay: 100 },
        success () {
          assert.isTrue(Date.now() - now >= 1000)
        },
      })
      return Promise.all([ api1.test(), api2.test(null, { delay: 1000 }) ])
    })

    test('privateConfig.mock', () => {
      const shareMock = {
        $headers: { a: 1, b: 2 },
        $body: 'this is mock',
      }
      const privateMock = {
        $body: 'this is private mock',
      }
      const api = http.create({
        env: 'development',
        config: {
          mock () {
            return shareMock
          },
        },
        response ({ responseObject: { data, headers } }) {
          assert.isEqual(data, privateMock.$body)
          assert.isEqual(headers, {})
        },
      })

      return api.test(null, {
        mock () {
          return privateMock
        },
      })
    })

    test('privateConfig.logger', () => {
      const api = http.create({
        config: {
          logger: false,
        },
        response ({ meta: { logger } }) {
          assert.isBe(logger, true)
        },
      })

      return api.test(null, {
        logger: true,
      })
    })

    test('privateConfig.abort', () => {
      const abort = {}
      const sendData = { id: 'GX-001', ms: 100 }
      const errorMessage = '取消产生的错误'
      const privateConfig = {
        method: 'get',
        abort,
        errorIgnore: true,
      }
      const api = http.create({
        failure (config) {
          assert.isBe(config.error.message, errorMessage)
        },
      })

      setTimeout(() => {
        abort.trigger(errorMessage)
      }, 20)

      return api.test(sendData, privateConfig).then()
    })
  })
}
