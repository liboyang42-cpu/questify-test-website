// 唯一一份 HTML 转义helper —— apechain.html(列表)与 deploy.html(详情)都引本文件,
// 两页拼 innerHTML 时共用这一个实现,避免各写一份走样。
// 同时转义引号,因此文本位与属性位都可以安全插值。
window.__siteEscapeHTML = function (value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
  });
};

window.__siteContent = {
  // 应用目录 —— apechain.html(列表)与 deploy.html(详情)共用的唯一数据源。
  // slug 是每条应用的稳定标识:列表页链接写 deploy.html?app=<slug>,详情页按 slug 反查,
  // 因此卡片在任何筛选/排序状态下都指向同一条数据。
  // status: 'live' 已上线(有真实素材和入口) / 'soon' 即将上线(占位图,列表和详情都会显式标注)。
  appCatalog: {
    // 分类词表:slug 供首页 ?f= 分类入口与 apechain.html 的筛选器共用,是唯一事实源。
    // 首页链接形如 ./apechain.html?f=game;未知 slug 由 apechain.html 安全降级为「全部」。
    categories: [
      { slug: 'game', name: '游戏' },
      { slug: 'story', name: '剧情插件' },
      { slug: 'interaction', name: '交互插件' },
      { slug: 'ai', name: 'AI插件' },
      { slug: 'achievement', name: '成就激励' }
    ],
    apps: [
      // 游戏
      {
        slug: 'd20',
        title: 'd20 判定',
        category: '游戏',
        desc: '城市任务里的掷骰判定 · 点击试玩',
        img: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='608'%20height='336'%3E%3Crect%20width='608'%20height='336'%20fill='%23120608'/%3E%3Cpolygon%20points='304%2C84%20402%2C152%20366%2C246%20242%2C246%20206%2C152'%20fill='none'%20stroke='%23ff2233'%20stroke-width='6'/%3E%3Ctext%20x='304'%20y='292'%20font-family='Arial'%20font-size='58'%20font-weight='bold'%20fill='%23ff2233'%20text-anchor='middle'%3Ed20%3C/text%3E%3C/svg%3E",
        link: 'd20.html',
        status: 'live',
        introduction: '城市任务里的判定环节：投出一颗 d20，用点数决定这一步的成败与后续分支。可直接在网页里点击试玩。',
        gameplay: '点击骰子投掷 → 等待点数停稳 → 按点数判定任务成败 → 返回任务继续推进。'
      },
      {
        slug: 'city-quest-chain',
        title: '城市任务链',
        category: '游戏',
        desc: '动态生成的城市探险任务与挑战',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '城市任务链是城瘾核心引擎，将城市地理转化为任务流。AI实时生成任务线路，用户探索城市同时完成目标。每条街道、每家门店都可能成为新的任务节点。',
        gameplay: '打开应用 → 接收AI任务 → 导航至目标位置 → 完成交互 → 获得奖励 → 解锁下一环节。支持单人探险和多人协作。'
      },
      {
        slug: 'landmark-collection',
        title: '地标收集',
        category: '游戏',
        desc: '扫码打卡城市地点解锁成就',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '探索城市的同时自动发现地标。每个地点都有独特的标识和背景故事。集齐同类型地标可解锁特殊徽章和奖励。',
        gameplay: '靠近地标 → 自动识别 → 扫码或拍照确认 → 收集地标卡片 → 积累地点进度 → 达成主题集合获奖励。'
      },
      {
        slug: 'merchant-race',
        title: '商户竞赛',
        category: '游戏',
        desc: '跨店铺竞速与排行榜系统',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '多人竞速模式，挑战用户在规定时间内访问指定商户数量。排行榜实时更新，周期结算奖励。商户合作创建专属挑战。',
        gameplay: '参加竞赛 → 接收商户清单 → 在限时内完成签到 → 提交成绩 → 查看排名 → 领取周期奖励。支持邀请好友组队竞争。'
      },
      {
        slug: 'time-trial',
        title: '时间竞速',
        category: '游戏',
        desc: '限时任务与动态事件触发',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '时间驱动的任务系统，任务在特定时间自动出现和消失。抓住稍纵即逝的机会，完成闪电任务获得高倍奖励。',
        gameplay: '接收时限提示 → 在规定时间内赶往地点 → 完成快速交互 → 获得加成奖励。夜间、周末、节假日有特殊任务加成。'
      },
      {
        slug: 'faction-war',
        title: '阵营战争',
        category: '游戏',
        desc: '多人社交对抗与领地争夺',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '城市被划分为多个势力范围。加入阵营与其他玩家争夺领地控制权。控制的地区越多，每日收益越高。',
        gameplay: '选择加入阵营 → 前往敌方领地 → 完成控制任务 → 转换领地颜色 → 每日获得地区收益 → 参与阵营战役。'
      },
      {
        slug: 'mystery-case',
        title: '解谜探案',
        category: '游戏',
        desc: '城市故事线谜题解构系统',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '多线程故事线，玩家通过收集线索解开城市之谜。线索分散在各个地点，需要逻辑推理才能破案。',
        gameplay: '接收案件线索 → 前往相关地点 → 收集物证 → 进行推理 → 提交答案 → 解锁故事下一章 → 获得剧情奖励。'
      },
      // 剧情插件
      {
        slug: 'ai-story-engine',
        title: 'AI故事引擎',
        category: '剧情插件',
        desc: '生成式叙事与动态分支剧情',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: 'AI动态生成故事线，根据用户选择创建分支剧情。每个决定都影响故事走向，同一个任务可能有完全不同的结局。',
        gameplay: '进入故事场景 → 阅读AI生成的叙述 → 做出选择影响剧情 → 解锁新的故事分支 → 体验不同的结局 → 重复游玩发现隐藏剧情。'
      },
      {
        slug: 'character-companion',
        title: '角色伴侣系统',
        category: '剧情插件',
        desc: 'AI NPC全程陪伴与实时对话',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: 'AI驱动的动态NPC，可自然对话交互。NPC会记住你的选择，根据历史互动调整态度和任务。',
        gameplay: '与NPC对话 → 选择对话选项 → 发展NPC关系 → 触发角色支线任务 → 解锁隐藏剧情 → NPC提供特殊帮助。'
      },
      {
        slug: 'city-legends',
        title: '城市传奇库',
        category: '剧情插件',
        desc: '本地化品牌故事与商户背景',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '每个商户都有自己的品牌故事和背景设定。探索商户历史，了解其在城市中的角色和影响力。',
        gameplay: '进入商户地点 → 触发故事弹窗 → 阅读品牌背景 → 参与商户特殊活动 → 收集商户徽章 → 解锁隐藏优惠。'
      },
      {
        slug: 'history-trace',
        title: '历史寻踪',
        category: '剧情插件',
        desc: '地点关联的互动内容解锁',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '地点本身就是内容。靠近特定位置自动解锁历史信息、文化背景或地理故事。',
        gameplay: '靠近地点 → 自动接收历史提示 → 阅读地点背景 → 完成相关任务 → 拍照打卡 → 积累知识徽章。'
      },
      // 交互插件
      {
        slug: 'ar-scan',
        title: 'AR扫描引擎',
        category: '交互插件',
        desc: '虚实互动的沉浸式体验',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '增强现实技术将虚拟内容叠加到现实城市。扫描真实世界发现隐藏的AR内容、虚拟NPC和交互物件。',
        gameplay: '打开AR扫描 → 对准城市环境 → 发现虚拟元素 → 与AR对象交互 → 收集虚拟奖励 → 拍摄AR照片分享。'
      },
      {
        slug: 'qr-trigger',
        title: 'QR即触发',
        category: '交互插件',
        desc: '门店二维码一键启动任务',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '商户在门店贴二维码，玩家扫码立即触发该商户的专属任务和优惠。简单快速的交互入口。',
        gameplay: '靠近商户 → 看到二维码 → 快速扫描 → 任务自动启动 → 完成店内交互 → 领取优惠或奖励。'
      },
      {
        slug: 'social-hub',
        title: '社交互动点',
        category: '交互插件',
        desc: '多人共享与协作游戏模式',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '在特定地点与其他玩家互动。共同完成合作任务、交换物品或进行竞技。',
        gameplay: '进入社交地点 → 匹配其他玩家 → 组织合作或竞争 → 共同完成目标 → 获得分享奖励 → 建立社交关系。'
      },
      {
        slug: 'checkin-card',
        title: '位置签到卡',
        category: '交互插件',
        desc: '持久化身份与进度保存',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '在地点签到建立持久化足迹。签到卡记录你在城市中的探索历史，形成个人的位置数据档案。',
        gameplay: '到达新地点 → 进行签到 → 收集位置卡片 → 查看签到历史 → 达成位置成就 → 分享签到路线。'
      },
      {
        slug: 'push-notify',
        title: '即时推送系统',
        category: '交互插件',
        desc: '隐藏任务与时限事件通知',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '系统根据你的位置推送实时通知。发现隐藏的快闪活动、限时优惠、周边任务机会。',
        gameplay: '接收位置推送 → 阅读隐藏任务信息 → 在指定时间赶去 → 完成闪电任务 → 获得稀有奖励。'
      },
      // AI插件
      {
        slug: 'ai-guide',
        title: 'AI导游伴侣',
        category: 'AI插件',
        desc: '实时路线规划与动态推荐',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: 'AI智能导游根据你的偏好、位置和时间智能规划游览路线。动态调整推荐，避免冷门或危险区域。',
        gameplay: '输入兴趣 → AI规划最优路线 → 跟随AI导航 → 接收实时推荐 → 发现隐藏景点 → 反馈评价优化AI。'
      },
      {
        slug: 'quest-generator',
        title: '任务生成器',
        category: 'AI插件',
        desc: '基于用户与环境的智能生成',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: 'AI根据你的行为习惯、当前位置、时间、天气等因素实时生成个性化任务。每次打开都有新任务。',
        gameplay: '打开应用 → AI自动生成个性化任务 → 完成任务获奖励 → 系统学习你的偏好 → 下次任务更贴切。'
      },
      {
        slug: 'dialogue-agent',
        title: '对话代理',
        category: 'AI插件',
        desc: '多轮交互的自然语言处理',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '自然对话的AI助手，可以用自然语言提问、寻求建议、解决问题。支持长对话上下文记忆。',
        gameplay: '点击对话 → 自然语言提问 → AI实时回复 → 多轮对话追问 → 获得帮助信息 → 反馈改进AI。'
      },
      {
        slug: 'smart-matcher',
        title: '智能匹配器',
        category: 'AI插件',
        desc: '用户偏好与商户的精准适配',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: 'AI学习你的消费习惯和兴趣偏好，推荐最匹配的商户、优惠和活动。精准度随使用次数提升。',
        gameplay: '使用系统建立偏好档案 → AI推荐相关商户 → 前往消费 → 系统记录反馈 → 推荐越来越精准。'
      },
      {
        slug: 'behavior-analyzer',
        title: '行为分析器',
        category: 'AI插件',
        desc: '实时学习与系统持续优化',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '后台AI不断分析所有用户行为，优化系统推荐、任务生成、路线规划。个人体验随时间不断改进。',
        gameplay: '正常使用系统 → AI在后台学习 → 逐步优化体验 → 周期获得个性化报告 → 享受定制体验。'
      },
      // 成就激励
      {
        slug: 'badge-book',
        title: '徽章收集簿',
        category: '成就激励',
        desc: '完成任务解锁专属勋章',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '完成各类任务和挑战解锁勋章。勋章代表你的成就，可分享展示。集齐主题勋章组合激活特殊效果。',
        gameplay: '完成特定任务 → 解锁相关勋章 → 查看徽章详情 → 集齐同系列勋章 → 激活勋章加成 → 展示成就。'
      },
      {
        slug: 'leaderboard',
        title: '排行榜竞技',
        category: '成就激励',
        desc: '实时排名与周期结算奖励',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '多维度排行榜实时更新排名。按积分、任务完成数、地点探索数等不同维度竞争。每周期结算奖励。',
        gameplay: '完成任务累积积分 → 查看实时排名 → 目标冲刺高排名 → 周期结算获奖励 → 新周期排名重置。'
      },
      {
        slug: 'level-progress',
        title: '等级进阶',
        category: '成就激励',
        desc: '持久化身份与角色成长体系',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '完成任务获经验升级。等级决定可解锁内容、任务难度和奖励幅度。高等级玩家获得特殊头衔。',
        gameplay: '完成任务获经验 → 积累升级经验条 → 等级提升解锁新功能 → 获得等级奖励 → 挑战更高难度任务。'
      },
      {
        slug: 'reward-exchange',
        title: '奖励兑换',
        category: '成就激励',
        desc: '参与凭证与商户优惠券整合',
        img: '/assets/placeholder-app.svg',
        status: 'soon',
        introduction: '积累的成就和积分可兑换商户优惠或现实奖励。系统记录保证权益持续有效。',
        gameplay: '积累成就积分 → 进入兑换商城 → 选择奖励类型 → 完成兑换 → 获得参与凭证 → 商户使用优惠。'
      }
    ]
  },

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

    // F04:这里原来按**下标**把 discover.labels 覆盖到 .Discover-label 上。
    // 那是与 F02 串号同一类的位置耦合:HTML 里的分类换了词表,这份按下标覆盖的
    // 旧文案会把正确文案盖回去 —— 而且跑马灯是「一组重复若干遍」的结构,
    // 下标与分类的对应关系一改结构就错位。
    // 现在文案由 HTML 自己承载(分类词表是 ?f= 链接契约的一部分,必须与 slug 同源),
    // content.js 不再插手。删除这段覆盖的同时也删掉了 discover.labels 数据。

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
