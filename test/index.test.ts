// document
// https://github.com/sschen86/ijest

import ijest from 'ijest';
import adapter from '@shushu.pro/adapter';
import http from './env/http';

import defaultConfig from './easyapi/config/defaultConfig';
import globalConfig from './easyapi/config/globalConfig';
import shareConfig from './easyapi/config/shareConfig';
import privateConfig from './easyapi/config/privateConfig';
import treeConfig from './easyapi/config/treeConfig';
import errorIgnore from './easyapi/config/errorIgnore';
import resolve from './easyapi/config/resolve';
import mock from './easyapi/config/mock';
import apiArgs from './easyapi/apiArgs';
import RESTful from './easyapi/RESTful';
import handles from './easyapi/handles';

import feature from './easyapi/feature';
// import example from './example';

const date = new Date();

ijest({
  // 上下文环境
  context: {
    http,
    adapter,
  },

  // 测试开始前运行
  before() {
    http.start();
  },

  // 测试结束后运行
  after() {
    http.close();
  },

  // 所有测试用例
  tests: {
    defaultConfig,
    globalConfig,
    shareConfig,
    privateConfig,
    treeConfig,
    errorIgnore,
    resolve,
    mock,
    apiArgs,
    RESTful,
    handles,
    // feature,
  },

  // 自定义断言
  asserts: {
    // ..
  },
  actives: [],
});
