export default function ({ http }, { tests, test, assert }) {
  tests('configTree', () => {
    const url = 'xxx?cmd=http200'

    // 多层配置
    test('configTree.levels', () => {
      const api = http.create(200, {
        configs: {
          mod1: {
            url,
          },
          mod2: {
            url: {
              mod3: {
                url,
              },
            },
            url2: {
              url,
            },
          },
          mod3: {
            mod4: {
              mod5: {
                mod6: {
                  mod7: {
                    url,
                  },
                },
              },
            },
          },
        },
      })

      return Promise.all([
        api.mod1(),
        api.mod2.url.mod3(),
        api.mod2.url2(),
        api.mod3.mod4.mod5.mod6.mod7(),
      ]).then((data) => [
        assert.isLength(data, 4),
      ])
    })

    // 子级存在同名key
    test('configTree.sameChildKey', () => {
      let total = 0
      const api = http.create(200, {
        configs: {
          mod1: {
            list: {
              num: 1,
              url,
            },
          },
          mod2: {
            list: {
              num: 2,
              url,
            },
          },
        },
        response (config) {
          total += config.meta.num
        },
      })

      return Promise.all([ api.mod1.list(), api.mod2.list() ]).then(() => {
        assert.isBe(total, 3)
      })
    })
  })
}
