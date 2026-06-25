import './script-reader.css';

// 预制人生阅读器组件 —— 从 src/landing.js 原样迁出,新增导出与可编程入口

export function scriptCaseCard(item, index) {
  return `<article class="script-case-card" data-script-open="${index}" aria-label="剧本案例：${item.title}">
    <video class="script-case-video" muted autoplay loop playsinline preload="metadata" src="${item.video}"></video>
    <div class="script-case-scrim"></div>
    <div class="script-case-card-content">
      <div class="script-case-meta"><span>${item.eyebrow}</span><span>${item.chapters.length} SCENES</span></div>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="script-case-tags">${item.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
      <button class="script-case-button" type="button" data-script-open-button>打开剧本</button>
    </div>
  </article>`;
}

export function scriptReaderOverlay(item) {
  const introLines = splitIntoLines(item.summary);
  const initialPreview = item.chapters[1]?.image || item.chapters[0].image;
  return `<div class="script-reader" data-script-reader aria-hidden="true" role="dialog" aria-modal="true" aria-label="${item.title} 剧本阅读器">
    <div class="script-reader-shell" data-reader-shell>
      <button class="script-reader-close" type="button" data-script-close aria-label="关闭剧本">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>

      <section class="reader-index" data-reader-index>
        <div class="reader-index-inner">
          <div class="reader-index-preview" data-index-preview>
            <div class="reader-index-preview-img" data-preview-img style="background-image:url('${initialPreview}')"></div>
          </div>
          <div class="reader-index-right">
            <div class="reader-index-top">
              <div class="reader-index-intro-wrap" data-split-intro>
                <p class="reader-index-intro">
                  ${introLines.map((line, i) =>
                    `<span class="reader-intro-line" style="--line-index:${i}">${line}</span>`
                  ).join('')}
                </p>
              </div>
            </div>
            <div class="reader-chapter-list" data-chapter-list>
              ${item.chapters.map((ch, i) => `
                <button class="reader-chapter-btn" type="button" data-chapter-open="${i}">
                  <span class="reader-chapter-num">${ch.num}</span>
                  <span class="reader-chapter-name">${ch.title}</span>
                  <span class="reader-chapter-desc">${ch.pull}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      ${item.chapters.map((ch, i) => scriptScene(ch, i)).join('')}
    </div>
  </div>`;
}

export function splitIntoLines(text) {
  return text
    .replace(/([。！？])/g, '$1\n')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

export function scriptScene(chapter, index) {
  const reversed = index % 2 === 1;
  return `<section class="script-scene${reversed ? ' scene-reversed' : ''}" data-script-scene data-chapter-index="${index}">
    <div class="scene-image-viewport">
      <div class="scene-image" style="--chapter-img:url('${chapter.image}')"></div>
    </div>
    <div class="scene-content${reversed ? ' scene-content-left' : ' scene-content-right'}">
      <div class="scene-content-inner">
        <div class="scene-thumb" aria-hidden="true">
          <div class="scene-thumb-image" style="background-image:url('${chapter.image}')"></div>
        </div>
        <div class="scene-header" data-scene-header>
          <span class="scene-number" data-scene-num>${chapter.num}</span>
          <h2 class="scene-title" data-scene-title>${liquidText(chapter.title)}</h2>
        </div>
        <div class="scene-body" data-scene-body hidden>
          <div class="scene-body-inner">
            ${chapter.body.map(p => `<p>${p}</p>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="scene-overlay" data-scene-overlay></div>
  </section>`;
}

export function liquidText(text) {
  return [...text].map((char, i) => `<span class="title-char" style="--char-index:${i}">${char}</span>`).join('');
}

export function setupScriptReader(root, item, options = {}) {
  const reader = root.querySelector('[data-script-reader]');
  if (!reader) return { destroy() {} };
  const scroller = reader.querySelector('[data-reader-shell]');
  const closeButton = reader.querySelector('[data-script-close]');
  const indexPage = reader.querySelector('[data-reader-index]');
  const openButtons = [...root.querySelectorAll('[data-script-open]')];
  const chapterBtns = [...reader.querySelectorAll('[data-chapter-open]')];
  const scenes = [...reader.querySelectorAll('[data-script-scene]')];
  const previewImg = reader.querySelector('[data-preview-img]');
  let lastFocused = null;
  let currentChapter = -1;
  let textVisible = false;
  let snapTimer = null;
  let isSlowSnapping = false;
  let slowSnapFrame = 0;
  let lastScrollTop = 0;
  let scrollDirection = 1;

  const ensureReaderLayer = () => {
    if (reader.parentElement !== document.body) {
      document.body.appendChild(reader);
    }
  };

  const open = () => {
    lastFocused = document.activeElement;
    ensureReaderLayer();
    reader.classList.add('open');
    reader.setAttribute('aria-hidden', 'false');
    document.body.classList.add('script-reader-open');
    scroller.scrollTo({ top: 0, behavior: 'auto' });
    scroller.classList.add('snap-disabled');
    lastScrollTop = 0;
    scrollDirection = 1;
    currentChapter = -1;
    textVisible = false;
    scenes.forEach(s => s.classList.remove('text-open'));
    scenes.forEach(s => {
      const body = s.querySelector('[data-scene-body]');
      if (body) body.hidden = true;
    });
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => scroller.classList.remove('snap-disabled'), 2000);
    requestAnimationFrame(() => scroller.focus({ preventScroll: true }));
  };

  const close = () => {
    reader.classList.remove('open');
    reader.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('script-reader-open');
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus?.({ preventScroll: true });
  };

  const goToChapter = (index) => {
    const target = scenes[index];
    if (!target) return;
    scroller.classList.add('snap-disabled');
    clearTimeout(snapTimer);
    smoothSnapTo(target, 1700);
    currentChapter = index;
    textVisible = false;
    scenes.forEach(s => s.classList.remove('text-open'));
    scenes.forEach(s => {
      const body = s.querySelector('[data-scene-body]');
      if (body) body.hidden = true;
    });
  };

  const toggleText = () => {
    if (currentChapter < 0) return;
    const scene = scenes[currentChapter];
    if (!scene) return;
    textVisible = !textVisible;
    scene.classList.toggle('text-open', textVisible);
    const body = scene.querySelector('[data-scene-body]');
    if (body) body.hidden = !textVisible;
  };

  const sectionTargets = () => [indexPage, ...scenes].filter(Boolean);

  const syncVisibleState = () => {
    const targets = sectionTargets();
    const activeIndex = nearestSectionIndex();
    targets.forEach((target, index) => {
      if (target === indexPage) return;
      target.classList.toggle('visible', index === activeIndex);
    });
    const chapterIndex = activeIndex - 1;
    if (chapterIndex >= 0) {
      currentChapter = chapterIndex;
      chapterBtns.forEach((btn) => {
        const btnIdx = parseInt(btn.dataset.chapterOpen);
        btn.classList.toggle('active', btnIdx === chapterIndex);
      });
    }
  };

  const nearestSectionIndex = () => {
    const targets = sectionTargets();
    return targets.reduce((best, target, index) => {
      const distance = Math.abs(target.offsetTop - scroller.scrollTop);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity }).index;
  };

  const smoothSnapTo = (target, duration = 1400) => {
    if (!target) return;
    const startTop = scroller.scrollTop;
    const endTop = target.offsetTop;
    const startTime = performance.now();
    isSlowSnapping = true;
    cancelAnimationFrame(slowSnapFrame);
    const animateSnap = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      scroller.scrollTop = startTop + (endTop - startTop) * eased;
      updateOverlays();
      if (t < 1) {
        slowSnapFrame = requestAnimationFrame(animateSnap);
        return;
      }
        scroller.classList.remove('snap-disabled');
        snapReEnableTime = Date.now();
        isSlowSnapping = false;
        syncVisibleState();
      };
      slowSnapFrame = requestAnimationFrame(animateSnap);
  };

  // ── 2s scroll snap delay ──
  let snapReEnableTime = 0;
  const delaySnap = () => {
    if (isSlowSnapping) return;
    // Ignore scroll events fired by the browser's own snap just after re-enable
    if (Date.now() - snapReEnableTime < 400) return;
    scroller.classList.add('snap-disabled');
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      const snapTargets = [indexPage, ...scenes].filter(Boolean);
      const nearest = snapTargets.reduce((best, target) => {
        const distance = Math.abs(target.offsetTop - scroller.scrollTop);
        return distance < best.distance ? { target, distance } : best;
      }, { target: indexPage, distance: Infinity }).target;
      smoothSnapTo(nearest, 1400);
    }, 2000);
  };

  // ── Overlay parallax on scroll (rAF throttled) ──
  let tickPending = false;
  const updateOverlays = () => {
    const scrollTop = scroller.scrollTop;
    const vh = scroller.clientHeight || window.innerHeight;
    const primarySceneIndex = nearestSectionIndex() - 1;
    scenes.forEach(scene => {
      const overlay = scene.querySelector('[data-scene-overlay]');
      const image = scene.querySelector('.scene-image');
      if (!overlay) return;
      const sceneIndex = parseInt(scene.dataset.chapterIndex);
      // Progress: 0 when scene below viewport, 1 when scene at viewport top
      const progress = Math.max(0, Math.min(1, (scrollTop - scene.offsetTop + vh) / vh));
      overlay.style.transform = `translateY(${-progress * 100}%)`;
      scene.style.setProperty('--scroll-dir', scrollDirection);
      const visible = progress > 0.03;
      scene.classList.toggle('image-in-view', visible);
      scene.classList.toggle('image-primary', sceneIndex === primarySceneIndex);
      if (image) {
        const rect = scene.getBoundingClientRect();
        const travel = (rect.top / vh) * 200;
        const offset = Math.max(-200, Math.min(200, travel));
        image.style.setProperty('--image-offset', `${offset.toFixed(2)}px`);
      }
    });
    tickPending = false;
  };

  const onScroll = () => {
    const currentTop = scroller.scrollTop;
    if (Math.abs(currentTop - lastScrollTop) > 1) {
      scrollDirection = currentTop > lastScrollTop ? 1 : -1;
      lastScrollTop = currentTop;
    }
    delaySnap();
    if (!tickPending) {
      requestAnimationFrame(updateOverlays);
      tickPending = true;
    }
  };

  // ── Open reader ──
  openButtons.forEach((button) => button.addEventListener('click', open));

  // ── Close button ──
  closeButton?.addEventListener('click', close);

  // ── Chapter hover → update preview image ──
  if (previewImg && item) {
    chapterBtns.forEach((btn) => {
      const idx = parseInt(btn.dataset.chapterOpen);
      const ch = item.chapters[idx];
      if (!ch) return;
      btn.addEventListener('mouseenter', () => {
        previewImg.style.backgroundImage = `url('${ch.image}')`;
      });
    });
    const list = reader.querySelector('[data-chapter-list]');
    if (list) {
      list.addEventListener('mouseleave', () => {
        previewImg.style.backgroundImage = `url('${item.chapters[1]?.image || item.chapters[0].image}')`;
      });
    }
  }

  // ── Chapter buttons → scroll to chapter ──
  chapterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.chapterOpen);
      goToChapter(idx);
    });
  });

  // ── Click scene → toggle body text ──
  scenes.forEach((scene) => {
    scene.addEventListener('click', (e) => {
      if (e.target.closest('[data-script-close]')) return;
      const idx = parseInt(scene.dataset.chapterIndex);
      if (currentChapter !== idx) {
        goToChapter(idx);
      } else {
        toggleText();
      }
    });
  });

  // ── IntersectionObserver for active chapter + visible class ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const idx = parseInt(entry.target.dataset.chapterIndex);
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (idx >= 0) {
          currentChapter = idx;
          textVisible = entry.target.classList.contains('text-open');
          chapterBtns.forEach((btn) => {
            const btnIdx = parseInt(btn.dataset.chapterOpen);
            btn.classList.toggle('active', btnIdx === idx);
          });
        }
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { root: scroller, threshold: 0.3 });
  scenes.forEach((scene) => observer.observe(scene));

  // ── Scroll handler for snap delay + overlay ──
  scroller.addEventListener('scroll', onScroll, { passive: true });

  // ── Line intro animation ──
  const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
    });
  }, { threshold: 0.3 });
  const introWrap = reader.querySelector('[data-split-intro]');
  if (introWrap) splitObserver.observe(introWrap);

  // ── Keyboard: Escape to close ──
  reader.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  // ── Scroll-to-start triggers ──
  const startTriggers = [...reader.querySelectorAll('[data-script-start]')];
  startTriggers.forEach((btn) => btn.addEventListener('click', () => goToChapter(0)));

  // ── Auto-open (for the standalone /preset-life.html page with no [data-script-open] trigger) ──
  if (options.autoOpen) {
    requestAnimationFrame(open);
  }

  return {
    open,
    close,
    goToChapter,
    destroy() {
      observer?.disconnect();
      splitObserver?.disconnect();
      clearTimeout(snapTimer);
      cancelAnimationFrame(slowSnapFrame);
      scroller.removeEventListener('scroll', onScroll);
      close();
    }
  };
}

/**
 * 可编程入口:在给定容器内挂载预制人生阅读器并(可选)直接打开。
 * 供独立页 /preset-life.html 在无 [data-script-open] 触发元素时直接调用。
 * @param {HTMLElement} rootEl  阅读器宿主容器(内部需含唯一 [data-script-reader] 节点,或留空由本函数注入)
 * @param {object} item         剧本数据(单个 scriptCase),默认取 scriptCases[0]
 * @param {object} [opts]       { autoOpen=true, caseIndex }
 * @returns {{ open, close, goToChapter, destroy }} 阅读器控制器
 */
export function openScriptReader(rootEl, item, opts = {}) {
  if (!rootEl) throw new Error('openScriptReader: rootEl is required');
  const { autoOpen = true } = opts;
  // 若容器内尚无阅读器 DOM,则注入(保证 [data-script-reader] 唯一)
  if (!rootEl.querySelector('[data-script-reader]')) {
    rootEl.insertAdjacentHTML('beforeend', scriptReaderOverlay(item));
  }
  return setupScriptReader(rootEl, item, { autoOpen });
}
