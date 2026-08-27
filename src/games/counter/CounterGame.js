/**
 * CounterGame.js — 计数器游戏(城市脉冲)的表现层。
 * Canvas 2D 负责脉冲环 / 粒子 / 飘字,DOM 负责数值、升级与可访问性。
 * 逻辑全部来自 CounterState.js,这里只做渲染与输入。
 */

import './counter.css';
import {
  createState, click, tick, buy, costOf, perClick, perSecond,
  comboMultiplier, levelInfo, save, load, clearSave,
  UPGRADES, COMBO_WINDOW
} from './CounterState.js';

const TAU = Math.PI * 2;
const ACCENT = [255, 34, 51];

export class CounterGame {
  constructor(container) {
    this.container = container;
    this.state = load();
    this._destroyed = false;
    this._reduceMotion = matchMediaSafe('(prefers-reduced-motion: reduce)');

    this.particles = [];
    this.ripples = [];
    this.floats = [];
    this.shake = 0;
    this.flash = 0;
    this.corePunch = 0;
    this.spin = 0;
    this._saveAccum = 0;

    this._buildDOM();
    this._bindEvents();
    this._resize();
    this._syncHUD();

    this._last = now();
    this._frame = requestAnimationFrame(this._loop);
  }

  /* ── DOM ── */

  _buildDOM() {
    const root = document.createElement('div');
    root.className = 'cc-root';
    root.innerHTML = `
      <canvas class="cc-canvas" aria-hidden="true"></canvas>
      <div class="cc-hud">
        <div class="cc-hud-row">
          <div><span class="cc-pulse" data-pulse>0</span><span class="cc-pulse-unit">脉冲</span></div>
          <div class="cc-rate">
            每次 <b data-per-click>+1</b><br>每秒 <b data-per-sec>+0</b>
          </div>
        </div>
        <div class="cc-level">
          <span class="cc-level-name" data-level>路人</span>
          <span class="cc-bar"><span data-bar></span></span>
          <span data-next>下一级 60</span>
        </div>
      </div>
      <button class="cc-core" type="button" data-core>
        打卡
        <span class="cc-core-combo" data-combo></span>
      </button>
      <div class="cc-shop">
        ${UPGRADES.map(u => `
          <button class="cc-buy" type="button" data-buy="${u.id}">
            <span class="cc-buy-top">
              <span class="cc-buy-name">${u.name}</span>
              <span class="cc-buy-lv" data-lv="${u.id}">Lv.0</span>
            </span>
            <span class="cc-buy-desc">${u.desc}</span>
            <span class="cc-buy-cost" data-cost="${u.id}">—</span>
          </button>`).join('')}
        <button class="cc-reset" type="button" data-reset>重置</button>
      </div>
      <p class="cc-sr" role="status" aria-live="polite" data-sr></p>
    `;
    this.container.appendChild(root);
    this.root = root;

    this.canvas = root.querySelector('.cc-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.coreEl = root.querySelector('[data-core]');
    this.comboEl = root.querySelector('[data-combo]');
    this.srEl = root.querySelector('[data-sr]');
    this.els = {
      pulse: root.querySelector('[data-pulse]'),
      perClick: root.querySelector('[data-per-click]'),
      perSec: root.querySelector('[data-per-sec]'),
      level: root.querySelector('[data-level]'),
      bar: root.querySelector('[data-bar]'),
      next: root.querySelector('[data-next]')
    };
  }

  _bindEvents() {
    this._onCore = (e) => { e.preventDefault(); this._doClick(); };
    this.coreEl.addEventListener('click', this._onCore);

    this._onBuy = (e) => {
      const btn = e.target.closest('[data-buy]');
      if (!btn) return;
      if (buy(this.state, btn.dataset.buy)) {
        this.corePunch = Math.max(this.corePunch, 0.7);
        this._announce(`${labelOf(btn.dataset.buy)} 升级到 Lv.${this.state.levels[btn.dataset.buy]}`);
        this._syncHUD();
        save(this.state);
      }
    };
    this.root.addEventListener('click', this._onBuy);

    this._onReset = () => {
      if (!window.confirm('清空脉冲、等级与升级,重新开始?')) return;
      this.state = createState();
      clearSave();
      this.particles.length = 0; this.ripples.length = 0; this.floats.length = 0;
      this._announce('进度已重置');
      this._syncHUD();
    };
    this.root.querySelector('[data-reset]').addEventListener('click', this._onReset);

    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(this.container);
    } else {
      this._onResize = () => this._resize();
      window.addEventListener('resize', this._onResize);
    }
  }

  /* ── 输入 ── */

  _doClick() {
    const t = now();
    const res = click(this.state, t);

    this.corePunch = 1;
    this.ripples.push({ r: this.coreR * 0.8, life: 1, mult: res.multiplier });
    this.floats.push({
      text: `+${res.gain}`,
      x: (Math.random() - 0.5) * this.coreR * 1.1,
      y: -this.coreR * 1.05,
      life: 1,
      big: res.multiplier >= 3
    });
    this._spawnParticles(Math.round(10 + res.combo * 1.2), res.multiplier);

    if (res.levelUp) {
      this.shake = this._reduceMotion ? 0 : 12;
      this.flash = 1;
      this._spawnParticles(90, 5, true);
      this._announce(`晋升:${res.levelUp.name}`);
    }

    this._syncHUD();
  }

  _spawnParticles(count, mult, burst) {
    if (this._reduceMotion) count = Math.min(count, 8);
    const cap = 420;
    const n = Math.min(count, cap - this.particles.length);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU;
      const speed = (burst ? 120 : 50) + Math.random() * (burst ? 260 : 130) * Math.min(mult, 5) * 0.4;
      this.particles.push({
        x: Math.cos(a) * this.coreR * 0.7,
        y: Math.sin(a) * this.coreR * 0.7,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - 20,
        life: 1,
        decay: 0.6 + Math.random() * 0.7,
        size: 1 + Math.random() * (burst ? 3 : 2),
        warm: burst || mult >= 3 || Math.random() < 0.35
      });
    }
  }

  /* ── HUD ── */

  _syncHUD() {
    const s = this.state;
    const info = levelInfo(s);
    this.els.pulse.textContent = format(s.pulse);
    this.els.perClick.textContent = `+${perClick(s)}`;
    this.els.perSec.textContent = `+${perSecond(s)}`;
    this.els.level.textContent = info.name;
    this.els.bar.style.width = `${(info.progress * 100).toFixed(1)}%`;
    this.els.next.textContent = info.next ? `下一级 ${format(info.next.at)}` : '已达顶级';

    for (const u of UPGRADES) {
      const cost = costOf(s, u.id);
      const btn = this.root.querySelector(`[data-buy="${u.id}"]`);
      btn.disabled = s.pulse < cost;
      btn.setAttribute('aria-label', `${u.name},${u.desc},花费 ${cost} 脉冲`);
      this.root.querySelector(`[data-lv="${u.id}"]`).textContent = `Lv.${s.levels[u.id]}`;
      this.root.querySelector(`[data-cost="${u.id}"]`).textContent = `${format(cost)} 脉冲`;
    }

    const mult = comboMultiplier(s);
    const on = s.combo > 1;
    this.comboEl.textContent = on ? `${s.combo} 连击 · ${mult.toFixed(1)}x` : '';
    this.comboEl.dataset.on = String(on);
    this.coreEl.setAttribute('aria-label', `打卡,当前 ${format(s.pulse)} 脉冲,每次 +${perClick(s)}`);
  }

  _announce(text) {
    this.srEl.textContent = text;
  }

  /* ── 画布 ── */

  _resize() {
    if (this._destroyed) return;
    const rect = this.container.getBoundingClientRect();
    const w = Math.max(1, rect.width || 600);
    const h = Math.max(1, rect.height || 480);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.coreR = clamp(Math.min(w, h) * 0.19, 58, 105);
  }

  _loop = () => {
    if (this._destroyed) return;
    const t = now();
    let dt = (t - this._last) / 1000;
    this._last = t;
    if (dt > 0.1) dt = 0.1;   // 切后台回来时不要一次补上巨量帧

    this._update(dt, t);
    this._draw(t);
    this._frame = requestAnimationFrame(this._loop);
  };

  _update(dt, t) {
    const res = tick(this.state, dt, t);
    if (res.gain > 0 || res.comboBroken || res.levelUp) {
      if (res.levelUp) {
        this.flash = 1;
        this.shake = this._reduceMotion ? 0 : 10;
        this._spawnParticles(80, 5, true);
        this._announce(`晋升:${res.levelUp.name}`);
      }
      this._syncHUD();
    }

    this._saveAccum += dt;
    if (this._saveAccum > 3) { this._saveAccum = 0; save(this.state); }

    this.spin += dt * (0.12 + comboMultiplier(this.state) * 0.05);
    this.corePunch = Math.max(0, this.corePunch - dt * 3.4);
    this.flash = Math.max(0, this.flash - dt * 1.8);
    this.shake *= Math.pow(0.0025, dt);
    if (this.shake < 0.15) this.shake = 0;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt * p.decay;
      if (p.life <= 0) { this.particles.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vy += 130 * dt;          // 轻微重力,粒子往下沉
      p.vx *= Math.pow(0.35, dt);
      p.vy *= Math.pow(0.6, dt);
    }
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.life -= dt * 1.5;
      r.r += dt * (150 + r.mult * 40);
      if (r.life <= 0) this.ripples.splice(i, 1);
    }
    for (let i = this.floats.length - 1; i >= 0; i--) {
      const f = this.floats[i];
      f.life -= dt * 1.1;
      f.y -= dt * 62;
      if (f.life <= 0) this.floats.splice(i, 1);
    }
  }

  _draw(t) {
    const ctx = this.ctx;
    const { w, h, dpr } = this;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#070708';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const sx = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    const sy = this.shake ? (Math.random() - 0.5) * this.shake : 0;
    ctx.save();
    ctx.translate(cx + sx, cy + sy);

    const mult = comboMultiplier(this.state);
    const heat = (mult - 1) / 4;                       // 0 → 1:连击越高越红
    const breathe = 1 + Math.sin(t / 620) * 0.02 + this.corePunch * 0.16;
    const R = this.coreR * breathe;

    // 背景辉光
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h) * 0.6);
    glow.addColorStop(0, rgba(ACCENT, 0.14 + heat * 0.16 + this.flash * 0.25));
    glow.addColorStop(0.55, rgba(ACCENT, 0.03));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(-w, -h, w * 2, h * 2);

    // 外圈:两层反向旋转的六边形
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba([255, 255, 255], 0.1);
    polygon(ctx, 0, 0, R * 1.9, 6, this.spin);
    ctx.stroke();
    ctx.strokeStyle = rgba(ACCENT, 0.18 + heat * 0.3);
    polygon(ctx, 0, 0, R * 1.52, 6, -this.spin * 1.6);
    ctx.stroke();

    // 等级进度弧
    const info = levelInfo(this.state);
    ctx.lineWidth = 3;
    ctx.strokeStyle = rgba([255, 255, 255], 0.08);
    ctx.beginPath(); ctx.arc(0, 0, R * 1.22, 0, TAU); ctx.stroke();
    if (info.progress > 0) {
      ctx.strokeStyle = rgba(ACCENT, 0.85);
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.22, -Math.PI / 2, -Math.PI / 2 + TAU * info.progress);
      ctx.stroke();
    }

    // 连击剩余时间(内圈细弧)
    if (this.state.combo > 0) {
      const left = clamp(1 - (t - this.state.lastClickAt) / COMBO_WINDOW, 0, 1);
      ctx.lineWidth = 2;
      ctx.strokeStyle = rgba(ACCENT, 0.55);
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.05, -Math.PI / 2, -Math.PI / 2 + TAU * left);
      ctx.stroke();
    }

    // 点击涟漪
    for (const r of this.ripples) {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = rgba(ACCENT, 0.4 * r.life);
      polygon(ctx, 0, 0, r.r, 6, this.spin);
      ctx.stroke();
    }

    // 核心
    const core = ctx.createRadialGradient(0, 0, R * 0.1, 0, 0, R);
    core.addColorStop(0, rgba([255, 255, 255], 0.16 + this.corePunch * 0.3));
    core.addColorStop(0.6, rgba(ACCENT, 0.22 + heat * 0.25));
    core.addColorStop(1, rgba(ACCENT, 0.04));
    ctx.fillStyle = core;
    polygon(ctx, 0, 0, R, 6, this.spin * 0.5);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = rgba(ACCENT, 0.7 + this.corePunch * 0.3);
    polygon(ctx, 0, 0, R, 6, this.spin * 0.5);
    ctx.stroke();

    // 粒子
    for (const p of this.particles) {
      ctx.fillStyle = p.warm
        ? rgba(ACCENT, p.life)
        : rgba([255, 255, 255], p.life * 0.55);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, TAU);
      ctx.fill();
    }

    // 飘字
    ctx.textAlign = 'center';
    for (const f of this.floats) {
      ctx.font = `${f.big ? 700 : 600} ${f.big ? 26 : 18}px -apple-system, "PingFang SC", sans-serif`;
      ctx.fillStyle = f.big ? rgba(ACCENT, f.life) : rgba([255, 255, 255], f.life * 0.85);
      ctx.fillText(f.text, f.x, f.y - (1 - f.life) * 10);
    }

    ctx.restore();
  }

  /* ── 生命周期 ── */

  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;
    cancelAnimationFrame(this._frame);
    save(this.state);
    this.coreEl.removeEventListener('click', this._onCore);
    this.root.removeEventListener('click', this._onBuy);
    if (this._ro) this._ro.disconnect();
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    this.root.remove();
  }
}

/* ── 小工具 ── */

function polygon(ctx, x, y, r, sides, rot) {
  ctx.beginPath();
  for (let i = 0; i <= sides; i++) {
    const a = rot + (i / sides) * TAU - Math.PI / 2;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function rgba(c, a) {
  return `rgba(${c[0]},${c[1]},${c[2]},${clamp(a, 0, 1).toFixed(3)})`;
}

function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

function format(n) {
  if (n < 10000) return String(Math.floor(n));
  if (n < 1e6) return `${(n / 1000).toFixed(1)}K`;
  return `${(n / 1e6).toFixed(2)}M`;
}

function labelOf(id) {
  const u = UPGRADES.find(x => x.id === id);
  return u ? u.name : id;
}

function now() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function matchMediaSafe(query) {
  try { return window.matchMedia(query).matches; } catch (_) { return false; }
}
