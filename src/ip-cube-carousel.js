const CUBE_INDEX_KEY = 'chengyin-ip-cube-index';

export function readSavedCubeIndex(wrapIndex) {
  const n = Number.parseInt(sessionStorage.getItem(CUBE_INDEX_KEY), 10);
  if (!Number.isFinite(n)) return 0;
  return wrapIndex(n);
}

export function saveCubeIndex(index) {
  sessionStorage.setItem(CUBE_INDEX_KEY, String(index));
}

export function cubeCarouselMarkup() {
  return `
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
  `;
}

export function cubeCarouselStyles() {
  return `
      .home {
        overflow: hidden;
        background: #000;
        --liquid-x: 50%;
        --liquid-y: 50%;
      }
      .home--fixed { position: fixed; inset: 0; }
      .home--page { position: relative; height: 100vh; width: 100%; }
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
      .gold-surface {
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at 50% 46%, rgba(255,230,130,0.14), transparent 18%),
          linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
          #07080d;
        background-size: auto, 44px 44px, 44px 44px, auto;
      }
      .gold-sigil {
        position: relative;
        width: min(72%, 520px);
        aspect-ratio: 1 / 1;
        display: grid;
        place-items: center;
        filter: drop-shadow(0 24px 22px rgba(0,0,0,0.34));
      }
      .gold-sigil svg {
        position: static;
        inset: auto;
        width: 100%;
        height: 100%;
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
  `;
}

export function bindCubeCarousel(home, options) {
  const {
    projects,
    projectVisual,
    wrapIndex,
    captureWheel = true,
    initialIndex = 0,
    onEnter
  } = options;

  const room = home.querySelector('.cube-ring');
  const cards = Array.from(home.querySelectorAll('.home-card'));
  const faces = {
    left: home.querySelector('.home-card.left'),
    front: home.querySelector('.home-card.front'),
    right: home.querySelector('.home-card.right')
  };
  const leftZone = home.querySelector('.left-zone');
  const rightZone = home.querySelector('.right-zone');
  let activeIndex = wrapIndex(initialIndex);
  let currentAngle = 0;
  let isAnimating = false;
  let dragStartX = 0;
  let dragging = false;
  let suppressClick = false;

  function projectAt(offset) {
    return projects[wrapIndex(activeIndex + offset)];
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
      saveCubeIndex(activeIndex);
      currentAngle = 0;
      isAnimating = false;
      suppressClick = false;
      renderFaces();
    }

    requestAnimationFrame(step);
  }

  function enterDetail() {
    const project = projects[activeIndex];
    saveCubeIndex(activeIndex);
    if (onEnter) onEnter(project);
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

  const dragRoot = captureWheel ? window : home;

  if (captureWheel) {
    window.addEventListener('wheel', event => {
      event.preventDefault();
      animateTo(event.deltaY > 0 ? 1 : -1);
    }, { passive: false });
  }

  dragRoot.addEventListener('pointerdown', event => {
    dragging = true;
    dragStartX = event.clientX;
  }, { passive: true });
  dragRoot.addEventListener('pointerup', event => {
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

  saveCubeIndex(activeIndex);
  renderFaces();
}
