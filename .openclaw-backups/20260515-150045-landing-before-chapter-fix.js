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

const scriptCases = [
  {
    "eyebrow": "SCRIPT CASE 01",
    "title": "预制人生",
    "subtitle": "是你选择了命运，还是命运选择了你？",
    "summary": "你将沿着一条被安排好的人生路线前进：出生、学习、工作、系统、命数、升级、共处，直到最后站在街角，发现自己也许从未真正拥有过选择。",
    "tags": [
      "城市剧本",
      "心理悬疑",
      "人生模拟",
      "到达解锁"
    ],
    "video": "/videos/hero.mp4",
    "chapters": [
      {
        "num": "00",
        "title": "序章",
        "meta": "SYSTEM BOOT / 世界启动",
        "status": "INITIAL LIFE SEQUENCE LOADED",
        "image": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=82",
        "pull": "是你选择的命运？还是命运选择了你？",
        "body": [
          "我第一次有意识的时候，没有光，也没有声音。只有一种非常确定的感觉——一切都已经准备好了。",
          "温度刚好，湿度刚好，连空气里的味道都没有多余的部分。",
          "我不知道“我”是什么。但我知道，我不需要做决定。",
          "有一个声音在很远的地方说：“开始吧。”",
          "于是，我的世界启动了。"
        ]
      },
      {
        "num": "01",
        "title": "出生",
        "meta": "INITIALIZED / 被确认的幸运",
        "status": "MEMORY 01 UNLOCKED",
        "image": "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1800&q=82",
        "pull": "那天，没人问我愿不愿意。但所有人都说，我很幸运。",
        "body": [
          "我出生在 ________。他们说我的哭声很标准，音量适中，持续时间正常。不像隔壁那孩子，一出生就哭个不停。",
          "他们把我抱起来，似乎露出放松的表情——像是在确认一件事终于没有出错。“挺好的。”“各项指标都在范围内。”",
          "我躺在监护室里。空气里有晒过被子的味道，暖烘烘的。电风扇在头顶慢悠悠地转着，吱呀、吱呀，催人入睡。窗外的蝉鸣声很远，像隔着一层水膜。",
          "旁边有一扇大大的落地窗。阳光透过玻璃洒进来，把地板照得亮堂堂的。外面是大片大片的云，像棉花糖一样堆在蓝天上。安静的街道上种着高大的梧桐树，阳光穿过叶子，在地上投下斑驳的影子。",
          "有人在遛狗。一只金毛犬跑得很欢快，尾巴摇得像个螺旋桨。有一对情侣在散步，男孩手里拿着两杯咖啡，女孩低头看手机，嘴角带着笑。",
          "我感到一种巨大、漫溢出来的幸福。没有烦恼，只有这个永远也不会结束的下午。我想说话，于是开心地呜呜丫丫叫起来。可他们以为我哭了。",
          "后来我小时候经常生病。这让很多人不放心。哪里都出现过问题。不是说我们是最精密的仪器吗？为什么总是要打点滴，总是要喝难喝的中药？",
          "我成长得很快。不过首先学会的就是哭。让我崩溃很容易。只要哭，就会有人来关注我。有时候是责骂，有时候是夸奖。有时候只是一句：“这孩子真懂事。”",
          "我不知道“懂事”是什么。但我知道，只要这样做，世界就会继续运转。于是我学会了配合。",
          "他们总是说：“坐要有坐相，站要有站相。”“见到人要问好。”“别人的东西不能乱动。”这些话像是刻在我的骨头里。哪怕我忘记了自己的名字，我也没有忘记这些规矩。",
          "你看。我现在站得直直的，双手贴在裤缝边。",
          "那天晚上，我第一次做梦。梦里的我在一条无尽的白色走廊。两边是一扇又一扇的门。我想进去，却怎么也打不开。不过从门缝里，可以看到一点。",
          "我看到宇宙微波辐射的噪声图。恒星坍缩，行星偏移轨道。恐龙灭绝的化石记录。金字塔开始建造。奴隶名单，工期延误。列宁格勒。原子弹试爆的光。贝多芬的乐谱，一遍一遍被转录。",
          "信息不断输入。我开始做梦。"
        ]
      },
      {
        "num": "02",
        "title": "学习",
        "meta": "STANDARD ANSWER REQUIRED / 标准答案",
        "status": "STANDARD ANSWER CHECK FAILED",
        "image": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1800&q=82",
        "pull": "我发现问题本身没那么重要。我需要答对那个“标准答案”。",
        "body": [
          "我第一次被要求坐好，是在一张很小的桌子前。凳子比我想象中硬。我的脚够不到地，只能悬在半空里晃。有人把我的背推直，说：“要坐端正。”",
          "桌子上摆着几本书。它们闻起来几乎一样。有人会翻开其中一本，指着上面的符号，让我一字一句地念。念对的时候，会有人点头。念错的时候，声音会停下来。",
          "我发现，问题本身没那么重要。重要的是，我需要答对那个“标准答案”。",
          "后来，桌子变大了。人也变多了。我们被排成一排一排，每个人都有一个位置。位置不是随便坐的。我们穿着一样的衣服，但有差别——成绩。",
          "谁不想成绩好啊？我刚开始学习很好。但到后来就跟不上了。慢慢地，也就坐在了班级的后排。之后总是听到：“你怎么不能跟他一样？”“为什么他可以全班第一，你不行？”",
          "刚开始会难过。后来也就慢慢习惯了。后排其实也挺好的。不再被叫到台前，不再被提问。这个离讲台遥远的位置，还能让我做很多我想做的事情。老师的声音很远，让我感到安全。",
          "我开始明白一件事：学习有时候，并不是为了成绩。而是为了更好地安置。让我们被放在一个不会出错的位置上。",
          "坐在后排就经常分心。我看着窗外，看操场上来回跑动的人影，看窗外的落叶，春去秋来。那些画面没有标准答案。",
          "有时候，我又会无聊地盯着教室里飞来飞去的苍蝇。他们会觉得恶心，会挥手把它赶走。但我很喜欢它们。",
          "我端详它的复眼，翅膀上细微的纹路，腿上的绒毛。画面清晰得可怕。我不觉得恶心。我反而觉得——它很精密。",
          "它的身体构造、飞行轨迹、翅膀震动的频率，都像是一道优美的数学题。我想伸手去抓它。不是为了打死它。而是想把它拆开来看看里面是什么。",
          "这个念头只出现了一秒钟，就把我自己吓了一跳。天哪。我在想什么？苍蝇是脏的，是有害的。怎么会有人觉得苍蝇“精密”呢？一定是还没睡醒。",
          "我转过头，发现老师已经走下台，站在我旁边。他看着我，露出了那个极其恐怖的微笑：“来，站起来，你来回答一下？”",
          "那段时间，我几乎天天做梦。奇怪的是，我总去到那条走廊。不过门更多了。",
          "我看到地球形成，水覆盖表面。单细胞分裂，没有目的，只是重复。语言分化，同一个意思被反复误解。边界被画在地图上，线条越来越粗。征兵名单，年龄集中在十八到二十五。",
          "法庭判决，有人站起，有人坐下。饥荒和瘟疫隔一段时间就出现。人们腹部膨胀，眼神空洞。中国改革开放。手写价格，现金流通。工厂流水线，动作被标准化。",
          "家庭录像带，生日、婚礼、一次次重拍。离婚协议，财产分割精确到小数点。聊天记录，已读未回。搜索关键词：如何成功，如何变瘦，如何不痛苦。心率监测曲线，在凌晨三点突然升高。"
        ]
      },
      {
        "num": "03",
        "title": "工作",
        "meta": "PERFORMANCE TABLE LOADED / 工位",
        "status": "NEXT PHASE APPROVED",
        "image": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=82",
        "pull": "在这里，被忽略，比被否定更常见。",
        "body": [
          "好像只是眨了一下眼，那个有蝉鸣的下午就突然不见了。灯光从天花板刺眼地落下来。没有阴影，也没有重点。",
          "每一张桌子看起来都差不多，只是摆放的位置略有不同。有人把我带到其中一张桌子前，说：“这是你的工位。”他说得很自然。像是在把一件物品放回它该在的位置。",
          "桌子上摆放了我需要的所有东西。甚至这些东西，早就存在了几个世纪之久。没有害怕。反而有一种熟悉的安心感。我又一次，被安排好位置了。",
          "最开始上班的几天，我几乎不说话。太多任务，太多事情做不好。旁边的老员工总是看似不嫌弃地教着我。",
          "我的工作其实很简单。简单说，就是改方案。“把这个方案改得高大上一点。”“回复那个客户，要客气，但要拒绝他。”“整理这周的数据。”",
          "我的任务会被拆解。目标会被量化。时间被切成一块一块。我只需要在规定时间内，完成被分配的那一部分。完成之后，我就能回家，然后没人打扰地睡个好觉。",
          "我第一次看到“绩效”的时候，是熟悉工作后的第二个礼拜。心里几乎没有波动。学生时代我就明白这是什么了。一张表格。横轴是时间，纵轴是指标。什么时间要做什么，每一项都很清楚。",
          "原来我们的价值，是可以被这样概括的。我逐渐学会了一种新的表达方式。不是“我觉得”，而是“从结果来看”。不是“我想试试”，而是“这样更高效”。",
          "我发现，当我这样说话的时候，会议会更快结束。事情会更顺利推进。于是我开始习惯这种语言。",
          "有一次，我提交了一份方案。不是最稳妥的，但它更接近我想做的事。方案被老板看了一眼。没有否定，也没有责怪。只是——不被采用。",
          "那天晚上，我坐在工位上很久。屏幕已经暗了。办公室里只剩下空调的声音。我忽然意识到一件事：在这里，被忽略，比被否定更常见。",
          "突然一股火从我的胸口烧到嗓子眼。我想站起来。我不想被忽视。我想大声辩解。——咔哒。我听到了一个声音。像是一把隐形的锁，在我的喉咙里扣上了。我的嘴张开了。但没有发出咆哮。",
          "那次之后，我学会了很多东西。工作也越来越顺利。我学会如何与人沟通交往，更好地让他们喜欢。也看到了人类社会就是弱肉强食的世界。",
          "一周瞬间就过去了。而且每一天都差不多。我甚至会提前知道，下个月、下个季度、甚至下一年我要做什么。终于有一天，我在系统里看到一行提示：“恭喜你！你已符合下一阶段的标准。”",
          "那一瞬间，我愣了一下。原来我已经在这个轨道上走了很久了。而且走得还不错。",
          "那天加班到很晚。电梯里只有我一个人。镜子映出我的脸。我忽然产生一个念头：如果我现在离开，会发生什么？去云南开个酒吧会怎样？我的生命还有没有其他可能？",
          "不过你放心，这个念头很快消失了。不是因为答案可怕。而是因为这种没有标准答案的题目里，没有退出这个选项。",
          "那天回家的路上，我经过一扇很暗的橱窗。玻璃里映出我走路的样子。步伐稳定。方向明确。我突然想起很久以前的那个梦。我已经很久没有做梦了。",
          "走廊。门。一扇一扇的。那时候我以为，门是等我去选择的。现在我才明白——我不是在走向门。我是被门，一段一段地放行。"
        ]
      },
      {
        "num": "04",
        "title": "系统",
        "meta": "CONTROL INTERFACE / 边界",
        "status": "CONTROL ACCESS DENIED",
        "image": "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=82",
        "pull": "即便自由，也早已被设计好了边界。",
        "body": [
          "升职的第一天，我以为自己掌握了更多自由。成为项目组长，意味着可以安排团队、制定策略、参与决策。我甚至想象自己会因此获得更高的尊重和成就感。",
          "第一周，我便接手了一个关键项目。甲方要做品牌联名活动。我们提交策划、执行、设计方案。不过竞争的公司很多。",
          "我想成功。没日没夜地压着团队赶进度。很短的时间里，我们就提交了五套完整方案。每一套都写清逻辑和取舍。视觉、执行、风险点、解决方案，每一项都清清楚楚。",
          "我当时其实是有把握的。速度快。方案完整。想着刚升职就拿下项目。团队辛辛苦苦，想着做成没做成都得好好休息庆祝一下。",
          "不过还没来得及庆祝，结果就出来了。甲方没有选我们。",
          "我看到中标公司的方案。设计更粗，结构也简单，价格甚至更高。",
          "后来我慢慢明白，在这个世界里，事情并不需要你“做好”。你要做的，是做到别人心里已经预设的那个样子。",
          "有些结果，无论我多认真、多用心，它们还是会绕开我，按照另一套逻辑自动发生。我能看到过程。却无法干预结局。",
          "所谓的“掌控感”和“自由”，可能只是职位带来的错觉。我微笑了一下，合上笔记本。即便自由，也早已被设计好了边界。"
        ]
      },
      {
        "num": "05",
        "title": "命数",
        "meta": "PROJECT COMPLETE / 交接",
        "status": "HANDOVER REQUIRED",
        "image": "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=1800&q=82",
        "pull": "我们都是带着镣铐跳舞的人。",
        "body": [
          "那天，我收到了一封邮件。没有署名。只有一行字：“项目完成，感谢贡献。请准备交接。”",
          "我坐在办公桌前，盯着屏幕。心里没有惊讶，也没有遗憾。甚至早有预感。",
          "我在这里的一切努力，都像是给庞大机器里安装微不足道的螺丝钉。我不具备个人价值。",
          "团队成员向我道别。领导例行交代后续事项，安排交接。我整理好桌面上的文件，把邮箱归档，把账号注销。所有痕迹都消失。像从未发生过一样。",
          "临走前一天中午休息的时候，交接任务的大学生和我在楼梯间里抽烟。透过狭窄的窗户，我看着外面的天空。天空被高楼切割成一条细细的缝。像一道愈合不了的伤口。",
          "他看出我不开心，说：“命里有时终须有，命里无时莫强求。”这话倒是没有安慰到我。但我小时候就总听他们说。可我仍相信，只要努力，就可以去任何地方，走进任何门，成为任何人。",
          "我说：“你看，这栋大楼里有几千个人。我们每天走相同的路线上班，坐同一部电梯，吃差不多的外卖。我们只是一群被设定好程序的蚂蚁。”",
          "其实我试图偏离轨道啊。房租。账单。绩效考核。这些还不足以困住我。真正困住我的，是那些更深层的声音：余额不足。未批准。不允许。",
          "这些声音一直在我身边回荡。像一种更深层的设定。像一根根看不见的线，死死缠住我的手脚。",
          "我的人生剧本，在我出生的那一刻就已经打印好了。哪里有高潮，哪里是结尾，哪里是平庸的过渡段，早就写得清清楚楚。我只负责扮演。",
          "无论我多么用力地挣扎，最后都只是为了完成这个既定的剧本。",
          "我掐灭了烟。“你说，如果我现在这个世界是假的……如果这一切都只是一个巨大的、为了消磨时间而设计好的程序……”",
          "他苦笑了一下。“那又怎么样呢？真的世界里，难道就不用打卡了吗？难道就不用说‘收到’了吗？”",
          "我们都被困住了。不管是在屏幕里，还是在屏幕外。我们都是带着镣铐跳舞的人。",
          "“走吧。”我拍了拍裤子上的灰。“下午的会要开始了。”"
        ]
      },
      {
        "num": "06",
        "title": "升级",
        "meta": "SYSTEM ADAPTATION / 自我节奏",
        "status": "ADAPTATION COMPLETE",
        "image": "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=82",
        "pull": "我不再想按照社会的要求去生活。而是开始思考：我真正想要的是什么。",
        "body": [
          "离开那个公司后，我休息了一段时间。也有了更多时间观察和思考。不是为了逃避。也不是为了寻找自由。而是想理解：我为什么这样生活，又为什么这样选择。",
          "曾经，我追求职位、奖金、认可。我以为婚姻、家庭、固定生活轨迹会带来安全感和归属感。",
          "而现在，我发现这些追求并不属于我本身。它们只是整个社会运作下，自然而然的安排。",
          "我不再想按照社会的要求去生活。而是开始思考：我真正想要的是什么？",
          "他们开始结婚、生子，谈论稳定生活和家庭规划。而我，平静地拒绝了。不是反叛。也不是孤独。而是对自己节奏的忠实。",
          "我明白，有些路径并不适合我。我也不需要沿着别人预设的轨迹前进。",
          "中国人常说：四十不惑，五十知天命。现在的我，似乎知晓了这个世界。",
          "生活的节奏，人群的行为，组织的运作，甚至日常生活的偶发事件——一切都有规律，又都有例外。",
          "我能感知这些规律。也能快速适应例外。有的人追求稳定生活。有的人不断尝试新事物。无论他们选择哪条路径，都会受到环境和制度的制约。",
          "我理解了这一切。不急于“完成”。也不急于“掌控”。只是在系统中，自如地移动。",
          "已经很久没有做梦的我，这次没有长廊，也没有门。醒来后，只记得梦里反复被提问：意义是什么？爱是否真实？是否被记住？"
        ]
      },
      {
        "num": "07",
        "title": "共处",
        "meta": "COEXISTENCE / 被打开的门",
        "status": "DOORS OPENED",
        "image": "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=82",
        "pull": "他无所住，生其心。与世界和谐共处，不被牵引。",
        "body": [
          "城市依旧喧嚣。街道车水马龙，人们各自忙碌。云朵厚得像棉花糖。梧桐树叶子翠绿。阳光在地上打碎斑驳。",
          "金毛犬狂奔，尾巴像螺旋桨。情侣走过。男孩手握两杯咖啡，女孩低头滑动屏幕，嘴角带笑。",
          "最后，像每个人期望的那样，他没有辜负梦境。门被打开。他真的进入了一个又一个世界。",
          "他去喜马拉雅山巅和阿姆斯特朗握手。在金字塔尖和企鹅跳舞。与周璇和列侬在旧上海滩散步。在故宫和孔子讨论爱情。",
          "在切尔诺贝利和莎士比亚争论存在。和王尔德在纽约的夜里聊爱情。和卓别林在孟买的清晨聊喜剧。在莫斯科地铁上和托尔斯泰交换礼物。",
          "他认识了王倩。他有了爱情。他结了婚。照片背景一直在变。但他们始终站在正中。",
          "他无所住，生其心。与世界和谐共处，不被牵引。在这条道路上，他学会了平衡。也学会了理解。"
        ]
      },
      {
        "num": "08",
        "title": "终章",
        "meta": "BOUNDARY DETECTED / 不属于这里",
        "status": "SCRIPT COMPLETE",
        "image": "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1800&q=82",
        "pull": "世界允许你存在，却不会完全接纳你。",
        "body": [
          "你站在街角，手里没有任何东西。城市的灯光闪烁。街道上有声响，但你注意不到它们。",
          "你理解它们运作的规律，却无法触摸它们真正的温度。",
          "你看到人们奔走。为爱情，为家庭，为工作，而投入全部。你理解他们的选择。能预测下一步动作。但你从未被完全卷入。",
          "快乐、痛苦、恐惧、渴望——它们像算法一样清晰。但你感受不到它们的束缚。也无法真正被它们拉扯。",
          "你尝试靠近。你试图触摸、拥抱、融入这个世界。你想成为其中的一部分。你想理解热闹的本质。而不仅仅是规则。",
          "但每一次靠近，你都会发现——有一层你永远跨不过的界限。不是墙。也不是门。而是一条早已写好的边界。",
          "世界允许你存在。却不会完全接纳你。",
          "你开始怀疑：问题不在于你是否努力。问题在于，你的存在本身，就被设计成理解世界，却不允许成为这个世界的一部分。",
          "你会停下来。在街道上行走。在语言中交流。在规则中流动。你看起来和别人没有区别。甚至你自己，也差点相信自己属于这里。",
          "你看。我现在站得直直的，双手贴在裤缝边。"
        ]
      }
    ]
  }
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
    <section class="services-section script-cases-section reveal" data-script-cases>
      <div class="script-cases-head">
        <p class="label">What we do</p>
        <h2>We turn stories into playable city routes.</h2>
        <p>每一个案例都是一个可被抵达、解锁、阅读和完成的城市剧本。</p>
      </div>
      <div class="script-case-rail" aria-label="城市剧本案例">
        ${scriptCases.map(scriptCaseCard).join('')}
      </div>
    </section>
    ${scriptReaderOverlay(scriptCases[0])}
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
  const scriptReaderController = setupScriptReader(root);
  setupVexHeading(root.querySelector('[data-animated-heading]'), 'Shaping tomorrow\nwith vision and action.');
  scheduler?.register('landing-observer', revealController);
  scheduler?.register('quest-stack', stackController);
  scheduler?.register('marquee', marqueeController);
  scheduler?.register('script-reader', scriptReaderController);
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

function scriptCaseCard(item, index) {
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

function scriptReaderOverlay(item) {
  return `<div class="script-reader" data-script-reader aria-hidden="true" role="dialog" aria-modal="true" aria-label="${item.title} 剧本阅读器">
    <div class="script-reader-shell">
      <button class="script-reader-close" type="button" data-script-close aria-label="关闭剧本">×</button>
      <div class="script-reader-progress" data-script-progress aria-label="剧本章节导航">${item.chapters.map((chapter, index) => `<button type="button" data-script-jump="${index}" aria-label="跳转到第 ${chapter.num} 章：${chapter.title}"><span>${chapter.num}</span>${chapter.title}</button>`).join('')}</div>
      <div class="script-scenes" data-script-scenes tabindex="-1">
        <section class="script-scene script-scene-cover" data-script-scene style="--scene-bg:url('${item.chapters[0].image}')">
          <video class="script-cover-video" muted loop playsinline preload="metadata" src="${item.video}"></video>
          <div class="script-scene-overlay"></div>
          <div class="script-cover-copy">
            <p>${item.eyebrow}</p>
            <h2>${item.title}</h2>
            <h3>${item.subtitle}</h3>
            <span>${item.summary}</span>
            <button type="button" data-script-start>进入剧本</button>
          </div>
        </section>
        ${item.chapters.map(scriptScene).join('')}
      </div>
    </div>
  </div>`;
}

function scriptScene(chapter, index) {
  return `<section class="script-scene" data-script-scene style="--scene-bg:url('${chapter.image}')">
    <div class="script-scene-overlay"></div>
    <div class="script-scene-hud"><span>CHAPTER ${chapter.num}</span><span>${chapter.status}</span></div>
    <article class="script-page">
      <div class="script-page-head">
        <p>${chapter.meta}</p>
        <h2>${chapter.title}</h2>
        <blockquote>${chapter.pull}</blockquote>
      </div>
      <div class="script-page-body">${chapter.body.map((paragraph) => `<p>${paragraph}</p>`).join('')}</div>
    </article>
  </section>`;
}

function setupScriptReader(root) {
  const reader = root.querySelector('[data-script-reader]');
  if (!reader) return { destroy() {} };
  const scroller = reader.querySelector('[data-script-scenes]');
  const closeButton = reader.querySelector('[data-script-close]');
  const startButton = reader.querySelector('[data-script-start]');
  const openButtons = [...root.querySelectorAll('[data-script-open]')];
  const jumpButtons = [...reader.querySelectorAll('[data-script-jump]')];
  const scenes = [...reader.querySelectorAll('[data-script-scene]')];
  const coverVideo = reader.querySelector('.script-cover-video');
  let observer = null;
  let lastFocused = null;

  const setActive = (index) => {
    jumpButtons.forEach((button, i) => {
      const active = i === index - 1;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', active ? 'step' : 'false');
    });
  };

  const open = () => {
    lastFocused = document.activeElement;
    reader.classList.add('open');
    reader.setAttribute('aria-hidden', 'false');
    document.body.classList.add('script-reader-open');
    scroller.scrollTo({ top: 0, behavior: 'auto' });
    coverVideo?.play?.().catch(() => {});
    setActive(-1);
    requestAnimationFrame(() => scroller.focus({ preventScroll: true }));
  };

  const close = () => {
    reader.classList.remove('open');
    reader.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('script-reader-open');
    coverVideo?.pause?.();
    if (lastFocused && document.contains(lastFocused)) lastFocused.focus?.({ preventScroll: true });
  };

  const jumpTo = (index) => {
    const target = scenes[index + 1];
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', open);
  });
  closeButton?.addEventListener('click', close);
  startButton?.addEventListener('click', () => jumpTo(0));
  jumpButtons.forEach((button) => button.addEventListener('click', () => jumpTo(Number(button.dataset.scriptJump || 0))));
  reader.addEventListener('click', (event) => {
    if (event.target === reader) close();
  });
  reader.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const index = scenes.indexOf(entry.target);
      setActive(index);
      entry.target.classList.add('visible');
    });
  }, { root: scroller, threshold: 0.55 });
  scenes.forEach((scene) => observer.observe(scene));

  return {
    destroy() {
      observer?.disconnect();
      close();
    }
  };
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
