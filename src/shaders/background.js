export const backgroundVertex = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const backgroundFragment = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform vec2 u_core;
uniform float u_time;
uniform float u_bend;
uniform float u_exposure;
varying vec2 v_uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float starCell(vec2 p, float scale, float threshold, float sharpness) {
  vec2 id = floor(p * scale);
  vec2 f = fract(p * scale) - 0.5;
  vec2 jitter = vec2(hash(id + 17.2), hash(id + 91.7)) - 0.5;
  float seed = hash(id + 41.4);
  float star = smoothstep(threshold, 1.0, seed);
  float d = length(f - jitter * 0.55);
  return star * exp(-d * d * sharpness);
}

void main() {
  vec2 uv = v_uv;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / max(u_resolution.y, 1.0);
  float skySpin = u_time * 0.026;
  mat2 skyRotation = mat2(cos(skySpin), -sin(skySpin), sin(skySpin), cos(skySpin));
  vec2 rotatingSky = skyRotation * p;

  float vignette = smoothstep(1.65, 0.18, length(p));
  float cosmicReveal = smoothstep(4.8, 9.0, u_time);
  float dustReveal = smoothstep(5.2, 9.8, u_time);
  float diskReveal = smoothstep(5.2, 9.4, u_time);
  float ignition = 1.0 - smoothstep(0.0, 5.8, u_time);
  float pointerGlow = exp(-length((uv * 2.0 - 1.0) - u_pointer) * 2.2);
  vec2 coreVector = ((uv * 2.0 - 1.0) - u_core) * 0.68;
  float coreDistance = length(coreVector);
  float stellarCore = exp(-coreDistance * 8.0);
  float halo = exp(-coreDistance * 1.85);
  float sphericalHaze = exp(-coreDistance * 2.9);
  float yaw = -0.44 + sin(u_time * 0.038) * 0.075;
  mat2 galaxyAxis = mat2(cos(yaw), -sin(yaw), sin(yaw), cos(yaw));
  vec2 axisCore = galaxyAxis * coreVector;
  float depthSway = sin(u_time * 0.052) * 0.18;
  vec2 diskVector = vec2(axisCore.x * (0.72 + depthSway * 0.08), axisCore.y * (1.52 - depthSway * 0.12));
  float warp = sin(diskVector.x * 1.75 + u_time * 0.075) * 0.15 + sin(diskVector.x * 4.4 - u_time * 0.032) * 0.045;
  float wideBand = exp(-abs(diskVector.y + warp) * 0.74) * exp(-abs(diskVector.x) * 0.28);
  float innerBand = exp(-abs(diskVector.y + warp * 0.56) * 2.8) * exp(-abs(diskVector.x) * 0.42);
  float stellarBand = exp(-abs(diskVector.y + warp * 0.35) * 5.5) * exp(-abs(diskVector.x) * 0.4);
  float armA = exp(-abs(diskVector.y - sin(diskVector.x * 1.35 + 0.7) * 0.34) * 2.7) * exp(-abs(diskVector.x) * 0.33);
  float armB = exp(-abs(diskVector.y + sin(diskVector.x * 1.22 - 0.9) * 0.26) * 3.0) * exp(-abs(diskVector.x) * 0.45);
  float blastBand = exp(-abs(diskVector.y + warp * 0.85) * 1.35) * exp(-abs(diskVector.x) * 0.18);
  float blastArm = max(armA, armB) * exp(-abs(diskVector.x) * 0.16);
  vec2 flow = vec2(sin(u_time * 0.034 + p.y * 1.7), cos(u_time * 0.028 + p.x * 1.2)) * 0.14;
  float nebulaA = noise(rotatingSky * 1.15 + flow + vec2(u_time * 0.01, -u_time * 0.006));
  float nebulaB = noise(rotatingSky * 2.7 - flow * 0.6);
  float nebulaC = noise(rotatingSky * 6.0 + flow * 1.25);
  float cloud = smoothstep(0.3, 0.82, nebulaA * 0.55 + nebulaB * 0.32 + nebulaC * 0.18);
  float dustNoise = noise(diskVector * vec2(2.1, 4.8) + vec2(u_time * 0.012, u_time * 0.008));
  float dustLane = smoothstep(0.38, 0.82, dustNoise) * exp(-abs(diskVector.y + warp * 1.1) * 2.25) * exp(-abs(diskVector.x) * 0.34);
  float rift = exp(-abs(diskVector.y - 0.18 + sin(diskVector.x * 2.0) * 0.18) * 4.2) * exp(-abs(diskVector.x) * 0.48);
  float grain = (hash(gl_FragCoord.xy + floor(u_time * 18.0)) - 0.5) * 0.018;

  vec3 deep = vec3(0.001, 0.002, 0.008);
  vec3 blue = vec3(0.018, 0.044, 0.09);
  vec3 violet = vec3(0.08, 0.06, 0.14);
  vec3 teal = vec3(0.025, 0.09, 0.12);
  vec3 amber = vec3(0.95, 0.58, 0.32);
  float compressionPressure = 1.0 - smoothstep(2.4, 4.6, u_time);
  float blastPressure = smoothstep(2.8, 4.8, u_time) * (1.0 - smoothstep(5.4, 7.2, u_time));
  float blastHaze = exp(-coreDistance * 0.72) * blastPressure;
  vec3 color = deep;
  color += vec3(0.95, 0.76, 0.48) * exp(-coreDistance * (3.2 + ignition * 4.6)) * ignition * (0.18 + compressionPressure * 0.12);
  color += vec3(0.72, 0.78, 1.0) * blastHaze * 0.012;
  color += vec3(1.0, 0.78, 0.48) * blastBand * blastPressure * 0.018;
  color += vec3(0.78, 0.9, 1.0) * blastArm * blastPressure * 0.012;
  color += blue * cloud * 0.045 * dustReveal;
  color += teal * cloud * 0.055 * dustReveal;
  color += violet * cloud * 0.035 * dustReveal;
  color += violet * sphericalHaze * 0.02;
  color += amber * halo * 0.075;
  color += vec3(0.22, 0.36, 0.62) * wideBand * 0.052 * diskReveal;
  color += vec3(0.78, 0.88, 1.0) * stellarBand * 0.082 * diskReveal;
  color += vec3(1.0, 0.72, 0.42) * innerBand * 0.078 * diskReveal;
  color += vec3(0.62, 0.78, 1.0) * max(armA, armB) * 0.052 * diskReveal;
  color += vec3(1.0, 0.86, 0.62) * stellarCore * 0.58;
  color += vec3(0.56, 0.76, 1.0) * pointerGlow * 0.018;
  color *= 1.0 - clamp((dustLane * 0.08 + rift * 0.05) + (dustLane * 0.18 + rift * 0.12) * diskReveal, 0.0, 0.28);
  color += vec3(0.006, 0.009, 0.018) * vignette * 0.16;
  color += grain;
  color *= 1.0 + u_exposure * 0.85;

  gl_FragColor = vec4(color, 1.0);
}
`;
