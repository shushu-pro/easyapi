export default function ({ http }, { tests, test, assert }) {
  tests('RESTful', () => {
    test('RESTful.get', () => {
      const api = http.create({
        response ({ responseObject: { config } }) {
          assert.isBe(config.url, 'goods/1001?cmd=http200')
          assert.isEqual(config.params, {
            id: 1001, type: 'goods',
          })
        },
        config: {
          url: '{type}/{id}?cmd=http200',
        },
      })

      return api.test({ type: 'goods', id: 1001 })
    })

    test('RESTful.post', () => {
      const api = http.create({
        response ({ responseObject: { config } }) {
          assert.isBe(config.url, 'goods/1001?cmd=http200')
          assert.isBe(config.data, JSON.stringify({
            type: 'goods', id: 1001,
          }))
        },
        config: {
          method: 'post',
          url: '{type}/{id}?cmd=http200',
        },
      })
      return api.test({ type: 'goods', id: 1001 })
    })

    test('RESTful.style-colon', () => {
      const api = http.create({
        response ({ responseObject: { config } }) {
          assert.isBe(config.url, 'goods/1001?cmd=http200')
          assert.isBe(config.data, JSON.stringify({
            type: 'goods', id: 1001,
          }))
        },
        config: {
          method: 'post',
          url: ':type/:id?cmd=http200',
        },
      })
      return api.test({ type: 'goods', id: 1001 })
    })
  })
}
