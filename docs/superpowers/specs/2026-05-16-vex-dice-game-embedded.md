# VEX Dice Roll — Plugin Demo Design Spec

> **For Claude Code implementation**
> Project: 城瘾 / Questify VEX Plugin Showcase
> Date: 2026-05-16

---

## 1. UX Flow

```
VEX Plugin Library Page（现有landing.js中的vex-scene区块）
│
├── 左侧 Sidebar（340px宽）
│   └── 插件列表（含骰子检定）
│         ↑ 点击
│
└── 右侧 Detail Panel（flex:1）
    │
    ├── [普通插件] → 显示vexTemplateDetail（文字介绍）
    │
    └── [骰子检定] → 进入游戏模式
        ├── Header: VX-XX | quest | Roll/Check → "骰子检定"
        ├── 游戏Canvas区域（Three.js渲染）
        │   ├── 深色背景 + 粒子场
        │   ├── 3D骰子（中心）
        │   └── 特效粒子
        └── UI浮层
            ├── 结果数字 + 分类名称
            └── "掷骰"按钮
```

**不是独立页面**，骰子游戏嵌入在右侧Detail Panel中。用户点左侧的骰子插件→右侧面板切换成游戏模式。切换回其他插件→恢复文字详情。

---

## 2. 布局与尺寸

### 右侧面板布局

```
┌─── vex-template-detail ──────────────────────────┐
│ padding: 44px 48px 48px 40px                      │
│                                                    │
│  ┌── vex-detail-header ──────────────────────┐    │
│  │ VX-00 | quest | 10% success → Roll value   │    │
│  │                                             │    │
│  │ 骰子检定                                    │    │
│  └─────────────────────────────────────────────┘    │
│                                                    │
│  ┌── game-canvas-container ──────────────────┐    │
│  │  ┌──────────────────────────────────┐     │    │
│  │  │  Three.js Canvas                 │     │    │
│  │  │  - 粒子背景                      │     │    │
│  │  │  - 3D骰子                        │     │    │
│  │  │  - 特效                          │     │    │
│  │  │                                  │     │    │
│  │  │  [UI浮层]                        │     │    │
│  │  │    结果: 20 🎉                    │     │    │
│  │  │    [ROLL]                        │     │    │
│  │  └──────────────────────────────────┘     │    │
│  └─────────────────────────────────────────┘    │
│                                                    │
│  ┌── vex-detail-body (游戏说明文字) ───────────┐ │
│  │ 点击屏幕或ROLL按钮掷骰...                     │ │
│  └─────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

### 尺寸参数

| 元素 | 尺寸 | 说明 |
|------|------|------|
| vex-template-detail | flex:1, padding: 44px/48px | 右侧面板容器 |
| game-canvas-container | height: min(55vh, 520px) | canvas区域高度 |
| canvas | 100% width, 100% height of container | Three.js渲染 |
| left sidebar | 340px fixed | 保持不变 |
| 总高度 | calc(100vh - 74px) | 减去导航栏 |

---

## 3. 如何改造现有代码

### 3.1 修改 landing.js 中的 setupVexLibrary

在 `selectPlugin()` 中，当选中骰子检定插件时（判断 `item.code === 'VX-01'` 或通过tag/title匹配），替换 `vex-template-detail` 的内容为游戏模板：

```js
// 在 setupVexLibrary 中，selectPlugin 函数添加分支
const selectPlugin = (index, filtered) => {
  const plugin = filtered[index];
  
  if (plugin && plugin.code === 'VX-01') {
    // 骰子检定 → 游戏模式
    showDiceGame(plugin);
  } else if (plugin) {
    // 其他插件 → 文字详情
    showNormalDetail(plugin);
  }
};
```

### 3.2 新增文件清单

```
src/demo/
├── dice-game/
│   ├── DiceGame.js       — 游戏主模块 (mount/destroy/resize)
│   ├── DiceScene.js      — Three.js场景
│   ├── DiceObject.js     — 3D骰子(icosahedron)
│   ├── ParticleField.js  — 粒子系统
│   ├── EffectBurst.js    — 结果特效爆发
│   └── DiceState.js      — 掷骰逻辑/结果分类
└── dice-game.css         — 游戏UI样式
```

所有文件新建，不修改已有文件（除landing.js中setupVexLibrary的selectPlugin分支）。

### 3.3 DiceGame.js 接口

```js
export class DiceGame {
  constructor(container) { /* container = 游戏canvas容器DOM元素 */ }
  mount() { /* 创建Three.js场景、启动渲染循环 */ }
  destroy() { /* 清理场景、取消RAF、释放资源 */ }
  resize() { /* 响应容器尺寸变化 */ }
}
```

在 setupVexLibrary 中调用：

```js
let diceGameInstance = null;

function showDiceGame(plugin) {
  if (diceGameInstance) diceGameInstance.destroy();
  
  const detail = anchor.querySelector('.vex-template-detail');
  detail.innerHTML = diceGameTemplate(plugin);
  
  const container = detail.querySelector('[data-dice-game]');
  diceGameInstance = new DiceGame(container);
  diceGameInstance.mount();
}

function showNormalDetail(plugin) {
  if (diceGameInstance) {
    diceGameInstance.destroy();
    diceGameInstance = null;
  }
  const detail = anchor.querySelector('.vex-template-detail');
  detail.innerHTML = vexTemplateDetail(plugin);
}
```

### 3.4 HTML模板

```js
function diceGameTemplate(item) {
  return `
    <div class="vex-detail-header">
      <div class="vex-detail-meta">
        <span class="vex-detail-code">${item.code}</span>
        <span class="vex-detail-pipe">|</span>
        <span class="vex-detail-tag">${item.tag}</span>
        <span class="vex-detail-pipe">|</span>
        <span class="vex-detail-signal">${item.signal}</span>
      </div>
      <h2 class="vex-detail-title">${item.title}</h2>
    </div>
    <div class="vex-dice-game-root" data-dice-game>
      <canvas data-dice-canvas></canvas>
      <div class="vex-dice-ui">
        <div class="vex-dice-result" data-dice-result>
          <span class="vex-dice-value" data-dice-value></span>
          <span class="vex-dice-label" data-dice-label></span>
        </div>
        <button class="liquid-glass vex-dice-roll-btn" data-dice-roll>ROLL</button>
        <span class="vex-dice-hint" data-dice-hint>点击掷骰</span>
      </div>
    </div>
    <div class="vex-detail-body" style="margin-top:24px">
      <p class="vex-detail-desc">${item.detail}</p>
      <div class="vex-detail-tags">
        ${item.tags.map(t => `<span>${t}</span>`).join('')}
      </div>
    </div>
  `;
}
```

---

## 4. Three.js 场景设计

### 4.1 场景层次

```
Canvas全区域
├── 背景渐变 (深色 #0a0b0f → #14151d)
├── 粒子场 (200-300点, 缓慢漂移, 极小半透明)
├── 3D骰子 (icosahedron, 中心位置)
└── 爆发粒子 (掷骰结果触发, 临时)
```

### 4.2 骰子 (DiceObject.js)

- **几何:** `THREE.IcosahedronGeometry(1.2, 0)` (半径1.2)
- **材质:** `THREE.MeshStandardMaterial`
  - color: #2a2d36
  - metalness: 0.65
  - roughness: 0.28
  - emissive: #000000 (默认无光, 触发特效时变)
- **线框:** `EdgesGeometry` + `LineSegments` 金色 #8a7340
- **大小适配:** 根据容器高度动态缩放 `scale = Math.min(containerH, 400) / 3`
- **旋转:** idle时Y轴 0.3 rad/s 缓慢自转

### 4.3 粒子场 (ParticleField.js)

- 200-300个粒子, 随机分布在 8x8x4 空间
- 每粒子: 极小平面的Sprite或Points（大小1-2px）
- 颜色: 半透明白/金混合 rgba(200,180,150,0.08~0.2)
- 运动: 正弦波漂移, 缓慢上下浮动

### 4.4 相机

- `THREE.PerspectiveCamera(45, aspect, 0.1, 20)`
- 位置: (0, 0, 5)
- 随容器宽高动态aspect

### 4.5 光照

- AmbientLight: intensity 0.4, color warm
- DirectionalLight: position (3, 5, 4), intensity 0.6
- PointLight: 骰子附近, 颜色随特效动态切换

---

## 5. 交互与结果特效

### 5.1 掷骰流程

```
[点击屏幕 或 点击ROLL按钮]
    │
    ▼
1. 骰子加速旋转 (1.5秒)
   - Quaternion slerp 随机目标旋转
   - 粒子场被扰动（向外扩散再恢复）
   
2. 骰子停止
   - 动画完成
   - 随机取 1-20
   
3. 触发特效
   - DiceState判断分类
   - EffectBurst执行对应特效
   
4. UI更新
   - 结果数字大号显示
   - 分类名称下方显示
   
5. 停留 3-4 秒后恢复idle
```

### 5.2 结果分类与特效

| 点数 | 分类 | 显示文字 | 粒子颜色 | 粒子行为 | 画面效果 | 骰子反应 | 叠加层 |
|------|------|---------|---------|---------|---------|---------|--------|
| 20 | 大成功 | 🎉 大成功!! | #FFD700→#FFA000 | 密集金色喷泉从骰子爆发→金色雨下落 | 全屏暖光闪烁 | 金色发光,表面光泽 | 金色叠加50%→渐隐 |
| 15-19 | 好成功 | 好成功! | #4FC3F7→#E3F2FD | 银色波纹环扩散×2-3 | 冷光洗泽 | 蓝色辉光脉冲 | 蓝白叠加30%→渐隐 |
| 10-14 | 成功 | 成功 | #66BB6A→#C8E6C9 | 绿色粒子轻柔上升散开 | 柔和脉冲 | 翠绿微光 | 绿叠加20%→渐隐 |
| 2-9 | 失败 | 失败 | #78909C→#455A64 | 灰褐粒子缓慢下降消散 | 画面暗化 (overlay black 15%) | 暗淡,轻微下沉 | 灰叠层15%→渐隐 |
| 1 | 大失败 | 💀 大失败!! | #D32F2F→#B71C1C | 红色烟雾爆发+碎片飞散 | 屏幕震动(4-8px抖动500ms)+红晕 | 剧烈抖动+红色裂缝 | 红叠层40%→渐隐 |

### 5.3 分类内微调 (per-number variation)

更高数值 → 更多粒子数、更长持续时间、更亮：

```js
// 在 16-19 范围内:
// value=16 → 粒子数 60, duration 2.0s, opacity max 0.6
// value=19 → 粒子数 120, duration 3.0s, opacity max 0.9
const intensity = (value - categoryMin) / (categoryMax - categoryMin);
particleCount = baseCount + Math.floor(extraCount * intensity);
duration = baseDuration + extraDuration * intensity;
```

---

## 6. CSS设计 (dice-game.css)

无需新全局样式, 作用域限定在 `vex-dice-game-root` 下:

```css
.vex-dice-game-root {
  position: relative;
  width: 100%;
  height: min(55vh, 520px);
  margin: 16px 0;
  border: 1px solid rgba(255,255,255,.04);
  overflow: hidden;
  background: #0a0b0f;
}

[data-dice-canvas] {
  width: 100%;
  height: 100%;
  display: block;
}

.vex-dice-ui {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.vex-dice-result {
  text-align: center;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.vex-dice-result.visible {
  opacity: 1;
}

.vex-dice-value {
  display: block;
  font-size: clamp(60px, 8vw, 96px);
  font-weight: 200;
  color: #fff;
  text-shadow: 0 0 40px rgba(255,255,255,0.15);
  line-height: 1;
}

.vex-dice-label {
  display: block;
  font-size: 12px;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.45);
  margin-top: 4px;
}

.vex-dice-roll-btn {
  position: absolute;
  bottom: 24px;
  pointer-events: auto;
  cursor: pointer;
  padding: 12px 32px;
  /* 复用 liquid-glass 样式 */
}

.vex-dice-hint {
  position: absolute;
  bottom: 80px;
  font-size: 10px;
  letter-spacing: .1em;
  color: rgba(255,255,255,.15);
}

/* 覆盖层（特效颜色叠加）*/
.vex-dice-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
  opacity: 0;
  transition: opacity 0.3s ease;
}
```

> **注意:** `liquid-glass` CSS类已在main.css中存在, 直接复用

---

## 7. 代码修改范围

### 需修改的文件

| 文件 | 修改内容 |
|------|---------|
| `src/landing.js` | setupVexLibrary 中添加 diceGameTemplate() 和游戏模式分支 |
| `src/styles/main.css` | 在vex相关CSS后追加dice-game相关样式 |

### 需创建的文件

| 文件路径 | 内容 |
|---------|------|
| `src/demo/dice-game/DiceGame.js` | 游戏主模块、Three.js场景、渲染循环 |
| `src/demo/dice-game/DiceObject.js` | 3D骰子实现（icosahedron + 材质 + 旋转动画） |
| `src/demo/dice-game/ParticleField.js` | 背景粒子系统 |
| `src/demo/dice-game/EffectBurst.js` | 各分类特效实现 |
| `src/demo/dice-game/DiceState.js` | 掷骰逻辑 + 结果分类 + 特效参数计算 |

---

## 8. 实现顺序

1. **DiceState.js** — 纯逻辑, 先确定roll/分类/参数
2. **DiceGame.js** + **DiceObject.js** — Three.js场景 + 骰子 + 渲染循环
3. **ParticleField.js** — 背景粒子
4. **EffectBurst.js** — 分类特效
5. **landing.js** + **main.css** 修改 — 集成到VEX页面
6. 调试: 切回文字插件再切回骰子, 确保destroy/mount正确
