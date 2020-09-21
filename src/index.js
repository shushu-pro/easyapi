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

  const envIsDevelopment = env !== 'production'
  const axiosInstance = axiosLib.create(Object.assign({}, defaults.axios, axios))

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

        if (config.mock && typeof config.mock !== 'function') {
          return console.error(`${label}配置项mock错误`)
        }

        validateConfigs[key] = [ groupName, key ]
      }
      allConfigs[key] = config
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

      const asyncResult = (envIsDevelopment && config.meta.mock) ? mockResponse(config) : httpResponse(config)

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
      let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
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

                if (envIsDevelopment && config.meta.logger) {
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
                if (envIsDevelopment && config.meta.logger) {
                  console.warn('=== easyapi.error ===\n', { config })
                }
              }
            })
        }, config.meta.delay || 0)
      })

      const resolve = config.meta.resolve
        ? (responseObject) => config.meta.resolve(responseObject)
        : (responseObject) => responseObject

      if (config.meta.errorIgnore) {
        let nextError
        const fakePromise = {
          then (callback) {
            promise = promise.then((responseObject) => {
              callback(resolve(responseObject))
            }).catch((error) => {
              nextError = error
            })
            return fakePromise
          },
          catch (callback) {
            promise = promise.catch((error) => {
              nextError = error
            })
            return promise.then(() => {
              nextError && callback(nextError)
            })
          },
          finally (callback) {
            return promise.catch(() => {}).then(() => {
              callback()
            })
          },
        }
        return fakePromise
      }

      return promise.then((responseObject) => {
        return Promise.resolve(resolve(responseObject))
      })
    }
  }
}

export default easyapi
