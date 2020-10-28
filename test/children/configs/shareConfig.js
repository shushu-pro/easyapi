export default function ({ http }, { tests, test, assert }) {
  tests('shareConfig', () => {
    test('shareConfig.url', () => {
      const api = http.create({
        config: {
          url: '?cmd=http200&seturl=1',
        },
        response ({ meta }) {
          assert.isMatch(meta.url, /\?cmd=http200&seturl=1$/)
        },
      })
      return api.test()
    })

    test('shareConfig.method', () => {
      const pps = [ 'get', 'post', 'put', 'delete', 'patch' ].map(method => {
        return http.create({
          config: { method },
          response ({ meta }) {

          },
        }).test()
      })

      return Promise.all(pps)
    })

    test('shareConfig.headers', () => {
      const api = http.create({
        config: {
          headers: { a: 1, b: 2 },
        },
        response ({ meta }) {
          assert.isBe(meta.headers.a, 1)
          assert.isBe(meta.headers.b, 2)
        },
      })
      return api.test()
    })

    test('shareConfig.timeout', () => {
      const api = http.create(999, {
        config: { timeout: 189 },
      })
      return api.test().then().catch((error) => {
        assert.isBe(error.message, 'timeout of 189ms exceeded')
      })
    })

    test('shareConfig.delay', () => {
      const now = Date.now()
      const api1 = http.create({
        success () {
          assert.isTrue(Date.now() - now < 100)
        },
      })
      const api2 = http.create({
        config: { delay: 2000 },
        success () {
          assert.isTrue(Date.now() - now < 2000)
        },
      })
      const api3 = http.create({
        env: 'development',
        config: { delay: 2000 },
        success () {
          assert.isTrue(Date.now() - now >= 2000)
        },
      })
      return Promise.all([ api1.test(), api2.test(), api3.test() ])
    })

    test('shareConfig.mock', () => {
      const mock = {
        $headers: { a: 1, b: 2 },
        $body: 'this is mock',
      }
      const api = http.create({
        env: 'development',
        config: {
          mock () {
            return mock
          },
        },
        response ({ responseObject: { data, headers } }) {
          assert.isEqual(data, mock.$body)
          assert.isEqual(headers, mock.$headers)
        },
      })

      return api.test()
    })

    test('shareConfig.logger', () => {
      const api1 = http.create({
        response ({ meta: { logger } }) {
          assert.isBe(logger, true)
        },
        config: {
          logger: true,
        },
      })
      const api2 = http.create({
        response ({ meta: { logger } }) {
          assert.isBe(logger, false)
        },
        config: {

        },
      })

      return Promise.all([ api1.test(), api2.test() ])
    })
  })
}
