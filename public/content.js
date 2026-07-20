window.__siteContent = {
  galaxy: {
    title: 'Galactic Core',
    description: 'A real-time WebGL galaxy field with deep-space particles and gravitational motion.',
    brand: 'Galactic Core',
    brandStyle: {
      selector: '.brand, .hud__status, .hud__bottom',
      css: {
        'font-family': "'Inter', system-ui, -apple-system, sans-serif",
        'font-size': '13px',
        'font-weight': '500',
        'line-height': '1',
        'letter-spacing': '0.02em'
      }
    },
    status: 'Realtime WebGL',
    eyebrow: 'Deep-space gravitational field',
    eyebrowStyle: {
      selector: '.eyebrow',
      css: {
        'font-family': "'Inter', system-ui, -apple-system, sans-serif",
        'font-size': '11px',
        'font-weight': '600',
        'line-height': '1',
        'letter-spacing': '0.08em',
        'text-transform': 'uppercase'
      }
    },
    heroTitle: 'A galaxy wakes.',
    heroTitleStyle: {
      selector: '#hero-title',
      css: {
        'font-family': "'Inter', system-ui, -apple-system, sans-serif",
        'font-size': 'clamp(46px, 9vw, 112px)',
        'font-weight': '400',
        'line-height': '0.88',
        'letter-spacing': '0'
      }
    },
    heroCopy: 'A cinematic star system where dust lanes, stellar cores, pointer gravity, and camera drift share one slow orbital pulse.',
    heroCopyStyle: {
      selector: '.hero-panel__copy',
      css: {
        'font-family': "'Inter', system-ui, -apple-system, sans-serif",
        'font-size': 'clamp(14px, 1.35vw, 17px)',
        'font-weight': '400',
        'line-height': '1.55',
        'letter-spacing': '0'
      }
    },
    triggers: [
      { label: 'Drag gravity', nextScene: 'vex' },
      { label: 'Ignite the core', nextScene: 'asme' },
      { label: 'Compress spacetime', nextScene: 'bloom' }
    ]
  },
  apechain: {
    pageTitle: '城瘾 | 精选主题活动',

    header: {
      homeTitle: '城瘾首页',
      mobileMenuLabel: 'Open menu',
      nav: ['探索', 'IP', '构建', '联系我们'],
      navStyle: {
        selector: '.Header-nav button',
        css: {
          'font-family': "'DM Mono', monospace",
          'font-size': '20px',
          'font-weight': '500',
          'line-height': '1',
          'letter-spacing': '0.1em',
          'text-transform': 'uppercase'
        }
      },
      sideButtons: ['分享城瘾', '小红书', '微信社群']
    },

    hero: {
      name: '上海夜行侦探局',
      nameStyle: {
        selector: '.Hero-app-name h2 span',
        css: {
          'font-family': "'Bebas Neue', 'Oswald', sans-serif",
          'font-size': '56px',
          'font-weight': '400',
          'line-height': '0.785',
          'letter-spacing': '0',
          'text-transform': 'uppercase'
        },
        media: {
          '(min-width: 768px)': {
            'font-size': '80px'
          }
        }
      },
      category: '主题活动',
      categoryStyle: {
        selector: '.Hero-hot-badge .font-sans',
        css: {
          'font-family': "'DM Sans', system-ui, sans-serif",
          'font-size': '16px',
          'font-weight': '400',
          'line-height': '1.3',
          'letter-spacing': '0.05em',
          'text-transform': 'uppercase'
        }
      },
      hotBadge: 'HOT',
      hotBadgeStyle: {
        selector: '.Hero-hot-badge .font-manuka',
        css: {
          'font-family': "'Bebas Neue', 'Oswald', sans-serif",
          'font-size': '32px',
          'font-weight': '400',
          'line-height': '0.785',
          'letter-spacing': '0.02em',
          'text-transform': 'uppercase'
        }
      },
      description: '3 小时夜行路线，沿静安到外滩收集线索、到点解锁、协作结案。',
      descriptionStyle: {
        selector: '.Hero-description p span',
        css: {
          'font-family': "'DM Sans', system-ui, sans-serif",
          'font-size': '12px',
          'font-weight': '400',
          'line-height': '1.3',
          'letter-spacing': '0.24px',
          'text-transform': 'uppercase'
        }
      },
      button: '查看活动',
      buttonStyle: {
        selector: '.UIBtn',
        css: {
          'font-family': "'DM Mono', monospace",
          'font-size': '12px',
          'font-weight': '500',
          'line-height': '1',
          'letter-spacing': '0.1em',
          'text-transform': 'uppercase'
        }
      },
      seeAll: '查看全部活动',
      seeAllStyle: {
        selector: '.UILink',
        css: {
          'font-family': "'DM Mono', monospace",
          'font-size': '12px',
          'font-weight': '500',
          'line-height': '1.12',
          'letter-spacing': '0.1em',
          'text-transform': 'uppercase'
        }
      }
    },

    appsData: [
      {
        name: '上海夜行侦探局',
        category: '可报名 · 3小时',
        description: '静安到外滩的夜行侦探路线。收集线索、到点解锁、协作结案。',
        image: '/assets/case-detective/shanghai-native-quarter.jpg',
        thumb: '/assets/case-detective/detective-diary-page.jpg',
        link: '/ip.html?project=geisai',
        color: '#A281FF'
      },
      {
        name: '南京路城市寻踪',
        category: 'Citywalk · 90分钟',
        description: '用路线、照片和隐藏点位重新打开南京路，适合首次体验城瘾。',
        image: '/assets/case-citywalk/nanjing-road-pedestrians.jpg',
        thumb: '/assets/case-citywalk/nanjing-pedestrian-evening.jpg',
        link: '/ip.html',
        color: '#EB8280'
      },
      {
        name: '书店线索局',
        category: '门店节点 · 45分钟',
        description: '书店、纸条、暗号和拍照核验组成一条轻量剧情任务。',
        image: '/assets/case-game/chapter-04-bookshop-clue.jpg',
        thumb: '/assets/case-game/chapter-02-photo-check.jpg',
        link: '/build.html#merchant',
        color: '#EBBF9A'
      },
      {
        name: '外滩黄昏任务线',
        category: '限时路线 · 黄昏',
        description: '从人民广场走到外滩，在光线变化里完成拍照、定位和章节解锁。',
        image: '/assets/case-citywalk/bund-walk.jpg',
        thumb: '/assets/case-citywalk/peoples-square-night.jpg',
        link: '/ip.html',
        color: '#89D0FF'
      },
      {
        name: '商圈隐藏菜单',
        category: '商家联动 · 内测',
        description: '多家门店成为任务节点，扫码核销后解锁隐藏权益和下一站。',
        image: '/assets/case-citywalk/nanjing-side-street.jpg',
        thumb: '/assets/case-citywalk/fuzhou-henan-road.jpg',
        link: '/build.html#merchant',
        color: '#0054FA'
      },
      {
        name: '小红书城市章节',
        category: '内容活动 · 复访',
        description: '把一次路线沉淀成章节封面、攻略笔记和城市足迹图鉴。',
        image: '/assets/case-xhs/xhs-cover.jpg',
        thumb: '/assets/case-xhs/xhs-chapter-03.jpg',
        link: '/ip.html?project=airforce',
        color: '#00A7FA'
      }
    ],

    spotlight: {
      title: '让你和城市成为乐园的一部分',
      titleStyle: {
        selector: '.Spotlight-text h2',
        css: {
          'font-family': "'Bebas Neue', 'Oswald', sans-serif",
          'font-size': '30px',
          'font-weight': '400',
          'line-height': '0.785',
          'letter-spacing': '0',
          'text-transform': 'uppercase'
        },
        media: {
          '(min-width: 768px)': {
            'font-size': '80px'
          }
        }
      },
      paragraphs: [
        '给玩家： 扫门店接任务、扫码触发剧情、拍照打卡解锁奖励。可以一个人探案解谜，也可以组队打阵营战、抢悬赏、竞速刷榜。走错路？系统推送隐藏任务。夜晚？解锁专属 AR 标记。',
        '给商家： 发布进店小任务、配置折扣券和奖品池、生成专属 QR 码贴门口。后台看引流数据、回头客统计、活动效果。同街区商户可组建联盟，发跨店通卡，共享客流。',
        '简单、快速、有趣的新玩法 = 重新组合插件 + 改参数，不需要从零开发。\u{1F98D}\u2728'
      ],
      paragraphStyle: {
        selector: '.Spotlight-text .desc',
        css: {
          'font-family': "'DM Sans', system-ui, sans-serif",
          'font-size': '14px',
          'font-weight': '400',
          'line-height': '1.3',
          'letter-spacing': '0.24px'
        },
        media: {
          '(min-width: 768px)': {
            'font-size': '16px',
            'line-height': '1.3'
          }
        }
      },
      launch: '立即查看',
      about: '了解玩法',
      featured: {
        name: '商圈隐藏菜单',
        nameStyle: {
          selector: '.Spotlight-featured-card .card-text h3',
          css: {
            'font-family': "'Bebas Neue', 'Oswald', sans-serif",
            'font-size': '32px',
            'font-weight': '400',
            'line-height': '1',
            'letter-spacing': '0',
            'text-transform': 'uppercase'
          },
          media: {
            '(min-width: 768px)': {
              'font-size': '48px'
            }
          }
        },
        description: '门店任务、扫码核销和隐藏权益组成的线下主题活动。',
        descriptionStyle: {
          selector: '.Spotlight-featured-card .card-text p',
          css: {
            'font-family': "'DM Mono', monospace",
            'font-size': '12px',
            'font-weight': '400',
            'line-height': '14px',
            'letter-spacing': '0.05em',
            'text-transform': 'uppercase'
          }
        }
      }
    },

    appsSection: {
      title: '主题活动',
      titleStyle: {
        selector: '.SectionGridCarousel .section-title h2',
        css: {
          'font-family': "'Bebas Neue', 'Oswald', sans-serif",
          'font-size': '56px',
          'font-weight': '400',
          'line-height': '0.785',
          'letter-spacing': '0',
          'text-transform': 'uppercase'
        },
        media: {
          '(min-width: 768px)': {
            'font-size': '120px'
          }
        }
      },
      seeAll: '查看全部活动',
      browseAll: '浏览活动库',
      cardCategoryStyle: {
        selector: '.pill',
        css: {
          'font-family': "'DM Mono', monospace",
          'font-size': '12px',
          'font-weight': '500',
          'line-height': '1',
          'letter-spacing': '0',
          'text-transform': 'uppercase'
        }
      },
      cardNameStyle: {
        selector: '.AppCard-name',
        css: {
          'font-family': "'Bebas Neue', 'Oswald', sans-serif",
          'font-size': '32px',
          'font-weight': '400',
          'line-height': '1',
          'letter-spacing': '0',
          'text-transform': 'uppercase'
        },
        media: {
          '(min-width: 1024px)': {
            'font-size': '48px',
            'line-height': '48px'
          }
        }
      },
      cardDescriptionStyle: {
        selector: '.AppCard-desc',
        css: {
          'font-family': "'DM Mono', monospace",
          'font-size': '12px',
          'font-weight': '400',
          'line-height': '14px',
          'letter-spacing': '0.05em',
          'text-transform': 'uppercase'
        }
      },
      cards: [
        { name: '上海夜行侦探局', category: '侦探路线', description: '静安到外滩，3 小时线索协作与结案。', image: '/assets/case-detective/shanghai-native-quarter.jpg', link: '/ip.html?project=geisai' },
        { name: '南京路城市寻踪', category: 'Citywalk', description: '用隐藏点位重新打开南京路。', image: '/assets/case-citywalk/nanjing-road-pedestrians.jpg', link: '/ip.html' },
        { name: '书店线索局', category: '门店任务', description: '书店纸条、暗号和拍照核验。', image: '/assets/case-game/chapter-04-bookshop-clue.jpg', link: '/build.html#merchant' },
        { name: '外滩黄昏任务线', category: '限时路线', description: '黄昏出发，沿途完成章节解锁。', image: '/assets/case-citywalk/bund-walk.jpg', link: '/ip.html' },
        { name: '商圈隐藏菜单', category: '商家联动', description: '多门店扫码核销，解锁隐藏权益。', image: '/assets/case-citywalk/nanjing-side-street.jpg', link: '/build.html#merchant' },
        { name: '小红书城市章节', category: '内容复访', description: '路线结束后沉淀攻略和章节封面。', image: '/assets/case-xhs/xhs-cover.jpg', link: '/ip.html?project=airforce' },
        { name: '人民广场速通', category: '竞速挑战', description: '限时完成节点，结算速度与完整度。', image: '/assets/case-citywalk/peoples-square-night.jpg', link: '/ip.html' },
        { name: '张园暗号夜', category: '夜游剧情', description: '到点获得口令，错过时间进入支线。', image: '/assets/case-game/chapter-01-lane-walk.jpg', link: '/ip.html?project=forging' },
        { name: '咖啡店接头点', category: '到店任务', description: '门店成为剧情交接与奖励核销点。', image: '/assets/case-citywalk/fuzhou-henan-road.jpg', link: '/build.html#merchant' },
        { name: '城市图鉴日', category: '收集活动', description: '完成路线后点亮地点、徽章和回忆。', image: '/assets/case-xhs/xhs-chapter-03.jpg', link: '/ip.html' },
        { name: '主理人试跑局', category: '俱乐部活动', description: '小队试跑路线，现场调整任务节奏。', image: '/assets/case-citywalk/shanghai-crosswalk-people.jpg', link: '/build.html#club' },
        { name: '老街证物袋', category: '线索收集', description: '纸本证物与 App 节点同步推进。', image: '/assets/case-detective/detective-diary-page.jpg', link: '/ip.html?project=geisai' },
        { name: '夜市阵营战', category: '组队对抗', description: '不同队伍争夺节点和隐藏积分。', image: '/assets/case-citywalk/shanghai-night-street.jpg', link: '/ip.html?project=forging' },
        { name: '周末城市盲盒', category: '随机事件', description: '报名后才揭晓路线主题和第一站。', image: '/assets/case-citywalk-ref/cropped/IMG_9554-crop.jpg', link: '/ip.html' },
        { name: '品牌联名路线', category: '联名活动', description: '把品牌内容做成可抵达的城市章节。', image: '/assets/case-xhs/xhs-chapter-01.jpg', link: '/build.html' },
        { name: '毕业季足迹线', category: '纪念路线', description: '用地图和任务保存一段城市记忆。', image: '/assets/case-citywalk-ref/cropped/IMG_9547-crop.jpg', link: '/ip.html?project=airforce' }
      ]
    },

    discover: {
      labels: [
        '主题活动',
        '城市任务',
        '侦探路线',
        '门店节点',
        '组队挑战',
        '内容章节',
        '活动报名',
        '商家联动',
        '俱乐部局',
        '路线图鉴',
        '隐藏权益',
        '城市复访'
      ],
      labelStyle: {
        selector: '.Discover-label',
        css: {
          'font-family': "'Bebas Neue', 'Oswald', sans-serif",
          'font-size': '56px',
          'font-weight': '400',
          'line-height': '0.785',
          'letter-spacing': '0',
          'text-transform': 'uppercase'
        },
        media: {
          '(min-width: 768px)': {
            'font-size': '120px'
          },
          '(min-width: 1024px)': {
            'font-size': 'clamp(120px, calc(120 / 900 * 100vh), 200px)'
          }
        }
      }
    },

    footer: {
      brand: '城瘾',
      brandStyle: {
        selector: '.Footer-big-word',
        css: {
          'font-family': "'Bebas Neue', 'Oswald', sans-serif",
          'font-size': 'clamp(120px, 26vw, 420px)',
          'font-weight': '400',
          'line-height': '0.78',
          'letter-spacing': '0',
          'text-transform': 'uppercase'
        }
      },
      copyright: '© 2026 城瘾',
      legal: ['服务条款', '隐私政策'],
      legalStyle: {
        selector: '.Footer-bottom-inner',
        css: {
          'font-family': "'DM Mono', monospace",
          'font-size': '12px',
          'font-weight': '400',
          'line-height': '14px',
          'letter-spacing': '0.05em',
          'text-transform': 'uppercase'
        }
      },
      columnTitleStyle: {
        selector: '.Footer-col h4',
        css: {
          'font-family': "'Bebas Neue', 'Oswald', sans-serif",
          'font-size': '26px',
          'font-weight': '400',
          'line-height': '1',
          'letter-spacing': '0',
          'text-transform': 'uppercase'
        }
      },
      columnLinkStyle: {
        selector: '.Footer-col li a',
        css: {
          'font-family': "'DM Mono', monospace",
          'font-size': '12px',
          'font-weight': '400',
          'line-height': '14px',
          'letter-spacing': '0.05em',
          'text-transform': 'uppercase'
        }
      },
      columns: [
        {
          title: '玩家入口',
          links: ['主题活动', '城市路线', '活动报名', '路线图鉴']
        },
        {
          title: '合作入口',
          links: ['商家联动', '俱乐部局', '品牌联名', '主理人试跑']
        },
        {
          title: '内容资产',
          links: ['侦探路线', '城市章节', '小红书封面', '隐藏权益']
        }
      ]
    }
  }
};

(function() {
  function getValue(path) {
    return path.split('.').reduce(function(acc, key) {
      return acc && acc[key] !== undefined ? acc[key] : undefined;
    }, window.__siteContent);
  }

  function setHTML(selector, value, root) {
    const el = (root || document).querySelector(selector);
    if (el && value != null) el.innerHTML = String(value);
  }

  function setText(selector, value, root) {
    const el = (root || document).querySelector(selector);
    if (el && value != null) el.textContent = String(value);
  }

  function setLabelPair(selector, value) {
    document.querySelectorAll(selector).forEach(function(el) {
      el.textContent = String(value);
    });
  }

  function cssBlock(selector, css) {
    if (!selector || !css) return '';
    const declarations = Object.keys(css).map(function(prop) {
      return '  ' + prop + ': ' + css[prop] + ';';
    }).join('\n');
    return selector + ' {\n' + declarations + '\n}';
  }

  function injectStyleRules(id, rules) {
    const filtered = (rules || []).filter(Boolean);
    if (!filtered.length) return;

    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const blocks = [];
    filtered.forEach(function(rule) {
      const base = cssBlock(rule.selector, rule.css);
      if (base) blocks.push(base);

      if (rule.media) {
        Object.keys(rule.media).forEach(function(query) {
          const mediaBlock = cssBlock(rule.selector, rule.media[query]);
          if (mediaBlock) {
            blocks.push('@media ' + query + ' {\n' + mediaBlock + '\n}');
          }
        });
      }
    });

    if (!blocks.length) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = blocks.join('\n\n');
    document.head.appendChild(style);
  }

  function galaxyStyleRules(content) {
    return [
      content.brandStyle,
      content.eyebrowStyle,
      content.heroTitleStyle,
      content.heroCopyStyle
    ];
  }

  function apechainStyleRules(content) {
    return [
      content.header.navStyle,
      content.hero.nameStyle,
      content.hero.categoryStyle,
      content.hero.hotBadgeStyle,
      content.hero.descriptionStyle,
      content.hero.buttonStyle,
      content.hero.seeAllStyle,
      content.spotlight.titleStyle,
      content.spotlight.paragraphStyle,
      content.spotlight.featured.nameStyle,
      content.spotlight.featured.descriptionStyle,
      content.appsSection.titleStyle,
      content.appsSection.cardCategoryStyle,
      content.appsSection.cardNameStyle,
      content.appsSection.cardDescriptionStyle,
      content.discover.labelStyle,
      content.footer.brandStyle,
      content.footer.legalStyle,
      content.footer.columnTitleStyle,
      content.footer.columnLinkStyle
    ];
  }

  function hydrateDataKeys() {
    document.querySelectorAll('[data-content-key]').forEach(function(el) {
      const value = getValue(el.getAttribute('data-content-key'));
      if (value == null || typeof value === 'object') return;

      const tag = el.tagName;
      if (tag === 'META') {
        el.setAttribute('content', String(value));
        return;
      }

      if (tag === 'TITLE' || tag === 'BUTTON' || tag === 'SPAN' || tag === 'P' || tag === 'H1' || tag === 'H2' || tag === 'A' || tag === 'DIV') {
        el.innerHTML = String(value);
      }
    });
  }

  function hydrateApechainHome() {
    const content = window.__siteContent && window.__siteContent.apechain;
    if (!content || !document.querySelector('.Hero-content-grid')) return;

    injectStyleRules('site-content-apechain-styles', apechainStyleRules(content));

    if (content.pageTitle) document.title = content.pageTitle;

    const hamburger = document.querySelector('.hamburger-btn');
    if (hamburger && content.header.mobileMenuLabel) {
      hamburger.setAttribute('aria-label', content.header.mobileMenuLabel);
    }
    document.querySelectorAll('.mobile-logo, .Header-logo').forEach(function(link) {
      if (content.header.homeTitle) link.setAttribute('title', content.header.homeTitle);
    });
    document.querySelectorAll('.Header-nav button').forEach(function(button, index) {
      if (content.header.nav[index] != null) button.textContent = content.header.nav[index];
    });
    document.querySelectorAll('.Hero-side-buttons .UIBtnIcon').forEach(function(button, index) {
      if (content.header.sideButtons[index] != null) button.setAttribute('aria-label', content.header.sideButtons[index]);
    });
    setText('.Hero-hot-badge .font-manuka', content.hero.hotBadge);
    setLabelPair('.Hero-description .UIBtn .label-inner', content.hero.button);
    setLabelPair('.Hero-right-col .UILink .UILink-inner span', content.hero.seeAll);

    setHTML('.Spotlight-text h2', content.spotlight.title);
    document.querySelectorAll('.Spotlight-text .desc p').forEach(function(el, index) {
      if (content.spotlight.paragraphs[index] != null) {
        el.innerHTML = content.spotlight.paragraphs[index];
      }
    });
    setLabelPair('.Spotlight-cta .UIBtn.primary .label-inner', content.spotlight.launch);
    setLabelPair('.Spotlight-cta .UIBtn.secondary .label-inner', content.spotlight.about);
    setText('.Spotlight-featured-card .card-text h3', content.spotlight.featured.name);
    setText('.Spotlight-featured-card .card-text p', content.spotlight.featured.description);

    setText('.SectionGridCarousel .section-title h2', content.appsSection.title);
    setLabelPair('.SectionGridCarousel .section-see-all .UILink-inner span', content.appsSection.seeAll);
    setLabelPair('.SectionDiscoverApps .UIBtn.secondary .label-inner', content.appsSection.browseAll);

    document.querySelectorAll('.SimpleSlider .AppCard').forEach(function(card, index) {
      const app = content.appsSection.cards[index];
      if (!app) return;
      setText('.pill', app.category, card);
      setText('.AppCard-name', app.name, card);
      setText('.AppCard-desc', app.description, card);
      const img = card.querySelector('img');
      if (img) {
        if (app.image) img.setAttribute('src', app.image);
        img.setAttribute('alt', app.name);
      }
      if (app.link) card.setAttribute('href', app.link);
    });

    document.querySelectorAll('.Discover-label').forEach(function(label, index) {
      const value = content.discover.labels[index];
      if (value == null) return;
      label.querySelectorAll('.label__inner').forEach(function(el) {
        el.textContent = value;
      });
    });

    document.querySelectorAll('.Footer-col').forEach(function(column, columnIndex) {
      const data = content.footer.columns[columnIndex];
      if (!data) return;
      setText('h4', data.title, column);
      column.querySelectorAll('li a').forEach(function(link, linkIndex) {
        if (data.links[linkIndex] != null) link.textContent = data.links[linkIndex];
      });
    });
    setText('.Footer-big-word', content.footer.brand);
    setText('.Footer-bottom-inner > span', content.footer.copyright);
    document.querySelectorAll('.Footer-bottom nav a').forEach(function(link, index) {
      if (content.footer.legal[index] != null) link.textContent = content.footer.legal[index];
    });
  }

  function hydrateGalaxyHome() {
    const content = window.__siteContent && window.__siteContent.galaxy;
    if (!content || !document.querySelector('.hud')) return;

    injectStyleRules('site-content-galaxy-styles', galaxyStyleRules(content));
  }

  function hydrate() {
    hydrateDataKeys();
    hydrateGalaxyHome();
    hydrateApechainHome();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrate, { once: true });
  } else {
    hydrate();
  }
})();
