import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages repo pages base path
// 배포 URL: https://jang-uk-5362.github.io/news_human_evaluation/
export default defineConfig({
  base: '/news_human_evaluation/',
  plugins: [react()],
})
