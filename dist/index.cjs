'use strict';

var packPluginFromManifest_js = require('@kintone/plugin-packer/dist/pack-plugin-from-manifest.js');
var fs = require('fs');
var path = require('path');
var NodeRSA = require('node-rsa');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(
          n,
          k,
          d.get
            ? d
            : {
                enumerable: true,
                get: function () {
                  return e[k];
                },
              }
        );
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/ _interopNamespaceDefault(fs);
var path__namespace = /*#__PURE__*/ _interopNamespaceDefault(path);

function kintonePlugin(options = {}) {
  const manifestJSONPath = options?.manifestJSONPath ?? './manifest.json';
  const privateKeyPath = options?.privateKeyPath ?? './private.ppk';
  const pluginZipPath = options?.pluginZipPath ?? './dist/plugin.zip';
  let privateKey;
  return {
    name: 'kintone-plugin',
    options() {
      if (!fs__namespace.existsSync(manifestJSONPath)) {
        throw new Error(`manifestJSONPath cannot found: ${manifestJSONPath}`);
      }
      if (!fs__namespace.existsSync(privateKeyPath)) {
        console.debug('generating a new key');
        const key = new NodeRSA({ b: 1024 });
        fs__namespace.writeFileSync(privateKeyPath, key.exportKey('pkcs1-private'));
      }
      privateKey = fs__namespace.readFileSync(privateKeyPath, 'utf-8');
    },
    async buildEnd() {
      const result = await packPluginFromManifest_js.packPluginFromManifest(manifestJSONPath, privateKey);
      const zipPath =
        typeof pluginZipPath == 'function'
          ? pluginZipPath(result.id, JSON.parse(fs__namespace.readFileSync(manifestJSONPath, 'utf-8')))
          : pluginZipPath;
      const zipDir = path__namespace.dirname(zipPath);
      if (!fs__namespace.existsSync(zipDir)) {
        fs__namespace.mkdirSync(zipDir, { recursive: true });
      }
      fs__namespace.writeFileSync(zipPath, result.plugin);
      console.log('----------------------');
      console.log('Success to create a plugin zip!');
      console.log(`Plugin ID: ${result.id}`);
      console.log(`Path: ${zipPath}`);
      console.log('----------------------');
    },
  };
}

module.exports = kintonePlugin;
