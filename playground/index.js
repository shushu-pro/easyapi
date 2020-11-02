
import easyapi from '../src/'


const api = easyapi({
  axios: {
    baseURL: '',
    timeout: 2000,
  },
  configs: {
    test: {
      url: '?cmd=http200',
      // errorIgnore: true,

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
    throw Error('abcde')
    // const { data } = config.responseObject
    // const { code } = data

    // if (code === 1008) {
    //   throw Error('NO-LOGIN')
    // }

    // if (code !== 0) {
    //   throw Error(data.message || '未知错误')
    // }
  },
  success (config) {
    config.responseObject.data = 'xxxxx'
  },
  failure (config) {
    if (!config.meta.errorMessageIgnore) {
      console.info(config.error.message)
    }
  },

})

api.test(null, {
  // resolve: false,
}).then((data) => {
  console.info('####', { data })
})

api.test(null, { errorIgnore: true }).finally(() => {
  console.info('yes')
})

const configs = {
  mod1: {
    api1: {
      url: 'xxx',
    },
    api2: {
      url: 'yyy',
    },
    mod2: {
      api3: {
        url: 'zzz',
      },
    },
  },
  mod3: {
    api3: {
      url: 'lll',
    },
  },
}


const apiCaches = {}
const apiExports = createExports(configs)

function createExports (configs, keys = []) {
  // 当前配置项存在字符串类型的url字段，则配置项为接口配置项，否则为模块配置项
  if (typeof configs.url === 'string') {
    console.info('createShareConfig')
    const config = Object.freeze(configs)
    // if (true) {
    //   validateConfig(config)
    // }

    return (...args) => {
      try {
        return requestCall(config, ...args)
      } catch (err) {
        Promise.reject(err)
      }
    }
  }

  // 模块配置项，走代理模式
  return new Proxy(configs, {
    get (origin, key) {
      // 已经生成了API配置项
      if (apiCaches[key]) {
        return apiCaches[key]
      }

      // 初始化API配置项
      if (origin[key]) {
        return apiCaches[key] = createExports(origin[key], keys.concat(key))
      }

      // 配置项未定义
      throw Error(`API配置项“${keys.concat(key).join('.')}”未定义`)
    },
    set (origin, key, newValue) {
      throw Error(`API配置项“${keys.concat(key).join('.')}”不允许重写`)
    },
    deleteProperty (origin, key) {
      throw Error(`API配置项“${keys.concat(key).join('.')}”不允许删除`)
    },
  })
}


apiExports.mod1.api1()
apiExports.mod1.api1()
apiExports.mod1.api1()

function requestCall (shareConfig, ...args) {
  console.info({ shareConfig, args })
}

function validateConfig (config) {

}

apiExports.mod1.api1()
