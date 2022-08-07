import ijest from 'ijest';

import context, { Context } from './context';

const { tests, run } = ijest<
  Context,
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
    http.start();
  },

  after({ http }) {
    http.close();
  },

  count: 1,
});

export default tests;

run();
