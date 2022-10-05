/// 通过读取tsconfig配置的paths生成webpack和eslint对应的别名配置
/// 生成webpack中ts编译包含的路径

const path = require('path');

const cwd = process.cwd();
const resolve = (...paths) => path.resolve(cwd, ...paths);
const tsconfig = require('../tsconfig.json');

const {
  compilerOptions: { baseUrl = '', paths },
  include,
} = tsconfig;

const eslintAlias = [];
const webpackAlias = {};
const tsIncludes = include;

Object.keys(paths).forEach((key) => {
  // // 过滤非"/*"结尾的别名配置
  // if (!/\/\*$/.test(key)) {
  //   return;
  // }
  const aliasKey = key.replace(/\/\*$/, '');
  const aliasValue = paths[key][0].replace(/\/\*$/, '');
  const aliasAbsoluteValue = resolve(baseUrl, aliasValue);

  eslintAlias.push([aliasKey, aliasAbsoluteValue]);
  webpackAlias[aliasKey] = aliasAbsoluteValue;
});

// console.info({ webpackAlias, eslintAlias });

module.exports = { eslintAlias, webpackAlias, tsIncludes };
