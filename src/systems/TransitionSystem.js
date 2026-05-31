import { damp } from '../utils/math.js';

export class TransitionSystem {
  constructor(state) {
    this.state = state;
    this.active = false;
    this.time = 0;
    this.startedAt = 0;
    this.velocity = 0;
    this.distance = 0;
  }

  update(dt) {
    const scene = this.state.scene;

    if (scene.transitionRequested && !this.active) {
      this.active = true;
      this.time = 0;
      this.startedAt = performance.now();
      this.velocity = 0.08;
      this.distance = 0;
      scene.transitionRequested = false;
      scene.transitionPhase = 'collapse';
      scene.transitionProgress = 0.001;
      scene.transitionKind = scene.nextScene === 'bloom' ? 'compression' : (scene.transitionKind || 'immersion');
      scene.compression = scene.transitionKind === 'compression' ? 0.04 : 0;
      scene.dive = 0;
      scene.exposure = 0.04;
      scene.whiteout = 0;
      scene.cityReveal = 0;
      scene.pulse = 1;
    }

    if (!this.active) {
      scene.transitionPhase = 'idle';
      scene.transitionProgress = 0;
      scene.exposure = damp(scene.exposure, 0, 2, dt);
      scene.whiteout = damp(scene.whiteout, 0, 2, dt);
      scene.cityReveal = damp(scene.cityReveal, 0, 2, dt);
      scene.dive = damp(scene.dive, 0, 2, dt);
      scene.collapseEnergy = 0;
      scene.compression = damp(scene.compression || 0, 0, 2, dt);
      return;
    }

    this.time += dt;
    const simulatedT = Math.min(this.time / 4, 1);
    const clockT = this.startedAt ? Math.min((performance.now() - this.startedAt) / 4000, 1) : simulatedT;
    const t = Math.max(simulatedT, clockT);
    const compressionMode = scene.transitionKind === 'compression';
    const acceleration = compressionMode
      ? 0.11 + Math.pow(t, 2.45) * 9.2
      : 0.16 + Math.pow(t, 2.85) * 11.5;
    this.velocity += acceleration * dt;
    this.velocity = Math.min(this.velocity, compressionMode ? 10.2 : 12.5);
    this.distance += this.velocity * dt;

    const travel = Math.min(t, 1);
    const energy = compressionMode ? Math.pow(t, 1.08) : Math.pow(t, 1.35);
    const proximity = Math.min(this.distance / (compressionMode ? 6.6 : 7.2), 1);
    const saturation = Math.max(0, (t - (compressionMode ? 0.76 : 0.72)) / (compressionMode ? 0.24 : 0.28));
    const city = Math.max(0, (t - 0.96) / 0.04);

    scene.transitionPhase = city > 0 ? 'city' : 'collapse';
    scene.transitionProgress = travel;
    scene.collapseEnergy = energy;
    scene.compression = compressionMode ? Math.min(1, Math.pow(t, 1.22) * 1.18) : 0;
    scene.dive = this.distance;
    scene.exposure = 0.04 + Math.pow(proximity, compressionMode ? 2.25 : 2.65) * (compressionMode ? 2.8 : 3.5);
    scene.whiteout = Math.min(1, Math.pow(saturation, 1.7));
    scene.cityReveal = Math.min(1, Math.pow(city, 1.2));
    scene.pulse = Math.max(scene.pulse, energy);
  }
}
