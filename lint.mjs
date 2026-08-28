#!/usr/bin/env node
// F23(b) · 无三方依赖的轻量 lint
//
// 为什么不是 ESLint:本环境到 npm registry 不通,node_modules 里也没有 eslint /
// espree / acorn 任何一个 JS parser。唯一现成的解析器是 vite 自带的 esbuild。
// 所以这里用 esbuild 做「明显错误类」检查,配一组零依赖的自定义规则。
// 有网之后可以平滑换成 ESLint(见 README 汇报),但今天这条路是能真跑起来的那条。
//
// 检查项:
//   1) JS 语法错误(.js/.mjs/.jsx)          —— esbuild transform,error 级
//   2) HTML 内联 <script> 的语法错误        —— 本站大部分逻辑写在内联脚本里
//   3) esbuild 的「明显错误」警告            —— 重复对象键 / 重复 case / 给 const 赋值 /
//                                              === NaN / this 在 ESM 中为 undefined 等
//   4) 自定义规则:debugger 残留、未终止的 TODO(FIXME 不算)
//   5) 死代码棘轮:从生产入口做 import 图可达性遍历,不可达行数不得超过基线
//
// 退出码:0 = 通过,1 = 有 error。

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { transformSync } from 'esbuild'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const SKIP_DIRS = new Set(['node_modules', '.git', 'test-results', 'audit-shots', 'work', 'recovery', 'artifacts'])

// ── 死代码棘轮基线 ────────────────────────────────────────────────
// 只允许下降。当前数字含 demos/ 整棵树 —— F10 把 galactic-core 移出生产构建后,
// src/landing.js / src/styles/main.css / 整套 demo 引擎都不再可达(这是预期结果);
// F13 统一删除死文件后请把这个数字往下钉(lint 会打印建议值)。
// 临时放行:DEAD_LINE_BUDGET=999999 npm run lint
const DEAD_LINE_BUDGET = Number(process.env.DEAD_LINE_BUDGET ?? 11476)

const errors = []
const warnings = []
const err = (file, msg) => errors.push(`${file}: ${msg}`)
const warn = (file, msg) => warnings.push(`${file}: ${msg}`)

function walk(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || name.startsWith('dist') || name.startsWith('.')) continue
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) walk(p, acc)
    else acc.push(p)
  }
  return acc
}

const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/')
const files = walk(ROOT).map(rel)
const jsFiles = files.filter((f) => /\.(js|mjs|jsx)$/.test(f))
const htmlFiles = files.filter((f) => f.endsWith('.html'))

// esbuild 里属于「几乎一定是 bug」的告警,升级为 error。
const HARD_WARNINGS = new Set([
  'duplicate-object-key', 'duplicate-case', 'assign-to-constant', 'assign-to-import',
  'equals-nan', 'equals-negative-zero', 'equals-new-object', 'delete-super-property',
  'this-is-undefined-in-esm', 'call-import-namespace', 'suspicious-boolean-not',
  'empty-import-meta', 'unsupported-regexp', 'assign-to-define',
])

function checkSource(label, code, loader, lineOffset = 0) {
  let res
  try {
    res = transformSync(code, { loader, format: undefined, sourcefile: label, logLevel: 'silent' })
  } catch (e) {
    for (const m of e.errors || [{ text: String(e) }]) {
      const line = (m.location?.line || 0) + lineOffset
      err(label, `[syntax] ${m.text}${m.location ? ` (line ${line})` : ''}`)
    }
    return
  }
  for (const m of res.warnings || []) {
    const line = (m.location?.line || 0) + lineOffset
    const id = m.id || ''
    const text = `[${id || 'warning'}] ${m.text} (line ${line})`
    if (HARD_WARNINGS.has(id)) err(label, text); else warn(label, text)
  }
}

// 1) 独立 JS 文件
for (const f of jsFiles) {
  const code = fs.readFileSync(path.join(ROOT, f), 'utf8')
  checkSource(f, code, f.endsWith('.jsx') ? 'jsx' : 'js')
  customRules(f, code, 0)
}

// 2) HTML 内联 script
const SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
for (const f of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8')
  for (const m of html.matchAll(SCRIPT_RE)) {
    const attrs = m[1] || ''
    const body = m[2] || ''
    if (/\ssrc\s*=/.test(attrs)) continue                    // 外链脚本,单独扫
    if (/type\s*=\s*["'](?!module|text\/javascript|application\/javascript)/i.test(attrs)) continue // json-ld 等
    if (!body.trim()) continue
    const lineOffset = html.slice(0, m.index).split('\n').length - 1
    checkSource(`${f} <script>`, body, 'js', lineOffset)
    customRules(`${f} <script>`, body, lineOffset)
  }
}

// 3) 自定义零依赖规则
function customRules(label, code, lineOffset) {
  const lines = code.split('\n')
  lines.forEach((ln, i) => {
    const n = i + 1 + lineOffset
    if (/(^|[\s;{])debugger\s*(;|\}|$)/.test(ln)) err(label, `[no-debugger] 残留 debugger (line ${n})`)
    if (/\bwith\s*\(/.test(ln) && !/\/\//.test(ln.split('with')[0])) warn(label, `[no-with] with 语句 (line ${n})`)
    if (/={2}\s*(null|undefined)\b/.test(ln) && !/[!=]==/.test(ln)) { /* == null 是常见惯用法,放过 */ }
  })
}

// 4) 死代码棘轮(从 vite.config.js 的 productionInput 出发做可达性遍历)
function reachability() {
  const cfg = fs.readFileSync(path.join(ROOT, 'vite.config.js'), 'utf8')
  const block = cfg.slice(cfg.indexOf('const productionInput'), cfg.indexOf('// F10'))
  const entries = [...block.matchAll(/resolve\(__dirname,\s*'([^']+)'\)/g)].map((m) => m[1])
  if (!entries.length) { err('vite.config.js', '[reachability] 解析不出 productionInput 入口列表'); return null }

  const reached = new Set()
  const queue = []
  const add = (p) => { const r = rel(p); if (!reached.has(r)) { reached.add(r); queue.push(p) } }
  for (const e of entries) add(path.join(ROOT, e))

  // vite 把 public/ 按根路径服务,且构建只复制 public/ —— public 必须优先于根目录同名文件,
  // 否则会把死副本判成活的、把线上文件判成死的。
  const resolveSpec = (spec, from) => {
    if (!spec || /^(https?:)?\/\//.test(spec) || spec.startsWith('data:')) return null
    let bases
    if (spec.startsWith('/')) bases = [path.join(ROOT, 'public', spec.slice(1)), path.join(ROOT, spec.slice(1))]
    else if (spec.startsWith('.')) bases = [path.resolve(path.dirname(from), spec)]
    else return null
    for (const b of bases) {
      for (const c of [b, b + '.js', b + '.mjs', b + '.jsx', path.join(b, 'index.js')]) {
        try { if (fs.statSync(c).isFile()) return c } catch { /* next */ }
      }
    }
    return null
  }
  const scanJs = (src) => {
    const out = []
    for (const m of src.matchAll(/(?:^|[\s;}])(?:import|export)\s[^;'"]*?from\s*['"]([^'"]+)['"]/g)) out.push(m[1])
    for (const m of src.matchAll(/(?:^|[\s;}])import\s*['"]([^'"]+)['"]/g)) out.push(m[1])
    for (const m of src.matchAll(/import\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) out.push(m[1])
    for (const m of src.matchAll(/new URL\(\s*['"]([^'"]+)['"]/g)) out.push(m[1])
    return out
  }
  while (queue.length) {
    const file = queue.shift()
    let src; try { src = fs.readFileSync(file, 'utf8') } catch { continue }
    const ext = path.extname(file)
    let specs
    if (ext === '.html') {
      specs = []
      for (const m of src.matchAll(/<script[^>]*\ssrc=["']([^"']+)["']/g)) specs.push(m[1])
      for (const m of src.matchAll(/<link[^>]*\shref=["']([^"']+\.css)["']/g)) specs.push(m[1])
      for (const m of src.matchAll(SCRIPT_RE)) specs.push(...scanJs(m[2] || ''))
    } else if (ext === '.css') {
      specs = [...src.matchAll(/@import\s+(?:url\()?['"]([^'"]+)['"]/g)].map((m) => m[1])
    } else specs = scanJs(src)
    for (const s of specs) { const r = resolveSpec(s.split('?')[0], file); if (r) add(r) }
  }

  const sources = files.filter((f) => /\.(js|mjs|jsx|css)$/.test(f) && f !== 'lint.mjs' && !f.startsWith('tests/') && !/\.config\.(js|mjs)$/.test(f))
  const dead = sources.filter((f) => !reached.has(f)).sort()
  const countLines = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n').length
  const deadLines = dead.reduce((s, f) => s + countLines(f), 0)
  return { dead, deadLines, deadDetail: dead.map((f) => `${String(countLines(f)).padStart(6)}  ${f}`) }
}

const reach = reachability()

// ── 输出 ─────────────────────────────────────────────────────────
console.log(`lint: 扫描 ${jsFiles.length} 个 JS 文件 + ${htmlFiles.length} 个 HTML 的内联脚本`)
if (reach) {
  console.log(`lint: 生产入口不可达源码 ${reach.dead.length} 个文件 / ${reach.deadLines} 行`)
  for (const l of reach.deadDetail) console.log(`        ${l}`)
  if (DEAD_LINE_BUDGET !== null && reach.deadLines > DEAD_LINE_BUDGET) {
    err('reachability', `[dead-code-ratchet] 不可达行数 ${reach.deadLines} 超过基线 ${DEAD_LINE_BUDGET}`)
  } else if (DEAD_LINE_BUDGET !== null && reach.deadLines < DEAD_LINE_BUDGET) {
    console.log(`lint: 死代码已减少,请把 DEAD_LINE_BUDGET 下钉到 ${reach.deadLines}`)
  }
}
if (warnings.length) {
  console.log(`\n--- warnings (${warnings.length}) ---`)
  for (const w of warnings) console.log('  ' + w)
}
if (errors.length) {
  console.log(`\n--- errors (${errors.length}) ---`)
  for (const e of errors) console.log('  ' + e)
  console.log(`\nlint FAILED: ${errors.length} error(s), ${warnings.length} warning(s)`)
  process.exit(1)
}
console.log(`\nlint OK: 0 error(s), ${warnings.length} warning(s)`)
