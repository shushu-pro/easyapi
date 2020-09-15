
export default function ({ http, adapter }, { tests, test, assert }) {
  tests('example', () => {
    test('example.adapter', () => {
      const api = http.create({
        request (config) {
          const { request } = config.meta
          if (typeof request === 'function') {
            config.sendData = request(config.sendData)
          } else if (request && typeof request === 'object') {
            config.sendData = adapter(request, config.sendData)
          }
        },
        response (config) {
          const { data } = config.responseObject
          const { response } = config.meta
          if (typeof response === 'function') {
            config.responseObject.data = response(data)
          } else if (response && typeof response === 'object') {
            config.responseObject.data = adapter(response, data)
          }
        },
        config: {
          request: (sendData) => {
            return adapter({
              name: Boolean,
            }, sendData)
          },
          response: {
            name: [ String, { $key: 'num', $value: (value) => value.length } ],
          },
        },
      })

      return Promise.all([
        api.test({ name: 'za' }).then(({ data }) => {
          assert.isEqual(data, {
            name: 'true',
            num: 4,
          })
        }),
      ])
    })
  })
}
