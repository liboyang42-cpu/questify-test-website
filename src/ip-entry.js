import './styles/main.css';
import { RenderScheduler } from './core/RenderScheduler.js';
import { mountLanding } from './landing.js';

const scheduler = new RenderScheduler();

scheduler.register('asme', { resume: () => {}, pause: () => {}, destroy: () => {} });
mountLanding(document.querySelector('#next-scene'), scheduler);
scheduler.activate('asme');

window.addEventListener('pagehide', () => {
  scheduler.destroy();
});
