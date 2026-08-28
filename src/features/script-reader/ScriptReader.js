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
    <div class="script-reader-shell" data-reader-shell tabindex="-1">
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
  // F32:用户可随时逃出吸附;prefers-reduced-motion 下彻底关掉吸附
  const motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const prefersReducedMotion = () => !!(motionQuery && motionQuery.matches);
  let autoSnapEnabled = !prefersReducedMotion();
  // F32:章节位置缓存 —— 原先 updateOverlays 每帧遍历 offsetTop / getBoundingClientRect,逐帧强制重排
  let sectionTopsCache = null;
  // F31:打开期间被置为 inert 的背景节点(记录原 aria-hidden 以便还原)
  let inertedBg = [];

  // ── F31:背景 inert —— 同时挡住 Tab 与无障碍树 ──
  const FOCUSABLE_SELECTOR =
    'a[href],area[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
    'textarea:not([disabled]),iframe,object,embed,[tabindex]:not([tabindex="-1"])';

  const focusableItems = () =>
    [...reader.querySelectorAll(FOCUSABLE_SELECTOR)].filter((el) => el.getClientRects().length > 0);

  const setBackgroundInert = (on) => {
    if (on) {
      if (inertedBg.length) return;
      inertedBg = [...document.body.children]
        .filter((el) => el !== reader && !/^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(el.nodeName))
        .map((el) => ({ el, ariaHidden: el.getAttribute('aria-hidden'), inert: el.hasAttribute('inert') }));
      inertedBg.forEach(({ el }) => {
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
      });
      return;
    }
    inertedBg.forEach(({ el, ariaHidden, inert }) => {
      if (!inert) el.removeAttribute('inert');
      if (ariaHidden === null) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', ariaHidden);
    });
    inertedBg = [];
  };

  const ensureReaderLayer = () => {
    if (reader.parentElement !== document.body) {
      document.body.appendChild(reader);
    }
  };

  const open = () => {
    // 触发元素可能不可聚焦(autoOpen 时 activeElement 是 body):回落到页面上的打开按钮,
    // 保证关闭后焦点有地方可还(F31)
    const active = document.activeElement;
    lastFocused = (active && active !== document.body && !reader.contains(active))
      ? active
      : (openButtons[0] || null);
    ensureReaderLayer();
    reader.classList.add('open');
    reader.setAttribute('aria-hidden', 'false');
    document.body.classList.add('script-reader-open');
    setBackgroundInert(true);
    invalidateSectionTops();
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
    // 减少动画偏好下不再打开 CSS 吸附(F32)
    if (autoSnapEnabled) {
      snapTimer = setTimeout(() => scroller.classList.remove('snap-disabled'), 2000);
    }
    requestAnimationFrame(() => scroller.focus({ preventScroll: true }));
  };

  const close = () => {
    cancelSnapAnimation();
    reader.classList.remove('open');
    reader.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('script-reader-open');
    // 先解除背景 inert,否则焦点还不回去(F31)
    setBackgroundInert(false);
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
    invalidateSectionTops();
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

  // F32:章节顶端位置只在开启 / 尺寸变化 / 正文展开时重算,不再逐帧读 offsetTop
  const invalidateSectionTops = () => { sectionTopsCache = null; };

  const sectionTops = () => {
    if (!sectionTopsCache) {
      sectionTopsCache = {
        tops: sectionTargets().map((target) => target.offsetTop),
        vh: scroller.clientHeight || window.innerHeight
      };
    }
    return sectionTopsCache;
  };

  const nearestSectionIndex = () => {
    const { tops } = sectionTops();
    return tops.reduce((best, top, index) => {
      const distance = Math.abs(top - scroller.scrollTop);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Infinity }).index;
  };

  const smoothSnapTo = (target, duration = 1400) => {
    if (!target) return;
    const startTop = scroller.scrollTop;
    const endTop = target.offsetTop;
    // 减少动画偏好:直接落位,不播 1400/1700ms 的拽动画(F32)
    if (prefersReducedMotion()) {
      cancelAnimationFrame(slowSnapFrame);
      isSlowSnapping = false;
      scroller.style.scrollBehavior = 'auto';
      scroller.scrollTop = endTop;
      scroller.style.scrollBehavior = '';
      updateOverlays();
      syncVisibleState();
      return;
    }
    const startTime = performance.now();
    isSlowSnapping = true;
    // 容器 CSS 是 scroll-behavior:smooth,浏览器会把每帧写入的位置再平滑一次:
    // 逐帧写完之后浏览器还在自己往目标滑,取消 rAF 也拦不住(F32 的「逃不掉」有一半在这)。
    // 动画期间临时关掉,结束/被打断时还原。
    scroller.style.scrollBehavior = 'auto';
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
        scroller.style.scrollBehavior = '';
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
    // 用户已经明确表示不要吸附(中断过一次动画,或系统开了减少动画):不再自动拽视图(F32)
    if (!autoSnapEnabled) {
      scroller.classList.add('snap-disabled');
      return;
    }
    if (isSlowSnapping) return;
    // Ignore scroll events fired by the browser's own snap just after re-enable
    if (Date.now() - snapReEnableTime < 400) return;
    scroller.classList.add('snap-disabled');
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => {
      const nearest = sectionTargets()[nearestSectionIndex()] || indexPage;
      smoothSnapTo(nearest, 1400);
    }, 2000);
  };

  // ── Overlay parallax on scroll (rAF throttled) ──
  let tickPending = false;
  const updateOverlays = () => {
    const scrollTop = scroller.scrollTop;
    const { tops, vh } = sectionTops();
    const primarySceneIndex = nearestSectionIndex() - 1;
    scenes.forEach((scene, i) => {
      // tops[0] 是目录页,章节从 1 开始
      const sceneTop = tops[i + 1] ?? scene.offsetTop;
      const overlay = scene.querySelector('[data-scene-overlay]');
      const image = scene.querySelector('.scene-image');
      if (!overlay) return;
      const sceneIndex = parseInt(scene.dataset.chapterIndex);
      // Progress: 0 when scene below viewport, 1 when scene at viewport top
      const progress = Math.max(0, Math.min(1, (scrollTop - sceneTop + vh) / vh));
      overlay.style.transform = `translateY(${-progress * 100}%)`;
      scene.style.setProperty('--scroll-dir', scrollDirection);
      const visible = progress > 0.03;
      scene.classList.toggle('image-in-view', visible);
      scene.classList.toggle('image-primary', sceneIndex === primarySceneIndex);
      if (image) {
        // scroller 铺满视口,章节的视口顶端 = 缓存位置 - 滚动量(等价于 getBoundingClientRect().top,但不触发重排)
        const travel = ((sceneTop - scrollTop) / vh) * 200;
        const offset = Math.max(-200, Math.min(200, travel));
        image.style.setProperty('--image-offset', `${offset.toFixed(2)}px`);
      }
    });
    tickPending = false;
  };

  // ── F32:逃出吸附 ──
  // 停掉进行中的吸附动画与待触发的计时器(关闭/销毁时用)
  const cancelSnapAnimation = () => {
    clearTimeout(snapTimer);
    cancelAnimationFrame(slowSnapFrame);
    scroller.style.scrollBehavior = '';
    isSlowSnapping = false;
  };

  // 滚轮 / 触摸 / 方向键 —— 用户要自己滚。
  // 只有当吸附动画正在把视图往别处拽时才算「逃出」:立刻停手,并且之后不再自动吸附
  // (还想要吸附就从目录点章节,那是明确意图)。没在吸附时什么都不做,免得把功能整个关掉。
  const onUserScrollIntent = () => {
    if (!isSlowSnapping) return;
    cancelSnapAnimation();
    autoSnapEnabled = false;
    scroller.classList.add('snap-disabled');
    snapReEnableTime = Date.now();
  };
  const SCROLL_KEYS = new Set([
    'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Spacebar'
  ]);

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

  // ── F31:Esc 关闭 + Tab 焦点陷阱 ──
  // 背景已 inert,这里再显式兜住 Tab,避免个别浏览器不支持 inert 时焦点跑出去。
  // 挂在 document 上是因为焦点可能落在不可聚焦的 body 上,事件不会冒泡经过 reader。
  const onKeydown = (event) => {
    if (!reader.classList.contains('open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (SCROLL_KEYS.has(event.key) && reader.contains(event.target)) {
      onUserScrollIntent();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusableItems();
    if (!items.length) {
      event.preventDefault();
      scroller.focus({ preventScroll: true });
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    const outside = !active || !reader.contains(active);
    if (event.shiftKey && (outside || active === first)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (outside || active === last)) {
      event.preventDefault();
      first.focus();
    }
  };
  document.addEventListener('keydown', onKeydown);

  // F32:用户自己滚动时立刻放开吸附
  scroller.addEventListener('wheel', onUserScrollIntent, { passive: true });
  scroller.addEventListener('touchstart', onUserScrollIntent, { passive: true });

  // F32:尺寸变化后章节位置缓存作废
  const onResize = () => invalidateSectionTops();
  window.addEventListener('resize', onResize);

  // 系统的减少动画偏好可随时切换
  const onMotionChange = () => {
    autoSnapEnabled = !prefersReducedMotion();
    if (!autoSnapEnabled) cancelSnapAnimation();
  };
  motionQuery?.addEventListener?.('change', onMotionChange);

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
      scroller.removeEventListener('wheel', onUserScrollIntent);
      scroller.removeEventListener('touchstart', onUserScrollIntent);
      document.removeEventListener('keydown', onKeydown);
      window.removeEventListener('resize', onResize);
      motionQuery?.removeEventListener?.('change', onMotionChange);
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
