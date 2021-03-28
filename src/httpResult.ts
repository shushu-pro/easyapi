import onResponse from './onResponse';
import RequestConfig from './RequestConfig';

// axios发起http请求
function httpResult(config: RequestConfig) {
  const { context } = config;
  // console.info('httpResult');
  return onResponse(context.axiosInstance(config.axios()), config);
}

export default httpResult;
