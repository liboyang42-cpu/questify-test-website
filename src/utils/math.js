export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const lerp = (a, b, t) => a + (b - a) * t;

export function damp(current, target, lambda, dt) {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function spring(value, velocity, target, stiffness, damping, dt) {
  const force = (target - value) * stiffness;
  velocity = (velocity + force * dt) * Math.exp(-damping * dt);
  value += velocity * dt;
  return [value, velocity];
}

export function normalizePointer(x, y, width, height) {
  return {
    x: width > 0 ? (x / width) * 2 - 1 : 0,
    y: height > 0 ? -((y / height) * 2 - 1) : 0
  };
}
