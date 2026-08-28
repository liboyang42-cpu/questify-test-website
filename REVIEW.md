# 城瘾官网 · 全站审查档案

审查对象：`questify-test-website` @ `c36ba57`
范围：前端 / 后端接入 / 功能 / 流程 / 代码 / 页面 / 交互
规模：10 个构建入口页，23,846 行源码（不含 vendor 与 lockfile）
方法：静态阅读 + `npm run build` + Chromium（Playwright）逐页运行时验证

共 **39** 项发现，其中 **14** 项已实测复现（标 ✅），其余为源码分析结论（标 📖）。F01 已在非 localhost 主机上端到端复现。

> 第二轮补审：首轮遗漏了四块线上代码未逐行阅读（`ip-entry.js` 详情渲染 1,390 行、`src/games/d20/*` 1,485 行、`bloomEnvironment.js` 490 行、ScriptReader 尾部与其 CSS）。已补完，新增 F35–F39，其中 F35、F36 为 P1。

在线版（含实测输出与修复计划）：https://claude.ai/code/artifact/97d265a5-6842-4ad8-b3f5-350ff143c682

---

## 结论

> **本节是审查当时（`c36ba57`）的结论，已被后续修复覆盖。当前状态见下方「修复状态」。**

**（审查时）目前不具备正式上线条件。**

视觉与文案完成度相当高，但把整站当成一个转化漏斗来走，三条主路径全部断在中途：留资表单在生产域名下必然失败、应用列表点进详情页全部串号、首页 12 个分类入口全是死链。这些不是打磨问题，是功能问题。

**（现在）三条主路径均已打通并实测**：表单在非 localhost 下不再静默 404（未配置时显式停用并指向兜底联系方式）、详情页改用稳定 slug 寻址且查不到时显式报「未找到」、12 个分类入口指向与解析端同源的契约词表。**但仍不能上线** —— 卡在法务文本与 ICP 备案（F11），以及表单收集真实 PII 而隐私政策仍是占位稿。

另有两项属于「已经在跑的风险」：首页首屏 18.5MB，以及一个第三方模板 demo 页随生产构建一起发布。代码层面，约 48% 的源码（11,440 行）已无任何生产页面引用。

| 等级 | 数量 |
|---|---|
| P0 阻断上线 | 3 |
| P1 功能流程 | 7 |
| P2 合规内容 | 4 |
| P3 代码质量 | 14 |
| P4 交互无障碍 | 11 |

---

## 修复状态（2026-08-28 更新）

39 项发现已全部处理：**37 项修复完成并实测**，2 项因缺外部输入而只能做到「代码侧就位 + 如实标注」。
修复由 6 条并行流按文件归属切分完成，每条都附实测证据；本节只记状态与需要人决策的部分。

| 等级 | 编号 | 状态 |
|---|---|---|
| **P0** | F01 | ✅ 代码侧完成 · ⚠️ 待填真实联系方式与 API base（见下） |
| | F02 F03 | ✅ 完成 |
| **P1** | F04 F05 F06 F07 F08 F35 | ✅ 完成 |
| | F36 | ✅ 「不下载」那半完成 · ⚠️ 重压缩需换环境（见下） |
| **P2** | F10 F12 | ✅ 完成 |
| | F09 | ✅ 代码侧完成（本地路径 + 占位兜底）· ⚠️ 待下载 9 张图并确认授权 |
| | F11 | ⚠️ **未修**：需法务提供正式文本，代码侧只做了内部标注与 noindex |
| **P3** | F13 F14 F15 F16 F17 F18 F19 F20 F21 F22 F23 F24 F37 F38 | ✅ 完成 |
| **P4** | F25 F26 F27 F28 F29 F30 F31 F32 F33 F34 F39 | ✅ 完成 |

### 本档案被实测推翻的三处结论

写档案时靠静态阅读得出的判断，动手修时被证据推翻，如实更正：

1. **F13「约 48% 源码（11,440 行）无生产引用」偏大一倍多。** 从 11 个构建入口做真实 import 图遍历，实测不可达 5,245 行，已删 5,188 行（余下是 `vite.config.js` 等工具链文件，本就不该判为死代码）。
2. **F15「9 个依赖完全未被使用」需限定范围。** `three` 删不得——d20 深度使用（含 `three/examples/jsm` 与 helvetiker 字体），首页统一版本后也在用；`gsap` 被 `about.html` 内联 import 使用。真正可删的是 React / Tailwind / TypeScript 那两条链，共 9 个，已删并同步 lockfile。
3. **F28「筛选器可聚焦但键盘不可用」低估了。** 复选框是 `display:none`，**根本聚焦不了**。已改成 clip 视觉隐藏保留可聚焦 + 监听 `change`。

另外 **F32** 的根因档案没写全：容器 CSS 是 `scroll-behavior:smooth`，浏览器会把 JS 每帧写入的 `scrollTop` 再平滑一次，取消 rAF 拦不住（实测动画已写到 900、实际仍在 1317 滑动）。

### 现在有防回归门禁了（F23）

此前无 CI、无测试、无 lint。现在：10 个入口页冒烟 + 1 条产物断言（共 11 条），断言覆盖 HTTP 200 / DOM 与文本下限 / 无 `console.error` / 无未捕获异常 / 无失败的同源请求；另有 lint（esbuild 解析，含 HTML 内联脚本）与死代码棘轮。

**冒烟套件带常驻负控**：注入 `console.error`、未捕获异常、同源 404、清空 body 四类故障，套件必须非零退出——谁把断言改成永远成立，CI 里那个 job 就会红。

### 仍需人提供的输入（代码侧已就位，等值填入）

| # | 待办 | 位置 |
|---|---|---|
| 1 | 对外邮箱 / 微信 / 电话 | `about.html` 的 `TODO-CONTACT-EMAIL` 等三个占位符 |
| 2 | 生产 `VITE_LEADS_API_BASE` 的值与配置位置 | 未配置时表单**有意**停用并指向兜底联系方式，不再静默 404 |
| 3 | 隐私政策与服务条款正文、运营主体全称与注册地址、个人信息保护负责人联系方式、生效日期 | `privacy.html` / `terms.html`；条款目前**完全缺失争议解决与管辖条款** |
| 4 | ICP 备案号 | `public/site-shell.js` 的 `data-cy-icp="placeholder"`，全站页脚共用 |
| 5 | 预制人生 9 张配图的下载与授权 | 清单见 `presetLifeData.js` 的 `IMAGE_TODO`；就位后从 `IMAGE_PENDING` 删掉文件名即自动生效 |
| 6 | 4 张 WebGL 贴图重压缩（9.72MB） | `galaxy.jpg` / `nasa-clouds-4096.jpg` / `nasa-blue-marble.jpg` / `nasa-night-lights-2012.jpg`；本环境无任何图片工具（cwebp / ImageMagick / Pillow 全无）且装不上，未做也未伪造数字。改文件名需同步 `src/bloomEnvironment.js` 的四行路径 |

在 3 与 4 落地前，两个法律页的 `noindex` 与内部警示框应保留。**表单收集的是真实 PII，而它同意项链到的隐私政策仍是占位稿——这个风险只能标注，消不掉。**

### 修复中新发现、不在原 39 项内

- 剧本阅读器的章节正文靠「点击场景切换展开」，而场景本身不可聚焦，键盘用户只能跳章、展不开正文。
- 预制人生页 5 个视频位仍全部指向 `/videos/hero.mp4`（自托管，不涉隐私，属素材待补）。

---

## P0 · 阻断上线

### F01 ✅ 留资表单在生产域名下 100% 失败，且全站没有备用联系方式

`about.html:12` 的 `<meta name="cy-api-base" content="" />` 是空的。非 localhost 主机下 `API_BASE` 回落为空字符串，POST 变成同源请求 `/api/public/v1/leads`，静态托管返回 404/405，用户只看到「提交失败，请稍后重试」。

```js
// about.html:193 — 生产分支解析为空
var API_BASE=(meta&&meta.content.trim())||
  ((location.hostname==='localhost'||location.hostname==='127.0.0.1')
    ? 'http://localhost:1337' : '');   // ← 生产域名走这里
```

**端到端复现**（用同一份 `npm run build` 产物，在非 localhost 主机名下访问，即走生产分支）：

```
页面 hostname     = 127.0.0.2
解析出的 API_BASE = ""
实际请求          = POST http://127.0.0.2:4180/api/public/v1/leads → 404
用户看到的提示    = "提交失败,请稍后重试。"
```

仓库内没有 `api/` 目录、没有 `vercel.json`、没有任何 rewrite 配置，`vite.config.js` 也没有 proxy——本 PR 的 Vercel 预览部署是纯静态站，该端点在真实部署上同样 404。也就是说这不是一个「等域名确定后再填」的待办，而是**当前每一次部署都在生效的故障**。

加重问题的是：「联系我们」页除表单外没有邮箱、微信、电话中的任何一项。表单一失败，全站归零可触达。

**修复** API base 改为构建期变量（`import.meta.env` + `vite.config.js` 注入，与已有 build-version 插件同一套路）；页面上无条件放一个静态兜底联系方式。

### F02 ✅ 应用列表点进详情页，24 张卡片全部打开错误内容

三份互不相同的目录被同一个 `?id=` 下标串在一起：`apechain.html` 的 `APPS` 有 25 条（含 d20），`deploy.html` 自带的 `APPS` 有 24 条（无 d20），而 `deploy.html:592` 又**优先**读 `content.js` 里 16 条「主题活动」。三者语义完全不同。

```
实测：
"AI导游伴侣"  → deploy.html?id=0 → 上海夜行侦探局 / 侦探路线
"AI故事引擎"  → deploy.html?id=1 → 南京路城市寻踪 / Citywalk
"AR扫描引擎"  → deploy.html?id=2 → 书店线索局    / 门店任务
```

第二层错误：`apechain.html:796` 写 href 用的 `i` 是**筛选排序之后的数组下标**，不是稳定 id，同一张卡在不同筛选状态下指向不同 `id`。越界或 `NaN` 无兜底，页面静默保留硬编码占位文案「LBS任务链引擎」。

**修复** 每条数据一个稳定 slug（`?app=ar-scan`），三处目录合并为一份共享数据源，补「未找到」状态。

### F03 ✅ 首页首屏传输 18.5MB

27 个请求约 18.5MB。字体 2.8MB（三个字重各 ~0.93MB 中文子集，无 `unicode-range` 分片），其余是 16 张未压缩 JPG，单张最大 1.4MB，无 WebP/AVIF、无 `srcset`。

其中 6 张被**下载了两次**：3D 卡片环用 `new Image()` 且设了 `img.crossOrigin='anonymous'`（`index.html:2669`），CORS 请求与页面 `<img>` 的普通请求缓存键不同，同一 URL 拉两遍，多出约 5MB。图片是同源的，这个属性没有必要。

叠加 `/assets/vendor/three.r128.min.js` 590KB 同步阻塞加载。面向上海移动端用户，这个首屏在 4G 下是数十秒级。

**修复** 去掉 `crossOrigin`；图片转 WebP + 响应式尺寸（3D 贴图只需 1024px 宽）；字体按 `unicode-range` 分片；three.js 改 `defer` 或动态 import。

---

## P1 · 功能与流程缺陷

### F04 ✅ 首页 12 个分类入口全部是死链
首页 Discover 区 12 个 `./apechain.html?f=gaming` 一类链接，但 `apechain.html` 从未读取 `location.search`。且 slug 是英文（gaming/finance/social/collectibles/infrastructure/intellectual-property），页面分类是中文（游戏/剧情插件/交互插件/AI插件/成就激励），两套词表一个都对不上。实测 `?f=gaming` → 25 张卡片全显示，激活筛选项仍是「全部」。
**修复** 统一 slug 词表并解析 `?f=`；筛选状态写回 URL。

### F05 ✅ IP 页在移动端完全没有导航
三重叠加：`ip-entry.js:483` 在 ≤640px 把 `.topbar-nav` 设为 `display:none`；同 topbar 的 `.menu` 汉堡按钮**没有任何 JS 监听**；`ip.html` 又不引共享站壳，也没有页脚导航。IP 是四个一级导航之一，手机用户唯一出口是左上角 logo。
**修复** ip.html 接入 `site-shell.js`，删掉重复且失效的 topbar。

### F06 ✅ 改筛选或排序会静默清空搜索结果，输入框仍显示关键词
搜索靠 `card.style.display='none'`，而 `renderGrid()` 整体重写 `grid.innerHTML`，内联样式随之丢失。实测：输入 "d20" → 1 张；切换排序 → 25 张，输入框仍是 "d20"。另：搜索只匹配 `.AppCard-name`，不含描述和分类，且无空结果提示。
**修复** 搜索词并入 `renderGrid()` 过滤条件，与筛选排序共用一条数据管线。

### F07 ✅ 所有页内锚点都落在固定顶栏下面
共享顶栏 `position:fixed; height:64px`，全仓没有一处 `scroll-margin-top` / `scroll-padding-top`。实测 `#merchant` top = -3px，`#contact` top = 0px。受影响的正是主转化路径（构建页两个 CTA、首页 6 张卡片）。
**修复** 全局 `:target{scroll-margin-top:88px}` 或对 `html` 设 `scroll-padding-top`。

### F08 ✅ 10 个页面里有 3 个脱离共享站壳
`ip.html`、`deploy.html`、`preset-life.html` 都不引 `site-shell.js/css`：没有统一导航、页脚、法律链接与 ICP 位，也拿不到站壳里的全局 `prefers-reduced-motion` 规则。而 `site-shell.js` 文件头写着「单一事实源」，IP 页却自己手写了一份重复 topbar。
**修复** 三页统一接入站壳。

### F35 ✅ IP 详情页滚到 84% 处会锁死滚动并强制跳转到另一个项目

`ip-entry.js:2361` 的 `startNextHandoff()` 一旦触发就不可取消：给 `body` 加 `handoff-lock` 锁住滚动 → 播 980ms 动画 → `window.location.href` 跳到下一个项目页。触发条件很松：`.next-scroll` 进入视口 42% 处，或 IntersectionObserver 的 0.34 阈值，或接近文档底部——任一满足即可。

```
实测（/ip.html?project=geisai，文档高 6663px）：
第 14 次滚轮，scrollY=5600（约 84%）→ handoff-lock 触发，滚动被锁
锁定后向上滚 2000px → scrollY 仍是 5600，纹丝不动
2.5 秒后 URL 自动变为 /ip.html?project=forging
```

读者只是正常往下读，就被冻住并甩到另一篇文章上，没有任何取消方式。而且这会连锁：geisai → forging → airforce → geisai 构成一个三页循环，出口只有浏览器后退或左上角 logo。

**与 F08 叠加后更糟**：`ip.html` 没有页脚，用户想找隐私政策或联系方式时的自然动作正是滚到底——而滚到底恰好会把他劫走。结果是 IP 板块里根本触达不到法律页和联系页。

违反 WCAG 3.2.5（Change on Request）：未经用户请求的自动跳转。

**修复** 把自动跳转改成一个显式的「下一个项目 →」链接。若要保留过场动画，也必须允许向上滚动取消，且不锁 `body`。

### F36 ✅ 「联系我们」页 11.09MB，其中 9.5MB 是纯装饰贴图

`about.html` 唯一的业务目标是让人填完表单，但它的首屏是：

```
实测 /about.html：11.09MB / 7 个请求
  galaxy.jpg                    3,907KB
  nasa-clouds-4096.jpg          2,970KB
  nasa-blue-marble.jpg          1,840KB
  nasa-night-lights-2012.jpg      775KB   ← 以上 4 张共 9.5MB，全部服务于背景那颗地球
  HarmonyOS 两个字重             1,863KB
```

`bloomEnvironment.js:285-288` 无条件加载这四张 NASA 贴图。转化页比首页之外的任何页面都更不该有这种重量——用户在这里的耐心最短。

另外 `about.html` 只调了 `env?.resume()`，全页没有 `pause`/`destroy` 调用：这颗地球的 WebGL 绘制循环在标签页切到后台时照跑不误（`bloomEnvironment.js` 本身是提供了 `pause`/`destroy` 的，只是没人调）。

**修复** 贴图降到实际渲染尺寸并转 WebP（4096px 的云图在一颗直径不到 600px 的球上纯属浪费）；用 IntersectionObserver + `visibilitychange` 调用已有的 `pause()`；考虑把地球改为滚动到视口后再懒加载，让表单先可用。

---

## P2 · 内容、合规与第三方依赖

### F09 ✅ 预制人生页的 9 张配图从 images.unsplash.com 外链
`presetLifeData.js` 里 9 张章节图全部指向 Unsplash，与全站「自托管字体」策略矛盾。风险：境内访问不稳定（本次沙箱内 9 个请求全部失败，页面视觉直接空掉）、访客 IP 泄露给第三方、图片授权未落到自己手上。同页 5 个视频位全部指向同一个 `/videos/hero.mp4` 占位文件。
**修复** 下载并自托管，或换成自有素材。

### F10 📖 第三方模板 demo 页随生产构建一起发布
`demos/galactic-core.html` 是 `vite.config.js` 的正式构建入口，会以真实 URL 发布到生产域名。该页装载全英文的 "Galactic Core / ASME" 模板文案；通过 `src/landing.js` 引用 **42 处** `https://motionsites.ai/assets/hero-*.gif`；并 `@import` Google Fonts（境内阻塞渲染）。`robots.txt` 的 `Disallow: /demos/` 只阻止抓取，不阻止访问。
**修复** 从 `rollupOptions.input` 移除；随之 `src/styles/main.css`(3,688 行) 与整套引擎代码可一并下线。

### F11 📖 在收集真实个人信息，但隐私政策自称「不构成正式法律声明」
表单同意项链接到 `/privacy.html`，该页正文写着「本页为占位框架……不构成正式法律声明」，且带 `noindex`。表单收集姓名、手机/微信/邮箱、需求描述——真实 PII。同线上：共享页脚硬编码「ICP 备案信息待补」，境内正式站点这是硬性要求；版权也写死「© 2026 城瘾」。
**修复** 上线前落地正式法律文本与 ICP 备案号；在此之前要么关掉表单，要么不声称已获合规同意。

### F12 ✅ 应用目录 25 条里 24 条是占位图
只有 d20 有真实图和可用链接，其余 24 条全部使用 `/assets/placeholder-app.svg` 且无 `link` 字段（因而全部落到 F02 的串号路径上）。
**修复** 补齐素材，或把未上线项显式标为「即将上线」并去掉可点击态（IP 页 `.is-soon` 卡片已有现成做法）。

---

## P3 · 代码与工程质量

### F13 ✅ 约 48% 的源码没有任何生产页面引用

```
23,846 行源码中：

严格无引用            5,131 行
  content.js            677  与 public/content.js 逐字节相同
  ip.css              2,568
  ip.js                 873  ← motionsites.ai 外链在这里
  src/vexAtmosphere.js  564  仅被上面这个死文件引用
  jack-portfolio.jsx    437  唯一的 React 文件，不在构建入口
  src/ip.js              12

仅 demo 页可达        6,309 行
  src/styles/main.css 3,688 · src/landing.js 778 · src/particles 531
  src/core 503 · src/shaders 398 · src/systems 223 · 其余 188
```

`ip.js` / `ip.css` 这组命名尤其危险：与真正在用的 `src/ip-entry.js`、`src/styles/ip-detail.css` 极易混淆，改错文件不会有任何报错。

### F14 ✅ 仓库里有两份不同版本的 Three.js
首页同步加载 `public/assets/vendor/three.r128.min.js`（590KB，r128）；d20 页从 npm 打包 `three@0.184`，产出 `DiceGame-*.js` **630KB**（gzip 170KB），构建时 Vite 已告警。两条独立升级线。

### F15 ✅ 9 个依赖完全未被使用
`react`、`react-dom`、`framer-motion`、`lucide-react`、`@vitejs/plugin-react`、`tailwindcss`、`postcss`、`autoprefixer`、`typescript` 均无引用点。无 tsconfig、无 tailwind/postcss 配置、无 `.ts` 文件，唯一的 `.jsx` 不在构建入口。`vite.config.js` 仍挂着 `react()` 插件。

### F16 ✅ 76 行顶栏滚动逻辑写了两份，操作的元素两个页面都不存在
`index.html:2302` 与 `apechain.html:564` 各有 38 行 `getElementById('mainHeader')` 逻辑。全仓 `mainHeader` 只出现在这两行 `getElementById` 里，元素不存在（顶栏由站壳注入，class 是 `.cy-header`），两处都在第一行 `return`。apechain 那份里还有一段够不到的 `.Header-nav button` 导航，其中两个分支只是 `console.log`。

### F17 📖 轮播的 monkey-patch 顺序颠倒
```js
// index.html:2411-2422
window.__updateCarousel = updateCarousel;      // ← 先导出（未打补丁）
var _origUpdateCarousel = updateCarousel;
updateCarousel = function(idx){ ... }          // ← 后打补丁
```
`window.__updateCarousel` 和 `window.__carouselCurrentIndex` 全仓只写不读，眼下无实际后果，但它们看起来像对外 API。

### F18 📖 3D 卡片环的吸附角度写死为 6 张卡
卡片按 `(i / CARD_COUNT) * 2π` 布置，吸附却按 `snapTarget = -idx * Math.PI / 3`（`index.html:2705`）固定 60°。两者只在 `appsData.length === 6` 时一致，数据加一条就错位且不报错。改为 `-idx * 2 * Math.PI / CARD_COUNT`。

### F19 📖 每次筛选都新建 IntersectionObserver 且从不断开
`apechain.html:844` 的 `observeCards()` 在每次 `renderGrid()` 末尾被调用，旧 observer 既不 `disconnect()` 也无引用可回收。用户每点一次筛选或排序就泄漏一个。

### F20 📖 动画主循环每帧强制重排，且从不暂停
`index.html:2718` 的 `animateHero()` 无条件 rAF，每帧：调 `updateHeroScrollState()`（2 次 `getBoundingClientRect()`，与已有 scroll 监听重复）；对 `starsMaterial` 设 `needsUpdate = true`；`ringGroup.traverse()` 遍历全部材质重设 `transparent`/`opacity`。后两项是 Three.js 已知反模式。循环在标签页隐藏、hero 滚出视口时都不停。同区域的 `updateScrollMotion()` 还对每个动效元素调 `getBoundingClientRect()`。

### F21 📖 模板字符串拼 innerHTML 全程不转义
`apechain.html:796`、`ip-entry.js` 多处、`ScriptReader.js:6` 都把数据直接插进 `innerHTML`，包括 `href="${app.link}"`、`alt="${app.title}"` 等属性位。当前数据全是硬编码常量，**不可利用**；但 F01 说明后端接入已在路上，一旦改接 CMS 就是存储型 XSS。`deploy.html:606` 已写了 `escapeHTML()`，做法是对的，只是没推广开。

### F22 ✅ 中文标题按码点排序，排序控件文案是英文
`a.title.localeCompare(b.title)` 未传 locale，中文按 Unicode 码点比较，对用户就是乱序。`apechain.html:658` 默认显示 "Alphabetical ASC" / "Alphabetical DESC"，出现在通篇中文的页面上。改 `localeCompare(b.title, 'zh-Hans-CN')`。

### F23 ✅ 没有 CI、没有测试、没有 lint
无 `.github/`，无任何 `*.test.*` / `*.spec.*`，无 ESLint 配置。`playwright` 装在 devDependencies 但没有一个测试文件。本次大量问题（F02/F04/F06/F07）一个最简 smoke 测试就能拦住。

### F24 ✅ 工具链版本声明与实际不符
`.nvmrc` 写 24，实际 Node 22.22；`packageManager` 写 `npm@11.12.1`，实际 npm 10.9.7（未启用 corepack，声明不生效）。

### F37 📖 IP 详情页的滚动处理有两处结构问题
`updateMotion()`（`ip-entry.js:2244`）对 `pageEl`、`cubeStage`、`mainCube`、`leftCube`、`rightCube`、`heroTitle`、`archiveCard`、`heroIndex`、`sideNav` 九个元素全部无空值保护，且在模块初始化时就直接调用一次。任一模板元素缺失即在每个滚动帧抛 TypeError。

更实际的问题是 `maybeStartHandoff()` **在 rAF 节流之外**：滚动监听里 `updateMotion` 被 `ticking` 保护，`maybeStartHandoff()` 却是每个 scroll 事件同步执行，内含一次 `getBoundingClientRect()` 加一次 `document.documentElement.scrollHeight` 读取——每个滚动事件两次强制重排。

另：`sideNav.style.transform` 用了 `clamp(1440 - y, 96, 990)`，三个魔数绑死在某个特定页高上，视口过高或过矮时侧栏位置就不对。

### F38 📖 装饰性 WebGL 全都不响应页面可见性
`about.html` 的地球、`index.html` 的星野与卡片环、`d20.html` 的骰子，三处 rAF 循环都没有 `visibilitychange` 处理，标签页切到后台仍持续绘制。三个模块里 `bloomEnvironment` 和 `DiceGame` 其实都实现了 `pause()`/`destroy()`，只是调用方从没用过——`src/app.js` 里的 `pagehide → scheduler.destroy()` 是对的写法，但那条路径只服务于已下线的 demo 页。

---

## P4 · 交互与无障碍

### F25 ✅ prefers-reduced-motion 只关掉了 CSS 动画，JS 动画全部照跑
`site-shell.css` 末尾的全局规则只作用于 `animation` 和 `transition`。rAF 和定时器驱动的动效不受影响：首页 3D 星野与卡片环、3 秒一次的 hero 轮播、IP 页 980ms 卡片旋转、阅读器 1.4s/1.7s 强制吸附滚动。实测 `reducedMotion:"reduce"` 下 rAF 循环仍在跑，hero 名称 3.6s 内自动从「上海夜行侦探局」变为「书店线索局」。大幅度自动运动正是前庭功能障碍用户需要规避的类型。
**修复** 各 JS 入口读一次 `matchMedia('(prefers-reduced-motion: reduce)')`。`about.html` 的 `gsap.matchMedia()` 写法可作范例。

### F26 ✅ 开场动画的 ESC 跳过会被任意一次按键弄失效
```js
// index.html:2996
window.addEventListener('keydown', function(event){
  if (event.key === 'Escape') closeIntro();
}, { once: true });          // ← 任何一个键都会消耗掉这个监听器
```
实测按 Tab 再按 ESC，遮罩不关闭——而遮罩上写着 "CLICK / ESC TO SKIP"。去掉 `{once:true}`，改在 `closeIntro()` 内 `removeEventListener`。

### F27 ✅ 首页没有 h1
实测 `index.html` 的 `h1` 数量为 0，`apechain.html`、`ip.html` 同样为 0。hero 大标题用的是 `<h2><span id="heroAppName">`。同时影响屏幕阅读器的结构导航和搜索引擎的主题判定。

### F28 📖 应用列表的筛选器键盘完全不可用
`apechain.html:747` 的委托监听第一行是 `if (e.target.tagName === 'INPUT') return;`，复选框上又没有 `change` 监听。键盘用户能聚焦、能看到勾选状态变化，但列表不会有任何反应。改为监听复选框的 `change` 事件。

### F29 📖 IP 首页在 window 上劫持滚轮和指针
```js
// ip-entry.js:970
window.addEventListener('wheel', event => {
  event.preventDefault();                    // ← 同时屏蔽 Ctrl+滚轮缩放
  animateTo(event.deltaY > 0 ? 1 : -1);
}, { passive: false });
```
IP 首页本身只有一屏高，不构成滚动陷阱；但 `preventDefault()` 会连带屏蔽浏览器缩放（WCAG 1.4.4）。同块还在 window 上挂了 `pointerdown/pointerup`：页面**任意位置**拖动超过 70px 就触发卡片旋转，包括在顶栏上划一下、或试图选中文字。

### F30 📖 IP 顶栏的汉堡按钮是可聚焦的空操作
`<button class="menu" aria-label="Menu">` 全文件只有 CSS 和这一行 HTML，没有任何监听。它进入 Tab 序列、被读作可用按钮、按下去什么也不发生（F05 的直接成因）。同顶栏 `aria-label` 中英混杂：`"Back to home"`、`"Menu"`，`setFace()` 又生成 `"Enter 侦探局"` 这样的半中半英标签，在 `lang="zh-CN"` 页面上会被中文语音引擎逐字母念出来。

### F31 📖 剧本阅读器缺焦点陷阱，背景未 inert
`ScriptReader.js` 的模态框做对了不少：`role="dialog"`、`aria-modal="true"`、ESC 关闭、关闭后焦点归还 `lastFocused`。缺的是焦点陷阱——Tab 能走出对话框；背景内容也没有 `inert` 或 `aria-hidden`，仍完整暴露在无障碍树里。对背景容器加 `inert` 一行可同时解决两个问题。

### F32 📖 阅读器的强制吸附滚动无法取消
停止滚动 2 秒后 `delaySnap()` 启动 **1400ms** 动画把视图拽到最近章节；从目录点章节则是 **1700ms**。期间用户唯一干预方式是继续滚动（然后 2 秒计时重新开始）。`updateOverlays()` 每帧调 `nearestSectionIndex()`，后者遍历所有章节读 `offsetTop`，逐帧强制重排。

### F33 📖 首页拖拽轮播只支持鼠标，键盘无法操作
`index.html:2767` 的 `SimpleSlider` 只有 mouse 和 touch 事件，无键盘入口也无左右按钮。`mouseleave` 直接中断拖拽，`mouseup` 只挂在轨道上，轨道外松手会留下卡住的拖拽状态。解析位移用 `parseFloat(transform.replace(/[^\d.-]/g,''))`：`translate3d(-123px, 0px, 0px)` 被压成 `"-123.00.0"`，靠 parseFloat 容错才碰巧得到 -123。IP 页的档案 rail（`ip-entry.js:71`）把同一交互做对了，可直接复用。

### F34 ✅ 两个页面对爬虫和无 JS 用户是空白的
`ip.html` 与 `preset-life.html` 的 `<body>` 里只有一个空 `<main>`，全部内容由 JS 注入。两页都配了完整 og:title / og:description，但正文零可爬内容。IP 是一级导航目标。另：`apechain.html` 搜索框无 label（实测 1 个无标签输入）；`deploy.html` 有 2 个只有 `title`、无可访问名的按钮/链接；搜索无结果时无空状态提示。

### F39 📖 d20 只能用鼠标点击，键盘玩不了
`DiceGame.js:114` 只在 `renderer.domElement` 上绑了 `click`。容器 `#dice` 是个 `<div>`，有 `aria-label` 但没有 `tabindex`、没有 `role="button"`、没有键盘监听。页面上写着 "CLICK TO ROLL"，键盘用户能 Tab 到的地方里没有一个能掷骰子。

顺带一提，`src/games/d20/` 是全仓工程质量最好的模块：`destroy()` 里完整做了 `cancelAnimationFrame`、`removeEventListener`，以及 geometry / material / texture / renderer 的逐项 `dispose()`。这套资源释放的写法值得推广到其他 WebGL 代码。

---

## 做得好的部分

这些不是客套——它们是上面那些修复可以直接照抄的现成范式。

- **IP 页的档案 rail**（`ip-entry.js:71-146`）是全仓最规范的交互模块：`tabindex` + `role` + 中文 `aria-label`、方向键、拖拽后吞掉误触点击、内容不溢出时自动隐藏控件。首页轮播应照它重写。
- **联系表单的状态处理很诚实**：`novalidate` + 自定义校验、`role="status" aria-live="polite"`、幂等键防重复提交、400/429/网络异常分别给不同文案，失败时明确告诉用户内容已保留。没有伪造成功。
- **字体别名方案很巧**：把 Bebas Neue / DM Sans / Inter 等原模板字族名全部 `@font-face` 重定向到自托管的 HarmonyOS Sans SC，零选择器改动完成去 CDN 化，且都带 `font-display:swap`。
- **WebGL 降级路径完整**：`webgl-check.js` 提供能力检测与静态兜底卡片，首页 3D 初始化前有检查，不支持时 hero 文案与 CTA 完整保留。
- **共享站壳的设计方向正确**：注入式 header/footer、按路径高亮 `aria-current`、移动端汉堡菜单带完整 `aria-expanded`。问题只是覆盖率（F08），不是设计。
- **注释带里程碑编号**（M2-24 / P1 / P2 / DEC-07），每个模块能追回决策来源；`vite.config.js` 注入 build-version 便于线上定位版本。

---

## 建议的修复顺序

按「先让路径通，再让它快，最后让它干净」排列。第一批全部是小改动，但决定站点能不能上线。

| 批次 | 内容 | 编号 | 量级 |
|---|---|---|---|
| **1 · 打通** | API base 走构建变量 + 静态兜底联系方式；合并三份应用目录并改用稳定 slug；实现 `?f=` 解析；搜索并入渲染管线；全局 `scroll-margin-top`；三页接入站壳；**取消 IP 详情页的强制跳转** | F01 F02 F04 F05 F06 F07 F08 **F35** | 2 天 |
| **2 · 减重** | 去掉 `crossOrigin` 消除重复下载；图片转 WebP + 响应式；**联系页 9.5MB 贴图降尺寸并懒加载**；字体 `unicode-range` 分片；three.js 去重与延迟加载；动画循环按可见性启停 | F03 **F36** F14 F20 **F38** | 2 天 |
| **3 · 合规** | 正式法律文本与 ICP 备案；自托管 Unsplash 素材；移除 demo 构建入口；占位内容显式标注 | F09 F10 F11 F12 | 依赖法务 |
| **4 · 无障碍** | JS 层响应 `prefers-reduced-motion`；补 h1；筛选器改 `change`；收窄 IP 页滚轮劫持；模态框 `inert`；轮播与 d20 键盘化 | F25–F34 **F39** | 1–2 天 |
| **5 · 清理** | 删除 5,131 行无引用代码与 9 个未使用依赖；删除两份死顶栏逻辑；统一 `escapeHTML`；`updateMotion` 补空值保护并把 `maybeStartHandoff` 纳入节流；建立 Playwright smoke 套件 | F13 F15 F16 F21 F23 F24 **F37** | 1 天 |

---

## 审查覆盖范围

| 模块 | 行数 | 覆盖方式 |
|---|---|---|
| 10 个页面的 HTML 与内联脚本 | ~6,600 | 逐行 |
| `public/` 站壳、content.js、webgl-check | 1,524 | 逐行 |
| `src/ip-entry.js` | 2,395 | 逐行 |
| `src/features/script-reader/*` | 1,506 | 逐行（CSS 抽查） |
| `src/games/d20/*` | 1,485 | 逐行 + 冒烟测试 |
| `src/bloomEnvironment.js` | 490 | 结构与资源生命周期 |
| 无生产引用的代码（见 F13） | 11,440 | 仅确认无引用，未逐行审 |
| `three.r128.min.js`、`package-lock.json` | — | 第三方，未审 |

运行时验证：`npm run build` + Chromium（Playwright）——全 10 页冒烟、apechain 筛选/排序/搜索交互、deploy 详情页跳转映射、about 表单在 localhost 与非 localhost 两种主机名下提交、IP 首页移动端断点与详情页滚动劫持、reduced-motion 上下文、逐页传输体积与 a11y 快照。
