# 更新日志

## 2024/01/04 0.2.2

- 优化`payload`逻辑，支持发送数组、字符串、FormData 等类型的数据

## 2022/12/11 0.2.1

- 升级依赖

## 2022/12/07 0.2.0

- `easyapi(~)`增加导出`request(~)`和`createAbort(~)`方法
- 去除`dataFormat(~)`配置，增加`dataNormalizer(~)`配置和`resolveType`，实现数据的更精准操作控制
- 重构优化`types`签名文件，支持根据扁平化的设计
- 增加对`require`模式导入模块的支持

## 2022/10/01 0.1.20

- 重构底层逻辑

## 2022/08/07 0.1.19

- 更新构建脚本
- 更新接口文档

## 2022/07/19 0.1.18

- 修复接口 payload 是数组被转成对象的错误

## 2020/03/30 0.1.17

- 修复接口异常的情况下永久缓存不更新的问题

## 2020/03/29 0.1.16

- 使用 ts 进行重构优化
- 增加 cache 配置项，支持接口缓存

## 2020/11/11 0.1.15

- 修复子级同名接口覆盖的问题

## 2020/11/03 0.1.14

- 取消模拟实现 Promise 达到 errorIgnore 的功能，使用原生错误捕获事件进行处理
