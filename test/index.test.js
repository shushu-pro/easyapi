import ijest from 'ijest'
import adapter from '@shushu.pro/adapter'
import http from './http'
import example from './children/example'
import defaultConfig from './children/configs/defaultConfig'
import globalConfig from './children/configs/globalConfig'
import shareConfig from './children/configs/shareConfig'
import privateConfig from './children/configs/privateConfig'
import errorIgnore from './children/configs/errorIgnore'
import resolve from './children/configs/resolve'
import mock from './children/configs/mock'
import apiArgs from './children/apiArgs'
import RESTful from './children/RESTful'
import handles from './children/handles'
import IgnoreErrorPromise from './children/util/IgnoreErrorPromise'
import feature from './children/feature'


// document
// https://github.com/sschen86/ijest

ijest({
  // 上下文环境
  context: {
    http,
    adapter,
  },

  // 测试开始前运行
  before (context) {
    http.start()
  },

  // 测试结束后运行
  after (context) {
    http.close()
  },

  // 所有测试用例
  tests: {
    defaultConfig,
    globalConfig,
    shareConfig,
    privateConfig,
    errorIgnore,
    mock,
    resolve,
    apiArgs,
    RESTful,
    handles,
    example,
    IgnoreErrorPromise,
    feature,
  },

  // 自定义断言
  asserts: {
    // 定义来一个判断值是否是长度为2的字符串断言，可以在测试中使用
    isString2 (value) {
      expect(typeof value).toBe('string')
      expect(value.length).toBe(2)
    },
  },
})
