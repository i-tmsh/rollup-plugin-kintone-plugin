import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import prettier from 'rollup-plugin-prettier';

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
    {
      file: 'dist/index.mjs',
      format: 'es',
    },
  ],
  plugins: [typescript(), prettier()],
});
