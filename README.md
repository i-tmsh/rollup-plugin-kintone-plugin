# rollup-plugin-kintone-plugin

🍣 A Rollup plugin to create a plugin zip of kintone.

## Install

```console
npm install git+https://github.com/i-tmsh/rollup-plugin-kintone-plugin.git --save-dev
```

## Usage

Create a `rollup.config.mjs` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:

```js
import { defineConfig } from 'rollup';
import kintonePlugin from 'rollup-plugin-kintone-plugin';

export default defineConfig({
  input: {
    config: 'src/config.js',
    desktop: 'src/desktop.js',
  },
  output: {
    dir: 'plugin/js',
    format: 'es',
  },
  plugins: [kintonePlugin()],
});
```

## Options

You can customize the paths of manifest.json, privateKey and plugin zip.
Those default values are like the following.

```
manifestJSONPath: './manifest.json',
privateKeyPath: './private.ppk',
pluginZipPath: './dist/plugin.zip'
```

If you want to customize these values, you can update the values like this.

```js
plugins: [kintonePlugin({
  manifestJSONPath: './plugin/manifest.json',
  privateKeyPath: './private.ppk',
  pluginZipPath: (id, manifest) => `${id}.${manifest.version}.plugin.zip`
})],
```
