import Config from './Config';
import { ConfigOption } from './types/ConfigOption';

function config<GEnv = any>(option: ConfigOption<GEnv>) {
  return new Config(option).value;
}

export default config;
