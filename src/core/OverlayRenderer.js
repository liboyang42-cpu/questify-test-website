import { setCanvasSize } from './gl.js';

export class OverlayRenderer {
  constructor(canvas, state) {
    this.canvas = canvas;
    this.state = state;
    this.ctx = null;
    this.width = 1;
    this.height = 1;
    this.dpr = 1;
  }

  mount() {
    this.ctx = this.canvas.getContext('2d', { alpha: true });
  }

  resize(width, height, dpr) {
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    setCanvasSize(this.canvas, width, height, dpr);
    if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  render({ impulses }) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = 'lighter';

    for (const impulse of impulses.impulses) {
      const t = Math.min(impulse.age / 2.3, 1);
      const radius = Math.max(0, impulse.age * impulse.speed) * Math.min(this.width, this.height) * 0.5;
      const shell = Math.max(8, impulse.width * Math.min(this.width, this.height) * 0.5);
      const alpha = Math.exp(-impulse.age * impulse.decay) * 0.18 * impulse.strength;

      const gradient = ctx.createRadialGradient(
        impulse.screenX,
        impulse.screenY,
        Math.max(0, radius - shell),
        impulse.screenX,
        impulse.screenY,
        radius + shell
      );
      gradient.addColorStop(0, 'rgba(255,255,255,0)');
      gradient.addColorStop(0.46, `rgba(255,255,255,${alpha * 0.06})`);
      gradient.addColorStop(0.52, `rgba(220,238,255,${alpha})`);
      gradient.addColorStop(0.62, `rgba(255,246,220,${alpha * 0.12})`);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(impulse.screenX, impulse.screenY, radius + shell, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(255,255,255,${alpha * (1 - t)})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.arc(impulse.screenX, impulse.screenY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  dispose() {
    this.ctx = null;
  }
}
