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
        apps: resolve(__dirname, 'apechain.html'),
        deploy: resolve(__dirname, 'deploy.html'),
        build: resolve(__dirname, 'build.html'),
        about: resolve(__dirname, 'about.html'),
        d20: resolve(__dirname, 'd20.html'),
        galacticCore: resolve(__dirname, 'demos/galactic-core.html'),
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
