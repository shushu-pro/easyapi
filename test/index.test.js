import ijest from 'ijest'
import adapter from '@shushu.pro/adapter'
import http from './http'
import example from './children/example'
import defaultConfig from './children/configs/defaultConfig'
import globalConfig from './children/configs/globalConfig'
import shareConfig from './children/configs/shareConfig'
import privateConfig from './children/configs/privateConfig'
import apiArgs from './children/apiArgs'
import RESTful from './children/RESTful'
import handles from './children/handles'

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
    example,
    defaultConfig,
    globalConfig,
    shareConfig,
    privateConfig,
    apiArgs,
    RESTful,
    handles,
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
