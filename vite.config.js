import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/jike-helper-front/' // 必须加！适配 GitHub Pages 路径
})