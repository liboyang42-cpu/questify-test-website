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
    pageTitle: '城瘾 | 城市探索产品能力',

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
      name: '城市主题探索',
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
      category: '小程序核心能力',
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
      description: '围绕真实地点组织主题、章节、任务与打卡，让一次出门拥有明确目标和可记录的过程。',
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
      button: '查看产品能力',
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
      seeAll: '查看全部能力',
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
        name: '城市主题探索',
        category: '主题与章节',
        description: '选择主题和章节，在真实城市中沿路线推进任务与内容。',
        image: '/assets/case-detective/shanghai-native-quarter.jpg',
        thumb: '/assets/case-detective/detective-diary-page.jpg',
        link: '/apechain.html',
        color: '#A281FF'
      },
      {
        name: '实时漫游',
        category: '路线与位置',
        description: '在地图与相机视角中查看附近地点、路线进度和当前任务。',
        image: '/assets/case-citywalk/nanjing-road-pedestrians.jpg',
        thumb: '/assets/case-citywalk/nanjing-pedestrian-evening.jpg',
        link: '/apechain.html',
        color: '#EB8280'
      },
      {
        name: '地点打卡',
        category: '到点确认',
        description: '到达真实地点后完成打卡、互动或内容解锁，进度由服务端结果确认。',
        image: '/assets/case-game/chapter-04-bookshop-clue.jpg',
        thumb: '/assets/case-game/chapter-02-photo-check.jpg',
        link: '/apechain.html',
        color: '#EBBF9A'
      },
      {
        name: '俱乐部活动',
        category: '同好与组织',
        description: '加入或创建俱乐部，围绕同一主题组织成员、活动和城市路线。',
        image: '/assets/case-citywalk/bund-walk.jpg',
        thumb: '/assets/case-citywalk/peoples-square-night.jpg',
        link: '/build.html#club',
        color: '#89D0FF'
      },
      {
        name: '商家合作节点',
        category: '场景与合作',
        description: '商家可以成为路线中的地点、互动或权益节点，与城市主题共同运营。',
        image: '/assets/case-citywalk/nanjing-side-street.jpg',
        thumb: '/assets/case-citywalk/fuzhou-henan-road.jpg',
        link: '/build.html#merchant',
        color: '#0054FA'
      },
      {
        name: '成长与徽章',
        category: '记录与激励',
        description: '记录探索进度、地点与徽章，让每次参与沉淀为可回看的城市足迹。',
        image: '/assets/case-xhs/xhs-cover.jpg',
        thumb: '/assets/case-xhs/xhs-chapter-03.jpg',
        link: '/apechain.html',
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
        '给玩家：选择城市主题，沿真实地点推进章节、任务和打卡；可以独自探索，也可以通过俱乐部和组队能力与同伴共同参与。',
        '给俱乐部与商家：围绕活动、地点和真实空间建立合作，让组织者、成员与城市节点进入同一条体验链路。',
        '官网只展示当前产品范围。具体功能、开放城市、活动状态和权益，以城瘾微信小程序相应页面为准。'
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
        name: '真实城市 · 可参与的主题',
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
        description: '把主题、路线、地点、俱乐部和商家合作组织在同一套城市探索体验中。',
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
      title: '产品能力',
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
      seeAll: '查看全部能力',
      browseAll: '浏览产品能力',
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
        { name: '城市主题探索', category: '主题与章节', description: '沿真实地点推进主题、章节与任务。', image: '/assets/case-detective/shanghai-native-quarter.jpg', link: '/apechain.html' },
        { name: '实时漫游', category: '路线与位置', description: '查看附近地点、路线进度和当前任务。', image: '/assets/case-citywalk/nanjing-road-pedestrians.jpg', link: '/apechain.html' },
        { name: '地点打卡', category: '到点确认', description: '到达地点后完成打卡与内容解锁。', image: '/assets/case-game/chapter-02-photo-check.jpg', link: '/apechain.html' },
        { name: '彩蛋收集', category: '探索反馈', description: '在路线中发现并收集隐藏内容。', image: '/assets/case-game/chapter-04-bookshop-clue.jpg', link: '/apechain.html' },
        { name: '线索与提示', category: '任务辅助', description: '围绕当前进度获得线索与提示。', image: '/assets/case-detective/detective-diary-page.jpg', link: '/apechain.html' },
        { name: '俱乐部', category: '同好组织', description: '加入或创建俱乐部并组织主题活动。', image: '/assets/case-citywalk/shanghai-crosswalk-people.jpg', link: '/build.html#club' },
        { name: '组队协作', category: '多人参与', description: '邀请伙伴共同参与城市探索。', image: '/assets/case-citywalk/nanjing-pedestrian-evening.jpg', link: '/build.html#club' },
        { name: '商家合作', category: '城市节点', description: '让真实商家成为主题与路线的一部分。', image: '/assets/case-citywalk/nanjing-side-street.jpg', link: '/build.html#merchant' },
        { name: '社区内容', category: '发现与分享', description: '围绕城市、主题与活动发布内容。', image: '/assets/case-xhs/xhs-cover.jpg', link: '/apechain.html' },
        { name: '成长等级', category: '探索记录', description: '持续记录参与和成长进度。', image: '/assets/case-xhs/xhs-chapter-03.jpg', link: '/apechain.html' },
        { name: '徽章', category: '成就激励', description: '完成探索后获得对应的成就记录。', image: '/assets/case-xhs/xhs-chapter-05.jpg', link: '/apechain.html' },
        { name: '优惠与奖励', category: '参与权益', description: '查看并使用活动或商家提供的权益。', image: '/assets/case-citywalk/fuzhou-henan-road.jpg', link: '/build.html#merchant' }
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
    document.querySelectorAll('.Hero-thumb img').forEach(function(img, index) {
      const app = content.appsData[index];
      if (!app) return;
      img.setAttribute('src', app.thumb || app.image);
      img.setAttribute('alt', app.name);
    });

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
    document.querySelectorAll('.Spotlight-bg-card img').forEach(function(img, index) {
      const app = content.appsData[index % content.appsData.length];
      if (!app) return;
      img.setAttribute('src', app.image);
      img.setAttribute('alt', '');
    });
    const spotlightImage = document.querySelector('.Spotlight-featured-card img');
    if (spotlightImage && content.appsData[0]) {
      spotlightImage.setAttribute('src', content.appsData[0].image);
      spotlightImage.setAttribute('alt', content.appsData[0].name);
    }

    setText('.SectionGridCarousel .section-title h2', content.appsSection.title);
    setLabelPair('.SectionGridCarousel .section-see-all .UILink-inner span', content.appsSection.seeAll);
    setLabelPair('.SectionDiscoverApps .UIBtn.secondary .label-inner', content.appsSection.browseAll);

    document.querySelectorAll('.SimpleSlider .AppCard').forEach(function(card, index) {
      const app = content.appsSection.cards[index];
      if (!app) {
        card.hidden = true;
        return;
      }
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
    document.querySelectorAll('.SimpleSlider-group').forEach(function(group) {
      const visibleCards = Array.from(group.querySelectorAll('.AppCard')).some(function(card) { return !card.hidden; });
      group.hidden = !visibleCards;
    });

    document.querySelectorAll('.Discover-label').forEach(function(label, index) {
      const value = content.discover.labels[index];
      if (value == null) return;
      label.querySelectorAll('.label__inner').forEach(function(el) {
        el.textContent = value;
      });
      const image = label.querySelector('img');
      const app = content.appsSection.cards[index % content.appsSection.cards.length];
      if (image && app) {
        image.setAttribute('src', app.image);
        image.setAttribute('alt', '');
      }
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
    document.documentElement.classList.add('cy-content-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrate, { once: true });
  } else {
    hydrate();
  }
})();
