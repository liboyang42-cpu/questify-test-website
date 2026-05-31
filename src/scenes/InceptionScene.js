import { WebGLRenderer } from '../core/WebGLRenderer.js';
import { OverlayRenderer } from '../core/OverlayRenderer.js';
import { CameraController } from '../systems/CameraController.js';
import { WorldField } from '../systems/WorldField.js';
import { ParticleEngine } from '../particles/ParticleEngine.js';
import { ImpulseSystem } from '../systems/ImpulseSystem.js';
import { TransitionSystem } from '../systems/TransitionSystem.js';

export class InceptionScene {
  constructor(root, state) {
    this.root = root;
    this.state = state;
    this.renderer = new WebGLRenderer(root.glCanvas, state);
    this.overlay = new OverlayRenderer(root.overlayCanvas, state);
    this.camera = new CameraController(state);
    this.world = new WorldField(state);
    this.impulses = new ImpulseSystem(state);
    this.transition = new TransitionSystem(state);
    this.particles = new ParticleEngine(state);
  }

  mount() {
    this.renderer.mount();
    this.overlay.mount();
    this.world.init();
    this.particles.init();
  }

  resize(width, height, dpr) {
    this.renderer.resize(width, height, dpr);
    this.overlay.resize(width, height, dpr);
    this.world.resize(width, height);
    this.particles.resize(width, height);
  }

  update(dt) {
    this.camera.update(dt);
    this.transition.update(dt);
    this.impulses.update(dt);
    this.world.update(dt);
    this.particles.update(dt, this.impulses);
  }

  render() {
    this.renderer.render({
      world: this.world,
      particles: this.particles
    });
    this.overlay.render({
      impulses: this.impulses
    });
  }

  dispose() {
    this.renderer.dispose();
    this.overlay.dispose();
  }
}
