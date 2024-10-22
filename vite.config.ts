import { defineConfig, Plugin } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { resolve} from 'path';
import { vitePluginTypescriptTransform } from 'vite-plugin-typescript-transform';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { nodeExternals } from 'rollup-plugin-node-externals'
import { node } from '@liuli-util/vite-plugin-node'

function externals(): Plugin {
  return {
    ...nodeExternals(),
    name: 'node-externals',
    enforce: 'pre', // 关键是要在 vite 默认的依赖解析插件之前运行
    apply: 'build',
  }
}

export default defineConfig({
  plugins: [
    externals()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    // 修改解析方式默认为 node 而非 browser
    mainFields: ['module', 'jsnext:main', 'jsnext'],
    conditions: ['node'],
  },
  build: {
    outDir: 'bin',// 如果你不需要压缩代码，可以设为 false
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['cjs'],
      fileName: () => {
        return  `ty.min.cjs`
      },
    },
    minify: 'terser',
    rollupOptions: {
      // 确保外部化处理那些
      // 你不想打包进库的依赖
      external: ['tinify']
    }
  },
})
