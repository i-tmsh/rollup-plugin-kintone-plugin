import { packPluginFromManifest } from '@kintone/plugin-packer/dist/pack-plugin-from-manifest.js';
import * as fs from 'fs';
import * as path from 'path';
import { Plugin } from 'rollup';
import NodeRSA from 'node-rsa';

interface Option {
  manifestJSONPath: string;
  privateKeyPath: string;
  pluginZipPath: string | PluginZipPathFunction;
}

type PluginZipPathFunction = (id: string, manifest: { [key: string]: any }) => string;

export default function kintonePlugin(options: Partial<Option> = {}): Plugin {
  const manifestJSONPath = options?.manifestJSONPath ?? './manifest.json';
  const privateKeyPath = options?.privateKeyPath ?? './private.ppk';
  const pluginZipPath = options?.pluginZipPath ?? './dist/plugin.zip';
  let privateKey: string;
  return {
    name: 'kintone-plugin',
    options() {
      if (!fs.existsSync(manifestJSONPath)) {
        throw new Error(`manifestJSONPath cannot found: ${manifestJSONPath}`);
      }
      if (!fs.existsSync(privateKeyPath)) {
        console.debug('generating a new key');
        const key = new NodeRSA({ b: 1024 });
        fs.writeFileSync(privateKeyPath, key.exportKey('pkcs1-private'));
      }
      privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
    },
    async buildEnd() {
      const result = await packPluginFromManifest(manifestJSONPath, privateKey);
      const zipPath =
        typeof pluginZipPath == 'function'
          ? pluginZipPath(result.id, JSON.parse(fs.readFileSync(manifestJSONPath, 'utf-8')))
          : pluginZipPath;
      const zipDir = path.dirname(zipPath);
      if (!fs.existsSync(zipDir)) {
        fs.mkdirSync(zipDir, { recursive: true });
      }
      fs.writeFileSync(zipPath, result.plugin);
      console.log('----------------------');
      console.log('Success to create a plugin zip!');
      console.log(`Plugin ID: ${result.id}`);
      console.log(`Path: ${zipPath}`);
      console.log('----------------------');
    },
  };
}
