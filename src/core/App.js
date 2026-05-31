import { InteractionManager } from '../interactions/InteractionManager.js';
import { clamp } from '../utils/math.js';

export class App {
  constructor({ state, scene, root, scheduler }) {
    this.state = state;
    this.root = root;
    this.scene = new scene(root, state);
    this.scheduler = scheduler;
    this.interactions = new InteractionManager(window, state);
    this.running = false;
    this.paused = false;
    this.frameId = 0;
    this.lastTime = 0;
    this.startTime = 0;
    this.fpsSamples = [];
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.interactions.mount();
    this.scene.mount();
    this.resize();
    this.lastTime = performance.now();
    this.startTime = 0;
    this.frameId = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    this.paused = false;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = 0;
    this.interactions.dispose();
    this.scene.dispose();
  }

  pause() {
    if (!this.running || this.paused) return;
    this.paused = true;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = 0;
    this.interactions.dispose();
  }

  resume() {
    if (!this.running || !this.paused) return;
    this.paused = false;
    this.interactions.mount();
    this.lastTime = performance.now();
    this.frameId = requestAnimationFrame(this.tick);
  }

  tick = (now) => {
    if (!this.running || this.paused) return;

    if (!this.startTime) {
      this.startTime = now - this.state.time * 1000;
      this.lastTime = now;
    }

    const dt = clamp((now - this.lastTime) / 1000, 0.001, 0.045);
    this.lastTime = now;

    const state = this.state;
    state.dt = dt;
    state.time = (now - this.startTime) / 1000;
    state.frame += 1;

    if (state.viewport.needsResize) {
      this.resize();
    }

    this.scene.update(dt);
    document.body.dataset.phase = state.scene.transitionPhase;
    document.body.dataset.nextScene = state.scene.nextScene || 'asme';
    this.syncScheduler();
    if (this.paused) return;
    this.scene.render();
    this.updateFps(dt);

    this.frameId = requestAnimationFrame(this.tick);
  };

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dprLimit = width < 760 ? 1.35 : 1.75;
    const dpr = Math.min(window.devicePixelRatio || 1, dprLimit);
    const tier = width < 760 ? 'mobile' : width < 1100 ? 'medium' : 'high';

    this.state.viewport.width = width;
    this.state.viewport.height = height;
    this.state.viewport.aspect = width / Math.max(height, 1);
    this.state.viewport.needsResize = false;
    this.state.quality.dpr = dpr;
    this.state.quality.tier = tier;
    this.state.quality.particleCount = tier === 'mobile' ? 2400 : tier === 'medium' ? 5200 : 11200;
    this.state.quality.gridSize = tier === 'mobile' ? 42 : tier === 'medium' ? 54 : 66;

    this.scene.resize(width, height, dpr);
  }

  syncScheduler() {
    if (!this.scheduler) return;
    const scene = this.state.scene;
    const next = scene.transitionPhase === 'city' ? (scene.nextScene || 'asme') : 'galaxy';
    this.scheduler.activate(next);
  }

  updateFps(dt) {
    this.fpsSamples.push(1 / dt);
    if (this.fpsSamples.length < 28) return;

    const average = this.fpsSamples.reduce((sum, fps) => sum + fps, 0) / this.fpsSamples.length;
    this.fpsSamples.length = 0;

    if (this.root.fps) {
      this.root.fps.textContent = String(Math.round(average));
    }
  }
}
