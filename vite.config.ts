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
      //配置跨域
      '/fdc-prod': {
        target: 'http://127.0.0.1:62000/',
        changeOrigin: true, //允许跨域
        timeout: 40000,
        rewrite: (path) => path.replace(/^\/fdc-prod/, ''),
      },
      '/fdc': {
        target: 'http://127.0.0.1:15318/',
        changeOrigin: true, //允许跨域
        timeout: 40000,
        rewrite: (path) => path.replace(/^\/fdc/, ''),
      },
      '/api/v1/samples': {
        target: 'http://127.0.0.1:18089/',
        changeOrigin: true, //允许跨域
        timeout: 40000,
      },
      '/api/v1/tests': {
        target: 'http://127.0.0.1:12291/',
        changeOrigin: true, //允许跨域
        timeout: 40000,
      },

      '/bdc': {
        target: 'http://127.0.0.1:21386/',
        changeOrigin: true, //允许跨域
        timeout: 40000,
        rewrite: (path) => path.replace(/^\/bdc/, ''),
      },
      '/valid': {
        target: 'http://127.0.0.1:15320/',
        changeOrigin: true, //允许跨域
        timeout: 40000,
      },
    },
  },
});
