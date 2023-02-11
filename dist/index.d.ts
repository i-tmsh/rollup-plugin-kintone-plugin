import { Plugin } from 'rollup';
interface Option {
    manifestJSONPath: string;
    privateKeyPath: string;
    pluginZipPath: string | PluginZipPathFunction;
}
type PluginZipPathFunction = (id: string, manifest: {
    [key: string]: any;
}) => string;
export default function kintonePlugin(options?: Partial<Option>): Plugin;
export {};
//# sourceMappingURL=index.d.ts.map