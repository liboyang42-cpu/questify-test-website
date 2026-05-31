import { damp } from '../utils/math.js';

export class WorldField {
  constructor(state) {
    this.state = state;
    this.vertices = new Float32Array();
    this.count = 0;
    this.anchors = [];
  }

  init() {
    this.createAnchors();
  }

  resize() {
    this.buildGrid();
    this.createAnchors();
  }

  update(dt) {
    const { scene, pointer, gestures } = this.state;

    let nearest = -1;
    let nearestDistance = Infinity;
    for (let i = 0; i < this.anchors.length; i += 1) {
      const anchor = this.anchors[i];
      const distance = Math.hypot(pointer.nx - anchor.x, pointer.ny - anchor.y);
      anchor.hover = damp(anchor.hover, distance < 0.22 ? 1 : 0, 9, dt);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = i;
      }
    }

    scene.hoveredAnchor = nearestDistance < 0.24 ? nearest : -1;
    const speedLift = Math.min(pointer.smoothSpeed * 0.035, 1.15);
    const clickLift = gestures.clickBursts.reduce((sum, burst) => sum + burst.strength, 0);
    const impulseLift = scene.impulseEnergy ?? 0;
    scene.bend = damp(scene.bend, 0.72 + speedLift + clickLift * 0.18 + impulseLift * 0.22, 3.2, dt);
    scene.pulse = damp(scene.pulse, Math.min(1, clickLift + impulseLift * 0.65), 4.8, dt);
  }

  buildGrid() {
    const size = this.state.quality.gridSize;
    const lines = [];
    const extentX = 1.42;
    const extentY = 1.05;

    for (let i = 0; i <= size; i += 1) {
      const t = i / size;
      const x = -extentX + t * extentX * 2;
      lines.push(x, -extentY, x, extentY);

      const y = -extentY + t * extentY * 2;
      lines.push(-extentX, y, extentX, y);
    }

    this.vertices = new Float32Array(lines);
    this.count = this.vertices.length / 2;
  }

  createAnchors() {
    this.anchors = [
      { x: -0.62, y: 0.36, hover: 0, phase: 0.0 },
      { x: 0.58, y: 0.3, hover: 0, phase: 1.7 },
      { x: -0.18, y: -0.16, hover: 0, phase: 3.2 },
      { x: 0.34, y: -0.46, hover: 0, phase: 4.5 }
    ];
  }
}
