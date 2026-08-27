/**
 * src/games/counter — 共享「城市脉冲」计数器游戏库。
 * 与 d20 一致的挂载约定:mount(container) → 带 .destroy() 的实例。
 * 纯 Canvas 2D + DOM,不需要 WebGL,因此没有降级分支。
 */
import { CounterGame } from './CounterGame.js';

/**
 * 把计数器游戏挂载到一个有尺寸的容器里。
 * @param {HTMLElement} container 需有明确宽高(getBoundingClientRect 用于初始化画布)
 * @returns {CounterGame} 实例,带 .destroy()
 */
export function mount(container) {
  if (!container) return null;
  if (getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }
  return new CounterGame(container);
}

export { CounterGame };
