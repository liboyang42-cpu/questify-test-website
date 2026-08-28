// F23 · 10 个生产入口页的冒烟套件
// 运行:  npm run build && npm run smoke
// 负控:  npm run smoke:selftest   (必须非零退出,证明这套断言会红)
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import {
  PAGES, BASE_URL, OUT_DIR, startServer, probe, buildOutputPages, isSelftest,
} from './helpers.mjs'

let server
let browser

before(async () => {
  server = await startServer()
  browser = await chromium.launch()
}, { timeout: 120_000 })

after(async () => {
  if (browser) await browser.close()
  if (server) await server.close()
})

// ── 构建产物本身的断言 ───────────────────────────────────────────
// 同时守住 F10:demos/galactic-core.html 若又混进生产构建,这条会红。
test(`${OUT_DIR} 恰好包含 10 个生产入口页`, () => {
  const expected = PAGES.map((p) => p.path.replace(/^\//, '')).sort()
  const actual = buildOutputPages()
  assert.deepEqual(actual, expected,
    `构建产物页面集合与预期不符\n  实际: ${actual.join(', ')}\n  预期: ${expected.join(', ')}`)
})

// ── 每页 4 类断言 ────────────────────────────────────────────────
for (const p of PAGES) {
  test(`smoke: ${p.name} (${p.path})`, async (t) => {
    const r = await probe(browser, BASE_URL + p.path)

    assert.equal(r.navError, null, `导航失败: ${r.navError}`)
    // 1) HTTP 200
    assert.equal(r.status, 200, `期望 HTTP 200,实际 ${r.status}`)
    // 2) 渲染出非空内容
    assert.ok(r.elements >= 10, `DOM 节点过少(${r.elements}),页面疑似空白`)
    assert.ok(r.textLength >= 20,
      `可见文本过少(${r.textLength} 字符): ${JSON.stringify(r.text.slice(0, 120))}`)
    assert.ok(r.title.trim().length > 0, '页面没有 <title>')
    // 3) 控制台无 error 级日志 + 无未捕获异常
    assert.deepEqual(r.pageErrors, [], `存在未捕获异常:\n  ${r.pageErrors.join('\n  ')}`)
    assert.deepEqual(r.consoleErrors, [], `存在 console.error:\n  ${r.consoleErrors.join('\n  ')}`)
    // 4) 无失败的同源网络请求(跨域资源已打桩,见 helpers.mjs)
    assert.deepEqual(r.networkFailures, [], `存在失败的同源请求:\n  ${r.networkFailures.join('\n  ')}`)

    if (r.thirdParty.length) {
      t.diagnostic(`第三方外链域(已打桩,不参与断言): ${r.thirdParty.join(', ')}`)
    }
    if (isSelftest()) t.diagnostic('!! SMOKE_SELFTEST 已开启,这轮结果不代表站点健康 !!')
  }, { timeout: 90_000 })
}
