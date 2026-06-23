import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { execSync } from 'child_process'

// 构建版本号(M0-13):提交 SHA + 构建时间,注入各页 <meta> 便于线上定位版本
function buildVersion() {
  let sha = 'unknown'
  try { sha = execSync('git rev-parse --short HEAD').toString().trim() } catch (e) {}
  return `${sha} @ ${new Date().toISOString()}`
}

function injectBuildVersion() {
  const version = buildVersion()
  return {
    name: 'inject-build-version',
    transformIndexHtml(html) {
      return html.replace('</head>', `  <meta name="build-version" content="${version}" />\n</head>`)
    },
  }
}

export default defineConfig({
  plugins: [react(), injectBuildVersion()],
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
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
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
