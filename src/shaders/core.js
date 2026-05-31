export const coreVertex = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const coreFragment = `
precision highp float;

uniform vec2 u_core;
uniform float u_time;
uniform float u_exposure;
uniform float u_dive;
uniform float u_feedback;
varying vec2 v_uv;

void main() {
  vec2 p = v_uv * 2.0 - 1.0;
  vec2 d = p - u_core;
  float r = length(d);
  float grainA = sin(dot(d, vec2(18.7, 9.2)) + u_time * 0.34);
  float grainB = sin(dot(d, vec2(-11.4, 16.3)) - u_time * 0.27);
  float plasmaNoise = (grainA + grainB) * 0.5;
  float sphereR = max(0.0, r + plasmaNoise * 0.004 * smoothstep(0.025, 0.24, r));
  float proximity = 1.0 + min(u_dive, 7.0) * 0.18;
  float core = exp(-sphereR * (52.0 / proximity));
  float photosphere = exp(-sphereR * (18.5 / proximity));
  float bloom = exp(-sphereR * (5.2 / proximity));
  float halo = exp(-sphereR * (2.25 / proximity));
  float corona = exp(-sphereR * (3.4 / proximity)) * smoothstep(0.012, 0.2 * proximity, sphereR);
  float pulse = 0.94 + sin(u_time * 0.9) * 0.045 + u_feedback * 0.18;
  float postBirth = smoothstep(4.2, 9.2, u_time) * 0.36;
  float compressionPressure = 1.0 - smoothstep(2.55, 4.6, u_time);
  float blastPressure = smoothstep(2.8, 4.8, u_time) * (1.0 - smoothstep(5.4, 7.2, u_time));
  float gravityWell = exp(-sphereR * 0.82) * compressionPressure;
  float shockBloom = exp(-sphereR * 1.65) * blastPressure;

  vec3 hot = vec3(1.0, 0.98, 0.86) * core * 2.25;
  vec3 warm = vec3(1.0, 0.66, 0.36) * photosphere * 0.62;
  vec3 coronaColor = vec3(0.82, 0.68, 1.0) * corona * (0.08 + compressionPressure * 0.05);
  vec3 violet = vec3(0.32, 0.42, 0.9) * halo * (0.045 + compressionPressure * 0.035);
  vec3 color = (hot + warm + violet) * pulse * (1.0 + compressionPressure * 0.45 + blastPressure * 0.22 - postBirth * 0.3 + u_exposure * 1.4 + min(u_dive, 7.0) * 0.16 + u_feedback * 0.2);
  color += vec3(0.95, 0.64, 0.34) * gravityWell * 0.2;
  color += vec3(1.0, 0.82, 0.52) * shockBloom * 0.045;
  color += coronaColor;
  float alpha = clamp(core + photosphere * (0.48 - postBirth * 0.12) + bloom * (0.2 + compressionPressure * 0.16 + blastPressure * 0.16 - postBirth * 0.145 + u_exposure * 0.08 + u_feedback * 0.055) + halo * (0.04 + compressionPressure * 0.11 + blastPressure * 0.1 - postBirth * 0.034 + u_exposure * 0.03 + u_feedback * 0.025) + corona * (0.045 + compressionPressure * 0.05 - postBirth * 0.018), 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
}
`;
