import * as THREE from 'three';

const waterVertex = `
varying vec2 vUv;
varying vec3 vWorld;
uniform float uTime;
void main() {
  vUv = uv;
  vec3 pos = position;
  float waveA = sin(pos.x * 0.45 + uTime * 0.45) * 0.045;
  float waveB = sin(pos.z * 0.82 - uTime * 0.32) * 0.024;
  float waveC = sin((pos.x + pos.z) * 1.55 + uTime * 0.18) * 0.014;
  pos.y += waveA + waveB + waveC;
  vec4 world = modelMatrix * vec4(pos, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const waterFragment = `
precision highp float;
varying vec2 vUv;
varying vec3 vWorld;
uniform float uTime;
uniform vec3 uCamera;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}

void main() {
  vec2 uv = vUv;
  float ripple = noise(uv * vec2(84.0, 22.0) + vec2(uTime * 0.04, -uTime * 0.02));
  float lanes = sin(uv.y * 145.0 + sin(uv.x * 12.0) * 1.8 + uTime * 0.62) * 0.5 + 0.5;
  float viewFresnel = pow(1.0 - abs(normalize(uCamera - vWorld).y), 3.0);
  vec3 deep = vec3(0.15, 0.21, 0.20);
  vec3 bronze = vec3(0.86, 0.58, 0.28);
  vec3 sky = vec3(0.62, 0.66, 0.58);
  float reflectionBand = smoothstep(0.08, 0.58, uv.y) * (1.0 - smoothstep(0.72, 1.0, uv.y));
  float brokenLight = reflectionBand * (0.28 + lanes * 0.22 + ripple * 0.18);
  vec3 color = mix(deep, sky, viewFresnel * 0.55);
  color += bronze * brokenLight;
  color += vec3(0.06, 0.045, 0.026) * noise(uv * 180.0 + uTime * 0.02);
  gl_FragColor = vec4(color, 1.0);
}
`;

const hazeVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const hazeFragment = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2 uPointer;

float hash(vec2 p){return fract(sin(dot(p,vec2(41.13,289.97)))*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.0,a=.5;
  for(int i=0;i<5;i++){v+=noise(p)*a;p=mat2(1.8,-1.15,1.15,1.8)*p+2.7;a*=.5;}
  return v;
}

void main() {
  vec2 drift = vec2(uTime * 0.012, -uTime * 0.004) + uPointer * 0.025;
  float horizon = exp(-abs(vUv.y - 0.44) * 8.5);
  float cloud = fbm(vUv * vec2(4.0, 9.0) + drift);
  float skyCloud = smoothstep(0.62, 0.86, vUv.y) * smoothstep(0.32, 0.76, cloud);
  float lowerMist = smoothstep(0.08, 0.45, vUv.y) * (1.0 - smoothstep(0.52, 0.72, vUv.y));
  float alpha = horizon * 0.24 + skyCloud * 0.08 + lowerMist * 0.09;
  vec3 color = mix(vec3(0.58, 0.64, 0.64), vec3(1.0, 0.78, 0.48), horizon);
  gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.32));
}
`;

function makeFacadeTexture(seed, width = 512, height = 1024, options = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const rng = seeded(seed);
  const base = options.base || [28, 31, 30];
  const glass = options.glass || [42, 52, 55];
  const light = options.light || [255, 176, 86];
  const cols = options.cols || Math.floor(9 + rng() * 10);
  const rows = options.rows || Math.floor(28 + rng() * 38);

  ctx.fillStyle = `rgb(${base[0]},${base[1]},${base[2]})`;
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `rgba(${glass[0] + 30},${glass[1] + 28},${glass[2] + 20},0.46)`);
  gradient.addColorStop(0.45, `rgba(${glass[0]},${glass[1]},${glass[2]},0.18)`);
  gradient.addColorStop(1, 'rgba(0,0,0,0.32)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const padX = Math.floor(width * (0.055 + rng() * 0.025));
  const padY = Math.floor(height * (0.035 + rng() * 0.025));
  const gapX = Math.max(2, Math.floor(width * 0.008));
  const gapY = Math.max(3, Math.floor(height * 0.004));
  const cellW = (width - padX * 2 - gapX * (cols - 1)) / cols;
  const cellH = (height - padY * 2 - gapY * (rows - 1)) / rows;

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const px = padX + x * (cellW + gapX);
      const py = padY + y * (cellH + gapY);
      const lit = rng() > 0.83 || (y > rows * 0.62 && rng() > 0.72);
      const cool = rng() > 0.55;
      ctx.fillStyle = lit
        ? `rgba(${light[0]},${light[1] + rng() * 32},${light[2] + rng() * 18},${0.42 + rng() * 0.5})`
        : `rgba(${cool ? 78 : 35},${cool ? 92 : 50},${cool ? 96 : 50},${0.15 + rng() * 0.28})`;
      ctx.fillRect(px, py, cellW, cellH);
    }
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < cols + 1; i += 1) {
    const x = padX + i * (cellW + gapX) - gapX * 0.5;
    ctx.beginPath();
    ctx.moveTo(x, padY * 0.65);
    ctx.lineTo(x, height - padY * 0.7);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  for (let i = 0; i < 220; i += 1) {
    ctx.fillRect(rng() * width, rng() * height, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}

function seeded(seed) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 233280 + 49297) % 2147483647;
    return s / 2147483647;
  };
}

function createMaterial(texture, tint = 0xffffff, roughness = 0.42, metalness = 0.16) {
  return new THREE.MeshStandardMaterial({
    map: texture,
    emissiveMap: texture,
    emissive: 0x4a2108,
    emissiveIntensity: 0.18,
    bumpMap: texture,
    bumpScale: 0.018,
    color: tint,
    roughness,
    metalness,
    envMapIntensity: 0.65
  });
}

function createGlassMaterial(color, emissive = 0x1a1208) {
  return new THREE.MeshPhysicalMaterial({
    color,
    emissive,
    emissiveIntensity: 0.06,
    roughness: 0.18,
    metalness: 0.22,
    clearcoat: 0.6,
    clearcoatRoughness: 0.18,
    transparent: true,
    opacity: 0.92
  });
}

function addRoofDetails(group, x, z, w, d, h, rng, material) {
  const detailCount = Math.floor(3 + rng() * 7);
  for (let i = 0; i < detailCount; i += 1) {
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(w * (0.07 + rng() * 0.14), h * (0.012 + rng() * 0.025), d * (0.06 + rng() * 0.16)),
      material
    );
    box.position.set(
      x + (rng() - 0.5) * w * 0.72,
      h + box.geometry.parameters.height * 0.5,
      z + (rng() - 0.5) * d * 0.72
    );
    group.add(box);
  }

  if (rng() > 0.55) {
    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.018, h * (0.12 + rng() * 0.18), 8),
      material
    );
    antenna.position.set(x + (rng() - 0.5) * w * 0.35, h + antenna.geometry.parameters.height * 0.5, z);
    group.add(antenna);
  }
}

function addBuilding(group, spec, materials) {
  const { x, z, w, d, h, seed, style = 0 } = spec;
  const rng = seeded(seed);
  const mat = materials[style % materials.length];
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 2, 18, 2), mat);
  body.position.set(x, h * 0.5, z);
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  const edgeMat = new THREE.MeshStandardMaterial({
    color: style % 2 ? 0x2d302d : 0x171a19,
    roughness: 0.62,
    metalness: 0.28
  });
  const cap = new THREE.Mesh(new THREE.BoxGeometry(w * 1.02, h * 0.018, d * 1.02), edgeMat);
  cap.position.set(x, h + h * 0.009, z);
  group.add(cap);

  if (rng() > 0.4) {
    const setback = new THREE.Mesh(new THREE.BoxGeometry(w * (0.48 + rng() * 0.26), h * (0.12 + rng() * 0.2), d * (0.46 + rng() * 0.28)), mat);
    setback.position.set(x + (rng() - 0.5) * w * 0.08, h + setback.geometry.parameters.height * 0.5, z + (rng() - 0.5) * d * 0.08);
    group.add(setback);
  }

  addRoofDetails(group, x, z, w, d, h, rng, edgeMat);
}

function addOrientalPearl(group, materials) {
  const metal = new THREE.MeshStandardMaterial({ color: 0x5c473d, roughness: 0.36, metalness: 0.62 });
  const pearl = new THREE.MeshStandardMaterial({ color: 0x8a5b50, emissive: 0x2a1208, roughness: 0.3, metalness: 0.42 });
  const x = -4.15;
  const z = -7.65;
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.052, 4.05, 20), metal);
  shaft.position.set(x, 1.93, z);
  group.add(shaft);
  const lower = new THREE.Mesh(new THREE.SphereGeometry(0.58, 48, 26), pearl);
  lower.scale.y = 0.92;
  lower.position.set(x, 1.5, z);
  group.add(lower);
  const upper = new THREE.Mesh(new THREE.SphereGeometry(0.3, 36, 18), pearl);
  upper.position.set(x, 3.28, z);
  group.add(upper);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.034, 1.55, 12), metal);
  mast.position.set(x, 4.42, z);
  group.add(mast);
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.72, 1.05, 0.52), materials[1]);
  base.position.set(x, 0.52, z);
  group.add(base);

  const supportMat = new THREE.MeshStandardMaterial({ color: 0x4d4036, roughness: 0.42, metalness: 0.54 });
  for (let i = 0; i < 3; i += 1) {
    const angle = -Math.PI / 2 + i * (Math.PI * 2 / 3);
    const support = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.062, 1.95, 12), supportMat);
    support.position.set(x + Math.cos(angle) * 0.42, 0.86, z + Math.sin(angle) * 0.28);
    support.rotation.z = Math.cos(angle) * 0.32;
    support.rotation.x = -Math.sin(angle) * 0.26;
    group.add(support);
  }
}

function addShanghaiTower(group) {
  const glass = createGlassMaterial(0x25302f);
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.54, 6.65, 9, 34), glass);
  tower.position.set(3.15, 2.95, -7.9);
  tower.rotation.y = -0.18;
  tower.scale.x = 0.86;
  tower.scale.z = 1.05;
  tower.castShadow = true;
  tower.receiveShadow = true;
  group.add(tower);

  const ribMat = new THREE.MeshStandardMaterial({ color: 0x303532, roughness: 0.38, metalness: 0.42 });
  for (let i = 0; i < 10; i += 1) {
    const angle = (i / 10) * Math.PI * 2 - 0.18;
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.012, 6.28, 0.02), ribMat);
    rib.position.set(3.15 + Math.cos(angle) * 0.42, 3.08, -7.9 + Math.sin(angle) * 0.46);
    rib.rotation.y = -angle;
    group.add(rib);
  }
}

function addPuxiForeground(scene, materials) {
  const group = new THREE.Group();
  group.position.set(0.15, -1.34, 6.2);
  group.rotation.x = 0;
  scene.add(group);

  const rng = seeded(707);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x202623, roughness: 0.86, metalness: 0.08 });
  for (let i = 0; i < 220; i += 1) {
    const row = Math.floor(i / 20);
    const col = i % 20;
    const x = (col - 9.5) * (0.58 + rng() * 0.12) + (rng() - 0.5) * 0.14;
    const z = (row - 5) * (0.38 + rng() * 0.09) + (rng() - 0.5) * 0.12;
    const w = 0.2 + rng() * 0.58;
    const d = 0.18 + rng() * 0.52;
    const h = 0.045 + Math.pow(rng(), 1.9) * 0.45;
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 1, 2, 1), materials[Math.floor(rng() * materials.length)]);
    mesh.position.set(x, h * 0.5, z);
    group.add(mesh);
    if (rng() > 0.55) {
      const roof = new THREE.Mesh(new THREE.BoxGeometry(w * 0.42, 0.025, d * 0.38), roofMat);
      roof.position.set(x + (rng() - 0.5) * w * 0.25, h + 0.015, z + (rng() - 0.5) * d * 0.25);
      group.add(roof);
    }
  }

  const roadMat = new THREE.MeshBasicMaterial({ color: 0x131817, transparent: true, opacity: 0.9 });
  for (let i = 0; i < 7; i += 1) {
    const road = new THREE.Mesh(new THREE.PlaneGeometry(12.5, 0.035), roadMat);
    road.rotation.x = -Math.PI * 0.5;
    road.position.set(0, 0.006, -2.2 + i * 0.62);
    group.add(road);
  }
  return group;
}

function addWorldFinancialCenter(group, material) {
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.46, 5.16, 0.38, 2, 26, 2), material);
  tower.position.set(2.08, 2.58, -7.72);
  tower.rotation.y = 0.04;
  group.add(tower);
  const aperture = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.42, 0.018),
    new THREE.MeshBasicMaterial({ color: 0x090908 })
  );
  aperture.position.set(2.08, 4.86, -7.505);
  aperture.rotation.y = 0.04;
  group.add(aperture);
}

function addJinMao(group, material) {
  const x = 1.45;
  const z = -7.58;
  const heights = [1.65, 1.04, 0.72, 0.48];
  let y = 0;
  heights.forEach((h, i) => {
    const width = 0.72 - i * 0.12;
    const part = new THREE.Mesh(new THREE.BoxGeometry(width, h, width * 0.78, 2, 10, 2), material);
    part.position.set(x, y + h * 0.5, z);
    group.add(part);
    y += h;
  });
  const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.065, 0.9, 8), new THREE.MeshStandardMaterial({ color: 0x2b2922, roughness: 0.32, metalness: 0.55 }));
  spire.position.set(x, y + 0.45, z);
  group.add(spire);
}

function buildCity(scene) {
  const city = new THREE.Group();
  city.position.set(0.05, -1.62, 0);
  city.scale.setScalar(0.78);
  scene.add(city);

  const textures = [
    makeFacadeTexture(11, 512, 1024, { cols: 11, rows: 48, base: [20, 23, 23], glass: [45, 54, 56] }),
    makeFacadeTexture(19, 512, 1024, { cols: 8, rows: 36, base: [36, 34, 30], glass: [56, 55, 50] }),
    makeFacadeTexture(31, 512, 1024, { cols: 15, rows: 58, base: [18, 21, 22], glass: [38, 48, 54] }),
    makeFacadeTexture(47, 512, 1024, { cols: 6, rows: 30, base: [42, 39, 34], glass: [62, 58, 51] })
  ];
  const materials = textures.map((texture, i) => createMaterial(texture, i === 1 ? 0xc0ad8e : 0xffffff, 0.38 + i * 0.04, 0.16));
  const darkService = new THREE.MeshStandardMaterial({ color: 0x24261f, roughness: 0.82, metalness: 0.14, transparent: true, opacity: 0.34 });

  const embankmentShape = new THREE.Shape();
  embankmentShape.moveTo(-6.9, -0.66);
  embankmentShape.bezierCurveTo(-6.2, 0.1, -4.8, 0.72, -2.65, 0.88);
  embankmentShape.bezierCurveTo(0.35, 1.12, 3.6, 0.55, 6.95, -0.38);
  embankmentShape.bezierCurveTo(5.2, -0.62, 2.4, -0.78, -0.8, -0.86);
  embankmentShape.bezierCurveTo(-3.4, -0.92, -5.4, -0.84, -6.9, -0.66);
  embankmentShape.closePath();
  const embankment = new THREE.Mesh(new THREE.ExtrudeGeometry(embankmentShape, { depth: 0.46, bevelEnabled: false }), darkService);
  embankment.rotation.x = -Math.PI * 0.5;
  embankment.position.set(0, -0.08, -4.65);
  city.add(embankment);

  addOrientalPearl(city, materials);
  addJinMao(city, materials[1]);
  addWorldFinancialCenter(city, materials[2]);
  addShanghaiTower(city);

  const rng = seeded(101);
  const bands = [
    { count: 36, z: -5.15, spread: 10.8, minH: 0.18, maxH: 0.86, minW: 0.2, maxW: 0.5 },
    { count: 110, z: -6.9, spread: 12.8, minH: 0.46, maxH: 2.15, minW: 0.16, maxW: 0.5 },
    { count: 150, z: -9.35, spread: 16.4, minH: 0.3, maxH: 1.8, minW: 0.12, maxW: 0.42 },
    { count: 190, z: -12.9, spread: 21.0, minH: 0.14, maxH: 0.96, minW: 0.08, maxW: 0.28 }
  ];

  bands.forEach((band, bandIndex) => {
    for (let i = 0; i < band.count; i += 1) {
      const xGuess = (rng() - 0.5) * band.spread + Math.sin(i * 1.7) * 0.25;
      const pearlGap = Math.abs(xGuess + 4.15) < 0.72 && bandIndex < 2;
      const towerGap = Math.abs(xGuess - 2.4) < 1.25 && bandIndex < 2;
      if ((pearlGap || towerGap) && rng() > 0.28) continue;
      const w = band.minW + rng() * (band.maxW - band.minW);
      const d = w * (0.75 + rng() * 0.95);
      const h = band.minH + Math.pow(rng(), 1.55) * (band.maxH - band.minH);
      const x = xGuess;
      const z = band.z + (rng() - 0.5) * 0.95;
      const style = Math.floor(rng() * materials.length);
      addBuilding(city, { x, z, w, d, h, seed: 2000 + bandIndex * 100 + i, style }, materials);
    }
  });

  const foreground = addPuxiForeground(scene, materials);
  return { city, foreground };
}

export function setupVexAtmosphere(canvas) {
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.34;
  renderer.setClearColor(0x000000, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.FogExp2(0x9b9b89, 0.043);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 110);
  camera.position.set(-0.4, 5.15, 11.4);

  const hemi = new THREE.HemisphereLight(0xd7d2bc, 0x182629, 1.08);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffd9a2, 5.2);
  sun.position.set(-2.7, 6.4, -5.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 18;
  sun.shadow.camera.left = -8;
  sun.shadow.camera.right = 8;
  sun.shadow.camera.top = 7;
  sun.shadow.camera.bottom = -3;
  scene.add(sun);

  const { city, foreground } = buildCity(scene);

  const waterUniforms = {
    uTime: { value: 0 },
    uCamera: { value: camera.position }
  };
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(42, 28, 220, 140),
    new THREE.ShaderMaterial({
      vertexShader: waterVertex,
      fragmentShader: waterFragment,
      uniforms: waterUniforms,
      transparent: false
    })
  );
  water.rotation.x = -Math.PI * 0.5;
  water.position.set(0, -1.72, 0.6);
  water.receiveShadow = true;
  scene.add(water);

  const hazeUniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2() }
  };
  const haze = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 1, 1),
    new THREE.ShaderMaterial({
      vertexShader: hazeVertex,
      fragmentShader: hazeFragment,
      uniforms: hazeUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    })
  );
  haze.renderOrder = 20;
  scene.add(haze);

  const pointer = new THREE.Vector2();
  const smoothPointer = new THREE.Vector2();
  const startTime = performance.now();
  let active = false;

  const onPointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * -2;
  };
  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
  }

  resize();

  const render = () => {
    const elapsed = (performance.now() - startTime) / 1000;
    smoothPointer.lerp(pointer, 0.025);

    hazeUniforms.uTime.value = elapsed;
    hazeUniforms.uPointer.value.copy(smoothPointer);
    waterUniforms.uTime.value = elapsed;

    const driftX = Math.sin(elapsed * 0.07) * 0.035;
    const driftY = Math.sin(elapsed * 0.052) * 0.018;
    camera.position.x = -0.4 + driftX + smoothPointer.x * 0.035;
    camera.position.y = 5.15 + driftY + smoothPointer.y * 0.016;
    camera.position.z = 11.4 + smoothPointer.y * 0.012;
    camera.lookAt(0.0 + smoothPointer.x * 0.022, 0.55 + smoothPointer.y * 0.012, -7.6);

    city.rotation.y = smoothPointer.x * 0.003;
    foreground.rotation.y = smoothPointer.x * 0.002;
    renderer.render(scene, camera);
  };

  const resume = () => {
    if (active) return;
    active = true;
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('resize', resize);
    resize();
    renderer.setAnimationLoop(render);
  };

  const pause = () => {
    if (!active) return;
    active = false;
    renderer.setAnimationLoop(null);
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('resize', resize);
  };

  const destroy = () => {
    pause();
    renderer.dispose();
  };

  return { pause, resume, destroy };
}
