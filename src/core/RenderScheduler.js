export class RenderScheduler {
  constructor() {
    this.scenes = new Map();
    this.activeName = null;
  }

  register(name, controller) {
    if (!name || !controller) return;
    this.scenes.set(name, controller);
  }

  activate(name) {
    if (this.activeName === name) return;

    const previous = this.scenes.get(this.activeName);
    previous?.pause?.();

    this.activeName = name;

    const next = this.scenes.get(name);
    next?.resume?.();
  }

  pause(name) {
    const controller = this.scenes.get(name);
    controller?.pause?.();
    if (this.activeName === name) {
      this.activeName = null;
    }
  }

  destroy() {
    this.scenes.forEach((controller) => controller?.destroy?.());
    this.scenes.clear();
    this.activeName = null;
  }
}
