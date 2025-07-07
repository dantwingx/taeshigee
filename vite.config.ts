import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: '0.0.0.0',
    open: false, // 브라우저 자동 열기 비활성화
    allowedHosts: ['healthcheck.railway.app', 'localhost', '.railway.app'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}) 