const root = document.querySelector('#next-scene');
const params = new URLSearchParams(window.location.search);
const activeProjectId = params.get('project');
const detailMode = Boolean(activeProjectId);

const events = [
  ['NIGHT CITY INSOMNIA PROTOCOL', 'Narrative Experiment', 'LIVE / 47%', '30% of citizens report overlapping dream states'],
  ['ANONYMOUS THEATER VOL.3', 'User Generated Narrative', 'EXPANDING / 68%', 'Users are assigned hidden roles in a collective story system'],
  ['DATA GOD AWAKENING', 'Collaboration IP', 'COUNTDOWN / 18%', 'A foreign creative entity is entering the city system']
];

const entities = [
  ['DATA CLEANER UNIT', 'System Maintenance Entity', 'Removing corrupted narrative fragments'],
  ['ANONYMOUS STORY WEAVER', 'Narrative Manipulator', 'Injecting alternate story branches'],
  ['EXTERNAL ARTIST NODE / XXX STUDIO', 'Collaboration Entity', 'Deploying visual narrative layer']
];

const navItems = [
  ['about', 'about'],
  ['live events', 'live-events'],
  ['city entities', 'city-entities'],
  ['narrative map', 'narrative-map'],
  ['participation', 'participation'],
  ['related archives', 'related-archives']
];

const projects = [
  {
    id: 'geisai',
    title: 'WORLD / IP LAYER',
    short: 'WORLD / IP',
    index: '009',
    year: '[2026 - LIVE]',
    date: 'JUN. 18TH, 2026',
    contract: 'CITY-09',
    chain: 'APECHAIN',
    tag: 'LIVE',
    tone: 'gold',
    about: 'World / IP Layer is a living city archive where intellectual property is no longer displayed as static content. It is operated as a sequence of live events, persistent entities, and connected narrative routes.',
    headline: 'World / IP Layer: the city event system by 城瘾'
  },
  {
    id: 'forging',
    title: 'CLONE X SZN1 FORGING',
    short: 'FORGING',
    index: '010',
    year: '[2026 - DROP]',
    date: 'APR. 24TH, 2026',
    contract: 'ERC-721',
    chain: 'APECHAIN',
    tag: 'PHYSICAL',
    tone: 'purple',
    about: 'Forging is a ritualized production layer where digital identity unlocks physical objects, limited claims, and staged city access.',
    headline: 'Clone X SZN1 Forging: city identity becomes physical'
  },
  {
    id: 'airforce',
    title: 'NIKE AIR FORCE 1',
    short: 'AIR FORCE',
    index: '011',
    year: '[2026 - OBJECT]',
    date: 'AUG. 30TH, 2026',
    contract: 'ERC-721',
    chain: 'APECHAIN',
    tag: 'SNEAKERS',
    tone: 'shoe',
    about: 'The Air Force 1 layer turns a cultural object into an indexed city artifact, connecting wearable identity with event-based ownership.',
    headline: 'Nike Air Force 1: wearable artifacts enter the city'
  }
];

function getProject(id) {
  return projects.find(project => project.id === id) || projects[0];
}

function wrapProjectIndex(index) {
  return (index + projects.length) % projects.length;
}

function sigilSvg(opacity = 1) {
  return `
    <svg viewBox="0 0 600 600" aria-hidden="true" style="opacity:${opacity}">
      <defs>
        <radialGradient id="gold" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#fff2a8"/>
          <stop offset="36%" stop-color="#d5a83a"/>
          <stop offset="72%" stop-color="#80510c"/>
          <stop offset="100%" stop-color="#2b1702"/>
        </radialGradient>
      </defs>
      ${Array.from({ length: 32 }).map((_, i) => {
        const rot = i * 11.25;
        const wide = i % 2 === 0;
        return `<path d="${wide ? 'M300 44L337 220L300 304L263 220Z' : 'M300 86L320 232L300 304L280 232Z'}" fill="url(#gold)" stroke="#3a2308" stroke-width="${wide ? 4 : 3}" transform="rotate(${rot} 300 300)"/>`;
      }).join('')}
      ${Array.from({ length: 16 }).map((_, i) => `<path d="M300 160C326 184 342 224 330 266L300 314L270 266C258 224 274 184 300 160Z" fill="#b57a17" stroke="#3a2308" stroke-width="4" transform="rotate(${i * 22.5} 300 300)"/>`).join('')}
      <circle cx="300" cy="300" r="140" fill="url(#gold)" stroke="#3a2308" stroke-width="12"/>
      <circle cx="300" cy="300" r="92" fill="#b17613" stroke="#4b2b06" stroke-width="8"/>
      <circle cx="300" cy="300" r="58" fill="#241405" stroke="#e5b848" stroke-width="10"/>
      <circle cx="300" cy="284" r="30" fill="#f8dc78" opacity="0.82"/>
    </svg>
  `;
}

function projectVisual(project, side = false) {
  if (project.tone === 'purple') {
    return `
      <div class="archive-surface purple-surface">
        <div class="forging-core">FORGING</div>
        <div class="forging-rays"></div>
      </div>
      ${side ? '' : '<span class="enter-tip">Click to enter</span>'}
    `;
  }
  if (project.tone === 'shoe') {
    return `
      <div class="archive-surface shoe-surface">
        <div class="shoe-object"></div>
      </div>
      ${side ? '' : '<span class="enter-tip">Click to enter</span>'}
    `;
  }
  return side ? sigilSvg(0.8) : `
    <div class="archive-surface"><div class="object"></div></div>
    <span class="enter-tip">Click to enter</span>
  `;
}

function baseStyles() {
  return `
    <style>
      :root {
        --bg: #000;
        --white: #f7f7f7;
        --pill: rgba(21,21,24,0.94);
        --mono: "Input Mono", "SFMono-Regular", "Roboto Mono", ui-monospace, monospace;
        --display: "Bebas Neue", Impact, sans-serif;
        font-family: var(--mono);
      }
      * { box-sizing: border-box; }
      html { scroll-behavior: smooth; background: #000; }
      body { margin: 0; min-height: 100vh; background: #000; color: var(--white); overflow-x: hidden; }
      a { color: inherit; text-decoration: none; }
      button { font: inherit; cursor: pointer; }
      .topbar {
        position: fixed;
        top: 26px;
        left: 22px;
        right: 22px;
        z-index: 50;
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        pointer-events: none;
      }
      .mark { width: 54px; height: 32px; pointer-events: auto; color: #fff; }
      .mark svg { width: 100%; height: 100%; display: block; }
      .timeline-pill { display: inline-flex; align-items: center; gap: 8px; pointer-events: auto; }
      .pill {
        border: 0;
        border-radius: 12px;
        background: var(--pill);
        color: #fff;
        height: 42px;
        padding: 0 22px;
        font-family: var(--mono);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }
      .pill.icon { width: 52px; padding: 0; display: grid; place-items: center; font-size: 28px; line-height: 1; }
      .menu {
        justify-self: end;
        width: 48px;
        height: 46px;
        border: 0;
        border-radius: 12px;
        background: var(--pill);
        pointer-events: auto;
        position: relative;
      }
      .menu::before,
      .menu::after { content: ""; position: absolute; left: 15px; right: 15px; height: 2px; background: #fff; }
      .menu::before { top: 17px; }
      .menu::after { top: 27px; }
      .loader-screen {
        position: fixed;
        inset: 0;
        z-index: 90;
        display: grid;
        place-items: center;
        background: #000;
        color: #fff;
        font-family: var(--display);
        font-size: clamp(82px, 15vw, 250px);
        line-height: 0.8;
        text-transform: uppercase;
        pointer-events: none;
        transition: opacity 0.55s ease, visibility 0.55s ease;
      }
      .loaded .loader-screen { opacity: 0; visibility: hidden; }
    </style>
  `;
}

function topbar(center = '') {
  return `
    <div class="topbar">
      <a class="mark" href="./apechain-home.html" aria-label="Back to home">
        <svg viewBox="0 0 100 60" aria-hidden="true"><path d="M5 8L88 25L74 36L94 52L26 35L37 27L5 8Z" fill="white"/></svg>
      </a>
      ${center}
      <button class="menu" type="button" aria-label="Menu"></button>
    </div>
  `;
}

function renderHome() {
  root.innerHTML = `
    ${baseStyles()}
    <style>
      body { overflow: hidden; }
      .home {
        position: fixed;
        inset: 0;
        overflow: hidden;
        background: #000;
        --liquid-x: 50%;
        --liquid-y: 50%;
      }
      .home::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at var(--liquid-x) var(--liquid-y), rgba(255,255,255,0.09), transparent 9%),
          radial-gradient(circle at calc(var(--liquid-x) + 4%) calc(var(--liquid-y) + 2%), rgba(0,136,255,0.16), transparent 7%),
          radial-gradient(circle at calc(var(--liquid-x) - 5%) calc(var(--liquid-y) - 3%), rgba(255,41,91,0.14), transparent 7%);
        mix-blend-mode: screen;
        opacity: 0;
        transition: opacity 0.25s ease;
        pointer-events: none;
      }
      .home.is-hovering::before { opacity: 1; }
      .cube-carousel {
        position: absolute;
        inset: -2vh -6vw 0;
        perspective: 980px;
        perspective-origin: 50% 42%;
        transform-style: preserve-3d;
      }
      .cube-ring {
        position: absolute;
        left: 50%;
        top: 9vh;
        width: min(52vw, 730px);
        aspect-ratio: 1 / 1;
        transform-style: preserve-3d;
        transform-origin: 50% 50%;
        will-change: transform;
      }
      .carousel-zone {
        position: absolute;
        top: 10vh;
        bottom: 16vh;
        z-index: 2500;
        border: 0;
        background: transparent;
        cursor: pointer;
      }
      .carousel-zone.left-zone { left: 0; width: 24vw; }
      .carousel-zone.right-zone { right: 0; width: 24vw; }
      .home-card {
        position: absolute;
        left: 50%;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border: 0;
        background: #dde1fb;
        box-shadow:
          -3px 0 0 rgba(255,75,24,0.72),
          3px 0 0 rgba(0,118,255,0.9),
          0 0 0 8px #030303,
          28px 22px 0 rgba(0,0,0,0.9);
        transform-style: preserve-3d;
        backface-visibility: visible;
        transition: filter 0.28s ease, opacity 0.28s ease;
        will-change: transform, opacity, filter;
        cursor: pointer;
      }
      .home-card::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at var(--liquid-x) var(--liquid-y), transparent 0 7%, rgba(255,255,255,0.18) 7.5%, transparent 13%),
          linear-gradient(90deg, rgba(255,0,60,0.18), transparent 12%, transparent 88%, rgba(0,124,255,0.22));
        mix-blend-mode: screen;
        opacity: 0;
        transform: translate3d(0,0,0);
        transition: opacity 0.18s ease;
        pointer-events: none;
      }
      .home.is-hovering .home-card.active::after { opacity: 1; animation: liquidPulse 1.35s ease-in-out infinite; }
      @keyframes liquidPulse {
        0%, 100% { filter: blur(0); transform: scale(1); }
        50% { filter: blur(1.4px); transform: scale(1.015); }
      }
      .home-card.front {
        background:
          radial-gradient(circle at 62% 38%, rgba(255,255,255,0.18), transparent 15%),
          linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
          #07080d;
        background-size: auto, 44px 44px, 44px 44px, auto;
      }
      .home-card.left,
      .home-card.right {
        filter: brightness(0.78) saturate(0.9);
      }
      .home-card svg {
        position: absolute;
        inset: 13%;
        width: 74%;
        height: 74%;
        filter: drop-shadow(0 20px 18px rgba(0,0,0,0.28));
      }
      .home-card:not(.active) svg { opacity: 0.34; }
      .archive-surface {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 38% 28%, rgba(255,255,255,0.08), transparent 7%),
          radial-gradient(circle at 67% 42%, rgba(255,255,255,0.08), transparent 8%),
          radial-gradient(circle at 48% 70%, rgba(255,255,255,0.06), transparent 9%),
          #07080d;
      }
      .archive-surface .object {
        position: absolute;
        left: 19%;
        right: 13%;
        top: 36%;
        height: 12%;
        border-radius: 999px 999px 999px 20px;
        background:
          radial-gradient(circle at 72% 50%, #ff4f98 0 12%, #f0d9c0 13% 28%, #20dbff 29% 45%, transparent 46%),
          linear-gradient(100deg, #fff 0 14%, #f5d4ea 15% 34%, #1bd7ff 35% 50%, #f8e7cc 51% 67%, #ff4f98 68% 100%);
        box-shadow:
          -4px 0 0 rgba(255,0,48,0.72),
          4px 0 0 rgba(0,118,255,0.78),
          0 16px 44px rgba(0,0,0,0.42);
        transform: rotate(12deg);
      }
      .archive-surface .object::before,
      .archive-surface .object::after {
        content: "";
        position: absolute;
        top: 50%;
        width: 34%;
        height: 34%;
        background: #f6f4ff;
        clip-path: polygon(0 45%, 100% 0, 72% 52%, 100% 100%, 0 58%);
      }
      .archive-surface .object::before { left: -27%; transform: translateY(-50%); }
      .archive-surface .object::after { right: -27%; transform: translateY(-50%) scaleX(-1); }
      .purple-surface {
        background:
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.14), transparent 8%),
          radial-gradient(circle at 30% 42%, rgba(126,78,255,0.55), transparent 24%),
          linear-gradient(135deg, #28146f, #090817 72%);
      }
      .forging-core {
        position: absolute;
        left: 50%;
        top: 52%;
        transform: translate(-50%, -50%) rotate(-4deg);
        color: #fff;
        font-family: var(--display);
        font-size: clamp(62px, 8vw, 112px);
        text-shadow: -3px 0 rgba(255,0,62,0.55), 3px 0 rgba(0,130,255,0.55);
      }
      .forging-rays {
        position: absolute;
        inset: 18%;
        background:
          linear-gradient(90deg, transparent 48%, rgba(255,255,255,0.42) 49% 51%, transparent 52%),
          linear-gradient(0deg, transparent 48%, rgba(255,255,255,0.32) 49% 51%, transparent 52%);
        transform: rotate(28deg);
        opacity: 0.32;
      }
      .shoe-surface {
        background:
          radial-gradient(circle at 54% 38%, rgba(255,255,255,0.2), transparent 18%),
          linear-gradient(135deg, #d9dced, #9ea7bd);
      }
      .shoe-object {
        position: absolute;
        left: 18%;
        right: 12%;
        top: 38%;
        height: 22%;
        background:
          radial-gradient(circle at 72% 42%, #1ccfe8 0 8%, transparent 9%),
          linear-gradient(100deg, #fff 0 36%, #24c8d9 37% 49%, #fff 50% 100%);
        border-radius: 42% 52% 28% 22%;
        transform: rotate(-3deg);
        box-shadow: -4px 0 rgba(255,40,80,0.45), 4px 0 rgba(0,120,255,0.5), 0 18px 28px rgba(0,0,0,0.28);
      }
      .shoe-object::after {
        content: "";
        position: absolute;
        left: 8%;
        right: 4%;
        bottom: -20%;
        height: 28%;
        background: #f7f7f7;
        border-radius: 0 0 40px 40px;
      }
      .enter-tip {
        position: absolute;
        left: 50%;
        top: 56%;
        transform: translate(-50%, -50%);
        z-index: 5;
        border-radius: 8px;
        padding: 9px 13px;
        background: rgba(0,0,0,0.92);
        color: #fff;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.06em;
        opacity: 0;
        transition: opacity 0.18s ease, transform 0.18s ease;
        pointer-events: none;
      }
      .home.is-hovering .enter-tip { opacity: 1; transform: translate(-50%, -58%); }
      .home-title {
        position: absolute;
        left: 1vw;
        right: -1vw;
        bottom: 4.2vh;
        z-index: 7;
        color: #fff;
        font-family: var(--display);
        font-size: clamp(108px, 18vw, 260px);
        line-height: 0.7;
        letter-spacing: 0;
        text-transform: uppercase;
        pointer-events: none;
      }
      .home-years {
        position: absolute;
        left: 24px;
        bottom: 26px;
        z-index: 8;
        color: #fff;
        font-size: 15px;
        font-weight: 800;
        letter-spacing: 0.04em;
      }
      @media (max-width: 700px) {
        .cube-ring { top: 18vh; width: 82vw; }
        .home-title { font-size: 45vw; bottom: 6vh; }
      }
    </style>
    <div class="home">
      <div class="loader-screen">WORLD/IP</div>
      ${topbar('')}
      <div class="cube-carousel" aria-label="World archive carousel">
        <div class="cube-ring">
          <button class="home-card left" data-face="left" type="button" aria-label="Show previous archive"></button>
          <button class="home-card front active" data-face="front" type="button" aria-label="Enter selected archive"></button>
          <button class="home-card right" data-face="right" type="button" aria-label="Show next archive"></button>
        </div>
        <button class="carousel-zone left-zone" type="button" aria-label="Show previous archive"></button>
        <button class="carousel-zone right-zone" type="button" aria-label="Show next archive"></button>
      </div>
      <div class="home-title">WORLD / IP</div>
      <div class="home-years">[2026 - LIVE]</div>
    </div>
  `;

  const home = document.querySelector('.home');
  const room = document.querySelector('.cube-ring');
  const cards = Array.from(document.querySelectorAll('.home-card'));
  const faces = {
    left: document.querySelector('.home-card.left'),
    front: document.querySelector('.home-card.front'),
    right: document.querySelector('.home-card.right')
  };
  const leftZone = document.querySelector('.left-zone');
  const rightZone = document.querySelector('.right-zone');
  let activeIndex = 0;
  let currentAngle = 0;
  let isAnimating = false;
  let dragStartX = 0;
  let dragging = false;
  let suppressClick = false;

  requestAnimationFrame(() => {
    setTimeout(() => document.body.classList.add('loaded'), 540);
  });

  function wrapIndex(index) {
    return (index + projects.length) % projects.length;
  }

  function projectAt(offset) {
    return projects[wrapIndex(activeIndex + offset)];
  }

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }

  function setFace(face, project, role) {
    face.dataset.project = project.id;
    face.innerHTML = projectVisual(project, role !== 'front');
    face.setAttribute('aria-label', role === 'front' ? `Enter ${project.title}` : `Show ${project.title}`);
    face.classList.toggle('active', role === 'front');
  }

  function updateGeometry(angle = currentAngle) {
    const size = room.getBoundingClientRect().width;
    const half = size / 2;
    const wallAngle = 72;
    const wallRadians = wallAngle * Math.PI / 180;
    const hingeX = half;
    const sideCenter = half + (Math.cos(wallRadians) * half) - size * 0.045;
    const sideZ = Math.sin(wallRadians) * half;
    const states = {
      '-2': { x: -sideCenter - size * 0.64, z: sideZ * 1.16, ry: wallAngle + 18, opacity: 0, filter: 0.42 },
      '-1': { x: -sideCenter, z: sideZ, ry: wallAngle, opacity: 0.94, filter: 0.86 },
      '0': { x: 0, z: 0, ry: 0, opacity: 1, filter: 1 },
      '1': { x: sideCenter, z: sideZ, ry: -wallAngle, opacity: 0.94, filter: 0.86 },
      '2': { x: sideCenter + size * 0.64, z: sideZ * 1.16, ry: -wallAngle - 18, opacity: 0, filter: 0.42 }
    };

    function mix(from, to, t) {
      return from + (to - from) * t;
    }

    function stateFor(slot) {
      const clamped = Math.max(-2, Math.min(2, slot));
      const lower = Math.floor(clamped);
      const upper = Math.ceil(clamped);
      if (lower === upper) return states[String(lower)];
      const start = states[String(lower)];
      const end = states[String(upper)];
      const t = clamped - lower;
      return {
        x: mix(start.x, end.x, t),
        z: mix(start.z, end.z, t),
        ry: mix(start.ry, end.ry, t),
        opacity: mix(start.opacity, end.opacity, t),
        filter: mix(start.filter, end.filter, t)
      };
    }

    function place(face, baseSlot) {
      const state = stateFor(baseSlot - angle);
      face.style.transform = `translate3d(calc(-50% + ${state.x}px), 0, ${state.z}px) rotateY(${state.ry}deg)`;
      face.style.opacity = state.opacity;
      face.style.filter = `brightness(${state.filter}) saturate(${face.dataset.face === 'front' ? 1 : 0.9})`;
      face.style.zIndex = String(Math.round((state.z + hingeX) * 10));
    }

    room.style.transform = 'translateX(-50%) rotateZ(-4deg)';
    place(faces.left, -1);
    place(faces.front, 0);
    place(faces.right, 1);
  }

  function renderFaces() {
    setFace(faces.left, projectAt(-1), 'left');
    setFace(faces.front, projectAt(0), 'front');
    setFace(faces.right, projectAt(1), 'right');
    updateGeometry(0);
  }

  function animateTo(direction) {
    if (isAnimating) return;
    isAnimating = true;
    suppressClick = true;
    home.classList.remove('is-hovering');

    const from = currentAngle;
    const to = direction;
    const duration = 980;
    const startedAt = performance.now();

    function step(now) {
      const t = Math.min((now - startedAt) / duration, 1);
      currentAngle = from + (to - from) * easeInOutCubic(t);
      updateGeometry(currentAngle);

      if (t < 1) {
        requestAnimationFrame(step);
        return;
      }

      activeIndex = wrapIndex(activeIndex + direction);
      currentAngle = 0;
      isAnimating = false;
      suppressClick = false;
      renderFaces();
    }

    requestAnimationFrame(step);
  }

  function enterDetail() {
    const project = projects[activeIndex];
    document.body.classList.remove('loaded');
    setTimeout(() => {
      window.location.href = `./ip.html?project=${project.id}`;
    }, 280);
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (suppressClick || isAnimating) return;
      if (card.dataset.face === 'front') enterDetail();
      if (card.dataset.face === 'left') animateTo(-1);
      if (card.dataset.face === 'right') animateTo(1);
    });
    card.addEventListener('mouseenter', () => {
      if (card.dataset.face === 'front' && !isAnimating) home.classList.add('is-hovering');
    });
    card.addEventListener('mouseleave', () => home.classList.remove('is-hovering'));
    card.addEventListener('pointermove', event => {
      if (card.dataset.face !== 'front' || isAnimating) return;
      const rect = card.getBoundingClientRect();
      home.style.setProperty('--liquid-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      home.style.setProperty('--liquid-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
  });

  leftZone?.addEventListener('click', () => animateTo(-1));
  rightZone?.addEventListener('click', () => animateTo(1));

  window.addEventListener('wheel', event => {
    event.preventDefault();
    animateTo(event.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  window.addEventListener('pointerdown', event => {
    dragging = true;
    dragStartX = event.clientX;
  }, { passive: true });
  window.addEventListener('pointerup', event => {
    if (!dragging) return;
    dragging = false;
    const delta = event.clientX - dragStartX;
    if (Math.abs(delta) > 70) {
      suppressClick = true;
      animateTo(delta < 0 ? 1 : -1);
      setTimeout(() => { suppressClick = false; }, 180);
    }
  }, { passive: true });

  window.addEventListener('resize', () => updateGeometry(currentAngle), { passive: true });

  renderFaces();
}

function renderDetail() {
  const project = getProject(activeProjectId);
  const projectIndex = projects.findIndex(item => item.id === project.id);
  const leftProject = projects[wrapProjectIndex(projectIndex - 1)];
  const rightProject = projects[wrapProjectIndex(projectIndex + 1)];

  root.innerHTML = `
    ${baseStyles()}
    <style>
      body { overflow-x: hidden; }
      .page { position: relative; min-height: 100vh; background: #000; --scroll: 0; }
      .side-nav {
        position: fixed; left: 20px; top: 0; z-index: 30; display: grid; gap: 8px;
        transform: translate3d(0, 990px, 0); transition: opacity 0.8s ease 0.25s, transform 0.8s cubic-bezier(.2,.8,.2,1) 0.25s; will-change: transform;
      }
      .side-nav a {
        width: max-content; min-width: 86px; max-width: 210px; height: 33px; display: inline-flex; align-items: center; justify-content: space-between; gap: 18px;
        border-radius: 12px; padding: 0 12px; color: #fff; background: rgba(20,20,23,0.92); font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
      }
      .side-nav a.active { min-width: 226px; color: #020202; background: #fff; }
      .side-nav a.active::after { content: "▶"; font-size: 11px; }
      .hero { position: relative; min-height: 1880px; overflow: hidden; }
      .hero-bg-panel {
        position: absolute; top: 0; bottom: 280px; width: 34vw; opacity: 0.78;
        background: linear-gradient(135deg, rgba(105,94,160,0.36), rgba(8,8,18,0.86)), linear-gradient(rgba(125,249,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(125,249,255,0.06) 1px, transparent 1px);
        background-size: auto, 44px 44px, 44px 44px; filter: saturate(1.2);
      }
      .hero-bg-panel.left { left: -12vw; transform: skewY(32deg) translate3d(calc(var(--scroll) * -60px), calc(var(--scroll) * 30px), 0); transform-origin: right top; }
      .hero-bg-panel.right { right: -9vw; transform: skewY(-43deg) translate3d(calc(var(--scroll) * 70px), calc(var(--scroll) * 24px), 0); transform-origin: left top; }
      .hero-blur-field {
        position: absolute; left: 14vw; top: 280px; width: min(72vw, 1080px); height: 980px; opacity: clamp(0, calc(var(--scroll) * 1.65), 0.82);
        background: radial-gradient(circle at 50% 39%, rgba(204,158,62,0.34), transparent 15%), radial-gradient(circle at 50% 45%, rgba(236,234,250,0.9), rgba(126,128,158,0.74) 50%, transparent 69%);
        filter: blur(34px) saturate(1.08); transform: translate3d(calc(var(--scroll) * -20px), calc(var(--scroll) * -155px), 0) scale(calc(1 + var(--scroll) * 0.08)); pointer-events: none;
      }
      .cube-stage { position: absolute; top: 270px; left: 0; right: 0; height: 900px; perspective: 1400px; transform-style: preserve-3d; will-change: transform, opacity; }
      .cube-panel {
        position: absolute; aspect-ratio: 1 / 1; background: #eceafa; box-shadow: -3px 0 0 rgba(255,78,36,0.72), 3px 0 0 rgba(0,126,255,0.86), 0 0 0 2px #050505, 28px 22px 0 rgba(0,0,0,0.9);
        overflow: hidden; transition: opacity 0.9s ease, transform 1.1s cubic-bezier(.2,.8,.2,1), filter 0.9s ease; will-change: transform;
      }
      .cube-panel::before { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 0 22%, rgba(0,0,0,0.035) 23% 24%, transparent 25%), repeating-radial-gradient(circle at center, rgba(0,0,0,0.035) 0 2px, transparent 2px 26px); opacity: 0.48; }
      .cube-panel::after { content: "©COA/IP"; position: absolute; right: 28px; bottom: 24px; color: #111; font: 800 13px/1 var(--mono); letter-spacing: 0.04em; }
      .cube-panel.main { left: 14.4vw; width: min(72vw, 1060px); transform: rotateZ(-4.5deg) rotateY(-7deg) translateZ(80px); z-index: 3; }
      .cube-panel.left { left: -19vw; top: 70px; width: min(46vw, 640px); transform: rotateY(64deg) rotateZ(-7deg) translateZ(-80px); transform-origin: right center; background: linear-gradient(135deg, rgba(225,232,255,0.92), rgba(104,112,158,0.68)), #cfd4e9; filter: brightness(0.82) saturate(0.85); z-index: 1; }
      .cube-panel.right { right: -17vw; top: 12px; width: min(50vw, 720px); transform: rotateY(-60deg) rotateZ(4deg) translateZ(-90px); transform-origin: left center; background: radial-gradient(circle at 60% 24%, rgba(88,84,255,0.42), transparent 18%), linear-gradient(rgba(125,249,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(125,249,255,0.08) 1px, transparent 1px), linear-gradient(135deg, #101238, #03030c 68%); background-size: auto, 48px 48px, 48px 48px, auto; filter: brightness(0.78) saturate(1.4); z-index: 2; }
      .sigil { position: absolute; inset: 0; display: grid; place-items: center; transform: rotate(calc(var(--scroll) * -18deg)) scale(calc(1 + var(--scroll) * 0.08)); transition: transform 0.08s linear; }
      .sigil svg { width: min(56%, 560px); filter: drop-shadow(0 20px 18px rgba(85,48,0,0.2)); animation: sigilIdle 7s ease-in-out infinite; }
      .cube-panel.right .sigil, .cube-panel.left .sigil { opacity: 0.22; }
      .archive-surface { position: absolute; inset: 0; background: #07080d; }
      .archive-surface .object { position: absolute; left: 18%; right: 12%; top: 43%; height: 11%; border-radius: 999px; background: linear-gradient(100deg, #fff 0 18%, #f5d4ea 19% 36%, #1bd7ff 37% 52%, #f8e7cc 53% 68%, #ff4f98 69%); transform: rotate(12deg); box-shadow: -4px 0 rgba(255,0,48,0.72), 4px 0 rgba(0,118,255,0.78); }
      .cube-panel.main .archive-surface .object { top: 30%; transform: rotate(12deg) scale(0.84); }
      .purple-surface { background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.14), transparent 8%), radial-gradient(circle at 30% 42%, rgba(126,78,255,0.55), transparent 24%), linear-gradient(135deg, #28146f, #090817 72%); }
      .forging-core { position: absolute; left: 50%; top: 52%; transform: translate(-50%,-50%) rotate(-4deg); color: #fff; font-family: var(--display); font-size: clamp(62px,8vw,112px); text-shadow: -3px 0 rgba(255,0,62,0.55), 3px 0 rgba(0,130,255,0.55); }
      .cube-panel.main .forging-core { top: 40%; transform: translate(-50%,-50%) rotate(-4deg) scale(0.88); }
      .forging-rays { position: absolute; inset: 18%; background: linear-gradient(90deg, transparent 48%, rgba(255,255,255,0.42) 49% 51%, transparent 52%), linear-gradient(0deg, transparent 48%, rgba(255,255,255,0.32) 49% 51%, transparent 52%); transform: rotate(28deg); opacity: 0.32; }
      .shoe-surface { background: radial-gradient(circle at 54% 38%, rgba(255,255,255,0.2), transparent 18%), linear-gradient(135deg, #d9dced, #9ea7bd); }
      .shoe-object { position: absolute; left: 18%; right: 12%; top: 40%; height: 20%; background: radial-gradient(circle at 72% 42%, #1ccfe8 0 8%, transparent 9%), linear-gradient(100deg, #fff 0 36%, #24c8d9 37% 49%, #fff 50%); border-radius: 42% 52% 28% 22%; transform: rotate(-3deg); box-shadow: -4px 0 rgba(255,40,80,0.45), 4px 0 rgba(0,120,255,0.5), 0 18px 28px rgba(0,0,0,0.28); }
      .cube-panel.main .shoe-object { top: 24%; transform: rotate(-3deg) scale(0.78); }
      .shoe-object::after { content: ""; position: absolute; left: 8%; right: 4%; bottom: -20%; height: 28%; background: #f7f7f7; border-radius: 0 0 40px 40px; }
      .project-forging .hero-blur-field { background: radial-gradient(circle at 50% 39%, rgba(138,68,255,0.52), transparent 17%), radial-gradient(circle at 50% 45%, rgba(74,43,155,0.88), rgba(12,8,35,0.8) 52%, transparent 70%); }
      .project-forging .media-block { background: radial-gradient(circle at 50% 45%, rgba(126,68,255,0.44), transparent 22%), linear-gradient(rgba(132,93,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(132,93,255,0.08) 1px, transparent 1px), #070414; background-size: auto, 48px 48px, 48px 48px, auto; }
      .project-airforce .hero-blur-field { background: radial-gradient(circle at 50% 39%, rgba(38,207,232,0.32), transparent 17%), radial-gradient(circle at 50% 45%, rgba(225,230,244,0.86), rgba(118,130,156,0.74) 52%, transparent 70%); }
      .project-airforce .media-block { background: radial-gradient(ellipse at 50% 65%, rgba(35,205,225,0.22), transparent 30%), linear-gradient(180deg, #cfd4df, #737d91); }
      @keyframes sigilIdle { 0%,100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.035) rotate(1.2deg); } }
      .hero-title { position: absolute; left: 9vw; top: 588px; z-index: 5; max-width: 860px; color: #fff; font-family: var(--display); font-size: clamp(96px, 10.8vw, 172px); line-height: 0.82; text-transform: uppercase; letter-spacing: 0; transition: opacity 0.8s ease 0.12s, transform 1s cubic-bezier(.2,.8,.2,1) 0.12s; will-change: transform; }
      .hero-index { position: absolute; left: 14px; top: 684px; z-index: 5; color: #fff; font: 600 12px/1 var(--mono); transition: opacity 0.8s ease 0.18s, transform 0.9s cubic-bezier(.2,.8,.2,1) 0.18s; }
      .archive-card { position: absolute; left: 25vw; right: 14px; bottom: 146px; min-height: 280px; display: grid; grid-template-columns: 240px 1fr 1fr 110px; gap: 20px; align-items: center; padding: 20px; border-radius: 12px; background: rgba(8,8,10,0.92); transition: opacity 0.9s ease 0.22s, transform 1s cubic-bezier(.2,.8,.2,1) 0.22s; will-change: transform; }
      .archive-thumb { position: relative; aspect-ratio: 1; border-radius: 6px; overflow: hidden; background: #eceafa; display: grid; place-items: center; }
      .archive-thumb svg { width: 72%; }
      .meta-grid { display: grid; grid-template-columns: repeat(2, minmax(130px, 1fr)); gap: 28px 52px; }
      .meta-label { color: rgba(255,255,255,0.22); font-size: 12px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; }
      .meta-value { margin-top: 8px; color: #fff; font-size: 13px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
      .tag-pill { justify-self: center; min-width: 74px; height: 34px; display: inline-grid; place-items: center; border-radius: 10px; background: rgba(255,255,255,0.08); color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
      .media-block { width: calc(100% - 40px); margin: -100px 20px 0; min-height: 650px; border-radius: 12px; overflow: hidden; position: relative; background: linear-gradient(180deg, rgba(0,0,0,0) 72%, rgba(0,0,0,0.34)), radial-gradient(ellipse at 50% 60%, rgba(180,210,255,0.08), transparent 36%), url('/assets/ip-stage-beams.png') center / cover no-repeat, linear-gradient(180deg, #030304 0%, #07080b 45%, #010101 100%); transform: translate3d(0, calc((1 - min(var(--scroll), 1)) * 24px), 0); }
      .play { position: absolute; left: 50%; top: 52%; transform: translate(-50%, -50%); display: inline-flex; align-items: center; gap: 10px; border: 1px solid #fff; border-radius: 8px; padding: 8px 14px 6px; color: #fff; font-family: var(--display); font-size: 84px; line-height: 0.82; text-transform: uppercase; background: rgba(0,0,0,0.2); animation: playFloat 3.2s ease-in-out infinite; transition: background 0.24s ease, color 0.24s ease, box-shadow 0.24s ease; }
      .play:hover { background: #fff; color: #000; box-shadow: 0 0 36px rgba(214,235,255,0.36); }
      @keyframes playFloat { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-54%) scale(1.025); } }
      .play::before { content: "▶"; display: grid; place-items: center; width: 48px; height: 48px; border: 1px solid #fff; border-radius: 8px; font-family: var(--mono); font-size: 24px; }
      .content { position: relative; width: min(100%, 1440px); margin: 0 auto; padding: 88px 20px 160px; }
      .article { margin-left: 24vw; max-width: 760px; padding-top: 34px; opacity: 0; transform: translate3d(0,44px,0); transition: opacity 0.85s ease, transform 0.95s cubic-bezier(.2,.8,.2,1); }
      .article.in-view { opacity: 1; transform: translate3d(0,0,0); }
      .section-kicker { color: rgba(255,255,255,0.46); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
      .article h2 { margin: 22px 0 44px; color: #fff; font-family: var(--display); font-size: clamp(76px, 8.6vw, 132px); line-height: 0.82; letter-spacing: 0; text-transform: uppercase; }
      .article p { margin: 0 0 24px; color: rgba(255,255,255,0.42); font-size: 15px; line-height: 1.55; letter-spacing: 0.02em; }
      .event-strip, .entry-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 34px; }
      .event-card, .entry { min-height: 220px; border-radius: 8px; padding: 16px; background: rgba(255,255,255,0.045); color: #fff; opacity: 0; transform: translate3d(0,34px,0); transition: opacity 0.75s ease, transform 0.75s cubic-bezier(.2,.8,.2,1), background 0.25s ease; }
      .event-card.in-view, .entry.in-view { opacity: 1; transform: translate3d(0,0,0); }
      .event-card:hover { transform: translate3d(0,-10px,0) scale(1.025); background: rgba(255,255,255,0.09); }
      .event-card span { display: flex; justify-content: space-between; color: rgba(255,255,255,0.38); font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
      .event-card h3, .entry h3 { margin: 46px 0 14px; font-family: var(--display); font-size: 46px; line-height: 0.84; text-transform: uppercase; }
      .event-card p, .entry p { color: rgba(255,255,255,0.44); font-size: 12px; line-height: 1.45; }
      .entity-list { display: grid; gap: 10px; margin-top: 36px; }
      .entity-row { display: grid; grid-template-columns: 1.1fr 0.7fr 1.2fr; gap: 16px; align-items: center; min-height: 72px; border-top: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.54); font-size: 12px; letter-spacing: 0.04em; opacity: 0; transform: translate3d(0,28px,0); transition: opacity 0.75s ease, transform 0.75s cubic-bezier(.2,.8,.2,1), color 0.24s ease; }
      .entity-row.in-view { opacity: 1; transform: translate3d(0,0,0); }
      .entity-row strong { color: #fff; font-family: var(--display); font-size: 34px; line-height: 0.88; text-transform: uppercase; }
      .archive-image { margin-top: 42px; width: min(100%, 1060px); aspect-ratio: 1.72 / 1; border-radius: 8px; background: linear-gradient(rgba(125,249,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(125,249,255,0.07) 1px, transparent 1px), #050506; background-size: 42px 42px; overflow: hidden; display: grid; place-items: center; position: relative; opacity: 0; transform: translateY(26px); transition: transform 0.9s cubic-bezier(.2,.8,.2,1), opacity 0.9s ease; }
      .archive-image.in-view, .article.in-view .archive-image { opacity: 1; transform: translateY(0); }
      .map-nodes { position: relative; width: 86%; height: 76%; }
      .map-nodes::before, .map-nodes::after { content: ""; position: absolute; inset: 18% 8%; border: 1px solid rgba(125,249,255,0.28); border-radius: 50%; }
      .map-nodes::after { inset: 31% 25%; border-color: rgba(156,255,109,0.28); }
      .node { position: absolute; transform: translate(-50%,-50%); min-width: 128px; padding: 10px 12px; border-radius: 6px; background: rgba(0,0,0,0.76); border: 1px solid rgba(255,255,255,0.22); color: #fff; font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; animation: nodePulse 3.8s ease-in-out infinite; }
      @keyframes nodePulse { 0%,100% { box-shadow: 0 0 0 rgba(125,249,255,0); } 50% { box-shadow: 0 0 26px rgba(125,249,255,0.14); } }
      @media (max-width: 900px) {
        .side-nav { display: none; }
        .hero { min-height: 1180px; }
        .cube-stage { top: 160px; height: 620px; }
        .cube-panel.main { left: 5vw; width: 90vw; }
        .cube-panel.left { left: -48vw; width: 58vw; }
        .cube-panel.right { right: -45vw; width: 62vw; }
        .hero-title { top: 360px; left: 22px; font-size: clamp(70px, 18vw, 110px); }
        .archive-card { left: 20px; right: 20px; bottom: 80px; grid-template-columns: 110px 1fr; }
        .media-block { min-height: 460px; }
        .article { margin-left: 0; padding-left: 20px; padding-right: 20px; }
        .event-strip, .entry-row, .entity-row { grid-template-columns: 1fr; }
      }
    </style>
    <div class="page project-${project.id}">
      <div class="loader-screen">WORLD/IP</div>
      ${topbar('<div class="timeline-pill"><a class="pill icon" href="./ip.html" aria-label="Back">‹</a><a class="pill" href="#about">TIMELINE</a></div>')}
      <nav class="side-nav" aria-label="Section navigation">
        ${navItems.map(([label, id], index) => `<a class="${index === 0 ? 'active' : ''}" href="#${id}">${label}</a>`).join('')}
      </nav>
      <section class="hero" id="about">
        <div class="hero-bg-panel left"></div><div class="hero-bg-panel right"></div><div class="hero-blur-field"></div><div class="hero-index">${project.index}</div>
        <div class="cube-stage">
          <div class="cube-panel left"><div class="sigil">${projectVisual(leftProject, true)}</div></div>
          <div class="cube-panel main"><div class="sigil">${projectVisual(project, true)}</div></div>
          <div class="cube-panel right"><div class="sigil">${projectVisual(rightProject, true)}</div></div>
        </div>
        <h1 class="hero-title">${project.title}</h1>
        <div class="archive-card">
          <div class="archive-thumb">${projectVisual(project, true)}</div>
          <div class="meta-grid">
            <div><div class="meta-label">Launch Date</div><div class="meta-value">${project.date}</div></div>
            <div><div class="meta-label">Contract</div><div class="meta-value">${project.contract}</div></div>
            <div><div class="meta-label">Chain</div><div class="meta-value">${project.chain}</div></div>
            <div><div class="meta-label">Address</div><div class="meta-value">0xIP...${project.id}</div></div>
          </div>
          <div></div><div class="tag-pill">${project.tag}</div>
        </div>
      </section>
      <section class="media-block" aria-label="World layer media preview"><div class="play">Play</div></section>
      <main class="content">
        <article class="article" id="about-copy"><span class="section-kicker">[ABOUT]</span><h2>${project.headline}</h2><p>${project.about}</p><p>The system treats every campaign as a city behavior. Citizens enter through checkpoints, events expand through participation, and story fragments become infrastructure that can be replayed, modified, and inherited by future layers.</p></article>
        <article class="article" id="live-events"><span class="section-kicker">[LIVE EVENTS]</span><h2>IP events are products, not announcements</h2><div class="event-strip">${events.map(event => `<div class="event-card"><span><em>${event[1]}</em><em>${event[2]}</em></span><h3>${event[0]}</h3><p>${event[3]}</p></div>`).join('')}</div></article>
        <article class="article" id="city-entities"><span class="section-kicker">[CITY ENTITIES]</span><h2>Persistent agents operate inside the city system</h2><div class="entity-list">${entities.map(entity => `<div class="entity-row"><strong>${entity[0]}</strong><span>${entity[1]}</span><span>${entity[2]}</span></div>`).join('')}</div></article>
        <article class="article" id="narrative-map"><span class="section-kicker">[NARRATIVE MAP]</span><h2>Story routes operate as city infrastructure</h2><div class="archive-image"><div class="map-nodes"><div class="node" style="left:12%;top:52%;">Reality Entry</div><div class="node" style="left:36%;top:36%;">City Events</div><div class="node" style="left:61%;top:22%;">Night Zone</div><div class="node" style="left:68%;top:54%;">Theater Zone</div><div class="node" style="left:86%;top:38%;">Data Core</div><div class="node" style="left:52%;top:78%;">Hidden Layer</div></div></div></article>
        <article class="article" id="participation"><span class="section-kicker">[PARTICIPATION]</span><h2>This city is not watched. It is entered.</h2><p>You are not a user. You are a system node. Join live events, create a city narrative node, or become a persistent entity in the World / IP Layer.</p><div class="entry-row"><div class="entry"><h3>Join Event</h3><p>Participate in live city events.</p></div><div class="entry"><h3>Create Event</h3><p>Generate your own city narrative node.</p></div><div class="entry"><h3>Become Entity</h3><p>Join as a persistent character.</p></div></div></article>
        <article class="article" id="related-archives"><span class="section-kicker">[RELATED ARCHIVES]</span><h2>Additional city records remain partially indexed</h2><p>Recovered fragments, inactive event nodes, and future city expansions are staged here as a living archive for the next system release.</p></article>
      </main>
    </div>
  `;

  const sideLinks = Array.from(document.querySelectorAll('.side-nav a'));
  const navById = new Map(sideLinks.map(link => [link.getAttribute('href').slice(1), link]));
  const pageEl = document.querySelector('.page');
  const cubeStage = document.querySelector('.cube-stage');
  const mainCube = document.querySelector('.cube-panel.main');
  const leftCube = document.querySelector('.cube-panel.left');
  const rightCube = document.querySelector('.cube-panel.right');
  const heroTitle = document.querySelector('.hero-title');
  const archiveCard = document.querySelector('.archive-card');
  const heroIndex = document.querySelector('.hero-index');
  const sideNav = document.querySelector('.side-nav');

  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('loaded'), 540));

  function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
  function setActiveNav(id) {
    const activeLink = navById.get(id);
    if (!activeLink || activeLink.classList.contains('active')) return;
    sideLinks.forEach(item => item.classList.remove('active'));
    activeLink.classList.add('active');
  }
  function updateActiveNav() {
    const marker = window.innerHeight * 0.38;
    let currentId = 'about';
    let closestDistance = Number.POSITIVE_INFINITY;
    navItems.forEach(([, id]) => {
      const section = document.getElementById(id);
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top - marker);
      if (rect.top < window.innerHeight * 0.82 && rect.bottom > 96 && distance < closestDistance) {
        closestDistance = distance;
        currentId = id;
      }
    });
    setActiveNav(currentId);
  }

  let ticking = false;
  function updateMotion() {
    const y = window.scrollY || 0;
    const p = clamp(y / 1000, 0, 1);
    const switchP = clamp((y - 220) / 760, 0, 1);
    pageEl.style.setProperty('--scroll', p.toFixed(4));
    cubeStage.style.transform = `translate3d(${switchP * -5}vw, ${p * -330}px, 0)`;
    cubeStage.style.opacity = String(clamp(1 - p * 1.28, 0, 1));
    mainCube.style.transform = `rotateZ(${-4.5 + p * 1.6}deg) rotateY(${-7 + switchP * 14}deg) translate3d(${switchP * -30}px, 0, ${80 - switchP * 160}px) scale(${1 - switchP * 0.05})`;
    mainCube.style.filter = `blur(${switchP * 1.4}px) brightness(${1 - switchP * 0.18})`;
    leftCube.style.transform = `rotateY(${64 + switchP * 4}deg) rotateZ(${-7 - switchP * 2}deg) translate3d(${switchP * -52}px, ${switchP * 16}px, ${-80 - switchP * 90}px)`;
    leftCube.style.opacity = String(clamp(1 - switchP * 1.1, 0, 1));
    rightCube.style.transform = `rotateY(${-60 + switchP * 34}deg) rotateZ(${4 - switchP * 4}deg) translate3d(${switchP * -230}px, ${switchP * 8}px, ${-90 + switchP * 180}px) scale(${1 + switchP * 0.08})`;
    rightCube.style.filter = `brightness(${0.78 + switchP * 0.3}) saturate(${1.4 - switchP * 0.2})`;
    heroTitle.style.transform = `translate3d(${p * 10}px, ${p * -410}px, 0) scale(${1 - p * 0.045})`;
    heroTitle.style.opacity = String(clamp(1 - p * 0.82, 0.18, 1));
    archiveCard.style.transform = `translate3d(0, ${p * -118}px, 0)`;
    heroIndex.style.transform = `translate3d(0, ${p * -170}px, 0)`;
    heroIndex.style.opacity = String(clamp(1 - p * 1.6, 0, 1));
    sideNav.style.transform = `translate3d(0, ${clamp(1440 - y, 96, 990)}px, 0)`;
    updateActiveNav();
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateMotion);
      ticking = true;
    }
  }, { passive: true });
  updateMotion();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.article, .archive-image, .event-card, .entity-row, .entry').forEach(el => revealObserver.observe(el));
}

if (detailMode) renderDetail();
else renderHome();
