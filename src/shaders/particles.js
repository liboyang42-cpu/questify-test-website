export const particleVertex = `
attribute vec2 a_position;
attribute vec4 a_meta;
attribute vec2 a_motion;

uniform vec2 u_pointer;
uniform vec3 u_camera;
uniform float u_dpr;
uniform float u_time;
uniform vec2 u_core;
uniform float u_exposure;

varying float v_alpha;
varying float v_depth;
varying float v_field;
varying vec2 v_motion;

void main() {
  float size = a_meta.x;
  float alpha = a_meta.y;
  float depth = a_meta.z;
  float field = a_meta.w;

  vec2 pos = a_position;
  float parallax = mix(0.18, 0.72, depth);
  pos.x -= u_camera.x * parallax;
  pos.y -= u_camera.y * parallax;
  pos *= 1.0 / max(u_camera.z * mix(1.08, 0.9, depth), 0.35);
  float coreDistance = distance(pos, u_core);
  float burn = clamp((u_exposure * 0.42) - coreDistance * 0.8, 0.0, 1.0);

  gl_Position = vec4(pos, 0.0, 1.0);
  float depthSize = mix(0.82, 1.86, depth);
  gl_PointSize = (size + field * 1.2 + burn * 0.75) * u_dpr * depthSize;
  v_alpha = (alpha * mix(0.54, 1.0, depth) + field * 0.045) * (1.0 - burn * 0.58) + burn * 0.03;
  v_depth = depth;
  v_field = field;
  v_motion = a_motion * (0.34 + depth * 0.32 + field * 0.22 + u_exposure * 1.05);
}
`;

export const particleFragment = `
precision highp float;

varying float v_alpha;
varying float v_depth;
varying float v_field;
varying vec2 v_motion;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;

  float sharpness = mix(0.5, 1.0, v_depth);
  float foregroundSoftness = smoothstep(0.68, 1.0, v_depth);
  float core = 1.0 - smoothstep(0.0, mix(0.22, 0.075, sharpness), d);
  float airy = 1.0 - smoothstep(0.01, mix(0.38, 0.2, sharpness), d);
  float haze = 1.0 - smoothstep(0.08, 0.42, d);
  vec2 direction = normalize(v_motion + vec2(0.0001, 0.0));
  vec2 tangent = vec2(-direction.y, direction.x);
  float alongMotion = dot(uv, direction);
  float acrossMotion = dot(uv, tangent);
  float motionStrength = smoothstep(0.0008, 0.012, length(v_motion));
  float trailShape = exp(-(acrossMotion * acrossMotion * 86.0 + alongMotion * alongMotion * 12.0));
  float trail = trailShape * motionStrength * smoothstep(-0.42, 0.18, alongMotion);
  float glow = max(airy, trail * (0.72 + v_field * 0.28));
  vec3 white = vec3(0.92, 0.96, 1.0);
  vec3 pearl = vec3(1.0, 0.88, 0.62);
  vec3 violet = vec3(0.62, 0.58, 1.0);
  vec3 cyan = vec3(0.58, 0.86, 1.0);
  vec3 color = mix(white, pearl, clamp(v_alpha * 0.36 + v_field * 0.16, 0.0, 1.0));
  color = mix(color, cyan, (1.0 - v_depth) * 0.16);
  color = mix(color, violet, (1.0 - v_depth) * 0.08 + v_field * 0.05);
  color = mix(color, vec3(1.0), core * 0.75);

  float diffuseFade = mix(0.52, 0.94, v_depth);
  gl_FragColor = vec4(color, (glow * (1.0 - foregroundSoftness * 0.18) + haze * foregroundSoftness * 0.14 + trail * (0.14 + v_field * 0.06)) * v_alpha * diffuseFade);
}
`;
