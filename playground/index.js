import easyapi from '../src/'


const api = easyapi({
  axios: {
    baseURL: '',
    timeout: 2000,
  },
  configs: {
    test: {
      url: '?cmd=http200',
      errorIgnore: true,

    //   reqa: {
    //     pageSize: Number,
    //     page: Number,
    //   },
    //   resa: {
    //     currentPage: 'page',
    //     pageSize: true,
    //     data: {
    //       $key: 'list',
    //       title: true,
    //       img: true,
    //       price: (value) => `￥${value.toFixed(2)}`,
    //       skuList: {
    //         code: true,
    //         label: true,
    //       },
    //     },
    //   },
    },
  },
  resolve: ({ data }) => data,
  response (config) {
    const { data } = config.responseObject
    const { code } = data

    if (code === 1008) {
      throw Error('NO-LOGIN')
    }

    if (code !== 0) {
      throw Error(data.message || '未知错误')
    }
  },
  success (config) {
    config.responseObject.data = 'xxxxx'
  },
  failure (config) {
    console.info(config.error)
  },

})

api.test(null, {
  // resolve: false,
}).then((data) => {
  console.info('####', { data })
})
