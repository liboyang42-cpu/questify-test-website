export const overexposureVertex = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const overexposureFragment = `
precision highp float;

uniform vec2 u_core;
uniform float u_exposure;
uniform float u_whiteout;
uniform float u_dive;
uniform float u_time;
varying vec2 v_uv;

void main() {
  vec2 p = v_uv * 2.0 - 1.0;
  vec2 d = p - u_core;
  float r = length(d);
  float energy = max(0.0, u_exposure + u_dive * 0.55);
  float burnRadius = pow(clamp(energy / 3.2, 0.0, 1.0), 1.8) * 1.9;
  float front = 1.0 - smoothstep(burnRadius - 0.42, burnRadius + 0.18, r);
  float coreBurn = exp(-r * (8.0 - min(energy, 2.4) * 1.2)) * min(1.0, energy * 0.75);
  float leakage = exp(-r * 1.4) * energy * 0.18;
  float instability = sin(r * 24.0 - u_time * 5.2) * 0.025 * smoothstep(0.4, 1.4, energy);
  float saturation = clamp(front * (0.2 + energy * 0.36) + coreBurn + leakage + u_whiteout + instability, 0.0, 1.0);
  vec3 hot = mix(vec3(1.0, 0.86, 0.62), vec3(1.0), clamp(saturation * 1.35, 0.0, 1.0));
  gl_FragColor = vec4(hot, saturation);
}
`;
