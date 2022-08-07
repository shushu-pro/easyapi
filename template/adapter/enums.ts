/** @description 通用枚举集合 */

import adapter from '@shushu.pro/adapter';

const enums: any = {};

/** @description 云产品枚举 */
enums.productName = ['全部', 'ECS', 'ODPS'];

adapter.addEnum(enums);
