export const worldVertex = `
attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform vec3 u_camera;
uniform float u_time;
uniform float u_bend;

varying float v_distance;
varying float v_depth;

void main() {
  vec2 pos = a_position;
  float d = distance(pos, u_pointer);
  float fold = exp(-d * 1.72) * u_bend;
  float wave = sin((pos.x * 5.0 + pos.y * 3.0) - u_time * 0.7) * 0.025;

  pos.y += fold * 0.26 * sin(pos.x * 2.2 + u_time * 0.28);
  pos.x += fold * 0.16 * sin(pos.y * 3.0 - u_time * 0.22);
  pos += normalize(pos - u_pointer + 0.0001) * fold * 0.035;
  pos.y += wave * (1.0 + fold);

  pos.x -= u_camera.x * (0.22 + fold * 0.08);
  pos.y -= u_camera.y * (0.24 + fold * 0.08);
  pos *= 1.0 / max(u_camera.z, 0.35);

  gl_Position = vec4(pos, 0.0, 1.0);
  v_distance = d;
  v_depth = fold;
}
`;

export const worldFragment = `
precision highp float;

uniform float u_time;
uniform float u_pulse;
varying float v_distance;
varying float v_depth;

void main() {
  float nearField = exp(-v_distance * 2.2);
  float pulse = u_pulse * exp(-v_distance * 1.4);
  vec3 base = mix(vec3(0.13, 0.19, 0.2), vec3(0.72, 0.7, 0.58), nearField * 0.48 + pulse * 0.3);
  float alpha = 0.12 + nearField * 0.24 + v_depth * 0.28 + pulse * 0.22;
  alpha *= 0.82 + sin(u_time * 1.2 + v_distance * 8.0) * 0.08;
  gl_FragColor = vec4(base, alpha);
}
`;
