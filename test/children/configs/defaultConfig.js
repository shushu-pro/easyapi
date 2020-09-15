export default function ({ http }, { tests, test, assert }) {
  tests('defaultConfig', () => {
    test('defaultConfig.method, mock, logger, baseURL, headers, responseType', () => {
      const api = http.create(200, {
        response ({ meta: { method, mock, logger, baseURL, headers, responseType } }) {
          assert.isBe(method, 'GET')
          assert.isBe(mock, null)
          assert.isBe(logger, false)
          assert.isBe(baseURL, 'http://localhost:4444/')
          assert.isEqual(headers, {})
          assert.isBe(responseType, 'json')
        },
      })
      return api.test()
    })
  })
}
