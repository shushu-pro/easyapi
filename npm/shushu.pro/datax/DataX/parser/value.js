import mockv from '@shushu.pro/mockv';

import context from '../context';

Object.assign(context, {
  $mock: mockv,
});

const valueTransform = [
  stepNumTransform,
  stepValueTransform,
  thisFieldTransform,
  randomValueTransform,
  mockValueTransform,
];

// 累加取值
function stepNumTransform(code) {
  const matches = code.match(/(\d+)(\+\+|--)/);
  if (!matches) {
    return;
  }
  const [, num, type] = matches;
  const step = type === '++' ? 1 : -1;
  return { nextCode: `${num - step} + this.$total * ${step}`, isBreak: true };
}

// 数组项取值
function stepValueTransform(code) {
  const matches = code.match(/([^.]+)?\.\.(?:\s+|$)/);
  if (!matches) {
    return;
  }
  const [, expression] = matches;
  return { nextCode: `${expression}[this.$index]`, isBreak: true };
}

// this转化
function thisFieldTransform(code) {
  // 跳过所有的字符串内容
  const nextCode = code.replace(
    /(?:'(?:[^']|\\\\|\\')')|(?:"(?:[^"]|\\\\|\\")")|(?:`(?:[^`]|\\\\|\\`)`)|(@)/g,
    (all, thisSymbol) => {
      if (thisSymbol) {
        return 'this.';
      }
      return all;
    }
  );
  if (code === nextCode) {
    return;
  }
  return { nextCode };
}

// 随机数取值
function randomValueTransform(code) {
  const matches = code.match(/(.+)?\?\?/);
  if (!matches) {
    return;
  }
  const [, expression] = matches;
  return { nextCode: `$mock.random(${expression})`, isBreak: true };
}

// mock转化
function mockValueTransform(code) {
  const matches = code.match(/^#(\w+[.\w]+)\s*(\(.+)?/);
  if (!matches) {
    return;
  }

  const [, command, args] = matches;
  if (command in mockv) {
    return { nextCode: `$mock.${command}${args || '()'}`, isBreak: true };
  }
  return { nextCode: `"${command}${args ? args.replace(/"/g, '\\"') : '()'}"` };
}

function valueParser(code) {
  for (let i = 0, lg = valueTransform.length; i < lg; i++) {
    const result = valueTransform[i](code);

    // 返回对象，则进行转化操作
    if (typeof result === 'object') {
      const { nextCode, isBreak } = result;
      if (nextCode !== undefined) {
        code = nextCode;
      }
      if (isBreak) {
        break;
      }
    }
  }

  return code;
}

export default valueParser;
