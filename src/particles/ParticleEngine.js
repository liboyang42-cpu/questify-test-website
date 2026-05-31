const TAU = Math.PI * 2;

const PHASE = {
  SINGULARITY_END: 2.8,
  EXPLOSION_END: 5.8,
  ORBIT_END: 9.4
};

const FIELD = {
  compressionScale: 1.38,
  expansionScale: 1.42,
  orbitProjection: 0.74,
  cameraDistance: 4.72,
  releaseDelaySpan: 0.22
};

const ROTATION = {
  normalSpeed: 0.23,
  stabilizationDuration: (TAU * 3) / (0.23 * 1.5)
};

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function smoothstep(edge0, edge1, value) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function easeInOut(value) {
  return smoothstep(0, 1, value);
}

function mix(from, to, value) {
  return from + (to - from) * value;
}

function sphericalDirection() {
  const theta = Math.random() * TAU;
  const cosPhi = randomBetween(-1, 1);
  const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
  return {
    x: Math.cos(theta) * sinPhi,
    y: cosPhi,
    z: Math.sin(theta) * sinPhi
  };
}

export class ParticleEngine {
  constructor(state) {
    this.state = state;
    this.particles = [];
    this.clickParticles = [];
    this.handledImpulses = new Set();
    this.positions = new Float32Array();
    this.meta = new Float32Array();
    this.motion = new Float32Array();
    this.count = 0;
    this.drawCount = 0;
    this.core = {
      tilt: 0.32,
      yaw: -0.26,
      roll: 0.08
    };
    this.starFeedback = 0;
    this.starPulse = 0;
    this.debug = {};
    this.debugEnabled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debugCosmos');
  }

  init() {
    this.spawn();
  }

  resize() {
    if (this.count !== this.state.quality.particleCount) {
      this.spawn();
    }
  }

  spawn() {
    const count = this.state.quality.particleCount;
    this.count = count;
    this.particles = [];
    this.clickParticles = [];
    this.drawCount = count;
    this.positions = new Float32Array((count + 700) * 2);
    this.meta = new Float32Array((count + 700) * 4);
    this.motion = new Float32Array((count + 700) * 2);

    for (let i = 0; i < count; i += 1) {
      const particle = this.createParticle(i / Math.max(1, count - 1));
      this.particles.push(particle);
      const position = this.computePosition(particle, this.state.time);
      particle.x = position.x;
      particle.y = position.y;
      particle.z = position.z;
      this.projectParticle(particle, 0);
    }
  }

  update(dt, impulses) {
    const { pointer, time, scene } = this.state;
    const compression = scene.compression || 0;
    const phase = this.phaseValues(time);
    let feedback = 0;
    const collectDebug = this.debugEnabled;
    let visibleCount = 0;
    let brightCount = 0;
    let alphaSum = 0;
    let sizeSum = 0;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    let minRadius = Infinity;
    let maxRadius = 0;

    for (let i = 0; i < this.count; i += 1) {
      const p = this.particles[i];
      p.angle += p.angularVelocity * dt;
      p.spin += p.spinVelocity * dt;

      const position = this.computePosition(p, time);
      p.x = position.x;
      p.y = position.y;
      p.z = position.z;
      const mouseField = this.applyMouseField(p, pointer, phase.orbit);
      this.projectParticle(p, 0);

      const release = smoothstep(0, 1, phase.explosion * 1.18 - p.releaseDelay * FIELD.releaseDelaySpan);
      const coreGlow = Math.exp(-p.diskRadius * 1.4);
      const diskGlow = phase.orbit * release * p.armStrength * Math.exp(-p.diskRadius * 0.12);
      const sphereGlow = phase.singularity * p.compressionGlow;
      const environmentalAlpha = phase.environment * release;
      const releaseFront = smoothstep(0, 1, phase.explosion * 1.1 - p.releaseDelay * FIELD.releaseDelaySpan);
      const blastMaterial = Math.max(release, releaseFront * 0.82);
      const blastGlow = (0.2 + phase.blast * 0.8) * blastMaterial * (0.28 + p.radialEnergy * 0.46);
      const chargingGlow = phase.charging * (0.38 + coreGlow * 0.34);
      const blastWeight = (0.3 + phase.blast * 0.7) * blastMaterial * phase.explosion;
      const orbitVisibility = p.visibleDiskMatter ? 1.62 : p.haloMatter ? 1.08 : 0.94;
      const alpha = (chargingGlow * (1.32 - phase.explosion * 0.38) + blastGlow * 1.84 + environmentalAlpha * orbitVisibility * (p.alpha * 1.08 + diskGlow * 0.25) + mouseField * 0.035) * this.depthFog(p);
      const preIgnitionSize = mix(0.46, 0.8, p.compressionGlow);
      const orbitMaterialSize = phase.orbit * release * (p.visibleDiskMatter ? 1.16 : p.haloMatter ? 0.82 : 0.76);
      const blastSize = smoothstep(0.08, 0.65, phase.explosion) * blastMaterial * (1 - phase.orbit * 0.62);
      const materialSize = 1 + blastSize * 2.35 + orbitMaterialSize + environmentalAlpha * (p.visibleDiskMatter ? 0.42 : p.haloMatter ? 0.24 : 0.1) + diskGlow * 0.34 + compression * 0.04 + mouseField * 0.08;
      const sizeLift = mix(materialSize, preIgnitionSize, Math.max(0, phase.charging - phase.explosion * 0.5));
      feedback += coreGlow * (phase.singularity * 0.9 + phase.blast * 0.42 + phase.expansion * 0.18) + mouseField * 0.05;

      this.positions[i * 2] = p.screenX;
      this.positions[i * 2 + 1] = p.screenY;
      this.meta[i * 4] = p.size * p.perspective * sizeLift;
      this.meta[i * 4 + 1] = Math.max(0.0, alpha * p.depthFade);
      this.meta[i * 4 + 2] = p.depth;
      this.meta[i * 4 + 3] = sphereGlow * 1.08 + diskGlow * 0.8 + mouseField + blastWeight * 0.98;
      this.motion[i * 2] = p.screenX - p.prevScreenX;
      this.motion[i * 2 + 1] = p.screenY - p.prevScreenY;

      if (collectDebug) {
        const screenX = this.positions[i * 2];
        const screenY = this.positions[i * 2 + 1];
        const pointSize = this.meta[i * 4];
        const pointAlpha = this.meta[i * 4 + 1];
        const radius = Math.hypot(screenX, screenY);
        if (screenX > -1 && screenX < 1 && screenY > -1 && screenY < 1) visibleCount += 1;
        if (pointAlpha > 0.02) brightCount += 1;
        alphaSum += pointAlpha;
        sizeSum += pointSize;
        minX = Math.min(minX, screenX);
        maxX = Math.max(maxX, screenX);
        minY = Math.min(minY, screenY);
        maxY = Math.max(maxY, screenY);
        minRadius = Math.min(minRadius, radius);
        maxRadius = Math.max(maxRadius, radius);
      }
    }

    this.consumeClickBursts(impulses);
    this.updateClickParticles(dt, phase);

    this.starFeedback = feedback / Math.max(1, this.count);
    this.starPulse = phase.singularity * 1.1 + phase.blast * 0.62 + phase.expansion * 0.28 + this.starFeedback * 0.95;
    if (collectDebug) {
      this.debug = {
        time,
        phase,
        visibleCount,
        brightCount,
        averageAlpha: alphaSum / Math.max(1, this.count),
        averageSize: sizeSum / Math.max(1, this.count),
        xRange: [minX, maxX],
        yRange: [minY, maxY],
        radiusRange: [minRadius, maxRadius]
      };
    }
  }

  consumeClickBursts(impulseSystem) {
    const bursts = impulseSystem?.impulses || [];
    if (!bursts.length) return;

    bursts.forEach((burst) => {
      if (this.handledImpulses.has(burst.id)) return;
      this.handledImpulses.add(burst.id);
      const amount = Math.round(24 + burst.strength * 18);
      for (let i = 0; i < amount; i += 1) {
        const radius = randomBetween(0.18, 0.72);
        const angle = Math.atan2(burst.y * 1.35, burst.x) + randomBetween(-0.45, 0.45);
        this.clickParticles.push({
          diskRadius: radius,
          orbitalPhase: angle,
          radialDrift: randomBetween(-0.035, 0.075),
          verticalPhase: Math.random() * TAU,
          verticalAmplitude: randomBetween(0.006, 0.028),
          angularVelocity: randomBetween(0.16, 0.3),
          age: 0,
          life: randomBetween(4.5, 7.5),
          size: randomBetween(1.15, 2.55) * burst.strength,
          alpha: randomBetween(0.06, 0.14),
          screenX: 0,
          screenY: 0,
          prevScreenX: 0,
          prevScreenY: 0,
          perspective: 1,
          depth: randomBetween(0.55, 0.95),
          depthFade: 1,
          indexRatio: Math.random()
        });
      }
    });

    if (this.clickParticles.length > 700) {
      this.clickParticles.splice(0, this.clickParticles.length - 700);
    }
    if (this.handledImpulses.size > 60) {
      this.handledImpulses = new Set([...this.handledImpulses].slice(-30));
    }
  }

  updateClickParticles(dt, phase) {
    let offset = this.count;
    const time = this.state.time;

    for (let i = this.clickParticles.length - 1; i >= 0; i -= 1) {
      const p = this.clickParticles[i];
      p.age += dt;
      if (p.age > p.life) {
        this.clickParticles.splice(i, 1);
        continue;
      }

      p.diskRadius += p.radialDrift * dt;
      p.diskRadius = Math.max(0.12, Math.min(2.4, p.diskRadius));
      p.radialDrift *= 1 - Math.min(dt * 0.55, 0.04);
      const field = this.orbitalField(p, time, p.diskRadius);
      const y = field.planeY * 0.7;
      const position = this.rotateToCamera(field.cos * p.diskRadius, y, field.sin * p.diskRadius + field.depthLift * 0.12, time, phase.orbit);
      p.x = position.x;
      p.y = position.y;
      p.z = position.z;
      this.applyMouseField(p, this.state.pointer, phase.orbit);
      this.projectParticle(p, 0);

      const lifeT = p.age / p.life;
      const fadeIn = smoothstep(0, 0.12, lifeT);
      const fadeOut = 1 - smoothstep(0.72, 1, lifeT);
      const index = offset;
      this.positions[index * 2] = p.screenX;
      this.positions[index * 2 + 1] = p.screenY;
      this.meta[index * 4] = p.size * p.perspective * (1.2 + phase.orbit * 0.8);
      this.meta[index * 4 + 1] = p.alpha * fadeIn * fadeOut * p.depthFade;
      this.meta[index * 4 + 2] = p.depth;
      this.meta[index * 4 + 3] = 0.55 + phase.orbit * 0.5;
      this.motion[index * 2] = p.screenX - p.prevScreenX;
      this.motion[index * 2 + 1] = p.screenY - p.prevScreenY;
      offset += 1;
    }

    this.drawCount = offset;
  }

  createParticle(indexRatio) {
    const dir = sphericalDirection();
    const layerRoll = Math.random();
    const coreMatter = layerRoll < 0.18;
    const haloMatter = layerRoll > 0.78;
    const visibleDiskMatter = !coreMatter && !haloMatter;
    const armCount = 4;
    const armIndex = Math.floor(Math.random() * armCount);
    const armPhase = (armIndex / armCount) * TAU;
    const diskRadius = coreMatter
      ? Math.pow(Math.random(), 2.0) * 0.42 + 0.04
      : haloMatter
        ? 1.9 + Math.pow(Math.random(), 0.58) * 4.6
        : 0.42 + Math.pow(Math.random(), 0.82) * 2.25;
    const sphereEnvelope = 0.31;
    const sphereRadius = sphereEnvelope * (0.32 + Math.cbrt(Math.random()) * 0.68);
    const armOffset = coreMatter ? randomBetween(-0.55, 0.55) : (Math.random() + Math.random() - 1) * (0.07 + diskRadius * 0.018);
    const baseAngle = randomBetween(-0.08, 0.08);
    const orbitalPhase = baseAngle + armPhase + armOffset + diskRadius * 2.18;
    const latitude = Math.asin(Math.max(-0.92, Math.min(0.92, dir.y)));
    const energy = Math.exp(-diskRadius * 0.42);
    const layerInertia = coreMatter ? 1.05 : haloMatter ? 0.48 : 0.78;
    const angularVelocity = ((0.16 + energy * 0.34) / Math.pow(diskRadius + 0.86, 0.54)) * layerInertia;
    const releaseDelay = coreMatter ? randomBetween(0, 0.45) : haloMatter ? randomBetween(0.24, 1.0) : randomBetween(0.08, 0.7);

    return {
      dir,
      indexRatio,
      coreMatter,
      haloMatter,
      visibleDiskMatter,
      armPhase,
      armOffset,
      diskRadius,
      sphereRadius,
      angle: baseAngle,
      orbitalPhase,
      latitude,
      spin: Math.random() * TAU,
      spinVelocity: randomBetween(0.16, 0.34),
      angularVelocity,
      verticalPhase: Math.random() * TAU,
      verticalAmplitude: coreMatter ? randomBetween(0.008, 0.026) : haloMatter ? randomBetween(0.035, 0.095) : randomBetween(0.012, 0.042),
      radialEnergy: coreMatter ? randomBetween(0.12, 0.32) : haloMatter ? randomBetween(0.48, 0.9) : randomBetween(0.28, 0.64),
      armStrength: coreMatter ? 0.42 : haloMatter ? 0.16 : Math.exp(-Math.abs(armOffset) * 11),
      compressionGlow: coreMatter ? randomBetween(0.45, 0.9) : randomBetween(0.12, 0.42),
      releaseDelay,
      chaos: randomBetween(-1, 1),
      chaosPhase: Math.random() * TAU,
      layerInertia,
      size: coreMatter ? randomBetween(1.05, 2.45) : haloMatter ? randomBetween(0.56, 1.22) : randomBetween(0.9, 2.15),
      alpha: coreMatter ? randomBetween(0.12, 0.26) : haloMatter ? randomBetween(0.032, 0.086) : randomBetween(0.064, 0.17),
      x: 0,
      y: 0,
      z: 0,
      prevScreenX: 0,
      prevScreenY: 0,
      screenX: 0,
      screenY: 0,
      perspective: 1,
      depth: 0.5,
      depthFade: 1
    };
  }

  phaseValues(time) {
    const explosion = smoothstep(PHASE.SINGULARITY_END, PHASE.EXPLOSION_END, time);
    const orbit = smoothstep(PHASE.EXPLOSION_END - 0.6, PHASE.ORBIT_END, time);
    const blast = Math.sin(explosion * Math.PI) * (1 - orbit * 0.18);
    const expansion = blast * (1 - orbit * 0.35);
    const singularity = 1 - smoothstep(PHASE.SINGULARITY_END - 0.05, PHASE.EXPLOSION_END, time);
    const environment = smoothstep(PHASE.SINGULARITY_END + 0.25, PHASE.ORBIT_END, time);
    const charging = 1 - smoothstep(PHASE.SINGULARITY_END - 0.12, PHASE.SINGULARITY_END + 0.32, time);
    return { singularity, charging, explosion, blast, expansion, orbit, environment };
  }

  computePosition(p, time) {
    const phase = this.phaseValues(time);
    const compressed = this.computeCompressedSphere(p, time);
    const expanded = this.computeRadialExpansion(p, time);
    const disk = this.computeDiskOrbit(p, time);
    const release = smoothstep(0, 1, phase.explosion * 1.08 - p.releaseDelay * FIELD.releaseDelaySpan);

    const compressedWeight = Math.max(phase.singularity * 0.92, 1 - release * 0.88);
    const expandedWeight = (phase.explosion * 0.76 + phase.expansion * 0.8 + phase.blast * 0.38) * release * (1 - phase.orbit * 0.52);
    const diskWeight = (phase.orbit * 1.72 + phase.environment * 0.5) * release;
    let x = compressed.x * compressedWeight + expanded.x * expandedWeight + disk.x * diskWeight;
    let y = compressed.y * compressedWeight + expanded.y * expandedWeight + disk.y * diskWeight;
    let z = compressed.z * compressedWeight + expanded.z * expandedWeight + disk.z * diskWeight;
    const total = Math.max(0.001, compressedWeight + expandedWeight + diskWeight);
    x /= total;
    y /= total;
    z /= total;

    return this.rotateToCamera(x, y, z, time, phase.orbit);
  }

  computeCompressedSphere(p, time) {
    const field = this.orbitalField(p, time, p.sphereRadius);
    const pressure = 0.86 + Math.sin(time * 1.9 + p.indexRatio * TAU) * 0.035;
    const turbulentShell = 0.68 + p.radialEnergy * 0.24;
    const r = p.sphereRadius * FIELD.compressionScale * pressure * turbulentShell;
    const theta = p.orbitalPhase + time * p.angularVelocity * 0.24;
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const shell = Math.cos(p.latitude);
    const x = cosTheta * r * shell + field.tangentX * r * 0.045;
    const y = Math.sin(p.latitude) * r * 0.86 + field.planeY * 0.05;
    const z = sinTheta * r * shell + field.tangentZ * r * 0.045;
    const unifiedSpin = time * 0.055;
    const cos = Math.cos(unifiedSpin);
    const sin = Math.sin(unifiedSpin);
    return {
      x: x * cos - z * sin,
      y,
      z: x * sin + z * cos
    };
  }

  computeRadialExpansion(p, time) {
    const t = easeInOut((time - PHASE.SINGULARITY_END) / (PHASE.EXPLOSION_END - PHASE.SINGULARITY_END));
    const field = this.orbitalField(p, time, p.diskRadius);
    const blastImpulse = Math.sin(Math.min(1, t) * Math.PI) * (0.42 + p.radialEnergy * 0.52);
    const chaos = smoothstep(0.06, 0.78, t) * (1 - smoothstep(0.76, 1, t));
    const chaoticKick = chaos * (0.18 + p.radialEnergy * 0.24);
    const compressedRadial = p.sphereRadius * FIELD.compressionScale * Math.cos(p.latitude) * (0.72 + p.radialEnergy * 0.28);
    const targetRadial = p.diskRadius * (0.58 + t * FIELD.expansionScale);
    const radialProgress = smoothstep(0.16, 1, t);
    const radial = compressedRadial * (1 - radialProgress) + targetRadial * radialProgress + blastImpulse * smoothstep(0.22, 0.78, t) + chaoticKick * p.chaos;
    const compressedY = Math.sin(p.latitude) * p.sphereRadius * FIELD.compressionScale * 0.86;
    const verticalSettle = 1 - t;
    const theta = p.orbitalPhase + time * p.angularVelocity * 0.24;
    const shell = Math.cos(p.latitude);
    const wobble = Math.sin(time * (0.9 + p.radialEnergy) + p.chaosPhase);
    const sphereX = Math.cos(theta + p.chaos * chaos * 0.42) * radial * shell + field.tangentX * chaoticKick * wobble;
    const sphereY = compressedY * verticalSettle + Math.sin(p.latitude) * blastImpulse * 0.42 + p.chaos * chaoticKick * 0.5;
    const sphereZ = Math.sin(theta - p.chaos * chaos * 0.34) * radial * shell + field.tangentZ * chaoticKick * Math.cos(p.chaosPhase + time * 0.7);
    const diskX = field.cos * radial + field.tangentX * blastImpulse * 0.14;
    const diskY = compressedY * verticalSettle + field.planeY * (0.32 + t * 0.62);
    const diskZ = field.sin * radial + field.tangentZ * blastImpulse * 0.14;
    const diskBlend = smoothstep(0.34, 1, t);
    return {
      x: mix(sphereX, diskX, diskBlend),
      y: mix(sphereY, diskY, diskBlend),
      z: mix(sphereZ, diskZ, diskBlend)
    };
  }

  computeDiskOrbit(p, time) {
    const field = this.orbitalField(p, time, p.diskRadius);
    const breathing = Math.sin(time * 0.075 + p.indexRatio * TAU) * (p.haloMatter ? 0.028 : 0.012);
    const radius = p.diskRadius * (1 + breathing);
    const armShear = Math.sin(field.theta * 2.0 + radius * 0.7) * 0.018 * (1 - Math.min(radius / 7.0, 1));
    const verticalOrbit = field.planeY * (p.haloMatter ? 1.25 : p.coreMatter ? 0.38 : 0.68);
    const y = verticalOrbit + armShear;
    const zLift = field.depthLift * (p.haloMatter ? 0.36 : 0.12);
    return {
      x: field.cos * radius,
      y,
      z: field.sin * radius + zLift
    };
  }

  orbitalField(p, time, radius) {
    const orbitalTime = time * p.angularVelocity + this.galacticRotation(time, radius);
    const theta = p.orbitalPhase + (radius - p.diskRadius) * 0.18 + orbitalTime;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const planeWave = Math.sin(theta * 0.72 + time * 0.11 + p.verticalPhase);
    const planeY = planeWave * p.verticalAmplitude;
    const tangentX = -sin;
    const tangentZ = cos;
    const depthLift = Math.cos(theta * 0.64 + p.verticalPhase + time * 0.08) * p.verticalAmplitude;
    return { theta, cos, sin, planeY, tangentX, tangentZ, depthLift };
  }

  galacticRotation(time, radius) {
    const birthT = Math.max(0, time - (PHASE.EXPLOSION_END - 0.75));
    const duration = ROTATION.stabilizationDuration;
    const stabilizedT = Math.min(birthT, duration);
    const extraRotation = ROTATION.normalSpeed * (2 * stabilizedT - (stabilizedT * stabilizedT) / (2 * duration));
    const normalRotation = Math.max(0, birthT - duration) * ROTATION.normalSpeed;
    return extraRotation + normalRotation;
  }

  applyMouseField(p, pointer, diskWeight) {
    if (!pointer.active) return 0;
    const dx = pointer.nx - p.x;
    const dy = pointer.ny - p.y;
    const distance = Math.hypot(dx, dy) + 0.0001;
    const reach = 0.32;
    const field = Math.max(0, 1 - distance / reach);
    if (field <= 0) return 0;

    const tangentX = -dy / distance;
    const tangentY = dx / distance;
    const orbitPull = Math.max(0.25, diskWeight);
    const falloff = field * field * (0.012 + orbitPull * 0.024);
    const radialBend = Math.max(0, 1 - distance / reach) * 0.16;
    p.x += (dx * radialBend + tangentX * 0.48) * falloff;
    p.y += (dy * radialBend + tangentY * 0.34) * falloff;
    return falloff;
  }

  rotateToCamera(x, y, z, time = 0, orbit = 0) {
    const yaw = this.core.yaw + Math.sin(time * 0.045) * 0.055 * orbit;
    const tilt = this.core.tilt + Math.sin(time * 0.035 + 1.4) * 0.09 * orbit;
    const roll = this.core.roll + time * 0.014 * orbit;
    const cy = Math.cos(yaw);
    const sy = Math.sin(yaw);
    const ct = Math.cos(tilt);
    const st = Math.sin(tilt);
    const cr = Math.cos(roll);
    const sr = Math.sin(roll);

    const yawX = x * cy - z * sy;
    const yawZ = x * sy + z * cy;
    const tiltY = y * ct - yawZ * st;
    const tiltZ = y * st + yawZ * ct;
    const rollX = yawX * cr - tiltY * sr;
    const rollY = yawX * sr + tiltY * cr;

    return { x: rollX, y: rollY, z: tiltZ };
  }

  projectParticle(p, field) {
    const { scene } = this.state;
    const compressionMode = scene.transitionKind === 'compression';
    const cameraDistance = FIELD.cameraDistance;
    const cameraZ = (scene.dive || 0) * (compressionMode ? 0.82 : 1);
    const z = p.z - cameraZ;
    const perspective = cameraDistance / Math.max(0.34, cameraDistance - z);
    const centerPull = compressionMode ? Math.max(0.2, 1 - (scene.compression || 0) * 0.38) : 1;

    p.prevScreenX = p.screenX;
    p.prevScreenY = p.screenY;
    p.perspective = Math.max(0.28, Math.min(3.05, perspective));
    p.depth = Math.max(0, Math.min(1, 0.5 + z * 0.3 + p.indexRatio * 0.05));
    p.depthFade = 0.46 + this.depthFog(p) * 0.58 + field * 0.08;
    p.screenX = p.x * p.perspective * FIELD.orbitProjection * centerPull;
    p.screenY = p.y * p.perspective * FIELD.orbitProjection * centerPull;
  }

  depthFog(p) {
    const zFade = Math.max(0.18, 1 - Math.abs(p.z) * 0.075);
    const radiusFade = Math.exp(-Math.max(0, p.diskRadius - 1.1) * 0.03);
    return zFade * radiusFade * (0.58 + p.depth * 0.5);
  }
}
