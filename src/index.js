import axios from 'axios'
import { compile } from 'path-to-regexp'
import defaults from './config'
import config from './config'

function easyapi (option) {
  return (new Easyapi(option)).exports
}

easyapi.defaults = { ...defaults }

function Easyapi (option) {
  const {
    // 是否开发环境
    env = 'production',
    logger = false,

    // 拦截器钩子
    init,
    request,
    response,
    success,
    failure,

    // axios配置项
    axios,

    // 自定义配置项
    props = {},

    // 接口配置项
    configs = {},
  } = option

  const envIsDevelopment = env === 'development'
  const axiosInstance = axios.create(Object.assign({}, defaults, axios))


  this.exports = createExports(configs)


  // 创建导出的接口
  function createExports (configs) {
    const allConfigs = {}
    const validateConfigs = {}

    // 解析configs，从中获取接口的配置项
    Object.keys(configs).forEach(key => {
      const config = configs[key]

      // 过滤无效的配置
      if (!config || typeof config !== 'object') {
        return
      }

      // 假如当前项存在url属性，则认定是API配置项
      if (typeof config.url === 'string') {
        return addConfig(key, config)
      }

      const childConfigs = config
      const groupName = key
      Object.keys(childConfigs).forEach(key => {
        const config = childConfigs[key]
        if (!config || typeof config !== 'object') {
          return
        }

        return addConfig(key, config, groupName)
      })
    })

    return new Proxy({}, {
      get: (configs, key) => {
        if (!allConfigs[key]) {
          return () => console.warn(`接口“${key}”未配置`)
        }
        return (...args) => {
          try {
            return requestCall(allConfigs[key], ...args)
          } catch (error) {
            return Promise.reject(error)
          }
        }
      },
    })

    function addConfig (key, config, groupName) {
      // 开发模式下对配置项做重复，完整性校验
      if (envIsDevelopment) {
        const label = `接口：${[ groupName, key ]}`
        const existsConfigInfo = validateConfigs[key]
        // 已经存在的接口
        if (existsConfigInfo) {
          return console.error(`注册接口失败；配置冲突：${existsConfigInfo.join('.')}，${[ groupName, key ].join('.')}`)
        }

        if (typeof config.url !== 'string') {
          return console.error(`${label}配置项url错误`)
        }

        if (config.mock && typeof mock !== 'function') {
          return console.error(`${label}配置项mock错误`)
        }

        validateConfigs[key] = [ groupName, key ]
      }
      allConfigs[key] = config
    }
  }

  function requestCall (shareConfig, sendData, callback, privateConfig) {
    // 由参数callback是否传入决定是callback模式还是Promise模式
    // sendData 由method决定是data还是params
    // sendData, callback
    // sendData, callback, privateConfig
    // sendData, privateConfig
    // sendData

    // 仅传了配置项
    if (sendData == null && typeof callback === 'object') {
      // requestCall(null, privateConfig)
      privateConfig = callback
      callback = null
      sendData = null
    } else if (typeof sendData === 'function') { // 无sendData参数
      // requestCall(callback)
      privateConfig = callback
      callback = sendData
      sendData = null
    } else if (typeof callback !== 'function') { // 不传callback，那么属于Promise模式
      // requestCall(sendData, privateConfig)
      privateConfig = callback
      callback = null
    }

    sendData = sendData || {}
    callback = callback || null
    privateConfig = privateConfig || {}

    const config = new Config({ shareConfig, privateConfig, sendData }) // 当前请求实例的配置项

    // 请求拦截器中进行处理
    if (typeof request === 'function') {
      request(config)
    }

    convertRESTful(config)

    const asyncResult = config.meta.mock ? mockResponse(config) : httpResponse(config)

    // 返回promise模式
    if (!callback) {
      return asyncResult
    }

    asyncResult
      .then((responseData) => {
        callback(responseData, null)
      })
      .catch((error) => {
        callback(null, error)
      })
  }

  // 创建配置类
  function Config ({ shareConfig, privateConfig, sendData }) {
    const config = {
      ...shareConfig,
      ...privateConfig,
      headers: {
        ...shareConfig.headers,
        ...privateConfig.headers,
      },
    }
    config.method = (config.method || defaults.method).toUpperCase()

    this.meta = config
    this.sendData = sendData
    this.axios = function () {

    }
  }

  // 转化RESTFul路径
  function convertRESTful (config) {
    const { sendData, meta } = config
    const { method, params, url } = meta

    const RESTFulParams = { ...params }
    if (method === 'GET') {
      Object.assign(RESTFulParams, sendData)
    }

    const urlSplits = url.split('?')
    let baseUrl = urlSplits.shift()
    const queryString = urlSplits.join('?')

    // /api/${id}
    if (/\{\w+\}/.test(baseUrl)) {
      baseUrl = baseUrl.replace(/\{(\w+)\}/g, (match, key) => {
        if (key in RESTFulParams) {
          return RESTFulParams[key]
        }
        return match
      })
    }

    // /api/:id
    if (/:\w+/.test(baseUrl)) {
      baseUrl = compile(baseUrl, { encode: encodeURIComponent })(RESTFulParams)
    }

    config.url = baseUrl + (queryString ? `?${queryString}` : '')
  }

  // 使用本地mock发起请求
  function mockResponse (config) {
    try {
      const responseObject = config.mock({
        sendData: config.sendData,
        headers: config.meta.headers,
        config: config.meta,
      })
      const asyncResponseObject = new Promise((resolve, reject) => {
        if (isPromise(responseObject)) {
          responseObject.then((responseObject) => {
            resolveResponseObject(responseObject)
          }).catch(reject)
        } else {
          resolveResponseObject(responseObject)
          resolve({
            data: responseObject.data,
            headers: responseObject.headers || {},
            config: config.meta,
          })
        }
        function resolveResponseObject (responseObject = {}) {
          const { $body, $headers } = responseObject

          // 返回的即body
          if (!$body && !$headers) {
            return resolve({
              data: responseObject,
              headers: {},
              config: config.meta,
            })
          }

          resolve({
            data: $body || null,
            headers: $headers || {},
            config: config.meta,
          })
        }
      })

      return onResponse(asyncResponseObject, config)
    } catch (error) {
      return Promise.reject(error)
    }
    function isPromise (data) {
      return typeof data === 'object' && typeof data.then === 'function'
    }
  }

  // axios发起http请求
  function httpResponse (config) {
    return onResponse(axiosInstance(config.axios()), config)
  }

  function onResponse (asyncResponseObject, config) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        asyncResponseObject
          .then(responseObject => {
            config.setResponse(responseObject)

            if (typeof response === 'function') {
              response(config)
            }

            if (typeof success === 'function') {
              success(config)
            }

            if (envIsDevelopment && logger) {
              console.warn('=== easyapi.response ===\n', { config })
            }

            resolve(config.responseData())
          })
          .catch(error => {
            try {
              if (typeof failure === 'function') {
                config.setError(error)
                resolve(failure(config))
              } else {
                reject(error)
              }
            } catch (error) {
              reject(error)
            } finally {
              if (envIsDevelopment && logger) {
                console.warn('=== easyapi.error ===\n', { config })
              }
            }
          })
      }, config.meta.delay || 0)
    })
  }
}

export default easyapi


// const conf = {
//   request (config) {
//     config.params,
//     config.data,

//   },
//   response (config) {
//     config.body
//     config.header

//   },
//   success (config) {
//     config.body
//     config.header
//   },
//   failure (config) {
//     config.error,
//     config.merge({
//         error
//     })
//   },
// }


// api.call(data, callback, config)

// api.getName({asas:1}, { data })

// mock({params, data, headers}){

// }


const configs = {
  group1: {
    api1: {
      // ...
    },
    api2: {
      // ...
    },
  },
  group2: {
    // ...
  },
  api3: {
    url: 'xx',
    delay: 11,
    timeout: 1000,
    props: {
      request (value, type) {
        if (type === 'function') {
          return value
        }
        if (value && type === 'object') {
          return (config) => adapter(value, config.sendData)
        }
        return () => {}
      },
    },
    mock () {

    },
    request (config) {
      config.merge({
        sendData: config.request(config),
      })
    },
    response () {

    },
  },
}
