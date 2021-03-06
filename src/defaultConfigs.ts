const axiosDefaults = {
  method: 'GET',
  responseType: 'json',
};

const easyapiDefaults = {
  delay: 0, // 延迟响应
  mock: null, // 启用mock数据
  logger: false, // 是否启用日志
};

export default {
  axios: axiosDefaults,
  easyapi: easyapiDefaults,
};
