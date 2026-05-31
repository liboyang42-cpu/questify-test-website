export function createInitialState() {
  return {
    time: 0,
    frame: 0,
    dt: 0,
    quality: {
      dpr: 1,
      tier: 'high',
      particleCount: 6800,
      gridSize: 64
    },
    viewport: {
      width: 1,
      height: 1,
      aspect: 1,
      needsResize: true
    },
    pointer: {
      x: -999,
      y: -999,
      targetX: -999,
      targetY: -999,
      nx: 0,
      ny: 0,
      vx: 0,
      vy: 0,
      speed: 0,
      smoothSpeed: 0,
      active: false,
      idle: 0
    },
    camera: {
      x: 0,
      y: 0,
      z: 1,
      targetX: 0,
      targetY: 0,
      targetZ: 1,
      vx: 0,
      vy: 0,
      vz: 0,
      scroll: 0,
      drift: 0
    },
    gestures: {
      clickBursts: [],
      wheelImpulse: 0
    },
    scene: {
      bend: 0,
      pulse: 0,
      magnetic: 0,
      hoveredAnchor: -1,
      exposure: 0,
      whiteout: 0,
      transitionPhase: 'idle',
      transitionProgress: 0,
      transitionKind: 'immersion',
      compression: 0,
      cityReveal: 0,
      dive: 0,
      nextScene: 'asme'
    }
  };
}
