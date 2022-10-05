import { OutputOptions } from 'rollup';
import Config from '../Config';

export interface ConfigOption<GEnv = Record<string, any>> {
  input: Config['input'];
  output: {
    es?: OutputOptions;
    cjs?: OutputOptions;
    umd?: OutputOptions;
    iife?: OutputOptions;
  };
  external?: Config['external'];
  extensions: Config['extensions'];
  env: GEnv;
}
