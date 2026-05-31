import { setupVexAtmosphere } from './vexAtmosphere.js';
import { setupBloomEnvironment } from './bloomEnvironment.js';


const modeContent = {
  player: {
    aboutLabel: '玩家版',
    aboutTitle: '城市不只是用来逛的。<br />它可以被<em>组队、挑战、解锁</em>，也可以赢取奖励。',
    featuredLabel: '主题玩法',
    featuredBody: '选择一个城市副本，开始一局真实世界的游戏。寻宝、解谜、夜游、组队挑战、限时活动、商圈副本，每一种主题都会把熟悉的街区变成新的地图。',
    featuredButton: '开始探索',
    featuredTags: '寻宝|解谜|组队|现金奖励',
    featuredMetricLabel: '今日任务',
    featuredMetricValue: '04',
    featuredPanelTitle: 'City Quest HUD',
    featuredPanelBody: '选择主题，锁定路线，进入真实城市副本。',
    philosophyTitle: '一个人可以玩，<em>一群人更好玩。</em>',
    philosophyOneLabel: '单人进入',
    philosophyOneBody: '你可以独自选择一个主题，在城市里寻找线索、完成打卡、解锁隐藏点位。每一次移动都不只是路过，而是在推进游戏进度。',
    philosophyTwoLabel: '组队挑战',
    philosophyTwoBody: '也可以邀请朋友组队，协作、竞速、对抗、冲榜。公园、地标、展览、市集和门店，都可能成为互动现场。',
    chapter1Kicker: 'Chapter 01 / Choose',
    chapter1Title: '选择你的主题。',
    chapter1Body: '从悬疑解谜到城市寻宝，从夜游路线到限时挑战。打开城瘾，选择你今天想进入的城市主题。',
    chapter1Meta: '寻宝 / 解谜 / 夜游 / 组队 / 限时活动',
    stack1Chips: '主题雷达|难度标签|城市路线',
    stack2Chips: '好友组队|阵营挑战|实时排行榜',
    stack3Chips: '线索扫描|拍照验证|现场任务',
    stack4Chips: '城市勋章|红包奖励|隐藏权益',
    chapter2Kicker: 'Chapter 02 / Team Up',
    chapter2Title: '单人出发，或者组队开局。',
    chapter2Body: '你可以一个人完成挑战，也可以邀请朋友加入。合作、竞速、阵营、排行榜，让一次出门变成一局真正的城市游戏。',
    chapter3RailTop: 'Play',
    chapter3RailBottom: 'City',
    chapter3Kicker: 'Chapter 03 / Play The City',
    chapter3Title: '在真实城市里互动。',
    chapter3Body: '街区、地标、公园、展览、市集、商圈和门店都可能成为游戏节点。寻找线索、拍照验证、答题解锁，或完成一场协作挑战。',
    panel1: '寻找',
    panel2: '解锁',
    panel3: '挑战',
    panel1Meta: '线索扫描 / 城市路径',
    panel2Meta: '拍照验证 / 答题解锁',
    panel3Meta: '协作挑战 / 冲榜奖励',
    chapter4Kicker: 'Chapter 04 / Reward',
    chapter4Title: '完成挑战，赢取奖励。',
    chapter4Body: '获得城市勋章、等级经验、排行榜积分，也可能赢取红包、现金奖励、隐藏权益，解锁下一场玩法入口。',
    finaleItems: '城市勋章|排行榜积分|现金奖励|隐藏权益',
    finaleLoop: '选择主题 → 组队开局 → 城市互动 → 奖励结算'
  },
  merchant: {
    aboutLabel: '商家版',
    aboutTitle: '从等待客流，到<em>进入玩法。</em><br />让门店和线下空间成为城市游戏的一部分。',
    featuredLabel: '玩法接入',
    featuredBody: '把门店变成玩家愿意主动到达的节点。餐饮、零售、展览、市集、景区、商圈活动，都可以成为挑战点、奖励点、集合点、剧情点，或一次主题玩法的赞助方。',
    featuredButton: '了解接入方式',
    featuredTags: '接入|匹配|互动|数据回流',
    featuredMetricLabel: '接入流程',
    featuredMetricValue: '04',
    featuredPanelTitle: 'Merchant Access Panel',
    featuredPanelBody: '把空间、奖励和互动动作配置成可验证的城市节点。',
    philosophyTitle: '玩家不是被广告打断，<em>而是带着目的到来。</em>',
    philosophyOneLabel: '成为互动节点',
    philosophyOneBody: '商家可以提供线索、奖励、验证动作、隐藏菜单、专属优惠或现场互动。玩家不是被广告拉来，而是在完成玩法时自然进入你的空间。',
    philosophyTwoLabel: '沉淀真实数据',
    philosophyTwoBody: '系统可以记录到访、互动、核销、完成率、复访和转化表现。每一次活动结束，都能为下一次玩法优化提供依据。',
    chapter1Kicker: 'Chapter 01 / Join',
    chapter1Title: '接入你的空间。',
    chapter1Body: '提交门店信息、活动目标、奖励资源和可承载的互动方式。城瘾会把你的空间转化为可参与、可验证的城市游戏节点。',
    chapter1Meta: '门店 / 展览 / 市集 / 景区 / 商圈',
    stack1Chips: '空间资料|承载动作|奖励资源',
    stack2Chips: '主题匹配|人群筛选|活动排期',
    stack3Chips: '扫码口令|到店验证|现场互动',
    stack4Chips: '到访数据|核销转化|复访回流',
    chapter2Kicker: 'Chapter 02 / Match',
    chapter2Title: '匹配合适的主题玩法。',
    chapter2Body: '你的空间可以被放入寻宝、解谜、组队挑战、限时活动或商圈副本中。不是把所有人都推过来，而是匹配给更可能参与的人。',
    chapter3RailTop: 'Local',
    chapter3RailBottom: 'Growth',
    chapter3Kicker: 'Chapter 03 / Activate',
    chapter3Title: '让玩家到场互动。',
    chapter3Body: '玩家可以通过扫码、口令、拍照、答题、领取奖励、完成挑战或与店员互动来完成节点。到店不再只是路过，而是游戏进程的一部分。',
    panel1: '到访',
    panel2: '互动',
    panel3: '核销',
    panel1Meta: '路线分发 / 到店验证',
    panel2Meta: '扫码口令 / 现场任务',
    panel3Meta: '奖励核销 / 转化记录',
    chapter4Kicker: 'Chapter 04 / Grow',
    chapter4Title: '获得客流、转化和复访。',
    chapter4Body: '城瘾帮助商家看到真实到访、互动完成率、奖励核销、消费转化和复访表现。一次活动结束后，下一次分发可以更精准。',
    finaleItems: '到访|互动|核销|复访',
    finaleLoop: '接入空间 → 匹配玩法 → 到场互动 → 数据回流'
  }
};

const videos = {
  hero: '/videos/hero.mp4',
  featured: '/videos/hero.mp4',
  philosophy: '/videos/hero.mp4',
  service1: '/videos/hero.mp4',
  service2: '/videos/hero.mp4'
};

const marqueeImages = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif'
];

const marqueeRows = [
  [...marqueeImages.slice(0, 11), ...marqueeImages.slice(0, 11), ...marqueeImages.slice(0, 11)],
  [...marqueeImages.slice(11), ...marqueeImages.slice(11), ...marqueeImages.slice(11)]
];

export function mountLanding(root, scheduler) {
  root.innerHTML = `
    <div class="landing-scene asme-scene">
    <section class="asme-hero">
      <video class="asme-hero-video" muted autoplay playsinline preload="auto" src="${videos.hero}"></video>
      <nav class="asme-nav cinematic-nav">
        <div class="liquid-glass nav-pill">
          <div class="nav-left">
            <span class="icon-globe"></span><strong>Asme</strong>
            <div class="nav-links"><a>Features</a><a>Pricing</a><a>About</a></div>
          </div>
          <div class="nav-right"><button>Sign Up</button><button class="liquid-glass login">Login</button></div>
        </div>
      </nav>
      <div class="asme-hero-content">
        <h1>Know it then <em>all</em>.</h1>
        <form class="liquid-glass email-pill"><input placeholder="Enter your email" /><button type="button">→</button></form>
        <p>Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.</p>
        <button class="liquid-glass manifesto cinematic-button">Manifesto</button>
      </div>
      <div class="social-row"><button class="liquid-glass">◎</button><button class="liquid-glass">𝕏</button><button class="liquid-glass">◌</button></div>
    </section>
    <section class="marquee-section" data-marquee-section>
      <div class="marquee-track" data-marquee-row="1"><div class="marquee-inner">${marqueeRows[0].map(marqueeImage).join('')}</div></div>
      <div class="marquee-track" data-marquee-row="2"><div class="marquee-inner">${marqueeRows[1].map(marqueeImage).join('')}</div></div>
    </section>
    <section class="about-section reveal mode-section" data-mode-scope>
      <div class="section-inner">
        <div class="mode-head">
          <p class="label" data-mode-field="aboutLabel">玩家版</p>
          <div class="liquid-glass mode-switch" role="tablist" aria-label="城瘾版本切换">
            <button class="active" type="button" data-mode-toggle="player" role="tab" aria-selected="true">玩家版</button>
            <button type="button" data-mode-toggle="merchant" role="tab" aria-selected="false">商家版</button>
          </div>
        </div>
        <h2 data-mode-field="aboutTitle">城市不只是用来逛的。<br />它可以被<em>挑战、组队、解锁</em>和赢取奖励。</h2>
      </div>
    </section>
    <section class="featured-section reveal"><div class="video-card"><video muted autoplay loop playsinline preload="auto" src="${videos.featured}"></video><div class="video-gradient"></div><div class="featured-copy"><div class="liquid-glass copy-card"><p class="label" data-mode-field="featuredLabel">主题玩法</p><p data-mode-field="featuredBody">选择一个城市副本，开始一局真实世界的游戏。寻宝、解谜、夜游、组队挑战、限时活动、商圈副本，每一种主题都会把熟悉的街区变成新的游戏地图。</p><div class="featured-tags" data-mode-list="featuredTags"><span>寻宝</span><span>解谜</span><span>组队</span><span>现金奖励</span></div></div><div class="featured-side"><div class="liquid-glass featured-access-panel"><span data-mode-field="featuredMetricLabel">今日任务</span><strong data-mode-field="featuredMetricValue">04</strong><p data-mode-field="featuredPanelTitle">City Quest HUD</p><small data-mode-field="featuredPanelBody">选择主题，锁定路线，进入真实城市副本。</small></div><button class="liquid-glass explore" data-mode-field="featuredButton">开始探索</button></div></div></div></section>
    <section class="philosophy-section reveal"><div class="section-inner"><h2 data-mode-field="philosophyTitle">一个人可以玩，<em>一群人更好玩。</em></h2><div class="two-col"><div class="media-round"><video muted autoplay loop playsinline preload="auto" src="${videos.philosophy}"></video></div><div class="text-stack"><article><p class="label" data-mode-field="philosophyOneLabel">单人进入</p><p data-mode-field="philosophyOneBody">你可以独自选择一个主题，在城市里寻找线索、完成打卡、解锁隐藏点位。每一次移动都不只是路过，而是在推进一场游戏。</p></article><span></span><article><p class="label" data-mode-field="philosophyTwoLabel">组队挑战</p><p data-mode-field="philosophyTwoBody">也可以邀请朋友组队，协作、竞速、对抗、冲榜。城市里的公园、地标、展览、市集和门店，都可能成为互动现场。</p></article></div></div></div></section>
    <section class="quest-stack-section reveal" data-stack-section>
      <div class="quest-stack-stage">
        ${stackCard(0, videos.service1, 'chapter1Kicker', 'chapter1Title', 'chapter1Body', '选择你的主题。', '从悬疑解谜到城市寻宝，从夜游路线到限时挑战。打开城瘾，选择你今天想进入的城市主题。', '<span>主题雷达</span><span>难度标签</span><span>城市路线</span>')}
        ${stackCard(1, videos.featured, 'chapter2Kicker', 'chapter2Title', 'chapter2Body', '单人出发，或者组队开局。', '你可以一个人完成挑战，也可以邀请朋友加入。合作、竞速、阵营、排行榜，让一次出门变成一局真正的城市游戏。', '<span>好友组队</span><span>阵营挑战</span><span>实时排行榜</span>')}
        ${stackCard(2, videos.philosophy, 'chapter3Kicker', 'chapter3Title', 'chapter3Body', '在真实城市里互动。', '街区、地标、公园、展览、市集、商圈和门店都可能成为游戏节点。寻找线索、拍照验证、答题解锁，或完成一场协作挑战。', '<span>线索扫描</span><span>拍照验证</span><span>现场任务</span>')}
        ${stackCard(3, videos.service2, 'chapter4Kicker', 'chapter4Title', 'chapter4Body', '完成挑战，赢取奖励。', '获得城市勋章、等级经验、排行榜积分，也可能赢取红包、现金奖励、隐藏权益，解锁下一场玩法入口。', '<span>城市勋章</span><span>红包奖励</span><span>隐藏权益</span>')}
      </div>
      <div class="quest-stack-loop liquid-glass" data-mode-field="finaleLoop">选择主题 → 组队开局 → 城市互动 → 奖励结算</div>
    </section>
    <section class="services-section reveal"><div class="section-inner"><div class="services-head"><h2>What we do</h2><p>Our services</p></div><div class="service-grid">${serviceCard(videos.service1, 'Strategy', 'Research & Insight', 'We dig deep into data, culture, and human behavior to surface the insights that drive meaningful, lasting change.')}${serviceCard(videos.service2, 'Craft', 'Design & Execution', 'From concept to launch, we obsess over every detail to deliver experiences that feel effortless and look extraordinary.')}</div></div></section>
    </div>
    <section class="landing-scene vex-scene">
      <canvas class="vex-realtime" aria-label="Realtime cinematic city atmosphere"></canvas>
      <nav class="vex-nav cinematic-nav"><div class="liquid-glass vex-nav-bar"><strong>VEX</strong><div><a>Story</a><a>Investing</a><a>Building</a><a>Advisory</a></div><button class="cinematic-button">Start a Chat</button></div></nav>
      <div class="vex-content">
        <div class="vex-grid">
          <div class="vex-main">
            <p class="label">Realtime Venture Field</p>
            <h1 data-animated-heading></h1>
            <p class="vex-sub">We back visionaries and craft ventures that define what comes next.</p>
            <div class="vex-buttons"><button class="cinematic-button">Start a Chat</button><button class="liquid-glass cinematic-button">Explore Now</button></div>
          </div>
          <div class="vex-tag"><div class="liquid-glass cinematic-panel"><span>01</span><strong>Investing. Building. Advisory.</strong><p>Three operating modes orbiting one calm strategic core.</p></div></div>
        </div>
      </div>
    </section>
    <section class="landing-scene bloom-scene">
      <canvas class="bloom-bg" aria-hidden="true"></canvas>
      <div class="bloom-layout">
        <div class="bloom-left">
          <div class="liquid-glass-strong bloom-glass-panel"></div>
          <nav class="bloom-nav">
            <div class="bloom-logo">${bloomMark(32)}<strong>bloom</strong></div>
            <button class="liquid-glass bloom-menu cinematic-button">${icon('menu')}<span>Menu</span></button>
          </nav>
          <div class="bloom-center">
            <p class="label">Spatial Generative System</p>
            <h1>Innovating the <em>spirit of bloom AI</em></h1>
            <button class="liquid-glass-strong bloom-cta cinematic-button"><span>Explore Now</span><i>${icon('download')}</i></button>
            <div class="bloom-pills">
              <span class="liquid-glass">Artistic Gallery</span>
              <span class="liquid-glass">AI Generation</span>
              <span class="liquid-glass">3D Structures</span>
            </div>
          </div>
          <div class="bloom-quote">
            <p>Visionary Design</p>
            <h2>We imagined a <em>realm</em> with no ending.</h2>
            <div><span></span><strong>Marcus Aurelio</strong><span></span></div>
          </div>
        </div>
        <aside class="bloom-right">
          <div class="bloom-topbar">
            <div class="liquid-glass bloom-social"><a>${icon('twitter')}</a><a>${icon('linkedin')}</a><a>${icon('instagram')}</a><i>${icon('arrow')}</i></div>
            <button class="liquid-glass bloom-account cinematic-button">${icon('sparkles')}<span>Account</span></button>
          </div>
          <article class="liquid-glass bloom-community">
            <h3>Enter our ecosystem</h3>
            <p>Explore planetary intelligence, atmospheric systems, and living Earth-scale simulations with AI.</p>
          </article>
          <div class="liquid-glass bloom-feature-shell">
            <div class="bloom-card-grid">
              <article class="liquid-glass bloom-mini-card"><i>${icon('wand')}</i><h3>Processing</h3><p>Prompt-driven simulations unfold through layered planetary intelligence.</p></article>
              <article class="liquid-glass bloom-mini-card"><i>${icon('book')}</i><h3>Growth Archive</h3><p>Save sculptural species, seed forms, and refined plant variations.</p></article>
            </div>
            <article class="liquid-glass bloom-wide-card">
              <div class="bloom-planet-thumb"></div>
              <div><h3>Planetary Atmosphere</h3><p>Observe ocean color, land mass, cloud flow, and luminous atmospheric depth.</p></div>
              <button>+</button>
            </article>
          </div>
        </aside>
      </div>
    </section>
  `;

  setupHeroLoop(root.querySelector('.asme-hero-video'));
  setupModeSwitch(root);
  const revealController = setupReveal(root);
  const stackController = setupStackCards(root);
  const marqueeController = setupMarquee(root);
  setupVexHeading(root.querySelector('[data-animated-heading]'), 'Shaping tomorrow\nwith vision and action.');
  scheduler?.register('landing-observer', revealController);
  scheduler?.register('quest-stack', stackController);
  scheduler?.register('marquee', marqueeController);
  scheduler?.register('vex', createLazyScene(() => setupVexAtmosphere(root.querySelector('.vex-realtime'))));
  scheduler?.register('bloom', createLazyScene(() => setupBloomEnvironment(root.querySelector('.bloom-bg'))));
}


function setupModeSwitch(root) {
  const toggles = [...root.querySelectorAll('[data-mode-toggle]')];
  const fields = [...root.querySelectorAll('[data-mode-field]')];

  const setMode = (mode) => {
    const content = modeContent[mode] || modeContent.player;
    root.dataset.mode = mode;
    const scene = root.querySelector('.asme-scene');
    if (scene) scene.dataset.mode = mode;
    toggles.forEach((button) => {
      const active = button.dataset.modeToggle === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    fields.forEach((node) => {
      const key = node.dataset.modeField;
      if (!key || !(key in content)) return;
      node.innerHTML = content[key];
    });
    root.querySelectorAll('[data-mode-list]').forEach((node) => {
      const key = node.dataset.modeList;
      const value = content[key];
      if (!value) return;
      node.innerHTML = String(value).split('|').map((item) => `<span>${item}</span>`).join('');
    });
  };

  toggles.forEach((button) => {
    button.addEventListener('click', () => setMode(button.dataset.modeToggle));
  });
  setMode('player');
}

function createLazyScene(factory) {
  let instance = null;

  const getInstance = () => {
    if (!instance) {
      instance = factory();
    }
    return instance;
  };

  return {
    resume() {
      getInstance()?.resume?.();
    },
    pause() {
      instance?.pause?.();
    },
    destroy() {
      instance?.destroy?.();
      instance = null;
    }
  };
}

function bloomMark(size) {
  return `<span class="bloom-mark" style="width:${size}px;height:${size}px"><span></span><span></span><span></span></span>`;
}

function icon(name) {
  const paths = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
    sparkles: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z"/><path d="M5 3v4"/><path d="M3 5h4"/><path d="M19 17v4"/><path d="M17 19h4"/>',
    wand: '<path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="m17.8 11.8 1.4 1.4"/><path d="m10.8 4.8-1.4-1.4"/><path d="m17.8 6.2 1.4-1.4"/><path d="m3 21 9-9"/><path d="m12.2 6.2 5.6 5.6"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/>',
    arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    twitter: '<path d="M22 4.01c-.8.55-1.7.95-2.7 1.13A4.4 4.4 0 0 0 12 9.1v1A10.6 10.6 0 0 1 3.6 5.8s-4 9 5 13a11.6 11.6 0 0 1-7 2c9 5 20 0 20-11.5 0-.28-.02-.56-.05-.83A7.7 7.7 0 0 0 22 4.01Z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><path d="M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || ''}</svg>`;
}

function marqueeImage(src) {
  return `<img src="${src}" alt="" loading="lazy" class="marquee-img"/>`;
}

function stackCard(index, src, kickerKey, titleKey, bodyKey, fallbackTitle, fallbackBody, chips) {
  const number = String(index + 1).padStart(2, '0');
  return `<article class="quest-stack-item" data-stack-card style="--stack-index:${index};">
    <div class="quest-card-inner">
      <div class="quest-card-top">
        <div class="quest-card-num-kicker">
          <span class="quest-card-num">${number}</span>
          <p class="quest-card-kicker-text chapter-kicker" data-mode-field="${kickerKey}">Chapter ${number}</p>
        </div>
        <h2 class="quest-card-title" data-mode-field="${titleKey}">${fallbackTitle}</h2>
      </div>
      <div class="quest-card-body">
        <div class="quest-card-media">
          <video muted autoplay loop playsinline preload="metadata" src="${src}"></video>
        </div>
        <div class="quest-card-copy">
          <p class="quest-card-desc" data-mode-field="${bodyKey}">${fallbackBody}</p>
          <div class="quest-card-chips">${chips}</div>
        </div>
      </div>
    </div>
  </article>`;
}

function serviceCard(src, tag, title, desc) {
  return `<article class="liquid-glass service-card"><div class="service-video"><video muted autoplay loop playsinline preload="auto" src="${src}"></video><div></div></div><div class="service-body"><div><p class="label">${tag}</p><span class="liquid-glass arrow">↗</span></div><h3>${title}</h3><p>${desc}</p></div></article>`;
}

function setupVexHeading(node, text) {
  if (!node) return;
  const charDelay = 30;
  const lines = text.split('\n');
  node.innerHTML = lines.map((line, lineIndex) => {
    let offset = 0;
    const words = line.split(' ').map((word) => {
      const chars = [...word].map((char, charIndex) => {
        const delay = 200 + lineIndex * line.length * charDelay + (offset + charIndex) * charDelay;
        return `<span class="vex-char" style="transition-delay:${delay}ms">${char}</span>`;
      }).join('');
      offset += word.length + 1;
      return `<span class="vex-word">${chars}</span>`;
    }).join(' ');
    return `<span class="vex-line">${words}</span>`;
  }).join('');
  setTimeout(() => node.classList.add('animate'), 40);
}

function setupHeroLoop(video) {
  if (!video) return;
  let fading = false;
  const fade = (from, to, duration, done) => {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      video.style.opacity = String(from + (to - from) * p);
      if (p < 1) requestAnimationFrame(step);
      else done?.();
    };
    requestAnimationFrame(step);
  };
  video.style.opacity = '0';
  video.addEventListener('canplay', () => {
    video.play();
    fade(0, 1, 500);
  }, { once: true });
  video.addEventListener('timeupdate', () => {
    if (!video.duration || fading) return;
    if (video.duration - video.currentTime <= 0.55) {
      fading = true;
      fade(Number(video.style.opacity || 1), 0, 500);
    }
  });
  video.addEventListener('ended', () => {
    video.style.opacity = '0';
    setTimeout(() => {
      video.currentTime = 0;
      video.play();
      fading = false;
      fade(0, 1, 500);
    }, 100);
  });
}

function setupStackCards(root) {
  const section = root.querySelector('[data-stack-section]');
  const cards = [...root.querySelectorAll('[data-stack-card]')];
  if (!section || !cards.length) return { destroy() {} };

  let frame = 0;
  let viewportHeight = window.innerHeight;
  const total = cards.length;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const update = () => {
    frame = 0;
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const progress = clamp((viewportHeight - cardCenter) / viewportHeight, 0, 1);
      const scale = 1 - (total - 1 - index) * 0.025 * clamp(progress * 2, 0, 1);
      const opacity = index < total - 1 ? 1 - progress * 0.12 : 1;
      card.style.transform = `scale(${scale.toFixed(4)})`;
      card.style.opacity = opacity.toFixed(3);
    });
  };

  const requestUpdate = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };

  const onResize = () => { viewportHeight = window.innerHeight; requestUpdate(); };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  return {
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', onResize);
    }
  };
}

function setupMarquee(root) {
  const section = root.querySelector('[data-marquee-section]');
  if (!section) return { destroy() {} };
  const row1 = section.querySelector('[data-marquee-row="1"] .marquee-inner');
  const row2 = section.querySelector('[data-marquee-row="2"] .marquee-inner');
  if (!row1 || !row2) return { destroy() {} };

  let frame = 0;

  const update = () => {
    frame = 0;
    const scrollY = document.body.scrollTop || document.documentElement.scrollTop || window.scrollY;
    const rect = section.getBoundingClientRect();
    const sectionTop = scrollY + rect.top;
    const offset = (scrollY - sectionTop + window.innerHeight) * 0.3;
    row1.style.transform = `translateX(${offset - 200}px)`;
    row2.style.transform = `translateX(${-(offset - 200)}px)`;
  };

  const requestUpdate = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', requestUpdate, { passive: true });
  document.body.addEventListener('scroll', requestUpdate, { passive: true });

  return {
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      document.body.removeEventListener('scroll', requestUpdate);
    }
  };
}

function setupReveal(root) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { rootMargin: '-100px' });
  root.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  return {
    destroy() {
      observer.disconnect();
    }
  };
}
