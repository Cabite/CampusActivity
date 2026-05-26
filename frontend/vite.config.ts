import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import { fileURLToPath, URL } from 'node:url'


export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock',
      enable: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/auth': 'http://127.0.0.1:5000',
      '/user': 'http://127.0.0.1:5000',
      '/organizer': 'http://127.0.0.1:5000',
      '/categories': 'http://127.0.0.1:5000',
      '/activities': 'http://127.0.0.1:5000',
      //'/checkin': 'http://127.0.0.1:5000',
      '/notifications': 'http://127.0.0.1:5000',
      '/announcements': 'http://127.0.0.1:5000',
      '/admin': 'http://127.0.0.1:5000',
      //'/statistics': 'http://127.0.0.1:5000',
      '/leaderboard': 'http://127.0.0.1:5000',
      // 其他需要代理的后端路由
    }
  }
})