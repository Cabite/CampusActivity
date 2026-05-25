import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import { fileURLToPath, URL } from 'node:url'

const apiProxy = {
  target: 'http://localhost:8000',
  changeOrigin: true,
}

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/auth': apiProxy,
      '/user': apiProxy,
      '/activities': apiProxy,
      '/categories': apiProxy,
      '/notifications': apiProxy,
      '/announcements': apiProxy,
      '/leaderboard': apiProxy,
    },
  },
})
