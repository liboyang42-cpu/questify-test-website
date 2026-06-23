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
        apechainHome: resolve(__dirname, 'apechain-home.html'),
        apechain: resolve(__dirname, 'apechain.html'),
        build: resolve(__dirname, 'build.html'),
        about: resolve(__dirname, 'about.html'),
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
