/**
 * DiceState.js — Pure roll logic, result classification, and effect parameter generation.
 * No Three.js dependency.
 */

// labelZh:给屏幕阅读器播报用(F39)。页面 lang="zh-CN",英文 label 会被中文语音引擎逐字母念。
const CATEGORIES = {
  CRITICAL_SUCCESS: { name: 'criticalSuccess', label: 'CRITICAL SUCCESS', labelZh: '大成功', icon: '\u{1F389}', min: 20, max: 20 },
  GREAT_SUCCESS:    { name: 'greatSuccess',    label: 'GREAT SUCCESS',    labelZh: '成功',   icon: '\u{1F537}', min: 15, max: 19 },
  SUCCESS:          { name: 'success',          label: 'SUCCESS',          labelZh: '通过',   icon: '✅',   min: 10, max: 14 },
  FAILURE:          { name: 'failure',          label: 'FAILURE',          labelZh: '失败',   icon: '❌',   min: 2,  max: 9 },
  CRITICAL_FAILURE: { name: 'criticalFailure',  label: 'CRITICAL FAILURE', labelZh: '大失败', icon: '\u{1F480}', min: 1,  max: 1 }
};

const CATEGORY_LIST = Object.values(CATEGORIES);

/* ─── Effect parameter configs ─── */

const EFFECT_BASE = {
  criticalSuccess: {
    particleCount: [300, 500],
    duration:      [3.0, 4.0],
    speed:         [6, 10],
    sizeRange:     [0.04, 0.18],
    colors:        ['#FFD700', '#FFA000', '#FFE082', '#FFF8E1'],
    behavior:      'fountain',
    overlayColor:  { r: 1.0, g: 0.78, b: 0.2 },
    overlayMax:    0.5,
    diceEmissive:  0xFFD700,
    diceEmissiveIntensity: 0.8,
    cameraShake:   { amount: 2, duration: 400, decay: 0.85 }
  },
  greatSuccess: {
    particleCount: [120, 220],
    duration:      [2.0, 3.0],
    speed:         [3, 6],
    sizeRange:     [0.03, 0.14],
    colors:        ['#4FC3F7', '#81D4FA', '#E3F2FD', '#FFFFFF'],
    behavior:      'ring',
    overlayColor:  { r: 0.31, g: 0.76, b: 0.97 },
    overlayMax:    0.25,
    diceEmissive:  0x4FC3F7,
    diceEmissiveIntensity: 0.5,
    cameraShake:   null
  },
  success: {
    particleCount: [80, 150],
    duration:      [1.5, 2.5],
    speed:         [2, 4],
    sizeRange:     [0.025, 0.10],
    colors:        ['#66BB6A', '#A5D6A7', '#C8E6C9'],
    behavior:      'float',
    overlayColor:  { r: 0.4, g: 0.73, b: 0.42 },
    overlayMax:    0.18,
    diceEmissive:  0x66BB6A,
    diceEmissiveIntensity: 0.3,
    cameraShake:   null
  },
  failure: {
    particleCount: [60, 100],
    duration:      [1.5, 2.0],
    speed:         [1.5, 3],
    sizeRange:     [0.02, 0.08],
    colors:        ['#78909C', '#90A4AE', '#B0BEC5', '#455A64'],
    behavior:      'drift',
    overlayColor:  { r: 0.0, g: 0.0, b: 0.0 },
    overlayMax:    0.18,
    diceEmissive:  0x455A64,
    diceEmissiveIntensity: 0.15,
    diceDim:       true,
    cameraShake:   null
  },
  criticalFailure: {
    particleCount: [200, 380],
    duration:      [3.0, 4.5],
    speed:         [5, 9],
    sizeRange:     [0.04, 0.20],
    colors:        ['#D32F2F', '#B71C1C', '#E57373', '#FFCDD2'],
    behavior:      'explode',
    overlayColor:  { r: 0.83, g: 0.18, b: 0.18 },
    overlayMax:    0.45,
    diceEmissive:  0xD32F2F,
    diceEmissiveIntensity: 0.9,
    cameraShake:   { amount: 8, duration: 600, decay: 0.9 }
  }
};

/* ─── Public API ─── */

export function roll() {
  const value = Math.floor(Math.random() * 20) + 1;
  const category = categorize(value);
  const intensity = calcIntensity(value, category);
  const config = buildEffectConfig(category, intensity);
  return { value, category, intensity, config };
}

export function getCategoryNames() {
  return CATEGORY_LIST.map(c => c.name);
}

export function getCategoryByValue(value) {
  return categorize(value);
}

/* ─── Internal ─── */

function categorize(value) {
  for (const cat of CATEGORY_LIST) {
    if (value >= cat.min && value <= cat.max) return cat;
  }
  return CATEGORIES.FAILURE;
}

function calcIntensity(value, category) {
  const range = category.max - category.min;
  if (range === 0) return 1;
  return (value - category.min) / range;
}

function buildEffectConfig(category, intensity) {
  const base = EFFECT_BASE[category.name];
  if (!base) return buildEffectConfig(CATEGORIES.SUCCESS, 0.5);

  const lerp = (a, b, t) => a + (b - a) * t;

  return {
    particleCount: Math.round(lerp(base.particleCount[0], base.particleCount[1], intensity)),
    duration:      lerp(base.duration[0], base.duration[1], intensity),
    speed:         lerp(base.speed[0], base.speed[1], intensity),
    sizeRange:     base.sizeRange,
    colors:        base.colors,
    behavior:      base.behavior,
    overlayColor:  base.overlayColor,
    overlayMax:    lerp(base.overlayMax * 0.5, base.overlayMax, intensity),
    diceEmissive:  base.diceEmissive,
    diceEmissiveIntensity: lerp(base.diceEmissiveIntensity * 0.6, base.diceEmissiveIntensity, intensity),
    diceDim:       base.diceDim || false,
    cameraShake:   base.cameraShake,
    categoryLabel: category.label,
    categoryLabelZh: category.labelZh,
    categoryIcon:  category.icon
  };
}
