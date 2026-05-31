import './styles/main.css';
import { App } from './core/App.js';
import { RenderScheduler } from './core/RenderScheduler.js';
import { createInitialState } from './core/state.js';
import { InceptionScene } from './scenes/InceptionScene.js';
import { mountLanding } from './landing.js';

const root = {
  glCanvas: document.querySelector('#gl-stage'),
  overlayCanvas: document.querySelector('#overlay-stage'),
  fps: document.querySelector('[data-status="fps"]')
};

const scheduler = new RenderScheduler();
const app = new App({
  state: createInitialState(),
  scene: InceptionScene,
  root,
  scheduler
});
scheduler.register('galaxy', app);
scheduler.register('asme', { resume: () => {}, pause: () => {}, destroy: () => {} });

if (new URLSearchParams(window.location.search).has('debugCosmos')) {
  window.__atlabApp = app;
  window.__atlabScheduler = scheduler;
}
app.start();
scheduler.activate('galaxy');
mountLanding(document.querySelector('#next-scene'), scheduler);
window.addEventListener('pagehide', () => {
  scheduler.destroy();
});
