import { assert, easyapi, expect, test, ErrorIgnoreSymbol } from './helper';

function isErrorIgnore(error) {
  expect(error.name).toBe(ErrorIgnoreSymbol);
}

test('config.default.errorIgnore', () => {
  const api = easyapi({
    errorIgnore: true,
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
      isErrorIgnore(error);
    });
});

test('config.define.errorIgnore', () => {
  const api = easyapi({
    response() {
      throw Error('businessDataError');
    },
    config: {
      errorIgnore: true,
    },
  });
  return api
    .test()
    .then(() => {
      throw Error();
    })
    .catch((error) => {
      isErrorIgnore(error);
    });
});

test('config.request.errorIgnore', () => {
  const api = easyapi({
    response() {
      throw Error('businessDataError');
    },
  });
  return api
    .test(null, { errorIgnore: true })
    .then(() => {
      throw Error();
    })
    .catch((error) => {
      isErrorIgnore(error);
    });
});

// 测试errorIgnore导致返回的对象不是promise，使得和第三方库衔接存在问题
test('config.errorIgnore:promise.then', () => {
  const api = easyapi({
    response() {
      throw Error('businessDataError');
    },
  });
  const promise = api.test(null, { errorIgnore: true });

  return promise
    .then(() => {
      expect(true).toBe(false);
    })
    .catch((err) => {
      expect(err.message).toBe('businessDataError');
    })
    .finally(() => {
      assert.instanceOf(promise, Promise);
    });
});

test('config.errorIgnore:promise.catch', () => {
  const api = easyapi({
    response() {
      throw Error('businessDataError');
    },
  });
  const promise = api.test(null, { errorIgnore: true });

  return promise.catch((err) => {
    expect(err.message).toBe('businessDataError');
  });
});

test('config.errorIgnore:promise.finally', () => {
  const api = easyapi({
    response() {
      throw Error('businessDataError');
    },
  });
  const promise = api.test(null, { errorIgnore: true });

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
