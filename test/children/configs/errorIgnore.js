export default function ({ http }, { tests, test, assert }) {
  tests('commonConfig.errorIgnore', () => {
    test('globalConfig.errorIgnore', () => {
      const api = http.create({
        errorIgnore: true,
        response () {
          throw Error('businessDataError')
        },
      })
      return api.test().then(() => {})
    })

    test('shareConfig.errorIgnore', () => {
      const api = http.create({
        response () {
          throw Error('businessDataError')
        },
        config: {
          errorIgnore: true,
        },
      })
      return api.test().then(() => {})
    })
    test('privateConfig.errorIgnore', () => {
      const api = http.create({
        response () {
          throw Error('businessDataError')
        },
      })
      return api.test(null, { errorIgnore: true }).then(() => {})
    })

    // 测试errorIgnore导致返回的对象不是promis，使得和第三方库衔接存在问题
    test('errorIgnore promise.then', () => {
      const api = http.create({
        response () {
          throw Error('businessDataError')
        },
      })
      const promise = api.test(null, { errorIgnore: true })

      return promise.then(() => {
        assert.isBe(true, false)
      }).catch(err => {
        assert.isBe(err.message, 'businessDataError')
      }).finally(() => {
        assert.isBe(promise instanceof Promise, true)
      })
    })

    test('errorIgnore promise.catch', () => {
      const api = http.create({
        response () {
          throw Error('businessDataError')
        },
      })
      const promise = api.test(null, { errorIgnore: true })

      return promise.catch(err => {
        assert.isBe(err.message, 'businessDataError')
      })
    })

    test('errorIgnore promise.finally', () => {
      const api = http.create({
        response () {
          throw Error('businessDataError')
        },
      })
      const promise = api.test(null, { errorIgnore: true })

      return promise.finally(() => {

      })
    })
  })
}
