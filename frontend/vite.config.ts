import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    minify: false,
    sourcemap: true
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: 'all'
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: 'all'
  }
})
