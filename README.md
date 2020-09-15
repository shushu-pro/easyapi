# @shushu.pro/easyapi

前端开发API系统，支持数据适配器，mock生成器，支持RESTFul方式接口，可以普遍在vue或者react的api相关模块中使用

### 开发目的
+ 解决前端接口管理维护的问题
+ 解决前端接口调试困难的问题
+ 解决前端接口数据mock的问题
+ 解决数据处理问题
+ 解决前端接口前后端字段不统一的问题


### 组件特点

+ 以配置文件的方式实现接口的定义
+ 以声明的方式实现动态mock数据的生成
+ 支持自定义的扩展配置项实现复杂的功能
+ 支持promise和callback模式无缝使用
+ 支持完整的调试信息输出
+ 支持前后端数据快速适配


### 配置说明

#### 应用中使用接口获取数据

```js
// promise模式
$api.getData({ id:1 })
    .then((responseObject) => {
        // responseObject包含返回的headers，body和config
        // 处理数据
    })
    .catch(err => {
        // 处理异常
    })

// callback模式
$api.getData({ id:1 }, (responseObject, err) => {
    if(err){
        // 错误处理
    }
    // data
})
```

#### 接口配置项

```js
const configs = {}

// 以配置项的key作为接口调用的名称
configs.getData = {
    method:'get', // 请求方式，默认get
    url: '/data/:id', // 接口地址
    mock (config){
        // params 请求的参数
        // header 请求头
        return {
            $body: {
                // 响应的数据
            },
            $headers: {
                // 响应头
            }
        }
    },
    delay: 1000, // 模拟延迟1000ms
    request: {
        // 请求适配器
    },
    response: {
        // 响应适配器
    }
}
```

#### 组件安装配置

```
yarn add @shushu.pro/easyapi
```

```js
import easyapi from '@shushu.pro/easyapi'
const $api = easyapi({
    baseURL: '', // 基础路径
    timeout: 2000, // 接口超时时间，也可以单独在config中配置某个接口的超时时间
    configs: {
        // 接口配置项
    },

    request (config) { // 接口请求时拦截器
       // 预处理请求数据或者直接拦截请求返回mock数据
    },
    response(rconfig){ // 接口响应拦截器
        // 预处理响应数据，比如返回自定义的逻辑错误
    },
    success (config) { // 正确响应处理器
        // 数据预处理
    },
    failure(config){ // 错误响应处理器
        // 错误统一处理，比如登录失效等
    }
})
```

### config接口

#### 数据值

+ config.sendData 请求提交的数据，由method决定是params还是data
+ config.meta 所有的配置项数据，比如：`method`，`url`等
+ config.responseObject，请求响应数据，包含请求头（headers），请求体（body）和请求配置项（config）
+ config.error 错误信息，存放遇到的错误信息

> 可以修改config对应的数据来实现数据的处理和请求参数的处理



### 示例

```js
import easyapi from '@shushu.pro/easyapi'
import adapter from '@shushu.pro/adapter'

const $api = easyapi({
    baseURL: '/api/', // 基础路径
    timeout: 30000, // 接口超时时间，也可以单独在config中配置某个接口的超时时间
    configs: {
        // 接口配置项
    },

     request (config) {
         // 请求数据转化
        const { request } = config.meta
        if (typeof request === 'function') {
            config.sendData = request(config.sendData)
        } else if (request && typeof request === 'object') {
            config.sendData = adapter(request, config.sendData)
        }
    },
    response (config) {
        // 对响应的数据做处理
        const { data } = config.responseObject
        const { code } = data

        if (code === 1008) {
            throw Error('NO-LOGIN')
        }

        if (code !== 0) {
            throw Error(data.message)
        }
    },
    success (config) { // 正确响应处理器
        const { data } = config.responseObject
        const { response } = config.meta
        // 响应数据转化
        if (typeof response === 'function') {
            config.responseObject.data = response(data)
        } else if (response && typeof response === 'object') {
            config.responseObject.data = adapter(response, data)
        }
    },
    failure(config){ // 错误响应处理器
        if (config.preventDefaultError) {
            return
        }
        if (error.message === 'NO-LOGIN') {
            return alert('登录失效')
        }
        alert(error.message)
    }
})
```