import tests from '@ijest';

import { IgnoreErrorNameSymbol } from '../../../src/easyapi/const';

tests('config.ignoreError', (test, assert, { http }) => {
  function isIgnoreError(error) {
    assert.isBe(error.name, IgnoreErrorNameSymbol);
  }

  test('config.global.ignoreError', () => {
    const api = http.create({
      ignoreError: true,
      response() {
        throw Error('businessDataError');
      },
    });
    return api
      .test()
      .then(() => {
        assert.isTrue(false);
      })
      .catch((error) => {
        isIgnoreError(error);
      });
  });

  test('config.share.ignoreError', () => {
    const api = http.create({
      response() {
        throw Error('businessDataError');
      },
      config: {
        ignoreError: true,
      },
    });
    return api
      .test()
      .then(() => {
        assert.isTrue(false);
      })
      .catch((error) => {
        isIgnoreError(error);
      });
  });

  test('config.private.ignoreError', () => {
    const api = http.create({
      response() {
        throw Error('businessDataError');
      },
    });
    return api
      .test(null, { ignoreError: true })
      .then(() => {
        assert.isTrue(false);
      })
      .catch((error) => {
        isIgnoreError(error);
      });
  });

  // 测试ignoreError导致返回的对象不是promis，使得和第三方库衔接存在问题
  test('config.ignoreError:promise.then', () => {
    const api = http.create({
      response() {
        throw Error('businessDataError');
      },
    });
    const promise = api.test(null, { ignoreError: true });

    return promise
      .then(() => {
        assert.isBe(true, false);
      })
      .catch((err) => {
        assert.isBe(err.message, 'businessDataError');
      })
      .finally(() => {
        assert.isBe(promise instanceof Promise, true);
      });
  });

  test('config.ignoreError:promise.catch', () => {
    const api = http.create({
      response() {
        throw Error('businessDataError');
      },
    });
    const promise = api.test(null, { ignoreError: true });

    return promise.catch((err) => {
      assert.isBe(err.message, 'businessDataError');
    });
  });

  test('config.ignoreError:promise.finally', () => {
    const api = http.create({
      response() {
        throw Error('businessDataError');
      },
    });
    const promise = api.test(null, { ignoreError: true });

    return new Promise((resolve) => {
      promise
        .catch(() => {
          //
        })
        .finally(() => {
          resolve(null);
        });
    });
  });
});
