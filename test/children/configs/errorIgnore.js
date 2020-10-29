export default function ({ http }, { tests, test, assert }) {
  tests('commonConfig.errorIgnore', () => {
    test('globalConfig.errorIgnore', () => {
      const api = http.create({
        errorIgnore: true,
        response () {
          throw Error('xx')
        },
      })
      return api.test().then(() => { })
    })

    test('shareConfig.errorIgnore', () => {
      const api = http.create({
        response () {
          throw Error('xx')
        },
        config: {
          errorIgnore: true,
        },
      })
      return api.test().then(() => { })
    })
    test('privateConfig.errorIgnore', () => {
      const api = http.create({
        response () {
          throw Error('xx')
        },
      })
      return api.test(null, { errorIgnore: true }).then(() => { })
    })

    // 测试errorIgnore导致返回的对象不是promis，使得和第三方库衔接存在问题
    test('errorIgnore', () => {
      const api = http.create({
        response () {
          throw Error('xx')
        },
      })
      const promise = api.test(null, { errorIgnore: true })
      console.info(promise)
      assert.isBe(promise instanceof Promise, true)
      return api.test(null, { errorIgnore: true }).then(() => { })
    })
  })
}
