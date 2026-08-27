/**
 * CounterState.js — 计数器游戏的纯逻辑层。
 * 负责:点击收益、连击倍率、等级晋升、升级购买、存档序列化。
 * 不依赖 DOM / Canvas / Three.js,可单独推演与测试。
 */

/* ─── 平衡参数 ─── */

export const COMBO_WINDOW = 900;   // ms:两次打卡间隔小于此值则续上连击
export const COMBO_STEP   = 4;     // 每 4 连击抬升一档倍率
export const COMBO_GAIN   = 0.5;   // 每档 +0.5x
export const COMBO_MAX    = 5;     // 倍率上限 5x

/** 城市身份等级:按累计脉冲晋升 */
export const LEVELS = [
  { name: '路人',     at: 0 },
  { name: '常客',     at: 60 },
  { name: '线人',     at: 240 },
  { name: '踩点者',   at: 800 },
  { name: '领队',     at: 2400 },
  { name: '城市传奇', at: 8000 }
];

/** 可购买的升级项 */
export const UPGRADES = [
  { id: 'amp',  name: '信号增幅', desc: '每次打卡 +1 脉冲',  baseCost: 25, growth: 1.6  },
  { id: 'auto', name: '自动巡线', desc: '每秒自动 +1 脉冲',  baseCost: 60, growth: 1.75 }
];

const SAVE_KEY = 'cy.counter.v1';

/* ─── 状态 ─── */

export function createState() {
  return {
    pulse: 0,        // 当前可消费脉冲
    total: 0,        // 累计获得脉冲(决定等级)
    clicks: 0,       // 累计打卡次数
    combo: 0,        // 当前连击数
    lastClickAt: 0,  // 上次打卡时间戳(ms)
    best: 0,         // 历史最高连击
    levels: { amp: 0, auto: 0 },
    _autoCarry: 0    // 自动收益的小数余量,避免每帧取整丢失
  };
}

/* ─── 派生量 ─── */

/** 连击倍率:每 COMBO_STEP 连击 +COMBO_GAIN,封顶 COMBO_MAX */
export function comboMultiplier(state) {
  const tier = Math.floor(state.combo / COMBO_STEP);
  return Math.min(COMBO_MAX, 1 + tier * COMBO_GAIN);
}

/** 单次打卡的基础收益(不含连击) */
export function perClick(state) {
  return 1 + state.levels.amp;
}

/** 每秒自动收益 */
export function perSecond(state) {
  return state.levels.auto;
}

/** 升级项当前价格(随已购层数指数增长) */
export function costOf(state, id) {
  const up = UPGRADES.find(u => u.id === id);
  if (!up) return Infinity;
  return Math.ceil(up.baseCost * Math.pow(up.growth, state.levels[id] || 0));
}

/** 当前等级 + 到下一级的进度 */
export function levelInfo(state) {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (state.total >= LEVELS[i].at) index = i;
  }
  const current = LEVELS[index];
  const next = LEVELS[index + 1] || null;
  const span = next ? next.at - current.at : 1;
  const progress = next ? Math.min(1, (state.total - current.at) / span) : 1;
  return { index, name: current.name, next, progress };
}

/* ─── 行为 ─── */

/**
 * 打卡一次。
 * @param {object} state
 * @param {number} now 当前时间戳(ms),由调用方传入以保持纯粹
 * @returns {{gain:number, combo:number, multiplier:number, levelUp:(object|null)}}
 */
export function click(state, now) {
  const before = levelInfo(state).index;

  const continued = state.lastClickAt > 0 && now - state.lastClickAt <= COMBO_WINDOW;
  state.combo = continued ? state.combo + 1 : 1;
  state.lastClickAt = now;
  if (state.combo > state.best) state.best = state.combo;

  const multiplier = comboMultiplier(state);
  const gain = Math.round(perClick(state) * multiplier);
  state.pulse += gain;
  state.total += gain;
  state.clicks += 1;

  const after = levelInfo(state);
  return {
    gain,
    combo: state.combo,
    multiplier,
    levelUp: after.index > before ? LEVELS[after.index] : null
  };
}

/**
 * 推进自动收益与连击衰减。
 * @param {object} state
 * @param {number} dt 距上一帧的秒数
 * @param {number} now 当前时间戳(ms)
 * @returns {{gain:number, comboBroken:boolean, levelUp:(object|null)}}
 */
export function tick(state, dt, now) {
  const before = levelInfo(state).index;

  let gain = 0;
  const rate = perSecond(state);
  if (rate > 0) {
    state._autoCarry += rate * dt;
    gain = Math.floor(state._autoCarry);
    if (gain > 0) {
      state._autoCarry -= gain;
      state.pulse += gain;
      state.total += gain;
    }
  }

  let comboBroken = false;
  if (state.combo > 0 && now - state.lastClickAt > COMBO_WINDOW) {
    state.combo = 0;
    comboBroken = true;
  }

  const after = levelInfo(state);
  return { gain, comboBroken, levelUp: after.index > before ? LEVELS[after.index] : null };
}

/** 购买升级;脉冲不足则返回 false 且不改动状态 */
export function buy(state, id) {
  if (!(id in state.levels)) return false;
  const cost = costOf(state, id);
  if (state.pulse < cost) return false;
  state.pulse -= cost;
  state.levels[id] += 1;
  return true;
}

/* ─── 存档 ─── */

export function save(state, storage) {
  const store = storage || safeStorage();
  if (!store) return;
  try {
    store.setItem(SAVE_KEY, JSON.stringify({
      pulse: state.pulse, total: state.total, clicks: state.clicks,
      best: state.best, levels: state.levels
    }));
  } catch (_) { /* 隐私模式 / 配额不足:静默降级为不存档 */ }
}

export function load(storage) {
  const store = storage || safeStorage();
  const state = createState();
  if (!store) return state;
  try {
    const raw = store.getItem(SAVE_KEY);
    if (!raw) return state;
    const data = JSON.parse(raw);
    state.pulse  = num(data.pulse);
    state.total  = num(data.total);
    state.clicks = num(data.clicks);
    state.best   = num(data.best);
    if (data.levels) {
      state.levels.amp  = num(data.levels.amp);
      state.levels.auto = num(data.levels.auto);
    }
  } catch (_) { return createState(); }
  return state;
}

export function clearSave(storage) {
  const store = storage || safeStorage();
  if (!store) return;
  try { store.removeItem(SAVE_KEY); } catch (_) {}
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

function safeStorage() {
  try { return typeof localStorage === 'undefined' ? null : localStorage; } catch (_) { return null; }
}
