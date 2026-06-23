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
    pageTitle: '城瘾',

    header: {
      homeTitle: 'Home',
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
      sideButtons: ['Share', 'Twitter / X', 'Discord']
    },

    hero: {
      name: 'LBS任务链引擎',
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
      category: '剧情插件',
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
      description: '基于位置服务的任务链引擎，将现实地点与成就系统深度融合',
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
      button: '部署',
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
      seeAll: '查看所有应用',
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
        name: 'LBS任务链引擎',
        category: '剧情插件',
        description: '基于位置服务的任务链引擎，将现实城市地点与成就系统深度融合',
        image: '/assets/placeholder-app.svg',
        thumb: '/assets/placeholder-app.svg',
        link: '/apps/otherside',
        color: '#A281FF'
      },
      {
        name: 'D20判定',
        category: '游戏',
        description: '基于D20规则的游戏判定系统，每次掷骰都有记录判定',
        image: '/assets/placeholder-app.svg',
        thumb: '/assets/placeholder-app.svg',
        link: '/apps/made-by-apes',
        color: '#EB8280'
      },
      {
        name: ' NPC对话引导',
        category: 'AI插件',
        description: '智能NPC对话引导插件，基于大语言模型驱动的角色扮演系统',
        image: '/assets/placeholder-app.svg',
        thumb: '/assets/placeholder-app.svg',
        link: '/apps/opensea',
        color: '#EBBF9A'
      },
      {
        name: '商户分析',
        category: '商户插件',
        description: '商户数据分析平台，实时追踪门店客流与转化',
        image: '/assets/placeholder-app.svg',
        thumb: '/assets/placeholder-app.svg',
        link: '/apps/clutch-market',
        color: '#89D0FF'
      },
      {
        name: 'AR互动',
        category: '交互插件',
        description: '虚实互动的沉浸式 AR 体验',
        image: '/assets/placeholder-app.svg',
        thumb: '/assets/placeholder-app.svg',
        link: '/apps/slab-cash',
        color: '#0054FA'
      },
      {
        name: '收集图鉴',
        category: '成就激励',
        description: '成就收集系统，完成任务解锁专属图鉴与勋章',
        image: '/assets/placeholder-app.svg',
        thumb: '/assets/placeholder-app.svg',
        link: '/apps/成就激励',
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
      launch: '立即体验',
      about: '了解更多',
      featured: {
        name: '应用名称待补',
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
        description: '城市主题竞猜玩法',
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
      title: '城瘾 应用',
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
      seeAll: '查看全部应用',
      browseAll: '浏览全部',
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
        // 游戏类
        { name: '城市任务链', category: '游戏', description: '动态生成的城市探险任务与挑战' },
        { name: '地标收集', category: '游戏', description: '扫码打卡城市地点解锁成就' },
        { name: '商户竞赛', category: '游戏', description: '跨店铺竞速与排行榜系统' },
        { name: '时间竞速', category: '游戏', description: '限时任务与动态事件触发' },
        { name: '阵营战争', category: '游戏', description: '多人社交对抗与领地争夺' },
        { name: '解谜探案', category: '游戏', description: '城市故事线谜题解构系统' },

        // 剧情插件
        { name: 'AI故事引擎', category: '剧情插件', description: '生成式叙事与动态分支剧情' },
        { name: '角色伴侣系统', category: '剧情插件', description: 'AI NPC全程陪伴与实时对话' },
        { name: '城市传奇库', category: '剧情插件', description: '本地化品牌故事与商户背景' },
        { name: '历史寻踪', category: '剧情插件', description: '地点关联的互动内容解锁' },

        // 交互插件
        { name: 'AR扫描引擎', category: '交互插件', description: '虚实互动的沉浸式体验' },
        { name: 'QR即触发', category: '交互插件', description: '门店二维码一键启动任务' },
        { name: '社交互动点', category: '交互插件', description: '多人共享与协作游戏模式' },
        { name: '位置签到卡', category: '交互插件', description: '持久化身份与进度保存' },
        { name: '即时推送系统', category: '交互插件', description: '隐藏任务与时限事件通知' },

        // AI插件
        { name: 'AI导游伴侣', category: 'AI插件', description: '实时路线规划与动态推荐' },
        { name: '任务生成器', category: 'AI插件', description: '基于用户与环境的智能生成' },
        { name: '对话代理', category: 'AI插件', description: '多轮交互的自然语言处理' },
        { name: '智能匹配器', category: 'AI插件', description: '用户偏好与商户的精准适配' },
        { name: '行为分析器', category: 'AI插件', description: '实时学习与系统持续优化' },

        // 成就激励
        { name: '徽章收集簿', category: '成就激励', description: '完成任务解锁专属勋章' },
        { name: '排行榜竞技', category: '成就激励', description: '实时排名与周期结算奖励' },
        { name: '等级进阶', category: '成就激励', description: '持久化身份与角色成长体系' },
        { name: '奖励兑换', category: '成就激励', description: '奖励凭证与商户优惠券整合' }
      ]
    },

    discover: {
      labels: [
        '游戏',
        '剧情插件',
        '交互插件',
        'AI插件',
        '成就激励',
        '游戏',
        '交互插件',
        'AI插件',
        '游戏',
        '剧情插件',
        '成就激励',
        '交互插件'
      ],
      labelStyle: {
        selector: '.Discover-label',
        css: {
          'font-family': "'Bebas Neue', 'Oswald', sans-serif",
          'font-size': '56px',
          'font-weight': '400',
          'line-height': '1',
          'letter-spacing': '0',
          'text-transform': 'uppercase'
        },
        media: {
          '(min-width: 768px)': {
            'font-size': '100px'
          },
          '(min-width: 1024px)': {
            'font-size': 'clamp(100px, calc(100 / 900 * 100vh), 160px)'
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
      legal: ['Terms of Service', 'Privacy Notice'],
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
      columns: []
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
    if (!content || !document.querySelector('#heroSection')) return;

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
      if (content.header.nav[index] === 'IP') {
        button.type = 'button';
        button.onclick = function() {
          window.location.href = './ip.html';
        };
      }
    });
    document.querySelectorAll('.Hero-side-buttons .UIBtnIcon').forEach(function(button, index) {
      if (content.header.sideButtons[index] != null) button.setAttribute('aria-label', content.header.sideButtons[index]);
    });
    setText('.Hero-hot-badge .font-manuka', content.hero.hotBadge);
    setLabelPair('.Hero-description .UIBtn .label-inner', content.hero.button);
    setText('.Hero-right-col .UILink .UILink-inner span', content.hero.seeAll);

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
      if (img) img.setAttribute('alt', app.name);
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
