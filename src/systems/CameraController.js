import { clamp, damp, spring } from '../utils/math.js';

export class CameraController {
  constructor(state) {
    this.state = state;
  }

  update(dt) {
    const { camera, pointer, gestures, viewport } = this.state;

    pointer.idle += dt;
    pointer.x = damp(pointer.x, pointer.targetX, 18, dt);
    pointer.y = damp(pointer.y, pointer.targetY, 18, dt);
    pointer.vx = (pointer.targetX - pointer.x) / Math.max(dt, 0.001);
    pointer.vy = (pointer.targetY - pointer.y) / Math.max(dt, 0.001);
    pointer.speed = Math.hypot(pointer.vx, pointer.vy) * 0.016;
    pointer.smoothSpeed = damp(pointer.smoothSpeed, pointer.speed, 8, dt);

    const idleDrift = pointer.idle > 1.8 ? 1 : 0;
    camera.drift += dt * 0.16;
    camera.scroll = damp(camera.scroll, camera.scroll + gestures.wheelImpulse, 7, dt);
    camera.scroll = clamp(camera.scroll, -1.2, 1.4);
    gestures.wheelImpulse = 0;

    const breathing = Math.sin(camera.drift * 0.63) * 0.035 + Math.sin(camera.drift * 1.17) * 0.012;
    camera.targetX = Math.sin(camera.drift) * 0.018 * idleDrift;
    camera.targetY = Math.cos(camera.drift * 0.73) * 0.014 * idleDrift;
    camera.targetZ = 0.82 + camera.scroll * 0.08 + breathing;

    [camera.x, camera.vx] = spring(camera.x, camera.vx, camera.targetX, 18, 5.8, dt);
    [camera.y, camera.vy] = spring(camera.y, camera.vy, camera.targetY, 18, 5.8, dt);
    [camera.z, camera.vz] = spring(camera.z, camera.vz, camera.targetZ, 16, 5.2, dt);

    const diagonal = Math.hypot(viewport.width, viewport.height);
    this.state.scene.magnetic = damp(this.state.scene.magnetic, pointer.smoothSpeed / Math.max(diagonal * 0.012, 1), 6, dt);
  }
}
