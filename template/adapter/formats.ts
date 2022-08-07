/** @description 自定义转化指令集 */

import adapter from '@shushu.pro/adapter';

const formats: any = {};

/** @description 时间格式化成 2020-12-12 12:12:12 */
formats.time = (value) => {
  const date = new Date(value);
  return [
    date.getFullYear(),
    '-',
    pad2(date.getMonth() + 1),
    '-',
    pad2(date.getDate()),
    ' ',
    pad2(date.getHours()),
    ':',
    pad2(date.getMinutes()),
    ':',
    pad2(date.getSeconds()),
  ].join('');
};

formats.applyTime = (value) => {
  const date = new Date(value);
  return [date.getFullYear(), '年', pad2(date.getMonth() + 1), '月'].join('');
};

function pad2(num) {
  return String(num).padStart(2, '0');
}

// 树转换逻辑
formats.tree = (
  value,
  ctx,
  key = 'id',
  parentKey = 'parentId',
  childrenKey = 'children'
) => {
  if (!Array.isArray(value)) {
    return value;
  }

  const tree = [];
  const treeMap = {};

  value.forEach((node) => {
    treeMap[node[key]] = node;
  });

  value.forEach((node) => {
    const parentId = node[parentKey];

    // 没有父节点，直接挂在根下
    if (parentId == null) {
      tree.push(node);
    } else {
      const parentNode = treeMap[parentId];

      // 存在父节点
      if (parentNode) {
        if (!parentNode[childrenKey]) {
          parentNode[childrenKey] = [];
        }
        parentNode[childrenKey].push(node);
      }
    }
  });

  return tree;
};

// 转换成JSON字符串
formats.JSONString = (value) => JSON.stringify(value);

// 转成成对象
formats.JSONParse = (value) => JSON.parse(value);

adapter.addFormat(formats);
