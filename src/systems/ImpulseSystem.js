import { damp } from '../utils/math.js';

export class ImpulseSystem {
  constructor(state) {
    this.state = state;
    this.impulses = [];
    this.energy = 0;
  }

  update(dt) {
    const bursts = this.state.gestures.clickBursts;
    while (bursts.length) {
      const strength = 0.85 + bursts[0].strength * 0.35;
      const burst = bursts.shift();
      this.impulses.push({
        id: `${Date.now()}-${Math.random()}`,
        x: burst.nx,
        y: burst.ny,
        screenX: burst.x,
        screenY: burst.y,
        age: 0,
        strength,
        speed: 1.05 + Math.random() * 0.22,
        width: 0.08 + Math.random() * 0.025,
        decay: 1.28,
        turbulence: Math.random() * Math.PI * 2
      });
      this.energy = Math.min(1.8, this.energy + strength * 0.65);
    }

    for (let i = this.impulses.length - 1; i >= 0; i -= 1) {
      const impulse = this.impulses[i];
      impulse.age += dt;
      if (impulse.age > 2.3) {
        this.impulses.splice(i, 1);
      }
    }

    this.energy = damp(this.energy, 0, 1.45, dt);
    this.state.scene.impulseEnergy = this.energy;
  }
}
