import callRequest from './callRequest';
import { EasyapiAPIConfig, EasyapiContext } from './typings';

// 创建导出的接口
function createExports(configs, keys, context: EasyapiContext) {
  // 当前配置项存在字符串类型的url字段，则配置项为接口配置项，否则为模块配置项
  if (typeof configs.url === 'string') {
    const config = Object.freeze(configs);

    if (context.isDevelopment) {
      validateConfig(config, keys);
    }

    return (...args) => {
      try {
        return callRequest(context, config, ...args);
      } catch (err) {
        Promise.reject(err);
      }
    };
  }
  const { apiConfigCaches } = context;

  // 模块配置项，走代理模式
  return new Proxy(configs, {
    get(origin, key) {
      const fullKeys = keys.concat(key);
      const fullKeysText = fullKeys.join('#');

      // 已经生成了API配置项
      if (apiConfigCaches[fullKeysText]) {
        return apiConfigCaches[fullKeysText];
      }

      // 初始化API配置项
      if (origin[key]) {
        return (apiConfigCaches[fullKeysText] = createExports(
          origin[key],
          fullKeys,
          context
        ));
      }

      // 配置项未定义
      throw Error(`API配置“${keys.concat(key).join('.')}”未定义`);
    },
    set(origin, key) {
      throw Error(`API配置“${keys.concat(key).join('.')}”不允许重写`);
    },
    deleteProperty(origin, key) {
      throw Error(`API配置“${keys.concat(key).join('.')}”不允许删除`);
    },
  });
}

// 校验配置项是否正确
function validateConfig({ mock }: EasyapiAPIConfig, keys: Array<string>) {
  if (mock && typeof mock !== 'function') {
    return console.error(`API配置“${keys.join('.')}”的字段mock不为Function`);
  }
}

export default createExports;
