/**
 * EffectBurst.js — Color overlay and camera shake for dice outcomes.
 */

import * as THREE from 'three';

export class EffectBurst {
  constructor(options = {}) {
    this.scene = options.scene;
    this.camera = options.camera;
    this.overlayEl = options.overlayEl || null;

    this._shakeTimer = 0;
    this._shakeDuration = 0;
    this._shakeAmount = 0;
    this._shakeDecay = 0.9;
    this._shakeOffset = { x: 0, y: 0 };

    this._active = false;
    this._lifetime = 0;
    this._duration = 0;
    this._overlayColor = null;
    this._overlayMax = 0;
  }

  /* ─── Trigger burst ─── */

  trigger(value, config) {
    this.clear();
    this._active = true;
    this._lifetime = 0;
    this._duration = config.duration;
    this._overlayColor = config.overlayColor;
    this._overlayMax = config.overlayMax;

    /* ── Camera shake ── */
    if (config.cameraShake) {
      this._shakeTimer = 0;
      this._shakeDuration = config.cameraShake.duration;
      this._shakeAmount = config.cameraShake.amount;
      this._shakeDecay = config.cameraShake.decay || 0.9;
    }

    /* Result numbers live on the die faces; no floating result label. */
  }

  /* ─── Update ─── */

  update(time, dt) {
    if (!this._active || !dt) return;
    this._lifetime += dt;
    if (this._shakeAmount > 0.1 && this._shakeTimer < this._shakeDuration) {
      this._shakeTimer += dt * 1000;
      const decay = Math.pow(this._shakeDecay, this._shakeTimer / 16);
      const current = this._shakeAmount * decay;
      this._shakeOffset.x = (Math.random() - 0.5) * current * 0.02;
      this._shakeOffset.y = (Math.random() - 0.5) * current * 0.02;
      this.camera.position.x += this._shakeOffset.x;
      this.camera.position.y += this._shakeOffset.y;

      if (this._shakeTimer >= this._shakeDuration) {
        this._shakeAmount = 0;
        this._shakeOffset.x = 0;
        this._shakeOffset.y = 0;
      }
    }

    /* ── Overlay ── */
    if (this.overlayEl && this._overlayColor) {
      const progress = this._lifetime / this._duration;
      let opacity = 0;
      if (progress < 0.1) {
        opacity = (progress / 0.1) * this._overlayMax;
      } else if (progress > 0.5) {
        opacity = (1 - (progress - 0.5) / 0.5) * this._overlayMax;
      } else {
        opacity = this._overlayMax;
      }
      this.overlayEl.style.opacity = String(opacity);
    }

    // End of effect
    if (this._lifetime >= this._duration) {
      this._finish();
    }
  }

  /* ─── Clear ─── */

  clear() {
    this._resetShake();
    this._resetOverlay();
    this._active = false;
    this._lifetime = 0;
  }

  dispose() {
    this.clear();
  }

  /* ─── Shake ─── */

  get isShaking() {
    return this._shakeAmount > 0.1;
  }

  _resetShake() {
    this._shakeTimer = 0;
    this._shakeDuration = 0;
    this._shakeAmount = 0;
    this._shakeOffset = { x: 0, y: 0 };
  }

  /* ─── Overlay ─── */

  _resetOverlay() {
    if (this.overlayEl) {
      this.overlayEl.style.opacity = '0';
    }
  }

  /* ─── Finish ─── */

  _finish() {
    this.clear();
  }

  /* ─── Utils ─── */

  _rgba(colorObj, alpha) {
    return `rgba(${Math.round(colorObj.r * 255)},${Math.round(colorObj.g * 255)},${Math.round(colorObj.b * 255)},${alpha})`;
  }
}
