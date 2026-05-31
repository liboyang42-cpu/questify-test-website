# VEX Dice Roll — WebGL Interactive Plugin Demo

> **Design Spec** for Claude Code implementation
> Part of 城瘾 / Questify VEX Plugin Showcase project
> Date: 2026-05-16

---

## 1. Overview

A full-screen WebGL interactive demo page demonstrating the **骰子检定 (Dice Roll Check)** plugin concept for the 城瘾 platform. The user clicks/taps the screen to roll a 3D d20 dice. Each result category triggers a distinct visual particle effect, color wash, and atmosphere change — making every roll a cinematic moment.

**Goal:** Show how TRPG (跑团) mechanics can be visualized in a city-exploration context, using 城瘾's existing black-cinematic WebGL aesthetic.

### Deliverable Output Files

All new files, no modifications to existing code:

```
src/demo/dice-roll/
├── index.html          — Full-screen WebGL page
├── main.js             — Entry point, Three.js scene setup, App lifecycle
├── Dice.js             — 3D d20 icosahedron geometry + materials + rolling animation
├── DiceState.js        — Roll result logic, categories, effect parameter mapping
├── ParticleField.js    — Background ambient particle system (floating city dust)
├── EffectBurst.js      — Per-result particle burst / effect controller
├── Atmosphere.js       — Fog, ambient light, color wash post-processing
├── styles.css          — Liquid-glass UI overlay styling
└── utils.js            — Shared math helpers (lerp, clamp, random range, etc.)
```

---

## 2. Visual Design

### 2.1 General Aesthetic

Continuation of existing VEX / 城瘾 visual language:
- **Color base:** Very dark (#0a0a0c → #121218) with subtle gradient
- **Atmosphere:** Volumetric fog, distant city silhouette, slow-drifting background particles
- **Highlight palette:** Black-film gold (#C8A45C → #FFD700), cool silver (#4FC3F7), deep crimson (#D32F2F), muted jade (#66BB6A)
- **UI:** Liquid-glass styled button (reuse `.liquid-glass` pattern from landing.js)
- **Typography:** Sans-serif, uppercase labels, minimal UI chrome

### 2.2 Scene Layers (back to front)

```
[1] Background gradient: dark #0a0a0c → #1a1a22
[2] Subtle distant city silhouette (thin horizontal lines, very low opacity)
[3] Ambient particle field: 200-400 small floating dots, slow drift
[4] The 3D d20 dice (center of screen, ~200px diameter)
[5] Effect particles (burst on roll result)
[6] UI layer: ROLL button, result text, instruction hint
[7] Color wash / post-effect (overlay div with blend mode)
```

### 2.3 Dice Design

- **Shape:** Regular icosahedron (20 triangular faces), Three.js `IcosahedronGeometry`
- **Material:** Custom `MeshStandardMaterial` with:
  - Color: dark gunmetal (#2a2a30) with slight metallic
  - Metalness: 0.7
  - Roughness: 0.3
  - Edge highlights: emissive edge glow on hover
- **Number faces:** Instead of actual engraved numbers (complex texture mapping for 20 faces), use a simpler approach: the dice itself is an icosahedron, and the RESULT is displayed as a large number/icon in the UI layer + the particle effect communicates the value
- **Edge wireframe:** Subtle gold/bronze wireframe overlay on the dice geometry

**Alternative simpler dice visual:** A glowing spherical "dice core" with geometric wireframe that pulses and reveals result through color + particle intensity. This is more achievable and fits the cinematic aesthetic better than a literal numbered die.

### 2.4 UI Overlay

- **Result number:** Large floating number (100px+) that appears after roll resolves
- **Name label:** Category name below result (大成功 / 好成功 / 成功 / 失败 / 大失败)
- **Roll button:** Center-bottom, liquid-glass styled, says "ROLL" or "再掷一次"
- **Hint text:** Faint instruction initially, fades after first roll
- **Stats pill:** Small top-right showing last 5 rolls for context (optional stretch)

---

## 3. Interaction Flow

```
IDLE STATE
  ┣━ Dice slowly rotating on Y axis (0.3 rad/s)
  ┣━ Particles drifting gently
  ┣━ UI shows "点击屏幕掷骰" hint
  ┃
  ├── [User clicks/taps anywhere on screen]
  ┃
  ▼
ROLLING STATE (1.5-2 seconds)
  ┣━ Dice spin accelerates rapidly (3-5 full rotations)
  ┣━ Particles disturbed, pushed outward
  ┣━ UI hint fades
  ┃
  ▼
RESULT STATE
  ┣━ Dice decelerates to stop
  ┣━ Result number + name appears in center
  ┣━ CATEGORY-SPECIFIC EFFECT TRIGGERS (see §4)
  ┃
  ├── [Hold for 3-4 seconds] 
  ┃
  ▼
RECOVERY STATE (1 second)
  ┣━ Effect fades out
  ┣━ Dice resumes idle rotation
  ┣━ Ready for next roll
```

---

## 4. Effects by Result Category — THE KEY DESIGN

Each category has a distinct visual identity. Colors, particles, screen effects, and dice response are all coordinated.

### 4.1 💀 Natural 1 — 大失败 "崩坏"

| Element | Description |
|---------|-------------|
| **Color** | Blood red #D32F2F → dark crimson #B71C1C |
| **Particle effect** | Red smoke burst + angular shard particles fly outward and downward |
| **Screen effect** | Brief screen shake (translate 4-8px oscillation damping over 500ms) + dark red vignette overlay |
| **Dice response** | Violent shake, surface flickers red emissive, brief "cracked" appearance |
| **Sound hint** | Low thud / impact feel |
| **Result text** | 大失败 ! |

### 4.2 ❌ 2-9 — 失败 "沉寂"

| Element | Description |
|---------|-------------|
| **Color** | Muted grey-blue #78909C → #37474F |
| **Particle effect** | Ash-like grey particles slowly falling, gentle dissipation |
| **Screen effect** | Slight darkening (overlay 0.15 opacity black) |
| **Dice response** | Dim emissive, slight downward bob |
| **Result text** | 失败 |

### 4.3 ✅ 10-14 — 成功 "点亮"

| Element | Description |
|---------|-------------|
| **Color** | Jade green #66BB6A → #C8E6C9 |
| **Particle effect** | Soft green particles rising gently, scattered upward trails |
| **Screen effect** | Subtle warm pulse from dice center |
| **Dice response** | Soft green glow pulse, gentle hover up |
| **Result text** | 成功 |

### 4.4 🔷 15-19 — 好成功 "涟漪"

| Element | Description |
|---------|-------------|
| **Color** | Sapphire blue #4FC3F7 → #E3F2FD |
| **Particle effect** | Expanding ring of blue/white particles (ripple effect), 2-3 rings |
| **Screen effect** | Cool blue sheen wash, slight lightening |
| **Dice response** | Blue light sweeps across surface, sustained glow |
| **Result text** | 好成功 ! |

### 4.5 ⭐ Natural 20 — 大成功 "爆发"

| Element | Description |
|---------|-------------|
| **Color** | Gold #FFD700 → amber #FFA000 |
| **Particle effect** | EXPLOSIVE: dense golden particle fountain from dice center, upward bursting, then slow golden rain fall |
| **Screen effect** | Full warm light flash, golden vignette, brief screen brightness boost |
| **Dice response** | Intense gold emissive glow, surface reflections shimmer |
| **Result text** | 🎉 大成功 !! |

### 4.6 Per-Number Subtle Variation (within category bonus)

For extra depth, within each category the specific number (e.g., 15 vs 19) slightly varies:
- **Higher number** → more particles, slightly brighter, longer effect duration
- **Lower number** → fewer particles, slightly dimmer, shorter effect
- This is a linear interpolation: `intensity = (value - categoryMin) / (categoryMax - categoryMin)`

---

## 5. Code Architecture

### 5.1 File Dependencies

```
index.html
  └── styles.css (linked)
  └── main.js (module)
        ├── Dice.js — Dice3D class
        ├── DiceState.js — roll() → { value, category, params } 
        ├── ParticleField.js — BackgroundAmbientParticles class
        ├── EffectBurst.js — ResultEffectController class
        ├── Atmosphere.js — SceneAtmosphere class
        └── utils.js — math helpers
```

### 5.2 Key Implementation Notes

**Three.js usage:**
- The project already has Three.js installed and used in `vexAtmosphere.js`
- Create scene, camera (perspective), renderer
- Orbit/render loop via `requestAnimationFrame`
- No need for post-processing pipeline — use overlay `<div>` for color washes and blend modes

**Particle system approach:**
- Use `THREE.BufferGeometry` + `THREE.Points` for all particle effects
- Background ambient: 200-400 particles, fixed positions with slow oscillation
- Burst particles: 100-300 particles per burst, spawned at dice center, animated with velocity + gravity + fade

**Dice approach:**
- `THREE.IcosahedronGeometry(1, 0)` for the base shape
- `THREE.EdgesGeometry` + `THREE.LineSegments` for wireframe overlay (gold color)
- Roll animation: Use `Quaternion.slerp` between random orientations over 1.5s
- On roll, set a target rotation and animate with easing

**Overlay approach:**
- Results text: DOM element positioned absolute, scales up + fades in
- Color wash: Full-screen `<div>` with `mix-blend-mode: overlay` or `mix-blend-mode: color`, animated opacity
- Screen shake: Apply `transform: translate()` to `document.body` or a wrapper

**No need for:**
- Post-processing pipeline (keep it simple — DOM overlays for color effects)
- Physics engine (manual easing is fine for a demo)
- Audio (can be added later, not in v1)

---

## 6. Project Integration

### 6.1 Route Configuration (for Vite)

Add to existing `vite.config.js`:
```js
export default defineConfig({
  // ...existing config...
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'dice-roll': 'src/demo/dice-roll/index.html',
      }
    }
  }
})
```

### 6.2 Navigation from VEX Site

In `landing.js`, the VEX plugin detail panel for "骰子检定" will get a "进入体验" button that links to `/dice-roll/` (or `src/demo/dice-roll/index.html`).

### 6.3 Shared Assets

The demo page is **self-contained** — it doesn't modify any existing project code. It only:
- Imports Three.js (already a project dependency)
- Creates all its own scene elements
- Reads nothing from existing project state

This keeps it clean and independent, like atlab.io's subdomain experiments.

---

## 7. Visual Reference

See `https://atlab.io` for the pattern of:
- Full-screen WebGL canvas
- Minimal UI overlay floating on top
- Click to trigger interaction
- Particle / color feedback as response

---

## 8. Implementation Priority

1. **`index.html` + `styles.css`** — Page shell with liquid-glass button
2. **`DiceState.js`** — Pure logic: roll(), category detection, effect params
3. **`Three.js scene`** (in main.js) — Basic scene + camera + renderer + dice
4. **`Dice.js`** — Icosahedron geometry, material, rotation animation, roll tween
5. **`ParticleField.js`** — Background ambient particles
6. **`EffectBurst.js`** — Per-result particle burst + animation
7. **`Atmosphere.js`** — Fog, vignette, color wash integration
8. **Integration** — Wire up all components, test flow, polish
