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
  })
}
