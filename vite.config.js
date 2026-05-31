import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ip: resolve(__dirname, 'ip.html'),
      },
    },
  },
  server: {
    allowedHosts: [
      'challenges-seas-despite-editor.trycloudflare.com',
      '.trycloudflare.com',
    ],
  },
})
