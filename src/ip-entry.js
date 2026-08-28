const root = document.querySelector('#next-scene');
const params = new URLSearchParams(window.location.search);
const activeProjectId = params.get('project');
const detailMode = Boolean(activeProjectId);

const navItems = [
  ['about', 'about'],
  ['how to play', 'how-to-play'],
  ['features', 'features'],
  ['media', 'media'],
  ['archives', 'related-archives']
];

const caseAssets = {
  street: '/assets/case-detective/shanghai-native-quarter.jpg',
  alley: '/assets/case-detective/longmen-cun.jpg',
  diary: '/assets/case-detective/detective-diary-page.jpg',
  noir: '/assets/case-detective/noir-figure.jpg',
  nanjingRoad: '/assets/case-citywalk/nanjing-road-pedestrians.jpg',
  nanjingSide: '/assets/case-citywalk/nanjing-side-street.jpg',
  nightStreet: '/assets/case-citywalk/shanghai-night-street.jpg',
  fuzhouRoad: '/assets/case-citywalk/fuzhou-henan-road.jpg',
  peoplesSquare: '/assets/case-citywalk/peoples-square-night.jpg',
  bund: '/assets/case-citywalk/bund-walk.jpg'
  ,
  crosswalkPeople: '/assets/case-citywalk/shanghai-crosswalk-people.jpg',
  nanjingEveningPeople: '/assets/case-citywalk/nanjing-pedestrian-evening.jpg',
  nanjingPeopleZone: '/assets/case-citywalk/nanjing-pedestrian-zone.jpg',
  gameLaneWalk: '/assets/case-game/chapter-01-lane-walk.jpg',
  gamePhotoCheck: '/assets/case-game/chapter-02-photo-check.jpg',
  gamePagerWalk: '/assets/case-game/chapter-03-pager-walk.jpg',
  gameBookshopClue: '/assets/case-game/chapter-04-bookshop-clue.jpg',
  gameBundFinal: '/assets/case-game/chapter-05-bund-final.jpg',
  xhsCover: '/assets/case-xhs/xhs-cover.jpg',
  xhsChapter01: '/assets/case-xhs/xhs-chapter-01.jpg',
  xhsChapter02: '/assets/case-xhs/xhs-chapter-02.jpg',
  xhsChapter03: '/assets/case-xhs/xhs-chapter-03.jpg',
  xhsChapter04: '/assets/case-xhs/xhs-chapter-04.jpg',
  xhsChapter05: '/assets/case-xhs/xhs-chapter-05.jpg',
  refStartPacket: '/assets/case-citywalk-ref/cropped/IMG_9542-crop.jpg',
  refNightPacket: '/assets/case-citywalk-ref/cropped/IMG_9543-crop.jpg',
  refNightStreet: '/assets/case-citywalk-ref/cropped/IMG_9544-crop.jpg',
  refDetectiveCard: '/assets/case-citywalk-ref/cropped/IMG_9545-crop.jpg',
  refWalkingBooklet: '/assets/case-citywalk-ref/cropped/IMG_9546-crop.jpg',
  refMapDocument: '/assets/case-citywalk-ref/cropped/IMG_9547-crop.jpg',
  refStreetEvidence: '/assets/case-citywalk-ref/cropped/IMG_9551-crop.jpg',
  refRouteMap: '/assets/case-citywalk-ref/cropped/IMG_9554-crop.jpg',
  refWalker: '/assets/case-citywalk-ref/cropped/IMG_9557-crop.jpg'
};

// 侧栏纵向位移的三个参数(px / 滚动距离),供 updateMotion 计算,不再散落成魔数
const SIDE_NAV_TOP = 96;
const SIDE_NAV_LIFT_START = 450;
const SIDE_NAV_LIFT_RANGE = 894;

function metaStrip(meta) {
  if (!meta) return '';
  const cells = [
    ['TYPE', meta.type], ['STATUS', meta.status], ['PLAYERS', meta.players],
    ['DURATION', meta.duration], ['CITY', meta.city]
  ].filter(([, v]) => v);
  if (!cells.length) return '';
  return `<div class="ip-meta-strip">${cells.map(([k, v]) => `<div class="ip-meta-cell"><span class="ip-meta-k">${k}</span><span class="ip-meta-v">${v}</span></div>`).join('')}</div>`;
}

function renderArchiveCard(item) {
  const ph = `<div class="ip-arch-cover" data-glyph="${(item.title || '◇').slice(0, 1)}"></div>`;
  const body = `<span class="ip-arch-type">${item.type || ''}</span><strong class="ip-arch-title">${item.title}</strong><span class="ip-arch-status">${item.status || (item.href ? '打开 →' : '')}</span>`;
  return item.href && !item.status
    ? `<a class="ip-arch-card is-live" href="${item.href}">${ph}${body}</a>`
    : `<div class="ip-arch-card is-soon" role="group" aria-label="${item.title}（${item.status || '即将上线'}）">${ph}${body}</div>`;
}

// 横向档案 rail 交互(P2):左右按钮 / 鼠标拖拽 / 键盘 ← → / 序号计数。
// 触控交给原生横向滚动(不阻塞页面纵向滚动);鼠标才走拖拽。
function setupArchiveRail() {
  const rail = document.querySelector('[data-archive-rail]');
  if (!rail) return;
  const cards = Array.from(rail.children);
  if (!cards.length) return;
  const ctrl = document.querySelector('[data-rail-ctrl]');
  const prevBtn = document.querySelector('[data-rail-prev]');
  const nextBtn = document.querySelector('[data-rail-next]');
  const countEl = document.querySelector('[data-rail-count]');
  const total = cards.length;
  const pad = n => String(n).padStart(2, '0');

  function step() {
    const a = cards[0].getBoundingClientRect();
    const b = cards[1] ? cards[1].getBoundingClientRect() : null;
    return b ? (b.left - a.left) : (a.width + 16);
  }
  function currentIndex() {
    const railLeft = rail.getBoundingClientRect().left;
    let idx = 0, best = Infinity;
    cards.forEach((c, i) => {
      const d = Math.abs(c.getBoundingClientRect().left - railLeft);
      if (d < best) { best = d; idx = i; }
    });
    return idx;
  }
  function refresh() {
    const max = rail.scrollWidth - rail.clientWidth - 1;
    // 内容能放下时(无溢出)直接隐藏控件,避免出现一排禁用按钮
    if (ctrl) ctrl.hidden = total <= 1 || max <= 1;
    if (countEl) countEl.textContent = `${pad(currentIndex() + 1)} / ${pad(total)}`;
    if (prevBtn) prevBtn.disabled = rail.scrollLeft <= 1;
    if (nextBtn) nextBtn.disabled = rail.scrollLeft >= max;
  }
  function scrollByStep(dir) {
    rail.scrollBy({ left: dir * step(), behavior: 'smooth' });
  }

  prevBtn?.addEventListener('click', () => scrollByStep(-1));
  nextBtn?.addEventListener('click', () => scrollByStep(1));
  rail.addEventListener('scroll', () => requestAnimationFrame(refresh), { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(refresh), { passive: true });
  rail.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollByStep(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByStep(-1); }
  });

  let dragging = false, startX = 0, startScroll = 0, moved = 0;
  rail.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    dragging = true; moved = 0; startX = e.clientX; startScroll = rail.scrollLeft;
    rail.classList.add('is-dragging');
    rail.setPointerCapture(e.pointerId);
  });
  rail.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    rail.scrollLeft = startScroll - dx;
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    rail.classList.remove('is-dragging');
    try { rail.releasePointerCapture(e.pointerId); } catch (_) { /* noop */ }
  }
  rail.addEventListener('pointerup', endDrag);
  rail.addEventListener('pointercancel', endDrag);
  // 拖拽超过阈值时吞掉随后的点击,避免误触发卡片链接
  rail.addEventListener('click', (e) => {
    if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; }
  }, true);

  refresh();
}

// 三张卡片共用的项目详情正文模板(P1):ABOUT / HOW TO PLAY / FEATURES / MEDIA / RELATED ARCHIVES
// 数据驱动,差异全在 projects[] 里;不再为某张卡单独写一套 DOM。
function renderProjectArticles(project) {
  const archives = project.archives || [];
  return `
        <article class="article ip-article ip-about" id="about-copy">
          <span class="section-kicker">[ABOUT]</span>
          <h2>${project.about.headline}</h2>
          ${project.about.body.map(p => `<p>${p}</p>`).join('')}
          ${metaStrip(project.meta)}
        </article>
        <article class="article ip-article ip-howto" id="how-to-play">
          <span class="section-kicker">[HOW TO PLAY]</span>
          <h2>${project.howToPlay.title}</h2>
          <ol class="ip-steps">
            ${project.howToPlay.steps.map((s, i) => `<li class="ip-step"><span class="ip-step-no">${String(i + 1).padStart(2, '0')}</span><div class="ip-step-body"><strong>${s.title}</strong><p>${s.desc}</p></div></li>`).join('')}
          </ol>
        </article>
        <article class="article ip-article ip-features" id="features">
          <span class="section-kicker">[FEATURES]</span>
          <h2>${project.features.title}</h2>
          <div class="ip-feature-grid">
            ${project.features.items.map(f => {
              const body = `<span class="ip-feature-action">${f.action}</span><strong class="ip-feature-cap">${f.capability}</strong><p>${f.desc}</p>`;
              return f.href
                ? `<a class="ip-feature is-link" href="${f.href}">${body}<span class="ip-feature-go">打开 →</span></a>`
                : `<div class="ip-feature">${body}</div>`;
            }).join('')}
          </div>
        </article>
        <article class="article ip-article ip-media" id="media">
          <span class="section-kicker">[MEDIA]</span>
          <h2>${project.media.title}</h2>
          <div class="ip-media-grid">
            ${project.media.items.map(m => `<figure class="ip-media-card"><div class="ip-media-ph" data-glyph="${(m.label || '▮').slice(0, 1)}"></div><figcaption>${m.label}<span>${m.note}</span></figcaption></figure>`).join('')}
          </div>
        </article>
        <article class="article ip-article ip-archives" id="related-archives">
          <div class="ip-rail-head">
            <span class="section-kicker">[RELATED ARCHIVES]</span>
            <div class="ip-rail-ctrl" data-rail-ctrl ${archives.length > 1 ? '' : 'hidden'}>
              <button type="button" class="ip-rail-btn" data-rail-prev aria-label="上一个档案">‹</button>
              <span class="ip-rail-count" data-rail-count>01 / ${String(archives.length).padStart(2, '0')}</span>
              <button type="button" class="ip-rail-btn" data-rail-next aria-label="下一个档案">›</button>
            </div>
          </div>
          <h2>相关档案</h2>
          <div class="ip-archive-rail" data-archive-rail tabindex="0" role="group" aria-label="相关档案,可横向滑动、拖拽或用左右方向键浏览">
            ${archives.map(renderArchiveCard).join('')}
          </div>
          <p class="ip-archive-note">横向滑动 · 拖拽 · ← → 浏览相关主题与剧本。更多条目将陆续上线。</p>
        </article>
  `;
}

const projects = [
  {
    id: 'geisai',
    title: '那一夜，我们一起当警察',
    short: 'CITY STORY',
    index: '001',
    year: '[2026 - LIVE]',
    date: '2000 WINTER',
    contract: 'CY-CASE-001',
    tag: 'UNSOLVED',
    tone: 'gold',
    meta: { type: '城市主题 · 实景叙事', status: 'LIVE / 47%', players: '1–6 人', duration: '约 3 小时', city: '上海 · 静安→外滩 6.2KM' },
    about: {
      headline: '一条 6.2 公里的上海夜行，把整座城市变成案发现场',
      body: [
        '你和朋友组成一支临时小队，沿南京西路一路走到外滩。线索藏在门牌、橱窗、路牌和传呼机代码里。',
        '走到哪、看见什么、怎么把时间重新排好，决定你们解开的是哪一个版本的结局。'
      ]
    },
    howToPlay: {
      title: '从组队到结案，一夜怎么玩',
      steps: [
        { title: '单人或组队', desc: '一个人也能加入，也可以邀请朋友拼一支 1–6 人的小队。' },
        { title: '领取身份', desc: '进入故事后各自拿到角色与任务，有人读线索，有人盯时间。' },
        { title: '跟着城市走', desc: 'App 用定位和时间逐站解锁剧情，从静安别墅一路推进到外滩。' },
        { title: '现场取证', desc: '扫码、拍照、答题、对暗号，把门牌、倒影、传呼代码变成线索。' },
        { title: '队友协作', desc: '进度实时共享，不同人看到不同信息，需要拼在一起才完整。' },
        { title: '结算', desc: '线索完整度与排时间的顺序，决定你们的结局、排名和成就。' }
      ]
    },
    features: {
      title: 'App 怎么撑起这场城市游戏',
      items: [
        { action: '找队友', capability: '邀请 · 匹配 · 队伍房间', desc: '从建队到全员准备，在一个房间里集合。' },
        { action: '到现场', capability: 'LBS · 地图 · 路线导航', desc: '任务点和距离实时变化，带你走到下一站。' },
        { action: '收线索', capability: '扫码 · 拍照 · 答题 · 口令', desc: '多种验证方式，只有到了现场才能触发。' },
        { action: '推剧情', capability: '任务状态 · 分支条件 · AI 角色', desc: '你的每个选择都在改变下一步走向。' },
        { action: '协作', capability: '队员状态 · 共享物品 · 分工任务', desc: '不同玩家看到不同信息，缺一不可。' },
        { action: '完成', capability: '结算 · 排行榜 · 成就 · 奖励', desc: '给出结果，也给出继续游玩的入口。' }
      ]
    },
    media: {
      title: '现场片段',
      items: [
        { label: '静安别墅 · 起点', note: '现场实拍 · 素材待定' },
        { label: '张园 · 最后目击', note: '现场实拍 · 素材待定' },
        { label: '南京西路 · 替身行走', note: '现场实拍 · 素材待定' },
        { label: '外滩 · 档案点', note: '现场实拍 · 素材待定' }
      ]
    },
    archives: [
      { title: '预制人生', type: 'READER', href: '/preset-life.html', status: '' },
      { title: '更多城市主题', type: 'THEME', href: '', status: '即将上线' }
    ]
  },
  {
    id: 'forging',
    title: '游戏模式',
    short: 'GAME MODES',
    index: '010',
    year: '[2026 - DROP]',
    date: 'APR. 24TH, 2026',
    contract: 'CY-APP-010',
    tag: 'TEMPLATE',
    tone: 'purple',
    meta: { type: '可复用玩法模板', status: 'TEMPLATE', players: '1 人起', duration: '30 分钟 – 3 小时', city: '任意城市' },
    about: {
      headline: '城瘾不止一个故事，而是一套能反复组合的城市玩法',
      body: [
        '同一座城市，可以是一个人的安静探索，也可以是几十人的阵营对抗。',
        '每一种模式都规定了人数、时长、目标和结算方式；换一个主题，就能复用同一套玩法。'
      ]
    },
    howToPlay: {
      title: '从选择模式到开始游戏',
      steps: [
        { title: '挑一个模式', desc: '按人数、时间和想要的节奏，选探索、竞速、对抗或寻宝。' },
        { title: '套上主题', desc: '同一套模式可以换不同城市主题，规则不变、故事换皮。' },
        { title: '开局', desc: '系统按模式分发目标、路线和角色，队伍即时成形。' },
        { title: '结算', desc: '按速度、线索完整度或团队表现排名，决定下一局怎么开。' }
      ]
    },
    features: {
      title: '七种可复用的游戏模式',
      items: [
        { action: '1 人 · 30–60min', capability: '单人探索', desc: '独自完成路线、线索与隐藏任务。' },
        { action: '2–6 人 · 1–2h', capability: '组队协作', desc: '队员分工、共享信息、共同解锁。' },
        { action: '多队 · 约 1h', capability: '限时竞速', desc: '多支队伍在时限内抢完成同一条任务链。' },
        { action: '2 阵营 · 1–2h', capability: '阵营对抗', desc: '争夺区域、资源或积分。' },
        { action: '1–6 人 · 1–3h', capability: '城市寻宝', desc: '靠地标、门店与实物线索一路推进。' },
        { action: '全员 · 任意', capability: 'D20 判定', desc: '用随机判定改变任务风险与剧情结果。', href: '/d20.html' },
        { action: '多队 · 赛季', capability: '排行榜挑战', desc: '按速度、线索完整度、团队表现结算。' }
      ]
    },
    media: {
      title: '模式预览',
      items: [
        { label: '单人探索', note: '模式主视觉 · 待定' },
        { label: '组队协作', note: '模式主视觉 · 待定' },
        { label: '阵营对抗', note: '模式主视觉 · 待定' },
        { label: 'D20 判定', note: '模式主视觉 · 待定' }
      ]
    },
    archives: [
      { title: 'D20 判定玩法', type: 'GAME', href: '/d20.html', status: '' },
      { title: '更多游戏模式', type: 'MODE', href: '', status: '即将上线' }
    ]
  },
  {
    id: 'airforce',
    title: 'IP 入城',
    short: 'IP IN CITY',
    index: '011',
    year: '[2026 - OBJECT]',
    date: 'AUG. 30TH, 2026',
    contract: 'CY-APP-011',
    tag: 'CROSSOVER',
    tone: 'shoe',
    meta: { type: 'IP × 真实城市', status: 'OPEN', players: '按活动', duration: '限定 / 长期', city: '城市地标 · 商圈 · 门店' },
    about: {
      headline: '熟悉的影视、游戏、角色与品牌，走进真实城市变成可玩的体验',
      body: [
        '你认识的 IP 不再只在屏幕里。它变成城市里的一条路线、一个任务、一位会说话的角色。',
        '限定活动结束后，这些内容仍能作为城市档案长期保留，随时可以再玩一次。'
      ]
    },
    howToPlay: {
      title: '作为玩家，你会怎么遇见它',
      steps: [
        { title: '选一个 IP 事件', desc: '从正在进行的影视、游戏或品牌事件里挑一个进城。' },
        { title: '在城市里接任务', desc: '熟悉的剧情和角色变成你身边的路线与节点。' },
        { title: '与 IP 互动', desc: '和 AI 角色对话、完成限定任务、触发隐藏剧情。' },
        { title: '解锁限定与收藏', desc: '线上身份、成就或收藏，解锁线下专属内容。' }
      ]
    },
    features: {
      title: 'IP 如何走进城市',
      items: [
        { action: '影视剧情', capability: '线下化', desc: '剧情变成城市路线和章节任务。' },
        { action: '游戏角色', capability: '城市化', desc: '角色成为 AI 角色、任务发布者或你的队友。' },
        { action: '品牌世界观', capability: '任务化', desc: '变成限定事件、隐藏任务和收藏内容。' },
        { action: '地标门店', capability: '节点化', desc: '展览、商圈与门店成为故事节点。' }
      ]
    },
    media: {
      title: '入城片段',
      items: [
        { label: '影视路线', note: '案例视觉 · 待授权确认' },
        { label: 'AI 角色', note: '案例视觉 · 待授权确认' },
        { label: '限定事件', note: '案例视觉 · 待授权确认' },
        { label: '城市节点', note: '案例视觉 · 待授权确认' }
      ]
    },
    archives: [
      { title: '预制人生', type: 'READER', href: '/preset-life.html', status: '' },
      { title: '更多 IP 联动', type: 'IP', href: '', status: '即将上线' }
    ]
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
        <div class="forging-core">APP 010</div>
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
  return `
    <div class="archive-surface gold-surface">
      <div class="gold-sigil">${sigilSvg(side ? 0.72 : 0.96)}</div>
    </div>
    ${side ? '' : '<span class="enter-tip">Click to enter</span>'}
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
      /* 页面操作条:导航/页脚由共享站壳(site-shell.js)提供,这里只放本页专属操作。
         top 留出站壳固定顶栏(桌面 64px / 移动 56px)的高度。 */
      .page-actions {
        position: fixed;
        top: 78px;
        left: 22px;
        right: 22px;
        z-index: 50;
        display: flex;
        justify-content: center;
        pointer-events: none;
      }
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

/* 本页专属操作条。品牌 logo、主导航与移动端汉堡菜单一律走共享站壳,
   不再在这里手写第二份(原来那份的汉堡按钮没有任何监听,移动端等于没有导航)。 */
function pageActions(content = '') {
  return `<div class="page-actions">${content}</div>`;
}

function renderHome() {
  root.innerHTML = `
    ${baseStyles()}
    <style>
      /* 首屏满屏但不锁死文档滚动:站壳页脚(法律/联系入口)接在下面,用户滚得到 */
      .home {
        position: relative;
        height: 100vh;
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
    </style>
    <div class="home">
      <div class="loader-screen">WORLD/IP</div>
      <div class="cube-carousel" role="group" aria-label="项目档案轮播(左右方向键切换)">
        <div class="cube-ring">
          <button class="home-card left" data-face="left" type="button" aria-label="上一个项目"></button>
          <button class="home-card front active" data-face="front" type="button" aria-label="进入当前项目"></button>
          <button class="home-card right" data-face="right" type="button" aria-label="下一个项目"></button>
        </div>
        <button class="carousel-zone left-zone" type="button" aria-label="上一个项目"></button>
        <button class="carousel-zone right-zone" type="button" aria-label="下一个项目"></button>
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
  const carousel = document.querySelector('.cube-carousel');
  const leftZone = document.querySelector('.left-zone');
  const rightZone = document.querySelector('.right-zone');
  let activeIndex = 0;
  let currentAngle = 0;
  let isAnimating = false;
  let dragStartX = 0;
  let dragStartY = 0;
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
    face.setAttribute('aria-label', role === 'front' ? `进入 ${project.title}` : `切换到 ${project.title}`);
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

  /* 滚轮:只认横向滚动(触控板左右划),并且全程 passive —— 不再 preventDefault,
     所以浏览器缩放(Ctrl+滚轮 / 双指捏合)和页面纵向滚动都保持正常。 */
  carousel?.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 12) return;
    animateTo(event.deltaX > 0 ? 1 : -1);
  }, { passive: true });

  /* 拖拽:只在轮播容器上生效(原来挂在 window 上,顶栏划一下或选中文字都会转卡),
     且要求横向位移明显大于纵向,避免和上下滚动抢手势。 */
  carousel?.addEventListener('pointerdown', event => {
    dragging = true;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
  }, { passive: true });
  carousel?.addEventListener('pointerup', event => {
    if (!dragging) return;
    dragging = false;
    const delta = event.clientX - dragStartX;
    const deltaY = event.clientY - dragStartY;
    if (Math.abs(delta) > 70 && Math.abs(delta) > Math.abs(deltaY)) {
      suppressClick = true;
      animateTo(delta < 0 ? 1 : -1);
      setTimeout(() => { suppressClick = false; }, 180);
    }
  }, { passive: true });
  carousel?.addEventListener('pointercancel', () => { dragging = false; }, { passive: true });

  /* 键盘:卡片本身是 button,左右方向键在轮播内切换项目 */
  carousel?.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); animateTo(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); animateTo(1); }
  });

  window.addEventListener('resize', () => updateGeometry(currentAngle), { passive: true });

  renderFaces();
}

function renderDetail() {
  const project = getProject(activeProjectId);
  const projectIndex = projects.findIndex(item => item.id === project.id);
  const leftProject = projects[wrapProjectIndex(projectIndex - 1)];
  const rightProject = projects[wrapProjectIndex(projectIndex + 1)];
  const nextProject = rightProject;

  root.innerHTML = `
    ${baseStyles()}
    <style>
      body { overflow-x: hidden; }
      .page { position: relative; min-height: 100vh; background: #000; --scroll: 0; }
      .side-nav {
        position: fixed; left: 20px; top: 0; z-index: 30; display: grid; gap: 8px;
        transform: translate3d(0, calc(100vh - 90px), 0); transition: opacity 0.8s ease 0.25s, transform 0.8s cubic-bezier(.2,.8,.2,1) 0.25s; will-change: transform;
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
      .project-geisai {
        --case-white: #e8e4da;
        --case-red: #8b1e1e;
      }
      .project-geisai .hero-bg-panel {
        background:
          linear-gradient(135deg, rgba(139,30,30,0.16), rgba(5,5,5,0.92)),
          linear-gradient(rgba(232,228,218,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,228,218,0.035) 1px, transparent 1px);
        background-size: auto, 44px 44px, 44px 44px;
        filter: grayscale(1);
      }
      .project-geisai .hero-blur-field {
        background:
          radial-gradient(circle at 50% 38%, rgba(139,30,30,0.24), transparent 15%),
          radial-gradient(circle at 50% 45%, rgba(232,228,218,0.46), rgba(22,22,22,0.82) 54%, transparent 70%);
        filter: blur(34px) grayscale(1) contrast(1.14);
      }
      .project-geisai .hero-title {
        font-family: "Inter", "PingFang SC", "Noto Sans SC", sans-serif;
        top: 620px;
        font-size: clamp(42px, 5.2vw, 82px);
        font-weight: 900;
        line-height: 1.08;
        max-width: 760px;
        text-transform: none;
      }
      .project-geisai .archive-card { background: rgba(5,5,5,0.94); border: 1px solid rgba(232,228,218,0.12); }
      .project-geisai .archive-thumb {
        background:
          linear-gradient(rgba(5,5,5,0.2), rgba(5,5,5,0.58)),
          url('${caseAssets.diary}') center / cover no-repeat;
        filter: grayscale(100%) contrast(1.18);
      }
      .project-geisai .archive-thumb > * { display: none; }
      .project-geisai .tag-pill { background: rgba(139,30,30,0.28); color: var(--case-white); }
      .project-geisai .media-block {
        background:
          linear-gradient(180deg, rgba(0,0,0,0) 66%, rgba(0,0,0,0.58)),
          linear-gradient(90deg, rgba(5,5,5,0.94), rgba(5,5,5,0.28)),
          url('${caseAssets.nanjingRoad}') center / cover no-repeat;
        filter: saturate(0.9) contrast(1.06);
      }
      .project-geisai .play {
        font-family: "Inter", "PingFang SC", "Noto Sans SC", sans-serif;
        font-size: 0;
        font-weight: 900;
        text-transform: none;
      }
      .project-geisai .play::after { content: "接下这件皮衣"; }
      .project-geisai .play::before {
        width: 34px;
        height: 34px;
        font-size: 16px;
      }
      .project-geisai .play::after { font-size: 16px; }
      .project-geisai .article h2 {
        font-family: "Inter", "PingFang SC", "Noto Sans SC", sans-serif;
        font-size: clamp(40px, 5vw, 76px);
        font-weight: 900;
        line-height: 1.08;
        text-transform: none;
      }
      .project-geisai .section-kicker { color: rgba(139,30,30,0.92); }
      .project-geisai .article p { color: rgba(232,228,218,0.62); font-size: 16px; line-height: 1.72; }
      .case-duo { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 32px; }
      .case-duo div, .story-paper, .story-clue, .story-cta { border: 1px solid rgba(232,228,218,0.14); background: rgba(255,255,255,0.045); }
      .case-duo div { min-height: 128px; padding: 16px; }
      .case-duo strong { display: block; color: #fff; font-size: 28px; margin-bottom: 12px; }
      .case-duo span { color: rgba(232,228,218,0.5); font-size: 12px; line-height: 1.5; }
      .story-wide { max-width: 1120px; }
      .chapter-walk {
        position: relative;
        min-height: 104vh;
        max-width: 1120px;
        padding: 18px;
        overflow: hidden;
        border: 1px solid rgba(232,228,218,0.12);
        background: #090909;
      }
      .chapter-layout {
        position: relative;
        z-index: 2;
        min-height: calc(104vh - 36px);
        display: grid;
        grid-template-columns: minmax(330px, 0.82fr) minmax(520px, 1.18fr);
        gap: 18px;
      }
      .chapter-route-line {
        display: none;
      }
      .chapter-route-line::before {
        content: "";
        position: absolute;
        left: 42px;
        top: 0;
        bottom: 0;
        width: 1px;
        background: rgba(232,228,218,0.22);
      }
      .chapter-route-line span {
        position: absolute;
        left: 42px;
        top: 0;
        width: 2px;
        height: 54%;
        background: #e8e4da;
      }
      .chapter-route-line span::after {
        content: "";
        position: absolute;
        left: -6px;
        bottom: -1px;
        width: 14px;
        height: 14px;
        border-right: 2px solid #e8e4da;
        border-bottom: 2px solid #e8e4da;
        transform: rotate(45deg);
      }
      .chapter-content {
        position: relative;
        z-index: 3;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 72px 28px 72px 118px;
        border: 1px solid rgba(232,228,218,0.12);
        background:
          linear-gradient(rgba(232,228,218,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,228,218,0.035) 1px, transparent 1px),
          rgba(5,5,5,0.9);
        background-size: 34px 34px;
      }
      .chapter-content h2 {
        margin-bottom: 18px;
        max-width: 420px;
      }
      .chapter-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 24px;
      }
      .chapter-meta span {
        min-height: 30px;
        display: inline-flex;
        align-items: center;
        border: 1px solid rgba(232,228,218,0.18);
        background: rgba(232,228,218,0.06);
        padding: 0 10px;
        color: rgba(232,228,218,0.82);
        font: 800 11px/1 var(--mono);
        letter-spacing: 0.07em;
        text-transform: uppercase;
      }
      .chapter-content > p {
        max-width: 430px;
        color: rgba(232,228,218,0.78);
        font-size: 15px;
        line-height: 1.72;
      }
      .chapter-objective {
        display: flex;
        align-items: center;
        gap: 12px;
        width: fit-content;
        margin-top: 20px;
        padding: 9px 12px;
        border-radius: 8px;
        background: rgba(255,255,255,0.08);
      }
      .chapter-objective span {
        color: rgba(139,30,30,0.95);
        font: 900 10px/1 var(--mono);
        letter-spacing: 0.12em;
      }
      .chapter-objective strong {
        color: rgba(232,228,218,0.9);
        font: 900 13px/1 "Inter", "PingFang SC", sans-serif;
      }
      .chapter-task-panel {
        width: min(100%, 430px);
        margin-top: 24px;
        display: grid;
        gap: 10px;
        border: 1px solid rgba(232,228,218,0.18);
        background: rgba(232,228,218,0.045);
        padding: 16px;
      }
      .chapter-task-panel strong,
      .chapter-clue-strip strong {
        color: rgba(139,30,30,0.95);
        font: 900 11px/1 var(--mono);
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }
      .chapter-task-panel span {
        border-top: 1px solid rgba(232,228,218,0.1);
        padding-top: 9px;
        color: rgba(232,228,218,0.78);
        font-size: 12px;
        line-height: 1.45;
      }
      .chapter-clue-strip {
        width: min(100%, 430px);
        margin-top: 14px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
      }
      .chapter-clue-strip em {
        min-height: 28px;
        display: inline-flex;
        align-items: center;
        padding: 0 9px;
        border: 1px solid rgba(232,228,218,0.18);
        background: rgba(232,228,218,0.08);
        color: rgba(232,228,218,0.78);
        font: 700 12px/1 var(--mono);
        font-style: normal;
      }
      .chapter-next {
        margin-top: 28px;
        color: rgba(232,228,218,0.72);
        font: 900 11px/1 var(--mono);
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }
      .chapter-next::before {
        content: none;
      }
      .chapter-visual {
        position: relative;
        min-height: 100%;
        overflow: hidden;
        border: 1px solid rgba(232,228,218,0.12);
        background: #050505;
      }
      .chapter-media {
        position: absolute;
        border: 1px solid rgba(232,228,218,0.12);
        filter: saturate(1.08) contrast(1.02);
        transition: filter 220ms ease, transform 420ms cubic-bezier(.2,.8,.2,1);
      }
      .chapter-media-main { background: var(--chapter-image) center / cover no-repeat; }
      .chapter-media-alt { background: var(--chapter-alt-image) center / cover no-repeat; }
      .chapter-walk.in-view .chapter-media { filter: saturate(1.24) contrast(1.08) brightness(1.14); transform: translate3d(0,0,0) scale(1); }
      .chapter-media::after {
        content: none;
      }
      .chapter-route-card {
        position: absolute;
        right: 18px;
        bottom: 18px;
        width: min(46%, 260px);
        min-height: 108px;
        padding: 14px;
        border: 1px solid rgba(232,228,218,0.16);
        background: rgba(5,5,5,0.82);
        backdrop-filter: blur(10px);
      }
      .chapter-route-card span {
        color: rgba(139,30,30,0.96);
        font: 900 12px/1 var(--mono);
      }
      .chapter-route-card strong {
        display: block;
        margin: 16px 0 8px;
        color: rgba(232,228,218,0.9);
        font: 900 11px/1 var(--mono);
        letter-spacing: 0.11em;
      }
      .chapter-route-card em {
        color: rgba(232,228,218,0.58);
        font: 800 11px/1.4 var(--mono);
        font-style: normal;
        text-transform: uppercase;
      }
      .chapter-entry .chapter-layout { grid-template-columns: minmax(340px, 0.82fr) minmax(540px, 1.18fr); }
      .chapter-entry .chapter-media-main {
        inset: 0;
        transform: translate3d(0, 20px, 0) scale(1.04);
      }
      .chapter-entry .chapter-media-alt {
        left: 22px;
        bottom: 22px;
        width: 34%;
        aspect-ratio: 4 / 5;
        transform: translate3d(-18px, 26px, 0) rotate(-2deg);
      }
      .chapter-photo-check .chapter-layout { grid-template-columns: minmax(520px, 1.1fr) minmax(330px, 0.9fr); }
      .chapter-photo-check .chapter-content { order: 2; padding-left: 52px; }
      .chapter-photo-check .chapter-route-line { left: auto; right: 398px; }
      .chapter-photo-check .chapter-media-main {
        left: 22px;
        top: 22px;
        width: 70%;
        height: 58%;
        transform: translate3d(-28px, -10px, 0) rotate(-1.2deg);
      }
      .chapter-photo-check .chapter-media-alt {
        right: 34px;
        bottom: 44px;
        width: 58%;
        height: 46%;
        transform: translate3d(24px, 24px, 0) rotate(1.4deg);
      }
      .chapter-photo-check .chapter-route-card { left: 28px; right: auto; bottom: 30px; }
      .chapter-transit {
        border-color: rgba(232,228,218,0.08);
        background:
          linear-gradient(90deg, rgba(232,228,218,0.045) 1px, transparent 1px),
          #050505;
        background-size: 13.5% 100%;
      }
      .chapter-transit .chapter-layout { grid-template-columns: 1fr; }
      .chapter-transit .chapter-content {
        order: 2;
        width: min(560px, 72%);
        min-height: auto;
        padding: 28px;
        margin: 18px 0 0 42px;
      }
      .chapter-transit .chapter-visual {
        order: 1;
        min-height: 68vh;
      }
      .chapter-transit .chapter-media-main {
        left: 25%;
        top: 0;
        width: 75%;
        height: 54%;
        transform: translate3d(48px, -18px, 0);
      }
      .chapter-transit .chapter-media-alt {
        left: 8%;
        bottom: 0;
        width: 68%;
        height: 48%;
        transform: translate3d(-34px, 28px, 0);
      }
      .chapter-transit .chapter-route-card { right: 34px; top: 56%; bottom: auto; }
      .chapter-evidence .chapter-layout { grid-template-columns: minmax(380px, 0.72fr) minmax(620px, 1.28fr); }
      .chapter-evidence .chapter-visual {
        display: grid;
        grid-template-columns: 1fr 0.72fr;
        gap: 14px;
        padding: 18px;
      }
      .chapter-evidence .chapter-media {
        position: relative;
        inset: auto;
        min-height: 100%;
        transform: translate3d(0, 20px, 0);
      }
      .chapter-evidence .chapter-media-main { min-height: 100%; }
      .chapter-evidence .chapter-media-alt { min-height: 58%; align-self: end; filter: saturate(0.82) contrast(1.05); }
      .chapter-evidence .chapter-route-card { right: 32px; top: 32px; bottom: auto; width: 230px; }
      .chapter-archive .chapter-layout { grid-template-columns: 1fr; }
      .chapter-archive .chapter-content {
        order: 2;
        justify-self: end;
        width: min(520px, 56%);
        min-height: auto;
        padding: 28px;
        margin-top: 18px;
      }
      .chapter-archive .chapter-visual {
        order: 1;
        min-height: 68vh;
      }
      .chapter-archive .chapter-media-main {
        left: 0;
        top: 0;
        width: 68%;
        height: 72%;
        transform: translate3d(-24px, -20px, 0) scale(1.03);
      }
      .chapter-archive .chapter-media-alt {
        right: 0;
        bottom: 0;
        width: 56%;
        height: 48%;
        transform: translate3d(24px, 30px, 0);
      }
      .chapter-archive .chapter-route-card { left: 34px; right: auto; bottom: 34px; }
      .project-geisai .chapter-entry .chapter-layout {
        grid-template-columns: minmax(500px, 0.86fr) minmax(700px, 1.14fr);
      }
      .project-geisai .chapter-entry .chapter-media-main {
        left: 0;
        right: -1px;
        top: 0;
        bottom: 0;
      }
      .project-geisai .chapter-entry .chapter-media-alt {
        left: -7vw;
        bottom: 4vh;
        width: min(28vw, 360px);
      }
      .project-geisai .chapter-photo-check .chapter-layout {
        grid-template-columns: minmax(700px, 1.08fr) minmax(500px, 0.92fr);
      }
      .project-geisai .chapter-photo-check .chapter-media-main {
        left: 0;
        top: 0;
        width: 78%;
        height: 63%;
      }
      .project-geisai .chapter-photo-check .chapter-media-alt {
        right: 4vw;
        bottom: 5vh;
        width: 54%;
        height: 46%;
      }
      .project-geisai .chapter-transit .chapter-layout {
        grid-template-columns: 1fr;
        grid-template-rows: 72vh auto;
      }
      .project-geisai .chapter-transit .chapter-visual {
        min-height: 72vh;
      }
      .project-geisai .chapter-transit .chapter-content {
        margin-left: max(280px, 24vw);
        padding: 34px 0 90px;
      }
      .project-geisai .chapter-transit .chapter-media-main {
        left: 24vw;
        top: 0;
        width: calc(76vw - 20px);
        height: 54%;
      }
      .project-geisai .chapter-transit .chapter-media-alt {
        left: 0;
        bottom: 0;
        width: 62vw;
        height: 48%;
      }
      .project-geisai .chapter-evidence .chapter-layout {
        grid-template-columns: minmax(500px, 0.84fr) minmax(720px, 1.16fr);
      }
      .project-geisai .chapter-evidence .chapter-visual {
        padding: 0;
        grid-template-columns: 1.08fr 0.72fr;
        gap: 20px;
        background: transparent;
      }
      .project-geisai .chapter-evidence .chapter-media-main {
        min-height: 78vh;
        align-self: start;
      }
      .project-geisai .chapter-evidence .chapter-media-alt {
        min-height: 46vh;
        align-self: end;
      }
      .project-geisai .chapter-archive .chapter-layout {
        grid-template-columns: 1fr;
        grid-template-rows: 74vh auto;
      }
      .project-geisai .chapter-archive .chapter-visual {
        min-height: 74vh;
      }
      .project-geisai .chapter-archive .chapter-content {
        width: min(560px, 48vw);
        margin-right: 8vw;
        padding: 34px 0 92px;
      }
      .project-geisai .chapter-archive .chapter-media-main {
        left: 0;
        top: 0;
        width: 68vw;
        height: 72vh;
      }
      .project-geisai .chapter-archive .chapter-media-alt {
        right: 0;
        bottom: 0;
        width: 48vw;
        height: 42vh;
      }
      .project-geisai .chapter-media-main,
      .project-geisai .chapter-media-alt {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-color: #050505;
        border-radius: 18px;
      }
      .project-geisai .chapter-media-main {
        width: min(43vw, 620px);
        height: 96vh;
      }
      .project-geisai .chapter-media-alt {
        width: min(31vw, 440px);
        height: 68vh;
      }
      .project-geisai .chapter-entry .chapter-layout,
      .project-geisai .chapter-evidence .chapter-layout {
        grid-template-columns: minmax(380px, 0.42fr) minmax(860px, 1.58fr);
      }
      .project-geisai .chapter-photo-check .chapter-layout {
        grid-template-columns: minmax(860px, 1.58fr) minmax(380px, 0.42fr);
      }
      .project-geisai .chapter-entry .chapter-media-main,
      .project-geisai .chapter-evidence .chapter-media-main {
        left: auto;
        right: 3vw;
        top: 2vh;
        bottom: auto;
      }
      .project-geisai .chapter-entry .chapter-media-alt,
      .project-geisai .chapter-evidence .chapter-media-alt {
        left: 33vw;
        right: auto;
        bottom: 0;
      }
      .project-geisai .chapter-photo-check .chapter-media-main {
        left: 3vw;
        right: auto;
        top: 2vh;
      }
      .project-geisai .chapter-photo-check .chapter-media-alt {
        left: auto;
        right: 26vw;
        bottom: 0;
      }
      .project-geisai .chapter-transit .chapter-media-main {
        left: 42vw;
        top: 2vh;
        width: min(43vw, 620px);
        height: 96vh;
      }
      .project-geisai .chapter-transit .chapter-media-alt {
        left: 7vw;
        bottom: 0;
        width: min(32vw, 460px);
        height: 70vh;
      }
      .project-geisai .chapter-archive .chapter-media-main {
        left: 8vw;
        top: 2vh;
        width: min(43vw, 620px);
        height: 96vh;
      }
      .project-geisai .chapter-archive .chapter-media-alt {
        left: auto;
        right: 6vw;
        bottom: 0;
        width: min(32vw, 460px);
        height: 70vh;
      }
      .story-route-map {
        position: relative;
        min-height: 760px;
        margin-top: 42px;
        border: 1px solid rgba(232,228,218,0.14);
        border-radius: 8px;
        overflow: hidden;
        background:
          radial-gradient(circle at 18% 14%, rgba(139,30,30,0.18), transparent 18%),
          linear-gradient(rgba(232,228,218,0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(232,228,218,0.045) 1px, transparent 1px),
          linear-gradient(rgba(5,5,5,0.62), rgba(5,5,5,0.9)),
          url('${caseAssets.alley}') center / cover no-repeat;
        background-size: auto, 48px 48px, 48px 48px, auto, cover;
        filter: grayscale(100%) contrast(1.08);
      }
      .story-route-map::before {
        content: "JINGAN  →  FUZHOU RD  →  BUND ARCHIVE";
        position: absolute;
        left: 22px;
        top: 18px;
        color: rgba(232,228,218,0.46);
        font: 800 11px/1 var(--mono);
        letter-spacing: 0.12em;
        z-index: 2;
      }
      .story-route-svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        overflow: visible;
      }
      .story-route-shadow,
      .story-route-path {
        fill: none;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
      .story-route-shadow { stroke: rgba(139,30,30,0.58); stroke-width: 8; opacity: 0.45; filter: blur(5px); }
      .story-route-path {
        stroke: rgba(232,228,218,0.95);
        stroke-width: 3;
        stroke-dasharray: var(--route-length, 1400);
        stroke-dashoffset: calc(var(--route-length, 1400) * (1 - var(--route-progress, 0)));
        transition: stroke-dashoffset 80ms linear;
      }
      .story-route-node {
        position: absolute;
        left: var(--x);
        top: var(--y);
        z-index: 3;
        width: 230px;
        min-height: 164px;
        transform: translate(-50%, -50%);
        padding: 14px;
        border: 1px solid rgba(232,228,218,0.16);
        background: rgba(5,5,5,0.84);
        color: #fff;
        transition: border-color 180ms ease, background 180ms ease, transform 180ms ease, opacity 180ms ease;
      }
      .story-route-node::before {
        content: "";
        position: absolute;
        left: -7px;
        top: -7px;
        width: 12px;
        height: 12px;
        border-radius: 999px;
        background: #555;
        border: 1px solid rgba(232,228,218,0.7);
      }
      .story-route-node.is-passed::before { background: #e8e4da; }
      .story-route-node.is-active {
        border-color: rgba(232,228,218,0.76);
        background: rgba(5,5,5,0.94);
        transform: translate(-50%, -54%);
      }
      .story-route-node.is-active::before { background: #8b1e1e; box-shadow: 0 0 0 5px rgba(139,30,30,0.24); }
      .story-route-node span { color: #8b1e1e; font: 900 12px/1 var(--mono); }
      .story-route-node strong { display: block; margin: 9px 0 5px; font-size: 18px; line-height: 1.2; }
      .story-route-node em { display: block; color: rgba(232,228,218,0.5); font: 800 10px/1.3 var(--mono); letter-spacing: 0.08em; text-transform: uppercase; font-style: normal; }
      .story-route-node p { margin: 10px 0 12px; color: rgba(232,228,218,0.64); font-size: 12px; line-height: 1.45; }
      .story-route-node small { color: rgba(232,228,218,0.8); font: 900 11px/1 var(--mono); letter-spacing: 0.06em; }
      .story-chapter-strip { grid-template-columns: repeat(5, minmax(240px, 1fr)); overflow-x: auto; padding-bottom: 14px; }
      .story-chapter-card { min-width: 260px; min-height: 560px; }
      .story-chapter-image { height: 170px; margin: -16px -16px 18px; background-size: cover; background-position: center; filter: grayscale(100%) contrast(1.2); opacity: 0.82; }
      .story-chapter-card ul { display: grid; gap: 8px; margin: 18px 0 0; padding: 0; list-style: none; }
      .story-chapter-card li { border-top: 1px solid rgba(232,228,218,0.12); padding-top: 8px; color: rgba(232,228,218,0.66); font-size: 12px; line-height: 1.4; }
      .story-board {
        min-height: 560px;
        background:
          linear-gradient(rgba(5,5,5,0.72), rgba(5,5,5,0.86)),
          url('${caseAssets.diary}') center / cover no-repeat;
        filter: grayscale(100%) contrast(1.06);
      }
      .story-paper-grid { position: relative; width: 100%; height: 100%; min-height: 560px; }
      .story-paper { position: absolute; width: 240px; min-height: 150px; padding: 16px; background: #e8e4da; color: #050505; transform: rotate(var(--r)); }
      .story-paper strong { display: block; margin-bottom: 12px; font-size: 18px; }
      .story-paper span { color: rgba(5,5,5,0.66); font-size: 13px; line-height: 1.45; }
      .story-paper:nth-child(1) { left: 6%; top: 10%; --r: -3deg; }
      .story-paper:nth-child(2) { left: 38%; top: 8%; --r: 2deg; }
      .story-paper:nth-child(3) { left: 66%; top: 22%; --r: -2deg; }
      .story-paper:nth-child(4) { left: 18%; top: 56%; --r: 3deg; }
      .story-paper:nth-child(5) { left: 55%; top: 58%; --r: -1deg; }
      .story-clue { width: 100%; color: rgba(232,228,218,0.54); font: inherit; text-align: left; }
      .story-clue:hover { color: rgba(232,228,218,0.86); }
      .story-clue strong { font-family: var(--mono); font-size: 13px; }
      .story-cta { color: inherit; text-align: left; cursor: pointer; }
      @media (max-width: 900px) {
        .project-geisai .hero-title { font-size: clamp(42px, 12vw, 72px); }
        .case-duo, .story-chapter-strip { grid-template-columns: 1fr; }
        .chapter-walk { min-height: auto; padding: 12px; }
        .chapter-layout { min-height: auto; grid-template-columns: 1fr; gap: 12px; }
        .chapter-content,
        .chapter-photo-check .chapter-content,
        .chapter-transit .chapter-content,
        .chapter-archive .chapter-content {
          order: 2;
          width: auto;
          min-height: 520px;
          margin: 0;
          padding: 74px 18px 34px 78px;
        }
        .chapter-visual,
        .chapter-transit .chapter-visual,
        .chapter-archive .chapter-visual {
          order: 1;
          min-height: 62vh;
        }
        .chapter-entry .chapter-media-main,
        .chapter-photo-check .chapter-media-main,
        .chapter-transit .chapter-media-main,
        .chapter-archive .chapter-media-main {
          left: 0;
          top: 0;
          width: 100%;
          height: 72%;
          transform: none;
        }
        .chapter-entry .chapter-media-alt,
        .chapter-photo-check .chapter-media-alt,
        .chapter-transit .chapter-media-alt,
        .chapter-archive .chapter-media-alt {
          left: 12px;
          right: auto;
          bottom: 12px;
          width: 58%;
          height: 34%;
          transform: none;
        }
        .chapter-evidence .chapter-visual { grid-template-columns: 1fr; min-height: auto; }
        .chapter-evidence .chapter-media-main,
        .chapter-evidence .chapter-media-alt { min-height: 42vh; }
        .project-geisai .chapter-media-main,
        .project-geisai .chapter-entry .chapter-media-main,
        .project-geisai .chapter-photo-check .chapter-media-main,
        .project-geisai .chapter-transit .chapter-media-main,
        .project-geisai .chapter-evidence .chapter-media-main,
        .project-geisai .chapter-archive .chapter-media-main {
          left: 50%;
          right: auto;
          top: 0;
          width: min(96vw, 520px);
          height: 82vh;
          transform: translateX(-50%);
        }
        .project-geisai .chapter-media-alt,
        .project-geisai .chapter-entry .chapter-media-alt,
        .project-geisai .chapter-photo-check .chapter-media-alt,
        .project-geisai .chapter-transit .chapter-media-alt,
        .project-geisai .chapter-evidence .chapter-media-alt,
        .project-geisai .chapter-archive .chapter-media-alt {
          display: none;
        }
        .chapter-route-card,
        .chapter-photo-check .chapter-route-card,
        .chapter-transit .chapter-route-card,
        .chapter-evidence .chapter-route-card,
        .chapter-archive .chapter-route-card {
          left: auto;
          right: 12px;
          top: auto;
          bottom: 12px;
          width: min(58%, 240px);
        }
        .chapter-route-line,
        .chapter-photo-check .chapter-route-line { left: 8px; right: auto; width: 54px; }
        .chapter-route-line::before, .chapter-route-line span { left: 26px; }
        .story-route-map { min-height: auto; padding: 72px 16px 16px; display: grid; gap: 14px; }
        .story-route-svg { display: none; }
        .story-route-node { position: relative; left: auto; top: auto; width: 100%; min-height: auto; transform: none; }
        .story-route-node.is-active { transform: none; }
        .story-board, .story-paper-grid { min-height: auto; }
        .story-paper-grid { display: grid; gap: 12px; padding: 16px; }
        .story-paper { position: relative; left: auto !important; top: auto !important; width: 100%; transform: none; }
      }
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
      .content { position: relative; width: min(100%, 1440px); margin: 0 auto; padding: 88px 20px 80px; }
      .article { margin-left: 24vw; max-width: 760px; padding-top: 34px; opacity: 0; transform: translate3d(0,44px,0); transition: opacity 0.85s ease, transform 0.95s cubic-bezier(.2,.8,.2,1); }
      .article.in-view { opacity: 1; transform: translate3d(0,0,0); }
      .section-kicker { color: rgba(255,255,255,0.46); font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; }
      .article h2 { margin: 22px 0 44px; color: #fff; font-family: var(--display); font-size: clamp(76px, 8.6vw, 132px); line-height: 0.82; letter-spacing: 0; text-transform: uppercase; }
      .article p { margin: 0 0 24px; color: rgba(255,255,255,0.42); font-size: 15px; line-height: 1.55; letter-spacing: 0.02em; }
      .project-geisai .content {
        position: relative;
        z-index: 12;
        width: 100%;
        max-width: none;
        padding-left: 0;
        padding-right: 0;
        background: #000;
      }
      .project-geisai .story-article {
        margin-left: max(280px, 24vw);
        max-width: 760px;
      }
      .project-geisai #about-copy {
        min-height: 54vh;
        padding-top: 72px;
      }
      .project-geisai .case-intro-article {
        display: grid;
        grid-template-columns: minmax(320px, 0.5fr) minmax(760px, 1.5fr);
        gap: 24px;
        align-items: center;
        max-width: none;
        margin-right: 20px;
      }
      .case-intro-copy {
        max-width: 680px;
      }
      .case-intro-visuals {
        position: relative;
        min-height: 94vh;
      }
      .case-intro-photo {
        position: absolute;
        background: var(--intro-image) center / contain no-repeat #050505;
        border-radius: 18px;
        box-shadow: 0 26px 90px rgba(0,0,0,0.54);
      }
      .case-intro-photo-primary {
        right: 26vw;
        top: 0;
        width: min(38vw, 540px);
        height: 92vh;
      }
      .case-intro-photo-secondary {
        right: 2vw;
        bottom: 2vh;
        width: min(32vw, 430px);
        height: 72vh;
      }
      .project-geisai .chapter-walk {
        width: calc(100vw - 40px);
        max-width: none;
        margin-left: 20px;
        margin-right: 20px;
        margin-top: 10vh;
        padding: 0;
        border: 0;
        background: #000;
      }
      .project-geisai .chapter-layout {
        min-height: 104vh;
        gap: 0;
      }
      .project-geisai .chapter-content {
        border: 0;
        background: transparent;
        justify-content: flex-end;
        padding: 84px 34px 126px 150px;
      }
      .project-geisai .chapter-content h2 {
        max-width: 480px;
        margin-bottom: 22px;
      }
      .project-geisai .chapter-meta span {
        border: 0;
        background: rgba(255,255,255,0.08);
        border-radius: 8px;
      }
      .project-geisai .chapter-task-panel {
        border: 0;
        background: transparent;
        padding: 0;
      }
      .project-geisai .chapter-task-panel span {
        border-top-color: rgba(232,228,218,0.16);
      }
      .project-geisai .chapter-clue-strip em {
        border: 0;
        border-radius: 8px;
        background: rgba(232,228,218,0.08);
      }
      .project-geisai .chapter-visual {
        border: 0;
        background: transparent;
        min-height: 104vh;
      }
      .project-geisai .chapter-media {
        border: 0;
        border-radius: 10px;
        filter: saturate(1.2) contrast(1.06) brightness(1.12);
        box-shadow: 0 34px 110px rgba(0,0,0,0.58);
      }
      .project-geisai .chapter-route-card {
        border: 0;
        border-radius: 8px;
        background: rgba(10,10,10,0.82);
      }
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
      /* 章末的“下一个项目”出口:一个普通链接,不再自动劫持滚动跳转 */
      .next-scroll {
        position: relative;
        min-height: 62vh;
        display: grid;
        place-items: center;
        align-content: center;
        gap: 18px;
        padding: 80px 22px;
        overflow: hidden;
        background: #000;
        text-align: center;
      }
      .next-scroll::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 52% 40%, rgba(255,255,255,0.08), transparent 13%),
          linear-gradient(180deg, transparent, rgba(255,255,255,0.04));
        opacity: 0.72;
      }
      .next-scroll__label {
        position: relative;
        z-index: 1;
        margin: 0;
        color: rgba(255,255,255,0.55);
        font-family: var(--mono);
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .next-scroll__link {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        gap: 14px;
        padding: 18px 30px;
        border: 1px solid rgba(255,255,255,0.28);
        border-radius: 14px;
        color: #fff;
        font-family: var(--display);
        font-size: clamp(30px, 5vw, 54px);
        line-height: 1;
        text-transform: uppercase;
        transition: border-color 0.25s ease, background 0.25s ease;
      }
      .next-scroll__link:hover,
      .next-scroll__link:focus-visible { border-color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.06); }
      .next-scroll__hint {
        position: relative;
        z-index: 1;
        margin: 0;
        max-width: 34em;
        color: rgba(255,255,255,0.5);
        font-family: var(--mono);
        font-size: 13px;
        line-height: 1.8;
      }
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
        .project-geisai .content { padding-left: 0; padding-right: 0; }
        .project-geisai .story-article {
          margin-left: 0;
          max-width: none;
          padding-left: 20px;
          padding-right: 20px;
        }
        .project-geisai .case-intro-article {
          grid-template-columns: 1fr;
          gap: 28px;
          margin-right: 0;
        }
        .case-intro-visuals {
          min-height: 86vh;
        }
        .case-intro-photo-primary {
          left: 0;
          right: auto;
          width: min(76vw, 360px);
          height: 72vh;
        }
        .case-intro-photo-secondary {
          right: 0;
          width: min(54vw, 260px);
          height: 48vh;
        }
        .project-geisai .chapter-walk {
          width: 100%;
          margin-left: 0;
          margin-right: 0;
          padding-left: 12px;
          padding-right: 12px;
        }
        .project-geisai .chapter-layout,
        .project-geisai .chapter-entry .chapter-layout,
        .project-geisai .chapter-photo-check .chapter-layout,
        .project-geisai .chapter-transit .chapter-layout,
        .project-geisai .chapter-evidence .chapter-layout,
        .project-geisai .chapter-archive .chapter-layout {
          grid-template-columns: 1fr;
          grid-template-rows: auto auto;
          min-height: auto;
        }
        .project-geisai .chapter-content,
        .project-geisai .chapter-photo-check .chapter-content,
        .project-geisai .chapter-transit .chapter-content,
        .project-geisai .chapter-archive .chapter-content {
          width: auto;
          margin: 0;
          padding: 74px 18px 34px 78px;
        }
        .event-strip, .entry-row, .entity-row { grid-template-columns: 1fr; }
      }
    </style>
    <div class="page project-${project.id}">
      <div class="loader-screen">WORLD/IP</div>
      ${pageActions('<div class="timeline-pill"><a class="pill icon" href="./ip.html" aria-label="返回 IP 世界">‹</a><a class="pill" href="#about">TIMELINE</a></div>')}
      <nav class="side-nav" aria-label="章节导航">
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
          </div>
          <div></div><div class="tag-pill">${project.tag}</div>
        </div>
      </section>
      <section class="media-block" aria-label="世界层影像预览"><div class="play">Play</div></section>
      <main class="content">
        ${renderProjectArticles(project)}
      </main>
      <section class="next-scroll" aria-labelledby="next-project-label">
        <p class="next-scroll__label" id="next-project-label">下一个项目</p>
        <a class="next-scroll__link" href="./ip.html?project=${nextProject.id}">${nextProject.title} <span aria-hidden="true">→</span></a>
        <p class="next-scroll__hint">${nextProject.short}</p>
      </section>
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
  const routeMap = document.querySelector('[data-route-map]');
  const routePath = document.querySelector('[data-route-path]');
  const routeNodes = Array.from(document.querySelectorAll('[data-route-node]'));

  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('loaded'), 540));
  requestAnimationFrame(() => {
    if (!routePath) return;
    const length = routePath.getTotalLength();
    routePath.style.setProperty('--route-length', length);
  });

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

  /* 首屏视差涉及的九个模板元素:缺任意一个就整体跳过,
     不再让每个滚动帧都抛 TypeError(章节高亮仍照常工作)。 */
  const motionEls = [pageEl, cubeStage, mainCube, leftCube, rightCube, heroTitle, archiveCard, heroIndex];
  const motionReady = motionEls.every(Boolean);

  let ticking = false;
  function updateMotion() {
    ticking = false;
    if (!motionReady) {
      updateActiveNav();
      return;
    }
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
    if (sideNav) {
      // 侧栏从视口下缘附近升到顶部锚点。原来写死的 1440/96/990 只在 1080 高的视口上对得上。
      const navRest = Math.max(SIDE_NAV_TOP, window.innerHeight - 90);
      const navP = clamp((y - SIDE_NAV_LIFT_START) / SIDE_NAV_LIFT_RANGE, 0, 1);
      sideNav.style.transform = `translate3d(0, ${(navRest + (SIDE_NAV_TOP - navRest) * navP).toFixed(1)}px, 0)`;
    }
    if (routeMap && routePath) {
      const rect = routeMap.getBoundingClientRect();
      const progress = clamp((window.innerHeight * 0.78 - rect.top) / (rect.height + window.innerHeight * 0.18), 0, 1);
      routeMap.style.setProperty('--route-progress', progress.toFixed(4));
      routeNodes.forEach((node, index) => {
        const nodeProgress = routeNodes.length <= 1 ? 1 : index / (routeNodes.length - 1);
        node.classList.toggle('is-passed', progress > nodeProgress + 0.08);
        node.classList.toggle('is-active', Math.abs(progress - nodeProgress) <= 0.12);
      });
    }
    updateActiveNav();
  }
  function requestMotion() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateMotion);
  }
  window.addEventListener('scroll', requestMotion, { passive: true });
  // 侧栏位置依赖视口高度,窗口尺寸变化时也要重算
  window.addEventListener('resize', requestMotion, { passive: true });
  updateMotion();

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.18 });
  document.querySelectorAll('.article, .archive-image, .event-card, .entity-row, .entry').forEach(el => revealObserver.observe(el));

  setupArchiveRail();
}

if (detailMode) renderDetail();
else renderHome();
