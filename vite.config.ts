import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import copy from 'rollup-plugin-copy';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    copy({
      targets: [
        { src: 'node_modules/pdfjs-dist/cmaps', dest: 'dist/static' }, //执行拷贝
      ],
      hook: 'writeBundle',
    }),
  ],
  build: {
    sourcemap: false,
    minify: 'esbuild',
    assetsDir: 'static',
    rollupOptions: {
      output: {
        manualChunks: {
          // 拆分代码
          'vue': ['vue', 'vue-router'], // 如果打包有BUG请屏蔽
          'element-plus': ['element-plus'],
        },
      },
    },
  },
  resolve: {
    alias: [
      //路径替换
      { find: '/static/cmaps', replacement: '/node_modules/pdfjs-dist/cmaps' },
      //文件映射替换
      { find: 'common', replacement: path.resolve(__dirname, 'src/common') },
      {
        find: 'components',
        replacement: path.resolve(__dirname, 'src/components'),
      },
    ],
  },
  server: {
    host: '127.0.0.1',
    port: 15437,
    https: false,
    hmr: true,
    proxy: {
      '/fdc': {
        target: 'http://10.200.125.202:15318/',
        changeOrigin: true, //允许跨域
        timeout: 40000,
        rewrite: (path) => path.replace(/^\/fdc/, ''),
      },
    },
  },
});
