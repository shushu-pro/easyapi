import IgnoreErrorPromise from '../../../src/IgnoreErrorPromise'

export default function ({ http }, { tests, test, assert }) {
  tests('IgnoreErrorPromise', () => {
    test('IgnoreErrorPromise.then()', () => {
      const promise = new IgnoreErrorPromise(Promise.reject(Error('selfError')))
      const nextPromise = promise
        .then(() => {
          throw Error('不应该触发then')
        })
        .then(() => {
          throw Error('不应该触发then')
        })
      assert.isBe(nextPromise instanceof Promise, true)
      return nextPromise.catch(() => {})
    })

    test('IgnoreErrorPromise.then().catch()', () => {
      const data = { message: null }
      const promise = new IgnoreErrorPromise(Promise.reject(Error('selfError')))
      const nextPromise = promise
        .then(() => {
          throw Error('不应该触发then')
        })
        .catch((error) => {
          data.message = error.message
        })
        .catch(() => {
          data.message = 'nextError'
        })

      assert.isBe(nextPromise instanceof Promise, true)

      return new Promise(resolve => {
        setTimeout(() => {
          assert.isBe(data.message, 'selfError')
          resolve()
        })
      })
    })

    test('IgnoreErrorPromise.then().finally()', () => {
      const data = { message: null }
      const promise = new IgnoreErrorPromise(Promise.reject(Error('selfError')))
      const nextPromise = promise
        .then(() => {
          throw Error('不应该触发then')
        })
        .finally(() => {
          data.v1 = true
        })
        .finally(() => {
          data.v2 = true
        })

      assert.isBe(nextPromise instanceof Promise, true)

      return new Promise(resolve => {
        setTimeout(() => {
          assert.isTrue(data.v1)
          assert.isTrue(data.v2)
          resolve()
        })
      })
    })

    test('IgnoreErrorPromise.catch()', () => {
      const promise = new IgnoreErrorPromise(Promise.reject(Error('selfError')))
      const nextPromise = promise.catch((error) => {
        assert.isBe(error.message, 'selfError')
      })
      assert.isBe(nextPromise instanceof Promise, true)
      return nextPromise
    })

    test('IgnoreErrorPromise.catch().then()', () => {
      const data = { v1: false, v2: false }
      const promise = new IgnoreErrorPromise(Promise.reject(Error('selfError')))
      const nextPromise = promise.catch((error) => {
        assert.isBe(error.message, 'selfError')
      }).then(() => {
        data.v1 = true
      }).then(() => {
        data.v2 = true
      })

      assert.isBe(nextPromise instanceof Promise, true)

      return new Promise(resolve => {
        setTimeout(() => {
          assert.isTrue(data.v1)
          assert.isTrue(data.v2)
          resolve()
        })
      })
    })

    test('IgnoreErrorPromise.catch().finally()', () => {
      const data = { v1: false, v2: false }
      const promise = new IgnoreErrorPromise(Promise.reject(Error('selfError')))
      const nextPromise = promise.catch((error) => {
        assert.isBe(error.message, 'selfError')
      }).finally(() => {
        data.v1 = true
      }).finally(() => {
        data.v2 = true
      })

      assert.isBe(nextPromise instanceof Promise, true)

      return new Promise(resolve => {
        setTimeout(() => {
          assert.isTrue(data.v1)
          assert.isTrue(data.v2)
          resolve()
        })
      })
    })

    test('IgnoreErrorPromise.finally()', () => {
      const data = { v1: false, v2: false }
      const promise = new IgnoreErrorPromise(Promise.reject(Error('selfError')))
      const nextPromise = promise
        .finally(() => {
          data.v1 = true
        })
        .finally(() => {
          data.v2 = true
        })

      assert.isBe(nextPromise instanceof Promise, true)

      return new Promise(resolve => {
        setTimeout(() => {
          assert.isTrue(data.v1)
          assert.isTrue(data.v2)
          resolve()
        })
      })
    })

    test('IgnoreErrorPromise.finally().then()', () => {
      const data = { v1: false, v2: false }
      const promise = new IgnoreErrorPromise(Promise.reject(Error('selfError')))
      const nextPromise = promise
        .finally(() => {
          data.v1 = true
        })
        .then(() => {
          data.v2 = true
        })

      assert.isBe(nextPromise instanceof Promise, true)

      return new Promise(resolve => {
        setTimeout(() => {
          assert.isTrue(data.v1)
          assert.isFalse(data.v2)
          resolve()
        })
      })
    })
  })
}
