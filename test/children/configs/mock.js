export default function ({ http }, { tests, test, assert }) {
  tests('config.mock', () => {
    test('config.mock.fully', () => {
      const mockData = {
        $headers: {
          token: 'abcd',
        },
        $body: {
          code: 200,
          data: {
            name: '张三',
          },
        },
      }
      const api = http.create({
        env: 'development',
        mock: () => mockData,
      })
      return api.test().then(({ data, headers }) => {
        assert.isEqual(data, mockData.$body)
        assert.isEqual(headers, mockData.$headers)
      })
    })

    test('config.mock.onlyBody', () => {
      const mockData = {
        code: 200,
        data: {
          name: '张三',
        },
      }
      const api = http.create({
        env: 'development',
        mock: () => mockData,
      })
      return api.test().then(({ data, headers }) => {
        assert.isEqual(data, mockData)
        assert.isEqual(headers, {})
      })
    })


    test('config.mock.error', () => {
      const mockData = {
        code: 200,
        data: {
          name: '张三',
        },
      }
      const api = http.create({
        env: 'development',
        mock: () => mockData,
        response () {
          throw Error('xx')
        },
      })
      return api.test().then(({ data, headers }) => {
        assert.isEqual(data, mockData)
        assert.isEqual(headers, {})
      }).catch(err => {
        assert.isBe(err.message, 'xx')
      })
    })
  })
}
