import { defineConfig } from 'vite'
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

// F23:生产构建入口 —— 冒烟测试断言构建产物恰好等于这 10 个页面。
// 新增/下线页面时改这里,tests/smoke.test.mjs 会随之校验。
const productionInput = {
  main: resolve(__dirname, 'index.html'),
  ip: resolve(__dirname, 'ip.html'),
  apps: resolve(__dirname, 'apechain.html'),
  deploy: resolve(__dirname, 'deploy.html'),
  build: resolve(__dirname, 'build.html'),
  about: resolve(__dirname, 'about.html'),
  d20: resolve(__dirname, 'd20.html'),
  privacy: resolve(__dirname, 'privacy.html'),
  terms: resolve(__dirname, 'terms.html'),
  presetLife: resolve(__dirname, 'preset-life.html'),
}

// F10:demos/galactic-core.html 是第三方模板页(全英文文案 + 42 处 motionsites.ai 外链
// + Google Fonts @import),不进生产构建。需要本地查看时用 `npm run build:demos`,
// 或直接 `npm run dev` 访问 /demos/galactic-core.html(dev server 不受 input 限制)。
const includeDemos = process.env.INCLUDE_DEMOS === '1'
const demoInput = { galacticCore: resolve(__dirname, 'demos/galactic-core.html') }

export default defineConfig({
  plugins: [injectBuildVersion()],
  build: {
    rollupOptions: {
      input: includeDemos ? { ...productionInput, ...demoInput } : productionInput,
    },
  },
  server: {
    allowedHosts: [
      'challenges-seas-despite-editor.trycloudflare.com',
      '.trycloudflare.com',
    ],
  },
})
