/// 包装获取esModule中的default

export default function esModule(data) {
  if (!(data instanceof Promise)) {
    // eslint-disable-next-line no-underscore-dangle
    if (data?.__esModule) {
      return data.default;
    }
    return data;
  }

  return data.then((data) => esModule(data));
}
