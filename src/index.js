import axiosLib from 'axios'
import { compile } from 'path-to-regexp'
import defaults from './config'

const CancelToken = axiosLib.CancelToken

function easyapi (option) {
  return (new Easyapi(option)).exports
}

function Easyapi (option) {
  const {
    // 是否开发环境
    env = 'production',
    logger = false,

    // 拦截器钩子
    // init,
    request,
    response,
    success,
    failure,

    // axios配置项
    axios,

    // 自定义配置项
    // props = {},

    // 接口配置项
    configs = {},

    // 剩余的其他配置项
    ...rest
  } = option

  const ISDEV = env !== 'production'
  const axiosInstance = axiosLib.create(Object.assign({}, defaults.axios, axios))
  const apiCaches = {}

  this.exports = createExports(configs, [])

  // 创建导出的接口
  function createExports (configs, keys) {
    // 当前配置项存在字符串类型的url字段，则配置项为接口配置项，否则为模块配置项
    if (typeof configs.url === 'string') {
      const config = Object.freeze(configs)

      if (ISDEV) {
        validateConfig(config, keys)
      }

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
        throw Error(`API配置“${keys.concat(key).join('.')}”未定义`)
      },
      set (origin, key, newValue) {
        throw Error(`API配置“${keys.concat(key).join('.')}”不允许重写`)
      },
      deleteProperty (origin, key) {
        throw Error(`API配置“${keys.concat(key).join('.')}”不允许删除`)
      },
    })
  }

  // 校验配置项是否正确
  function validateConfig ({ mock }, keys) {
    if (mock && typeof mock !== 'function') {
      return console.error(`API配置“${keys.join('.')}”的字段mock不为Function`)
    }
  }

  // 发起请求
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

    const asyncResult = (ISDEV && config.meta.mock) ? mockResponse(config) : httpResponse(config)

    // 返回promise模式
    if (!callback) {
      return asyncResult
    }

    asyncResult
      .then((responseObject) => {
        callback(responseObject, null)
      })
      .catch((error) => {
        callback({}, error)
      })
  }

  // 创建配置类
  function Config ({ shareConfig, privateConfig, sendData }) {
    const config = {
      ...defaults.axios,
      ...defaults.easyapi,
      ...rest,
      logger,
      ...shareConfig,
      ...privateConfig,
      headers: {
        ...shareConfig.headers,
        ...privateConfig.headers,
      },
    }

    this.meta = config
    // this.state = 0 // 0:INIT, 1:RESPONSE, 2:RESOLVE, 3:REJECT, 4:FINNALY, 6:RESOLVEDATA
    this.sendData = sendData
    this.error = null
    this.responseObject = null

    config.method = (config.method || defaults.axios.method).toUpperCase() // 请求方式

    // 放入取消请求的钩子
    const { abort } = config
    if (abort && typeof abort === 'object') {
      const source = CancelToken.source()
      config.cancelToken = source.token
      abort.trigger = (message) => {
        source.cancel(message)
      }
    }
    this.axios = function () {
      let data = null
      let params = null

      const { sendData, meta } = this

      if (/^GET$/i.test(meta.method)) {
        params = sendData
      } else if (/^(POST|PUT)$/i.test(meta.method)) {
        data = sendData
      }

      return {
        ...meta,
        data,
        params: {
          ...meta.params,
          ...params,
        },
      }
    }
  }

  // 转化RESTFul路径
  function convertRESTful (config) {
    const { sendData, meta } = config
    const { params, url } = meta

    const RESTFulParams = { ...params }
    Object.assign(RESTFulParams, sendData)

    // if (method === 'GET') {
    //   Object.assign(RESTFulParams, sendData)
    // } else {
    //   Object.assign(RESTFulParams, sendData)
    // }

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

    meta.url = baseUrl + (queryString ? `?${queryString}` : '')
  }

  // 使用本地mock发起请求
  function mockResponse (config) {
    const { meta } = config
    try {
      const responseObject = meta.mock({
        sendData: config.sendData,
        headers: meta.headers,
        config: config.meta,
      })
      const asyncResponseObject = new Promise((resolve, reject) => {
        if (isPromise(responseObject)) {
          responseObject.then((responseObject) => {
            resolveResponseObject(responseObject)
          }).catch(reject)
        } else {
          resolveResponseObject(responseObject)
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
    const { logger } = config.meta
    const promise = new Promise((resolve, reject) => {
      // 开发模式下，模拟delay效果
      if (ISDEV) {
        setTimeout(asyncResponseCall, config.meta.delay || 0)
      } else {
        asyncResponseCall()
      }

      function asyncResponseCall () {
        asyncResponseObject
          .then(responseObject => {
            config.responseObject = responseObject
            try {
              if (typeof response === 'function') {
                response(config)
              }

              if (typeof success === 'function') {
                success(config)
              }

              if (ISDEV && logger) {
                console.warn('=== easyapi.response ===\n', { config })
              }

              // 需要对resolve的数据进行拦截处理
              if (config.resolve) {
                return resolve(config.resolve(config))
              }

              resolve(config.responseObject)
            } catch (err) {
              return Promise.reject(err)
            }
          })
          .catch(error => {
            try {
              if (typeof failure === 'function') {
                config.error = error
                failure(config)
                return reject(config.error)
              }
              reject(error)
            } catch (error) {
              reject(error)
            } finally {
              if (ISDEV && logger) {
                console.warn('=== easyapi.error ===\n', { config })
              }
            }
          })
      }
    })

    const resolveDataTransformer = config.meta.resolve
      ? (responseObject) => config.meta.resolve(responseObject)
      : (responseObject) => responseObject


    if (config.meta.errorIgnore) {
      return new IgnoreErrorPromise(promise, resolveDataTransformer)
    }

    return promise.then((responseObject) => Promise.resolve(resolveDataTransformer(responseObject)))
  }
}

export default easyapi

function IgnoreErrorPromise (promise, resolveDataTransformer) {
  let nextError

  this.then = function (callback) {
    promise = promise.then((responseObject) => {
      callback(resolveDataTransformer(responseObject))
    }).catch((error) => {
      nextError = error
    })
    return this
  }

  this.catch = function (callback) {
    promise = promise.catch((error) => {
      nextError = error
    })
    return promise.then(() => {
      nextError && callback(nextError)
    })
  }

  this.finally = function (callback) {
    return promise.catch(() => {}).then(() => {
      callback()
    })
  }
}

IgnoreErrorPromise.prototype = new Promise(() => {})
