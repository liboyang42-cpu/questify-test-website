/**
 * src/games/d20 — 共享 d20 掷骰子游戏库。
 * 两个入口(首页展示位 / app 列表详情)都通过 mount() 挂载同一套游戏。
 */
import { DiceGame } from './DiceGame.js';

/**
 * 把 d20 游戏挂载到一个有尺寸的容器里。
 * @param {HTMLElement} container 需有明确宽高(getBoundingClientRect 用于初始化画布)
 * @returns {DiceGame} 实例,带 .destroy()
 */
export function mount(container) {
  // WebGL 不支持:显示静态降级卡片,不创建 WebGL 渲染器(M2-24)
  if (typeof window !== 'undefined' && window.cyWebGLSupported && !window.cyWebGLSupported()) {
    if (container && getComputedStyle(container).position === 'static') {
      container.style.position = 'relative';
    }
    if (window.cyShowWebGLFallback) {
      window.cyShowWebGLFallback(container, {
        title: 'd20 需要 3D 渲染(WebGL)',
        text: '你的浏览器或设备暂不支持 WebGL,无法运行 d20 掷骰演示。',
      });
    }
    return null;
  }
  return new DiceGame(container);
}

export { DiceGame };
