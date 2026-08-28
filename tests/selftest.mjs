// F23 · 冒烟套件的负控(meta-test)
// 逐一注入 4 类人为故障,要求冒烟套件每次都 **必须失败**。
// 如果哪一类注入之后套件还是绿的,说明对应那条断言是摆设 —— 这里直接报错。
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const FAULTS = [
  ['console',   '注入 console.error'],
  ['pageerror', '注入未捕获异常'],
  ['network',   '注入同源 404 请求'],
  ['empty',     '清空 document.body'],
]

let bad = 0
for (const [kind, desc] of FAULTS) {
  const r = spawnSync(process.execPath, ['--test', 'tests/'], {
    cwd: ROOT,
    env: { ...process.env, SMOKE_SELFTEST: kind },
    encoding: 'utf8',
  })
  const failing = (r.stdout.match(/^# fail (\d+)$/m) || [])[1] || '?'
  if (r.status === 0) {
    console.error(`✗ 负控失效: ${kind} (${desc}) —— 注入故障后套件仍然是绿的`)
    bad++
  } else {
    console.log(`✓ 负控生效: ${kind} (${desc}) —— exit=${r.status}, 失败用例 ${failing} 个`)
  }
}
if (bad) {
  console.error(`\n${bad}/${FAULTS.length} 个负控失效,冒烟套件存在假绿断言。`)
  process.exit(1)
}
console.log(`\n全部 ${FAULTS.length} 个负控均生效:冒烟套件确实会红。`)
