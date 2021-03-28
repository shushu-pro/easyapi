import RequestConfig from './RequestConfig';

function cacheResult(config: RequestConfig) {
  return config.useCache();
}

export default cacheResult;
