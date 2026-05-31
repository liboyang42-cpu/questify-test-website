/**
 * DiceGame.js — Main orchestrator. Creates Three.js scene, manages dice + particles + effects lifecycle.
 */

import * as THREE from 'three';
import { DiceObject } from './DiceObject.js';
import { ParticleField } from './ParticleField.js';
import { EffectBurst } from './EffectBurst.js';
import { roll as diceRoll } from './DiceState.js';

export class DiceGame {
  constructor(container) {
    this.container = container;

    // WebGL support check
    const hasWebGL = (() => {
      try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl') || c.getContext('webgl2'));
      } catch (_) { return false; }
    })();

    if (!hasWebGL) {
      container.innerHTML = `<div class="vex-dice-fallback">
        <span style="font-size:11px;letter-spacing:.1em;color:rgba(255,255,255,.2);text-transform:uppercase">WebGL not supported — upgrade your browser</span>
      </div>`;
      this._destroyed = true;
      return;
    }

    this._destroyed = false;

    /* ── Renderer ── */
    const rect = container.getBoundingClientRect();
    const w = rect.width || 600;
    const h = rect.height || 500;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x070708, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.display = 'block';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.cursor = 'pointer';
    container.appendChild(this.renderer.domElement);

    /* ── Overlay DOM element for color wash ── */
    this.overlayEl = document.createElement('div');
    this.overlayEl.className = 'vex-dice-overlay';
    this.overlayEl.style.cssText = `
      position: absolute; inset: 0; pointer-events: none;
      mix-blend-mode: overlay; opacity: 0;
      transition: opacity 0.05s ease;
      background: transparent;
      z-index: 2;
    `;
    container.appendChild(this.overlayEl);

    /* ── Scene ── */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070708);
    this.scene.fog = new THREE.FogExp2(0x070708, 0.028);

    /* ── Camera ── */
    this.camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 20);
    this.camera.position.set(0, 0.18, 5.7);
    this._baseCameraPos = new THREE.Vector3(0, 0.18, 5.7);

    /* ── Lighting ── */
    this._setupLights();

    /* ── Ground plane ── */
    this._setupGround();

    /* ── Components ── */
    this.dice = new DiceObject();
    this.scene.add(this.dice.getObject());

    this.particles = new ParticleField(this.scene);

    this.effects = new EffectBurst({
      scene: this.scene,
      camera: this.camera,
      overlayEl: this.overlayEl
    });

    /* ── State ── */
    this._isProcessing = false;
    this._lastResult = null;

    /* ── Camera animation — settle, reveal, then return ── */
    this._camPhase = null;           // null | 'waiting' | 'moving' | 'showing' | 'returning'
    this._camProgress = 0;
    this._camStartPos = new THREE.Vector3();
    this._resultCamOffset = new THREE.Vector3(0, 2.8, 0.95);
    this._resultCamPos = new THREE.Vector3();
    this._lookTarget = new THREE.Vector3(0, 0, 0);
    this._camStartLookTarget = new THREE.Vector3(0, 0, 0);
    this._finalDicePos = new THREE.Vector3(0, 0, 0);
    this._showTimer = 0;
    this._waitTimer = 0;
    this._resultFaceLocked = false;

    /* ── Click handler ── */
    this._onClick = this._handleClick.bind(this);
    this.renderer.domElement.addEventListener('click', this._onClick);

    /* ── Resize ── */
    this._onResize = this._resize.bind(this);
    window.addEventListener('resize', this._onResize);

    /* ── Start loop ── */
    this._lastTime = performance.now();
    this._tick = this._tick.bind(this);
    this._animFrame = requestAnimationFrame(this._tick);
  }

  /* ─── Lighting ─── */

  _setupLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.42);
    this.scene.add(ambient);

    const key = new THREE.DirectionalLight(0xffffff, 2.35);
    key.position.set(-3.2, 4.8, 5.2);
    this.scene.add(key);

    const fill = new THREE.DirectionalLight(0xd9e6ff, 0.34);
    fill.position.set(3, 1, 4);
    this.scene.add(fill);

    const rim = new THREE.DirectionalLight(0xffffff, 0.52);
    rim.position.set(2, 3.6, -3);
    this.scene.add(rim);

    this.effectLight = new THREE.PointLight(0xffffff, 0, 6);
    this.effectLight.position.set(0, 0, 0);
    this.scene.add(this.effectLight);
  }

  /* ─── Ground plane ─── */

  _setupGround() {
    // Procedural gaming mat texture with fabric noise
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(size, size);
    const d = imageData.data;

    // Dark charcoal felt base (like a premium gaming mat)
    const baseR = 26, baseG = 26, baseB = 32;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const dx = (x - size / 2) / (size / 2);
        const dy = (y - size / 2) / (size / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Fabric weave noise (subtle diagonal pattern)
        const weave = (
          Math.sin(x * 0.4 + y * 0.2) * Math.sin(y * 0.35 - x * 0.15) * 3.5 +
          Math.sin(x * 0.8 + y * 0.6) * 1.5 +
          Math.sin(y * 1.2 + x * 0.7) * 1.2
        );

        // Fine grain noise
        const grain = (Math.random() - 0.5) * 1.5;

        // Vignette: darker at edges
        const vignette = 1 - dist * dist * 0.35;
        const edgeFade = Math.max(0, 1 - Math.pow(Math.max(0, dist - 0.7) / 0.3, 2));

        // Soft center glow (very subtle)
        const centerGlow = Math.max(0, 1 - dist * 1.5) * 8;

        const r = (baseR + weave + grain + centerGlow) * vignette;
        const g = (baseG + weave * 0.9 + grain + centerGlow * 0.9) * vignette;
        const b = (baseB + weave * 0.7 + grain * 0.8 + centerGlow * 0.7) * vignette;

        d[i]     = Math.max(0, Math.min(255, r));
        d[i + 1] = Math.max(0, Math.min(255, g));
        d[i + 2] = Math.max(0, Math.min(255, b));
        d[i + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Very faint concentric reference rings
    ctx.strokeStyle = 'rgba(60,60,80,0.07)';
    ctx.lineWidth = 1;
    for (let r = 0.5; r <= 2.5; r += 0.5) {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, (r / 3) * size / 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 4;

    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.95,
      metalness: 0,
      side: THREE.DoubleSide,
      depthWrite: true
    });
    this.ground = new THREE.Mesh(new THREE.CircleGeometry(3, 48), mat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = 0;
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);
  }

  /* ─── Click ─── */

  _handleClick(event) {
    if (this._camPhase === 'showing' || this._camPhase === 'returning') return;
    if (this._destroyed || this._isProcessing) return;
    this._startRoll();
  }

  /* ─── Roll cycle ─── */

  _startRoll() {
    this._isProcessing = true;

    // Reset camera
    this._camPhase = null;
    this._waitTimer = 0;
    this._showTimer = 0;
    this._resultFaceLocked = false;
    this.camera.position.copy(this._baseCameraPos);
    this.camera.up.set(0, 1, 0);
    this._lookTarget.set(0, 0, 0);

    // Reset dice
    this.dice.clearHighlight();
    this.dice.restoreColor();

    // Reset effects
    this.effectLight.intensity = 0;
    if (this.overlayEl) this.overlayEl.style.opacity = '0';

    // Disturb particle field
    this.particles.disturb(1.0);

    // Roll dice
    this.dice.roll();

    // Determine result
    this._pendingResult = diceRoll();
  }

  _finishRoll() {
    const result = this._pendingResult;
    this._pendingResult = null;
    this._lastResult = result;

    // Capture final dice position for camera + effects
    this._finalDicePos.copy(this.dice.diceGroup.position);
    this._resultCamPos.copy(this._finalDicePos).add(this._resultCamOffset);
    this._resultFaceLocked = false;

    // Hold the original view for two seconds before the top-down result reveal.
    this._camPhase = 'waiting';
    this._waitTimer = 0;

    // Dim dice for failure
    if (result.config.diceDim) {
      this.dice.dim();
    }
  }

  _triggerResultEffects() {
    const result = this._lastResult;
    if (!result) return;

    // Dice highlight
    this.dice.setHighlight(result.config.diceEmissive, result.config.diceEmissiveIntensity);

    // Effect light at dice position
    this.effectLight.position.copy(this._finalDicePos);
    this.effectLight.color.setHex(result.config.diceEmissive || 0xffffff);
    this.effectLight.intensity = 3.0;

    // Overlay color
    if (this.overlayEl) {
      const c = result.config.overlayColor;
      this.overlayEl.style.background =
        `radial-gradient(circle at 50% 50%, rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},0.6), transparent 70%)`;
    }

    // Burst particles at dice position
    this.particles.emitBurst(result.config, this._finalDicePos);

    // Camera shake + overlay animation
    this.effects.trigger(result.value, { ...result.config, cameraShake: null });

    // Fade effect light
    setTimeout(() => {
      if (!this._destroyed) this.effectLight.intensity = 0;
    }, 800);
  }

  /* ─── Render loop ─── */

  _tick(now) {
    if (this._destroyed) return;
    this._animFrame = requestAnimationFrame(this._tick);

    const dt = Math.min((now - this._lastTime) / 1000, 0.05);
    this._lastTime = now;

    // Check if dice roll finished
    if (this._pendingResult && !this.dice.isRolling) {
      this._finishRoll();
    }

    // Camera animation — 3-phase result reveal
    this._updateCamera(dt);

    // Update components
    this.dice.update(now, dt);
    this.particles.update(now);
    this.effects.update(now, dt);

    this.renderer.render(this.scene, this.camera);
  }

  _updateCamera(dt) {
    if (this._camPhase === 'waiting') {
      // Phase 0: hold original view while the result die is fully still
      this._waitTimer += dt;
      this.camera.lookAt(this._lookTarget);
      if (this._waitTimer >= 2.0) {
        this._camPhase = 'moving';
        this._camStartPos.copy(this.camera.position);
        this._camStartLookTarget.copy(this._lookTarget);
        this._camProgress = 0;
      }

    } else if (this._camPhase === 'moving') {
      // Phase 1: camera moves to a fixed top-down result position
      this._camProgress += dt / 0.9;
      if (this._camProgress >= 1) {
        this._camProgress = 1;
        this._camPhase = 'showing';
        this._showTimer = 0;
        // Trigger effects now that camera is in position
        this._triggerResultEffects();
      }
      const eased = 1 - Math.pow(1 - this._camProgress, 3);
      if (!this._resultFaceLocked && this._camProgress >= 0.55) {
        this.dice.lockResultFace(this._lastResult.value, this._resultCamPos);
        this._resultFaceLocked = true;
      }
      this.camera.position.lerpVectors(this._camStartPos, this._resultCamPos, eased);
      this._lookTarget.lerpVectors(this._camStartLookTarget, this._finalDicePos, eased);
      this.camera.up.set(0, 1, 0);
      this.camera.lookAt(this._lookTarget);

    } else if (this._camPhase === 'showing') {
      // Phase 2: hold the top-down result view for five seconds
      this._showTimer += dt;
      this.camera.position.copy(this._resultCamPos);
      this.camera.up.set(0, 1, 0);
      this.camera.lookAt(this._lookTarget);
      if (this._showTimer >= 5.0) {
        this._camPhase = 'returning';
        this._camStartPos.copy(this.camera.position);
        this._camProgress = 0;
      }

    } else if (this._camPhase === 'returning') {
      // Phase 3: return to the original camera while keeping the result die still
      this._camProgress += dt / 1.0;
      if (this._camProgress >= 1) {
        this._camProgress = 1;
        this._camPhase = null;
        this._isProcessing = false;
        // Clean up dice state after result reveal
        this.dice.clearHighlight();
        this.dice.restoreColor();
        this.dice._lockedStill = false;
        if (this.overlayEl) this.overlayEl.style.opacity = '0';
        this.effectLight.intensity = 0;
      }
      const eased = 1 - Math.pow(1 - this._camProgress, 3);
      this.camera.position.lerpVectors(this._camStartPos, this._baseCameraPos, eased);
      this.camera.up.set(0, 1, 0);
      this.camera.lookAt(this._lookTarget);

    } else if (!this.effects.isShaking) {
      if (this._isProcessing && this._camPhase === null) {
        // During active roll: track dice to keep it visible in frame
        const dPos = this.dice.diceGroup.position;
        const height = Math.max(0, dPos.y);
        const targetCam = new THREE.Vector3(
          dPos.x * 0.12,
          0.18 + height * 0.35,
          5.7
        );
        this.camera.position.lerp(targetCam, 0.06);
        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(dPos.x * 0.5, height * 0.5, 0);
      } else {
        // Default idle: slowly return to base position
        this.camera.position.lerp(this._baseCameraPos, 0.08);
        this.camera.up.set(0, 1, 0);
      }
    }
  }

  /* ─── Resize ─── */

  _resize() {
    if (this._destroyed) return;
    const rect = this.container.getBoundingClientRect();
    const w = rect.width || 600;
    const h = rect.height || 500;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  /* ─── Cleanup ─── */

  destroy() {
    this._destroyed = true;
    if (this._animFrame) cancelAnimationFrame(this._animFrame);
    this.renderer.domElement.removeEventListener('click', this._onClick);
    window.removeEventListener('resize', this._onResize);

    this.effects.dispose();
    this.particles.dispose();
    this.dice.dispose();

    // Ground plane cleanup
    if (this.ground) {
      this.scene.remove(this.ground);
      this.ground.geometry.dispose();
      this.ground.material.map?.dispose();
      this.ground.material.dispose();
    }

    this.renderer.dispose();

    if (this.overlayEl) {
      this.overlayEl.style.opacity = '0';
      this.overlayEl.style.background = 'transparent';
    }

    const kids = [this.overlayEl, this.renderer.domElement];
    for (const el of kids) {
      if (el && el.parentElement === this.container) {
        this.container.removeChild(el);
      }
    }
  }
}
