// F23 · 冒烟测试公共设施:静态服务器 + 页面探针
// 本仓装的是 `playwright`(库)而不是 `@playwright/test`(runner),
// 所以用 Node 内置 test runner(node --test)驱动 playwright 库。
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readdirSync, statSync, existsSync } from 'node:fs'

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// 只允许 5186(任务约束)。可用 SMOKE_PORT 覆盖,默认 5186。
export const PORT = Number(process.env.SMOKE_PORT || 5186)
export const OUT_DIR = process.env.SMOKE_OUT_DIR || 'dist-f'
export const BASE_URL = process.env.SMOKE_BASE_URL || `http://127.0.0.1:${PORT}`

// 生产构建的 10 个入口页(与 vite.config.js 的 productionInput 一一对应)。
// demos/galactic-core.html 已按 F10 移出生产构建,故不在此列 —— 见 buildOutputPages()。
// SMOKE_PAGES=privacy,terms 可只跑子集(负控 meta-test 用它把耗时压到 ~10s)。
const PAGE_FILTER = (process.env.SMOKE_PAGES || '').split(',').map((x) => x.trim()).filter(Boolean)

const ALL_PAGES = [
  { name: 'index',       path: '/index.html' },
  { name: 'ip',          path: '/ip.html' },
  { name: 'apechain',    path: '/apechain.html' },
  { name: 'deploy',      path: '/deploy.html' },
  { name: 'build',       path: '/build.html' },
  { name: 'about',       path: '/about.html' },
  { name: 'd20',         path: '/d20.html' },
  { name: 'privacy',     path: '/privacy.html' },
  { name: 'terms',       path: '/terms.html' },
  { name: 'preset-life', path: '/preset-life.html' },
]

export const PAGES = PAGE_FILTER.length
  ? ALL_PAGES.filter((p) => PAGE_FILTER.includes(p.name))
  : ALL_PAGES

export const EXPECTED_BUILD_PAGES = ALL_PAGES.map((p) => p.path.replace(/^\//, '')).sort()

// ── 自检开关(负控)────────────────────────────────────────────────
// SMOKE_SELFTEST=console | pageerror | network | empty | all
// 向每个页面注入一个人为故障,用来证明这套断言真的会红。
// 见 tests/selftest.mjs:CI 里会跑一遍,要求它必须非零退出。
const SELFTEST = process.env.SMOKE_SELFTEST || ''
function selftestOn(kind) {
  return SELFTEST === 'all' || SELFTEST === kind
}

export function selftestScript() {
  if (!SELFTEST) return null
  const parts = []
  if (selftestOn('console')) parts.push(`console.error('[smoke-selftest] injected console error');`)
  if (selftestOn('pageerror')) parts.push(`setTimeout(function(){ throw new Error('[smoke-selftest] injected uncaught error') }, 0);`)
  if (selftestOn('network')) parts.push(`window.addEventListener('DOMContentLoaded', function(){ var s=document.createElement('script'); s.src='/__smoke_selftest_missing__.js'; document.head.appendChild(s) });`)
  if (selftestOn('empty')) parts.push(`window.addEventListener('DOMContentLoaded', function(){ document.body.replaceChildren() });`)
  if (!parts.length) throw new Error(`unknown SMOKE_SELFTEST value: ${SELFTEST}`)
  return parts.join('\n')
}

export function isSelftest() { return Boolean(SELFTEST) }

// ── Chromium 可执行文件定位 ───────────────────────────────────────
// 本环境 PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers 里装的是 chromium-1194,
// 而 playwright 1.59.1 默认找 chromium_headless_shell-1217 —— 版本对不上会直接
// launch 失败。这里在浏览器目录里就地找一个可用的 chrome 二进制;找不到就回落到
// playwright 默认解析(CI 上跑过 `playwright install` 的机器走这条)。
export function chromiumExecutable() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE) return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH
  if (!base || !existsSync(base)) return undefined
  const dirs = readdirSync(base)
    .filter((d) => d.startsWith('chromium'))
    // 优先完整 chromium,其次 headless shell;同名按 revision 倒序
    .sort((a, b) => (a.startsWith('chromium-') === b.startsWith('chromium-')
      ? b.localeCompare(a, 'en', { numeric: true })
      : (a.startsWith('chromium-') ? -1 : 1)))
  for (const d of dirs) {
    for (const rel of ['chrome-linux/chrome', 'chrome-linux/chrome-headless-shell',
      'chrome-linux64/chrome', 'chrome-headless-shell-linux64/chrome-headless-shell']) {
      const p = resolve(base, d, rel)
      if (existsSync(p)) return p
    }
  }
  return undefined
}

export async function launchChromium(chromium) {
  const executablePath = chromiumExecutable()
  return chromium.launch({ executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] })
}

// ── 静态服务器 ───────────────────────────────────────────────────
export async function startServer() {
  if (process.env.SMOKE_BASE_URL) return { close: async () => {} } // 外部已起好

  const child = spawn(
    process.execPath,
    [resolve(ROOT, 'node_modules/vite/bin/vite.js'), 'preview',
      '--outDir', OUT_DIR, '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
    { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] },
  )
  let log = ''
  child.stdout.on('data', (d) => { log += d })
  child.stderr.on('data', (d) => { log += d })

  const deadline = Date.now() + 30_000
  for (;;) {
    if (child.exitCode !== null) throw new Error(`vite preview exited early:\n${log}`)
    try {
      const r = await fetch(`${BASE_URL}/index.html`, { redirect: 'manual' })
      if (r.status < 500) break
    } catch { /* not up yet */ }
    if (Date.now() > deadline) throw new Error(`vite preview did not come up on ${BASE_URL}:\n${log}`)
    await new Promise((r) => setTimeout(r, 200))
  }
  return {
    close: async () => {
      child.kill('SIGTERM')
      await new Promise((r) => { child.once('exit', r); setTimeout(r, 3000) })
    },
  }
}

// ── 构建产物里的 html 列表 ────────────────────────────────────────
export function buildOutputPages() {
  const out = []
  const base = resolve(ROOT, OUT_DIR)
  const walk = (dir, prefix) => {
    for (const e of readdirSync(dir)) {
      const full = resolve(dir, e)
      if (statSync(full).isDirectory()) {
        if (e === 'assets') continue
        walk(full, `${prefix}${e}/`)
      } else if (e.endsWith('.html')) {
        out.push(`${prefix}${e}`)
      }
    }
  }
  walk(base, '')
  return out.sort()
}

// ── 单页探针 ─────────────────────────────────────────────────────
// 返回结构化观测结果,由测试文件负责断言(断言与采集分离,方便负控)。
export async function probe(browser, url) {
  const origin = new URL(url).origin
  const consoleErrors = []
  const pageErrors = []
  const networkFailures = []
  const thirdParty = new Set()

  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const inject = selftestScript()
  if (inject) await context.addInitScript({ content: inject })
  const page = await context.newPage()

  // 让 CI 与本地都不依赖外网:跨域请求一律本地打桩(可控、可重复)。
  // 同源请求原样放行 —— 同源 4xx/5xx 是真回归,必须红。
  await page.route('**/*', async (route) => {
    const reqUrl = route.request().url()
    if (reqUrl.startsWith(origin) || reqUrl.startsWith('data:') || reqUrl.startsWith('blob:')) {
      return route.continue()
    }
    thirdParty.add(new URL(reqUrl).host)
    const type = route.request().resourceType()
    if (type === 'image') {
      return route.fulfill({
        status: 200,
        contentType: 'image/gif',
        body: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      })
    }
    if (type === 'stylesheet') return route.fulfill({ status: 200, contentType: 'text/css', body: '' })
    if (type === 'script') return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' })
    if (type === 'font') return route.fulfill({ status: 200, contentType: 'font/woff2', body: '' })
    return route.fulfill({ status: 200, contentType: 'text/plain', body: '' })
  })

  page.on('console', (msg) => {
    if (msg.type() !== 'error') return
    const loc = msg.location()?.url || ''
    // 跨域资源已打桩,理论上不该出现;仍做一层来源过滤,避免第三方噪音掩盖真问题。
    if (loc && !loc.startsWith(origin) && !loc.startsWith('data:')) return
    consoleErrors.push(`${msg.text()}  @ ${loc || 'n/a'}`)
  })
  page.on('pageerror', (err) => pageErrors.push(String(err && err.stack ? err.stack.split('\n')[0] : err)))
  page.on('requestfailed', (req) => {
    if (!req.url().startsWith(origin)) return
    networkFailures.push(`FAILED ${req.url()} — ${req.failure()?.errorText || 'unknown'}`)
  })
  page.on('response', (res) => {
    if (!res.url().startsWith(origin)) return
    if (res.status() >= 400) networkFailures.push(`HTTP ${res.status()} ${res.url()}`)
  })

  let status = 0
  let navError = null
  try {
    const response = await page.goto(url, { waitUntil: 'load', timeout: 30_000 })
    status = response ? response.status() : 0
  } catch (e) {
    navError = String(e)
  }
  // 给延迟脚本 / rAF 动画一点时间,以便捕获「加载后才抛」的错误。
  await page.waitForTimeout(2000)

  const content = navError ? { text: '', elements: 0, title: '' } : await page.evaluate(() => ({
    text: (document.body?.innerText || '').replace(/\s+/g, ' ').trim(),
    elements: document.body ? document.body.querySelectorAll('*').length : 0,
    title: document.title || '',
  }))

  await context.close()
  return {
    url, status, navError, consoleErrors, pageErrors, networkFailures,
    thirdParty: [...thirdParty].sort(),
    text: content.text, textLength: content.text.length,
    elements: content.elements, title: content.title,
  }
}
