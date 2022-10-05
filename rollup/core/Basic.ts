import { Plugin, RollupOptions } from 'rollup';

import pkg from '../../package.json';
import { ConfigOption } from './types/ConfigOption';

abstract class Basic {
  protected env: any;

  protected input: RollupOptions['input'];

  protected external: RollupOptions['external'];

  protected extensions: Array<string>;

  protected output: Array<RollupOptions['output']>;

  protected plugins: Array<Plugin>;

  constructor(option: ConfigOption<any>) {
    const { input, output, external, extensions, env } = option;

    this.env = {
      appName: pkg.name,
      ...env,
    };
    this.input = input;
    this.external = external;
    this.extensions = extensions;
    this.output = [];
    this.plugins = [];

    this.initOutput(output);
    this.initPlugins();
  }

  protected abstract initOutput(output): void;

  protected abstract initPlugins(): void;

  get value() {
    return {
      input: this.input,
      output: this.output,
      plugins: this.plugins,
      external: this.external,
    };
  }
}

export default Basic;
