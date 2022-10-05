import ijest from 'ijest';

import context from './context';

const { tests, run } = ijest<
  typeof context,
  {
    isStringNumber: (v) => unknown;
  }
>({
  context,

  assert: (assert) => ({
    isStringNumber(value) {
      assert.isString(value);
      assert.isMatch(value, /^\d+$/);
    },
  }),

  before({ http }) {
    // 关闭warn报错
    global.console.warn = () => undefined;
    http.start();
  },

  after({ http }) {
    http.close();
  },

  count: 1,
});

export default tests;

run();
