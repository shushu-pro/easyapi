import tests from '@ijest';

tests('config.errorIgnore', (test, assert, { ErrorIgnoreName, easyapi }) => {
  function iserrorIgnore(error) {
    assert.isBe(error.name, ErrorIgnoreName);
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
        iserrorIgnore(error);
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
        assert.isTrue(false);
      })
      .catch((error) => {
        iserrorIgnore(error);
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
        assert.isTrue(false);
      })
      .catch((error) => {
        iserrorIgnore(error);
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
        assert.isBe(true, false);
      })
      .catch((err) => {
        assert.isBe(err.message, 'businessDataError');
      })
      .finally(() => {
        assert.isBe(promise instanceof Promise, true);
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
      assert.isBe(err.message, 'businessDataError');
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
});
