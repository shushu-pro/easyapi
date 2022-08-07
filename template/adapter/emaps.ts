/** @description 通用映射集合 */

import adapter from '@shushu.pro/adapter';

const emaps: any = {};

emaps.provider = { aliyun: '阿里云', tencent: '腾讯云' };

emaps.province = {
  zj: '浙江省',
  bj: '北京市',
  hlj: '黑龙江',
};

adapter.addEmap(emaps);
