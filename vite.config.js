import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 核心配置：base = /你的仓库名/（必须和Gitee仓库名一致）
  base: '/jike-helper-front/'
})
