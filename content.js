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
    pageTitle: 'APECHAIN',

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
      description: 'Web3-enabled virtual worlds on ApeChain',
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
        description: 'Web3-enabled virtual worlds on ApeChain',
        image: 'https://images.ctfassets.net/opj3ybl4k7mx/7Cn10d3ErtqfrG6H7EFGg8/1942238297ed97ef14f5e9f1049389f7/apeChain-thumbnail-608x336-Otherside.jpg',
        thumb: 'https://images.ctfassets.net/opj3ybl4k7mx/2J6KKq5u2F9zIl5L9maX9g/ab97e1bd1e38cbb58718e991ee123583/apeChain-hero-960x960-Otherside.jpg',
        link: '/apps/otherside',
        color: '#A281FF'
      },
      {
        name: 'D20判定',
        category: '游戏',
        description: 'A club full of builders',
        image: 'https://images.ctfassets.net/opj3ybl4k7mx/48OMy3cRzsdFbNYR8el1Zk/b2a2036389810b0ac2e3c6dff023d3fb/apeChain-thumbnail-608x336-MadeByApes.jpg',
        thumb: 'https://images.ctfassets.net/opj3ybl4k7mx/15yPALJilSS9qb07GSF8Zs/9bccadf42723734f55ec2a0b5d3f6fe7/apeChain-feature-608x960-MadeByApes.jpg',
        link: '/apps/made-by-apes',
        color: '#EB8280'
      },
      {
        name: ' NPC对话引导',
        category: 'AI插件',
        description: 'NFT marketplace',
        image: 'https://images.ctfassets.net/opj3ybl4k7mx/1sIW0LN0KGP4fhqHJpaIbH/88bac67f63a64d4d6db478bc08f5b734/608x336_opensea.jpg',
        thumb: 'https://images.ctfassets.net/opj3ybl4k7mx/7iFJe0Q1aX5fKc1d8epQaE/39743450485b7dd498b312c0efa990b9/960x960_opensea.jpg',
        link: '/apps/opensea',
        color: '#EBBF9A'
      },
      {
        name: '数据分析',
        category: '商户插件',
        description: 'Decentralized Parlay Platform on ApeChain',
        image: 'https://images.ctfassets.net/opj3ybl4k7mx/4RY933fgr5bhgvPho9Sl98/a27e42b0db63cc884c2bd355d95b840b/608x336-clutch.jpg',
        thumb: 'https://images.ctfassets.net/opj3ybl4k7mx/4YlMJVGA2312YhmLtu4bGQ/a6144db6461b8e317e9722dd50ffc43e/960x960-clutch.jpg',
        link: '/apps/clutch-market',
        color: '#89D0FF'
      },
      {
        name: 'AR互动',
        category: '交互插件',
        description: 'AR互动 is a RWA platform built for the EVM, with support for ApeChain',
        image: 'https://images.ctfassets.net/opj3ybl4k7mx/606Ce7C4Bg7OEG0qjKb7W0/5c8d49fc02d156228b5d5e3c8b85de9f/Banner.png',
        thumb: 'https://images.ctfassets.net/opj3ybl4k7mx/606Ce7C4Bg7OEG0qjKb7W0/5c8d49fc02d156228b5d5e3c8b85de9f/Banner.png',
        link: '/apps/slab-cash',
        color: '#0054FA'
      },
      {
        name: '收集图鉴',
        category: '成就激励',
        description: 'Build the future of web3 on ApeChain',
        image: 'https://images.ctfassets.net/opj3ybl4k7mx/7Cn10d3ErtqfrG6H7EFGg8/1942238297ed97ef14f5e9f1049389f7/apeChain-thumbnail-608x336-Otherside.jpg',
        thumb: 'https://images.ctfassets.net/opj3ybl4k7mx/2J6KKq5u2F9zIl5L9maX9g/ab97e1bd1e38cbb58718e991ee123583/apeChain-hero-960x960-Otherside.jpg',
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
      launch: 'Launch',
      about: 'What\'s this',
      featured: {
        name: 'Clutch Markets',
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
        description: 'Decentralized parlay platform on ApeChain.',
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
      title: 'ApeChain Apps',
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
      seeAll: 'See All Apps',
      browseAll: 'Browse All Apps',
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
        { name: 'LBS任务引擎', category: '剧情插件', description: 'Web3-enabled virtual worlds on ApeChain' },
        { name: 'D20判定', category: '游戏', description: 'A club full of builders' },
        { name: 'NPC对话引导', category: 'AI插件', description: 'NFT marketplace' },
        { name: '数据分析', category: '商户插件', description: 'Decentralized Parlay Platform on ApeChain' },
        { name: 'AR互动', category: '交互插件', description: 'ApeChain dashboard and 成就激励 tools' },
        { name: '收集图鉴', category: '成就激励', description: 'Decentralized exchange' },
        { name: 'Ape Portal', category: 'Infrastructure', description: 'Get on ApeChain' },
        { name: 'Blever', category: 'AI插件', description: 'An NFT launchpad for ApeChain' },
        { name: 'Ape Express', category: '交互插件', description: 'Fast and simple bridge by ApeChain' },
        { name: 'Etherscan', category: 'Infrastructure', description: 'Block explorer infrastructure' },
        { name: 'Gains', category: '交互插件', description: 'Trade perpetuals on ApeChain' },
        { name: 'OpenOcean', category: '交互插件', description: 'DEX aggregator' },
        { name: 'Cyan', category: 'AI插件', description: 'Buy now, pay later for NFTs' },
        { name: 'Magic Eden', category: 'AI插件', description: 'NFT marketplace on ApeChain' },
        { name: 'Mintpad', category: 'AI插件', description: 'Launch your NFT on ApeChain' },
        { name: 'Ormi', category: 'Infrastructure', description: 'Unified Web3 data layer' }
      ]
    },

    discover: {
      labels: [
        '游戏',
        'AI插件',
        '交互插件',
        '游戏',
        'AI插件',
        '交互插件',
        'Gaming',
        'Infrastructure',
        'Social',
        'Gaming',
        'Infrastructure',
        'Social'
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
      brand: 'APECHAIN',
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
      copyright: '© 2026 Ape Foundation',
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
      columns: [
        {
          title: 'Build on ApeChain',
          links: ['Docs', 'Mainnet Hub', 'Testnet Hub', 'Block Explorer', 'Ape Portal']
        },
        {
          title: 'ApeCoin',
          links: ['Discord', 'Twitter / X', 'Otherside Calendar']
        },
        {
          title: 'ApeChain',
          links: ['Bridge', 'Relay Bridge', 'The Blueprint', 'Telegram', 'Twitter / X', 'Brand Kit']
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
