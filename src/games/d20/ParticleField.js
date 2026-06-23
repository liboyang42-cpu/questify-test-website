/**
 * ParticleField.js — Ambient background particle field + result burst particles.
 */

import * as THREE from 'three';

const IS_MOBILE = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
const FIELD_COUNT = IS_MOBILE ? 80 : 250;
const FIELD_SPREAD = 8;
const FIELD_HEIGHT = 5;

export class ParticleField {
  constructor(scene) {
    this.scene = scene;
    this.burstParticles = null;
    this.burstData = null;

    /* ── Background field ── */
    this._initField();
  }

  /* ─── Background field ─── */

  _initField() {
    const count = FIELD_COUNT;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * FIELD_SPREAD;
      positions[i * 3 + 1] = (Math.random() - 0.5) * FIELD_HEIGHT;
      positions[i * 3 + 2] = (Math.random() - 0.5) * FIELD_SPREAD - 2;
      sizes[i] = 0.5 + Math.random() * 1.5;
      speeds.push({
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.04
      });
    }

    this._fieldSpeeds = speeds;
    this._fieldBasePos = new Float32Array(positions);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      color: 0xc8b896,
      size: 0.035,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.field = new THREE.Points(geo, mat);
    this.field.position.set(0, 0, 0);
    this.scene.add(this.field);

    /* ── Store references for update ── */
    this._fieldPos = positions;
    this._fieldCount = count;
    this._disturbAmount = 0;
  }

  /* ─── Disturb field during roll ─── */

  disturb(intensity = 1.0) {
    this._disturbTarget = intensity;
    this._disturbAmount = 0;
  }

  /* ─── Burst particles ─── */

  emitBurst(config, position) {
    this._clearBurst();

    const count = config.particleCount;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const lifetimes = new Float32Array(count);
    const velocities = [];

    const colorObjs = config.colors.map(c => new THREE.Color(c));

    for (let i = 0; i < count; i++) {
      // Start near dice center
      positions[i * 3]     = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      // Color
      const ci = colorObjs[Math.floor(Math.random() * colorObjs.length)];
      colors[i * 3]     = ci.r;
      colors[i * 3 + 1] = ci.g;
      colors[i * 3 + 2] = ci.b;

      // Size
      sizes[i] = config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]);

      // Lifetime
      lifetimes[i] = config.duration * (0.4 + Math.random() * 0.6);

      // Velocity based on behavior
      const spd = config.speed * (0.5 + Math.random() * 0.7);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      switch (config.behavior) {
        case 'fountain': {
          // Upward burst then gravity
          velocities.push({
            x: (Math.random() - 0.5) * spd * 0.6,
            y: spd * (0.8 + Math.random() * 0.8),
            z: (Math.random() - 0.5) * spd * 0.6,
            grav: -3.0
          });
          break;
        }
        case 'ring': {
          // Horizontal ring expansion
          const angle = i * 0.1 + Math.random() * 0.3;
          velocities.push({
            x: Math.cos(angle) * spd * 0.8,
            y: (Math.random() - 0.5) * spd * 0.15,
            z: Math.sin(angle) * spd * 0.8,
            grav: 0
          });
          break;
        }
        case 'float': {
          // Gentle upward float
          velocities.push({
            x: (Math.random() - 0.5) * spd * 0.3,
            y: spd * (0.3 + Math.random() * 0.4),
            z: (Math.random() - 0.5) * spd * 0.3,
            grav: -0.3
          });
          break;
        }
        case 'drift': {
          // Slow downward drift
          velocities.push({
            x: (Math.random() - 0.5) * spd * 0.4,
            y: -spd * (0.2 + Math.random() * 0.3),
            z: (Math.random() - 0.5) * spd * 0.4,
            grav: -0.5
          });
          break;
        }
        case 'explode':
        default: {
          // Explosive burst
          velocities.push({
            x: Math.sin(theta) * Math.cos(phi) * spd,
            y: Math.sin(phi) * spd + Math.random() * 0.5,
            z: Math.cos(theta) * Math.cos(phi) * spd,
            grav: -2.0
          });
          break;
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    this.burstParticles = new THREE.Points(geo, mat);
    if (position) this.burstParticles.position.copy(position);
    this.burstData = {
      velocities,
      lifetimes,
      maxLifetime: Math.max(...lifetimes),
      duration: config.duration,
      decayThreshold: 0.15
    };
    this.scene.add(this.burstParticles);
  }

  /* ─── Update ─── */

  update(time) {
    const now = time * 0.001;

    /* ── Background field ── */
    if (this.field) {
      const pos = this._fieldPos;
      const count = this._fieldCount;

      // Smooth disturb: attack then release
      if (this._disturbTarget > 0) {
        if (this._disturbAmount < this._disturbTarget) {
          this._disturbAmount = Math.min(this._disturbAmount + 0.02, this._disturbTarget);
        } else {
          this._disturbTarget = 0;
        }
      } else if (this._disturbAmount > 0.001) {
        this._disturbAmount *= 0.995;
      } else {
        this._disturbAmount = 0;
      }

      for (let i = 0; i < count; i++) {
        const s = this._fieldSpeeds[i];
        const drift = Math.sin(now * 0.2 + i) * 0.005;

        pos[i * 3]     += s.x + drift;
        pos[i * 3 + 1] += s.y + Math.sin(now * 0.3 + i * 0.1) * 0.003;
        pos[i * 3 + 2] += s.z;

        // Disturb: push outward from center
        if (this._disturbAmount > 0.001) {
          const dx = pos[i * 3] - this._basePos(i * 3);
          const dz = pos[i * 3 + 2] - this._basePos(i * 3 + 2);
          pos[i * 3]     += dx * this._disturbAmount * 0.02;
          pos[i * 3 + 2] += dz * this._disturbAmount * 0.02;
          pos[i * 3 + 1] += Math.abs(pos[i * 3 + 1]) * this._disturbAmount * 0.01;
        }

        // Wrap around
        if (Math.abs(pos[i * 3]) > FIELD_SPREAD * 0.5) pos[i * 3] *= -0.9;
        if (Math.abs(pos[i * 3 + 2]) > FIELD_SPREAD * 0.5) pos[i * 3 + 2] *= -0.9;
      }

      this.field.geometry.attributes.position.needsUpdate = true;
    }

    /* ── Burst particles ── */
    if (this.burstParticles && this.burstData) {
      const data = this.burstData;
      const pos = this.burstParticles.geometry.attributes.position.array;
      const sizes = this.burstParticles.geometry.attributes.size.array;
      const count = pos.length / 3;
      let alive = false;

      for (let i = 0; i < count; i++) {
        const life = data.lifetimes[i];
        if (life <= 0) {
          sizes[i] = 0;
          continue;
        }

        alive = true;
        const dt = 0.016;
        data.lifetimes[i] -= dt;

        const v = data.velocities[i];
        // Gravity
        if (v.grav) v.y += v.grav * dt;

        // Damping
        v.x *= 0.99;
        v.y *= 0.98;
        v.z *= 0.99;

        pos[i * 3]     += v.x * dt * 60;
        pos[i * 3 + 1] += v.y * dt * 60;
        pos[i * 3 + 2] += v.z * dt * 60;

        // Fade size over lifetime
        const lifeRatio = 1 - data.lifetimes[i] / data.maxLifetime;
        if (lifeRatio > 0.6) {
          const fadeProgress = (lifeRatio - 0.6) / 0.4;
          sizes[i] *= (1 - fadeProgress * 0.02);
        }
      }

      this.burstParticles.geometry.attributes.position.needsUpdate = true;
      this.burstParticles.geometry.attributes.size.needsUpdate = true;

      // Fade opacity near end
      const maxLifeLeft = Math.max(...data.lifetimes);
      if (maxLifeLeft < data.maxLifetime * data.decayThreshold) {
        const fade = maxLifeLeft / (data.maxLifetime * data.decayThreshold);
        this.burstParticles.material.opacity = fade;
      }

      if (!alive) {
        this._clearBurst();
      }
    }
  }

  /* ─── Cleanup ─── */

  _clearBurst() {
    if (this.burstParticles) {
      this.scene.remove(this.burstParticles);
      this.burstParticles.geometry.dispose();
      this.burstParticles.material.dispose();
      this.burstParticles = null;
      this.burstData = null;
    }
  }

  dispose() {
    this._clearBurst();
    if (this.field) {
      this.scene.remove(this.field);
      this.field.geometry.dispose();
      this.field.material.dispose();
      this.field = null;
    }
  }

  _basePos(offset) {
    return this._fieldBasePos[offset];
  }
}
