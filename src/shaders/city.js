export const cityVertex = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const cityFragment = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_reveal;
uniform float u_dive;
varying vec2 v_uv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.2, 289.7))) * 9437.31);
}

float box(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return 1.0 - smoothstep(0.0, 0.012, length(max(d, 0.0)) + min(max(d.x, d.y), 0.0));
}

void main() {
  vec2 uv = v_uv;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / max(u_resolution.y, 1.0);

  float perspective = pow(1.0 - uv.y, 2.1);
  vec2 grid = vec2(p.x * (6.0 + perspective * 16.0), (uv.y + u_dive * 0.08 + u_time * 0.015) * (12.0 + perspective * 24.0));
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;
  float rnd = hash(cell);
  float height = 0.18 + rnd * 0.68;
  float building = box(local, vec2(0.32 + rnd * 0.08, 0.28));
  float skyline = smoothstep(0.08, 0.95, perspective + height * 0.35);
  float windows = step(0.72, hash(floor(local * 10.0) + cell * 3.1)) * building;
  float street = 1.0 - smoothstep(0.018, 0.05, min(abs(local.x), abs(local.y)));

  vec3 dusk = vec3(0.12, 0.07, 0.11);
  vec3 warm = vec3(1.0, 0.36, 0.16);
  vec3 teal = vec3(0.24, 0.8, 0.78);
  vec3 color = dusk;
  color += warm * building * skyline * (0.18 + rnd * 0.28);
  color += teal * windows * 0.22;
  color += warm * street * perspective * 0.12;
  color += vec3(1.0, 0.43, 0.2) * exp(-abs(p.x + 1.4) * 4.0) * 0.22;
  color *= smoothstep(0.0, 0.85, u_reveal);

  float haze = exp(-uv.y * 2.4) * 0.24 * u_reveal;
  color += vec3(1.0, 0.32, 0.18) * haze;
  float alpha = smoothstep(0.02, 0.45, u_reveal);
  gl_FragColor = vec4(color, alpha);
}
`;
