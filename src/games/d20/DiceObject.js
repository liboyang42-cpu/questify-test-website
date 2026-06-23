/**
 * DiceObject.js — 3D D20 with frosted white finish, black numbers, physics-based throw/bounce/roll.
 */

import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import helvetikerBold from 'three/examples/fonts/helvetiker_bold.typeface.json';

const DICE_RADIUS = 0.36;
const DICE_REST_Y = DICE_RADIUS;
const EDGE_COLOR = 0xcfcac0;
const DEFAULT_EMISSIVE = 0x000000;
const NUMBER_FONT = new FontLoader().parse(helvetikerBold);

/* ─── Face number labels (1-20) ─── */

function createNumberGeometry(num, face) {
  const text = String(num);
  const geometry = new TextGeometry(text, {
    font: NUMBER_FONT,
    size: face.edgeLength * 0.28,
    depth: 0.003,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThickness: 0.001,
    bevelSize: 0.001,
    bevelSegments: 1
  });
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const width = box.max.x - box.min.x;
  const height = box.max.y - box.min.y;
  geometry.translate(-box.min.x - width * 0.5, -box.min.y - height * 0.5, -0.002);
  geometry.computeVertexNormals();
  return geometry;
}

function getFaceData(radius) {
  const geo = new THREE.IcosahedronGeometry(radius, 0);
  const pos = geo.attributes.position;
  const faces = [];
  const worldUp = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < 20; i++) {
    const i3 = i * 3;
    const a = new THREE.Vector3(pos.getX(i3), pos.getY(i3), pos.getZ(i3));
    const b = new THREE.Vector3(pos.getX(i3 + 1), pos.getY(i3 + 1), pos.getZ(i3 + 1));
    const c = new THREE.Vector3(pos.getX(i3 + 2), pos.getY(i3 + 2), pos.getZ(i3 + 2));
    const center = new THREE.Vector3().addVectors(a, b).add(c).divideScalar(3);
    const normal = center.clone().normalize();

    // Project world-up onto the face plane for consistent text orientation
    let tangent, bitangent;
    const projectedUp = worldUp.clone().sub(normal.clone().multiplyScalar(worldUp.dot(normal)));
    if (projectedUp.length() < 0.001) {
      // Face normal is parallel to world-up; fall back to edge direction
      tangent = b.clone().sub(a).normalize();
      bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize();
    } else {
      bitangent = projectedUp.normalize();
      tangent = bitangent.clone().cross(normal).normalize();
    }

    const edgeLength = Math.min(a.distanceTo(b), b.distanceTo(c), c.distanceTo(a));
    faces.push({ center, normal, tangent, bitangent, edgeLength });
  }
  geo.dispose();
  return faces;
}

export class DiceObject {
  constructor() {
    this.group = new THREE.Group();
    this.diceGroup = new THREE.Group();
    this.group.add(this.diceGroup);

    /* ── Body — frosted white icosahedron ── */
    const geo = new THREE.IcosahedronGeometry(DICE_RADIUS, 0);
    this.material = new THREE.MeshStandardMaterial({
      color: 0xf5f2ed,
      roughness: 0.72,
      metalness: 0,
      emissive: DEFAULT_EMISSIVE,
      emissiveIntensity: 0,
      envMapIntensity: 0.25
    });
    this.mesh = new THREE.Mesh(geo, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.diceGroup.add(this.mesh);

    /* ── Subtle edge lines ── */
    const edgeGeo = new THREE.EdgesGeometry(geo);
    this.edgeMat = new THREE.LineBasicMaterial({
      color: EDGE_COLOR,
      transparent: true,
      opacity: 0.10
    });
    this.wireframe = new THREE.LineSegments(edgeGeo, this.edgeMat);
    this.diceGroup.add(this.wireframe);

    /* ── Face-mounted black numbers ── */
    this._faceNumbers = [];
    this.numberMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.8,
      metalness: 0,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    const faceData = getFaceData(DICE_RADIUS);
    this._faceData = faceData;
    for (let i = 0; i < 20; i++) {
      const face = faceData[i];
      const label = new THREE.Mesh(createNumberGeometry(i + 1, face), this.numberMaterial);
      const matrix = new THREE.Matrix4().makeBasis(face.tangent, face.bitangent, face.normal);
      label.quaternion.setFromRotationMatrix(matrix);
      label.position.copy(face.center).addScaledVector(face.normal, 0.012);
      label.castShadow = false;
      label.receiveShadow = true;
      this.diceGroup.add(label);
      this._faceNumbers.push(label);
    }

    /* ── Inner glow shell ── */
    const glowGeo = new THREE.IcosahedronGeometry(DICE_RADIUS * 1.02, 0);
    this.glowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      wireframe: true,
      side: THREE.BackSide
    });
    this.glowShell = new THREE.Mesh(glowGeo, this.glowMat);
    this.diceGroup.add(this.glowShell);

    /* ── Ground shadow ── */
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    const shadowGradient = shadowCtx.createRadialGradient(64, 64, 4, 64, 64, 56);
    shadowGradient.addColorStop(0, 'rgba(0,0,0,0.40)');
    shadowGradient.addColorStop(0.4, 'rgba(0,0,0,0.20)');
    shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
    shadowCtx.fillStyle = shadowGradient;
    shadowCtx.fillRect(0, 0, 128, 128);
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    });
    this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.6), shadowMat);
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.set(0, 0.004, 0);
    this.group.add(this.shadow);

    /* ── Animation state ── */
    this._isRolling = false;
    this._velX = 0;
    this._velY = 0;
    this._velZ = 0;
    this._angVel = new THREE.Vector3();
    this._gravity = -22;
    this._bounceDamping = 0.35;
    this._airFriction = 0.97;
    this._groundFriction = 0.82;
    this._onGround = false;

    /* ── Idle state ── */
    this._idleTime = 0;
    this._lockedStill = false;
  }

  /* ─── Lifecycle ─── */

  getObject() {
    return this.group;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.wireframe.geometry.dispose();
    this.edgeMat.dispose();
    this.glowShell.geometry.dispose();
    this.glowMat.dispose();
    this.shadow.geometry.dispose();
    this.shadow.material.map?.dispose();
    this.shadow.material.dispose();
    this.numberMaterial.dispose();
    for (const s of this._faceNumbers) {
      s.geometry.dispose();
    }
    this._faceNumbers = [];
  }

  /* ─── Idle update ─── */

  update(time, dt) {
    this._idleTime = time * 0.001;

    if (this._isRolling) {
      this._updateRoll(dt);
    } else if (!this._lockedStill) {
      this.diceGroup.rotation.y += 0.004;
      this.diceGroup.position.y = DICE_REST_Y + Math.abs(Math.sin(this._idleTime * 0.5)) * 0.008;
      this.edgeMat.opacity = 0.08 + Math.sin(this._idleTime * 0.6) * 0.03;
    } else {
      this.diceGroup.position.y = DICE_REST_Y;
      this.edgeMat.opacity = 0.08;
    }
  }

  /* ─── Roll — thrown arc + bounce + ground roll ─── */

  roll() {
    if (this._isRolling) return;
    this._isRolling = true;
    this._lockedStill = false;
    this._rollStart = performance.now();

    // Random throw direction
    const angle = Math.random() * Math.PI * 2;
    this.diceGroup.position.set(0, DICE_REST_Y + 0.05, 0);
    this.diceGroup.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    // Launch: strong upward throw + lateral drift
    this._velY = 8.0 + Math.random() * 3.0;
    const lateral = 1.2 + Math.random() * 1.0;
    this._velX = Math.cos(angle) * lateral;
    this._velZ = Math.sin(angle) * lateral;

    // Rapid spin
    this._angVel.set(
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 22
    );

    this._onGround = false;
  }

  get isRolling() {
    return this._isRolling;
  }

  /* ─── Highlight ─── */

  setHighlight(color, intensity = 0.5) {
    this.material.emissive.setHex(color);
    this.material.emissiveIntensity = intensity;
    this.glowMat.opacity = Math.min(intensity * 0.04, 0.05);
    this.glowMat.color.setHex(0xffffff);
  }

  clearHighlight() {
    this.material.emissive.setHex(DEFAULT_EMISSIVE);
    this.material.emissiveIntensity = 0;
    this.glowMat.opacity = 0;
  }

  dim() {
    this.material.color.setHex(0xe8e4dc);
  }

  restoreColor() {
    this.material.color.setHex(0xf5f2ed);
  }

  lockResultFace(value, cameraPosition) {
    const face = this._faceData[value - 1];
    if (!face) return;

    this._lockedStill = true;
    this.diceGroup.position.y = DICE_REST_Y;

    const viewNormal = cameraPosition.clone().sub(this.diceGroup.position).normalize();
    const worldUp = new THREE.Vector3(0, 1, 0);
    let targetUp = worldUp
      .clone()
      .sub(viewNormal.clone().multiplyScalar(worldUp.dot(viewNormal)));
    if (targetUp.length() < 0.001) {
      targetUp = new THREE.Vector3(0, 0, -1)
        .sub(viewNormal.clone().multiplyScalar(new THREE.Vector3(0, 0, -1).dot(viewNormal)));
    }
    targetUp.normalize();

    const alignNormal = new THREE.Quaternion().setFromUnitVectors(face.normal, viewNormal);
    const currentUp = face.bitangent.clone().applyQuaternion(alignNormal);
    const signed = Math.atan2(
      new THREE.Vector3().crossVectors(currentUp, targetUp).dot(viewNormal),
      currentUp.dot(targetUp)
    );
    const alignText = new THREE.Quaternion().setFromAxisAngle(viewNormal, signed);

    alignText.multiply(alignNormal);
    this.diceGroup.quaternion.copy(alignText);
    this._angVel.set(0, 0, 0);
  }

  /* ─── Internal physics update ─── */

  _updateRoll(dt) {
    // Clamp dt to prevent physics spiral-of-death on big frame gaps
    const step = Math.min(dt, 0.05);

    // Gravity (only while airborne)
    if (!this._onGround) {
      this._velY += this._gravity * step;
    }

    // Update position
    this.diceGroup.position.x += this._velX * step;
    this.diceGroup.position.y += this._velY * step;
    this.diceGroup.position.z += this._velZ * step;

    // Floor collision & response
    const wasInAir = !this._onGround;
    if (this.diceGroup.position.y <= DICE_REST_Y) {
      this.diceGroup.position.y = DICE_REST_Y;
      this._onGround = true;

      if (wasInAir && Math.abs(this._velY) > 0.3) {
        // Bounce: reflect + damp, add spin from horizontal impact
        this._velY = -this._velY * this._bounceDamping;
        this._velX *= 0.85;
        this._velZ *= 0.85;
        this._angVel.x += this._velZ * 2.5 + (Math.random() - 0.5) * 4;
        this._angVel.z -= this._velX * 2.5 + (Math.random() - 0.5) * 4;
        this._angVel.y += (Math.random() - 0.5) * 3;
      } else {
        // On ground: rolling phase
        this._velY = 0;
        // Angular velocity drives ground rolling
        this._velX += this._angVel.z * 0.012;
        this._velZ -= this._angVel.x * 0.012;
        // Strong ground friction
        this._velX *= this._groundFriction;
        this._velZ *= this._groundFriction;
        this._angVel.multiplyScalar(this._groundFriction);
      }
    } else {
      this._onGround = false;
    }

    // Apply angular velocity
    this.diceGroup.rotation.x += this._angVel.x * step;
    this.diceGroup.rotation.y += this._angVel.y * step;
    this.diceGroup.rotation.z += this._angVel.z * step;

    // Angular friction (air)
    if (!this._onGround) {
      this._angVel.multiplyScalar(this._airFriction);
    }

    // Shadow tracks dice horizontally, stays on ground
    this.shadow.position.x = this.diceGroup.position.x;
    this.shadow.position.z = this.diceGroup.position.z;
    const height = Math.max(0, this.diceGroup.position.y - DICE_REST_Y);
    this.shadow.material.opacity = 0.65 * Math.max(0.1, 1 - height * 0.3);

    // Edge glow and shell pulse from movement energy
    const angSpeed = this._angVel.length();
    const hSpeed = Math.sqrt(this._velX * this._velX + this._velZ * this._velZ);
    const energy = angSpeed + hSpeed * 2;
    this.edgeMat.opacity = 0.06 + Math.min(energy * 0.004, 0.08);
    this.glowMat.opacity = Math.min(angSpeed * 0.004, 0.035);

    // Check settled
    const elapsed = (performance.now() - this._rollStart) / 1000;
    const settled = this._onGround
      && Math.abs(this._velY) < 0.01
      && hSpeed < 0.02
      && angSpeed < 0.12;

    if (settled || elapsed > 3.5) {
      this._finishRoll();
    }
  }

  _finishRoll() {
    this._isRolling = false;
    this.diceGroup.position.y = DICE_REST_Y;

    // Clamp position to stay within visible ground area (radius 2.5)
    const gx = this.diceGroup.position.x;
    const gz = this.diceGroup.position.z;
    const dist = Math.sqrt(gx * gx + gz * gz);
    if (dist > 2.5) {
      const scale = 2.5 / dist;
      this.diceGroup.position.x = gx * scale;
      this.diceGroup.position.z = gz * scale;
    }

    this._velX = 0;
    this._velY = 0;
    this._velZ = 0;
    this._angVel.set(0, 0, 0);
    this.edgeMat.opacity = 0.08;
    this.glowMat.opacity = 0;
    this.shadow.material.opacity = 0.65;
  }
}
