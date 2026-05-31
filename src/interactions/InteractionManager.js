import { clamp, normalizePointer } from '../utils/math.js';

export class InteractionManager {
  constructor(target, state) {
    this.target = target;
    this.state = state;
  }

  mount() {
    this.target.addEventListener('pointermove', this.onPointerMove, { passive: true });
    this.target.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    this.target.addEventListener('wheel', this.onWheel, { passive: true });
    this.target.addEventListener('resize', this.onResize, { passive: true });
    this.onResize();
  }

  dispose() {
    this.target.removeEventListener('pointermove', this.onPointerMove);
    this.target.removeEventListener('pointerdown', this.onPointerDown);
    this.target.removeEventListener('wheel', this.onWheel);
    this.target.removeEventListener('resize', this.onResize);
  }

  onPointerMove = (event) => {
    const { pointer, viewport } = this.state;
    pointer.targetX = event.clientX;
    pointer.targetY = event.clientY;
    pointer.active = true;
    pointer.idle = 0;

    const n = normalizePointer(event.clientX, event.clientY, viewport.width, viewport.height);
    pointer.nx = n.x;
    pointer.ny = n.y;
  };

  onPointerDown = (event) => {
    if (event.target.closest('[data-transition-trigger]')) {
      const trigger = event.target.closest('[data-transition-trigger]');
      this.state.scene.nextScene = trigger.dataset.nextScene || 'asme';
      this.state.scene.transitionKind = this.state.scene.nextScene === 'bloom' ? 'compression' : 'immersion';
      this.state.scene.transitionRequested = true;
      return;
    }

    this.state.pointer.targetX = event.clientX;
    this.state.pointer.targetY = event.clientY;
    this.state.pointer.active = true;
    this.state.pointer.idle = 0;
    this.state.gestures.clickBursts.push({
      x: event.clientX,
      y: event.clientY,
      nx: this.state.pointer.nx,
      ny: this.state.pointer.ny,
      age: 0,
      strength: clamp(0.65 + this.state.pointer.smoothSpeed * 0.006, 0.65, 1.45)
    });
  };

  onWheel = (event) => {
    if (
      this.state.scene.transitionPhase === 'idle'
      && Math.abs(event.deltaY) > 12
      && !this.state.scene.transitionRequested
    ) {
      this.state.scene.nextScene = 'bloom';
      this.state.scene.transitionKind = 'compression';
      this.state.scene.transitionRequested = true;
      return;
    }

    this.state.gestures.wheelImpulse += clamp(event.deltaY * 0.0015, -0.75, 0.75);
  };

  onResize = () => {
    this.state.viewport.needsResize = true;
  };
}
