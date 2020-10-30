function IgnoreErrorPromise (promise) {
  let nextError

  this.then = function (callback) {
    // 假如还存在错误，则下次调用直接跳过

    promise = promise
      .then(() => {
        if (!nextError) {
          callback()
        }
      })
      .catch((error) => {
        nextError = error
      })
    return this
  }

  // 错误未抓取之前，都会在内部进行流转
  this.catch = function (callback) {
    promise = promise.catch((error) => {
      nextError = error
    })

    return promise.then(() => {
      nextError && callback(nextError)
    })
  }

  this.finally = function (callback) {
    promise = promise
      .catch((error) => {
        nextError = error
      })
      .finally(() => {
        callback()
      })
    return this

    // console.info({ nextError })

    // // 错误没处理，则继续使用内部的流程
    // if (nextError) {
    //   callback()
    //   console.info('#########3')
    //   return this
    // }

    // return promise.finally(callback)
  }
}

IgnoreErrorPromise.prototype = new Promise(() => {})
IgnoreErrorPromise.prototype.constructor = IgnoreErrorPromise

export default IgnoreErrorPromise
