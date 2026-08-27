# 城瘾官网 · 全站审查档案

审查对象：`questify-test-website` @ `c36ba57`
范围：前端 / 后端接入 / 功能 / 流程 / 代码 / 页面 / 交互
规模：10 个构建入口页，23,846 行源码（不含 vendor 与 lockfile）
方法：静态阅读 + `npm run build` + Chromium（Playwright）逐页运行时验证

共 34 项发现，其中 11 项已实测复现（标 ✅），其余为源码分析结论（标 📖）。F01 已在非 localhost 主机上端到端复现。

在线版（含实测输出与修复计划）：https://claude.ai/code/artifact/97d265a5-6842-4ad8-b3f5-350ff143c682

---

## 结论

**目前不具备正式上线条件。**

视觉与文案完成度相当高，但把整站当成一个转化漏斗来走，三条主路径全部断在中途：留资表单在生产域名下必然失败、应用列表点进详情页全部串号、首页 12 个分类入口全是死链。这些不是打磨问题，是功能问题。

另有两项属于「已经在跑的风险」：首页首屏 18.5MB，以及一个第三方模板 demo 页随生产构建一起发布。代码层面，约 48% 的源码（11,440 行）已无任何生产页面引用。

| 等级 | 数量 |
|---|---|
| P0 阻断上线 | 3 |
| P1 功能流程 | 5 |
| P2 合规内容 | 4 |
| P3 代码质量 | 12 |
| P4 交互无障碍 | 10 |

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
| **1 · 打通** | API base 走构建变量 + 静态兜底联系方式；合并三份应用目录并改用稳定 slug；实现 `?f=` 解析；搜索并入渲染管线；全局 `scroll-margin-top`；三页接入站壳 | F01 F02 F04 F05 F06 F07 F08 | 1–2 天 |
| **2 · 减重** | 去掉 `crossOrigin` 消除重复下载；图片转 WebP + 响应式；字体 `unicode-range` 分片；three.js 去重与延迟加载；动画循环启停控制 | F03 F14 F20 | 1–2 天 |
| **3 · 合规** | 正式法律文本与 ICP 备案；自托管 Unsplash 素材；移除 demo 构建入口；占位内容显式标注 | F09 F10 F11 F12 | 依赖法务 |
| **4 · 无障碍** | JS 层响应 `prefers-reduced-motion`；补 h1；筛选器改 `change`；收窄 IP 页滚轮劫持；模态框 `inert`；轮播键盘化 | F25–F34 | 1–2 天 |
| **5 · 清理** | 删除 5,131 行无引用代码与 9 个未使用依赖；删除两份死顶栏逻辑；统一 `escapeHTML`；建立 Playwright smoke 套件 | F13 F15 F16 F21 F23 F24 | 1 天 |
