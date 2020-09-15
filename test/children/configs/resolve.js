export default function ({ http }, { tests, test, assert }) {
  tests('commonConfig.resolve', () => {
    const mockData = {
      data: {
        name: 'zx',
        list: [ { a: 1 } ],
      },
    }
    test('globalConfig.resolve', () => {
      const api = http.create({
        env: 'development',
        resolve: ({ data }) => data,
        mock: () => mockData,
      })
      return api.test().then((data) => {
        assert.isEqual(data, mockData)
      })
    })

    test('shareConfig.resolve', () => {
      const api = http.create({
        env: 'development',
        mock: () => mockData,
        config: {
          resolve: ({ data }) => data,
        },
      })
      return api.test().then((data) => {
        assert.isEqual(data, mockData)
      })
    })
    test('privateConfig.resolve', () => {
      const api = http.create({
        env: 'development',
        resolve: ({ data }) => data.data,
        mock: () => mockData,
      })
      return api.test(null, { resolve: false }).then((responseObject) => {
        assert.isEqual(responseObject.data, mockData)
      })
    })
  })
}
