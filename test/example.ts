export default function t(context, { tests, test, assert }) {
  tests('title', () => {
    test('test', () => {
      assert.isNumber(1);
    });
  });
}
