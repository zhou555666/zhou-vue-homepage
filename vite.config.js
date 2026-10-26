import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 部署到 GitHub Pages 时取消注释并填入你的仓库名（如 base: '/my-repo/'），
  // 前后都要带斜杠；本地开发无需设置。相关部署步骤见《部署到GitHub Pages》文档。
  base: '/zhou-vue-homepage/',
  // 实验五：本地开发时将前端 /api 请求代理到后端服务器（server/app.js，默认 3000 端口）
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
})
