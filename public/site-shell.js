/* 城瘾官网共享站壳 —— 单一事实源:导航/页脚/当前栏目/移动菜单。
   用法:页面 <head> 引 site-shell.css,<body> 末引 <script src="/site-shell.js" defer>。
   自动注入 header(body 首)与 footer(body 末),按路径高亮当前栏目。 */
(function () {
  var NAV = [
    { label: '探索', href: '/index.html', match: ['/', '/index.html', '/apechain.html', '/deploy.html', '/d20.html'] },
    // preset-life 是从 IP 页档案 rail 进去的阅读器页,归在 IP 栏目下
    { label: 'IP', href: '/ip.html', match: ['/ip.html', '/preset-life.html'] },
    { label: '构建', href: '/build.html', match: ['/build.html'] },
    { label: '联系我们', href: '/about.html', match: ['/about.html'] }
  ];

  function currentPath() {
    var p = location.pathname.replace(/\/$/, '') || '/';
    return p === '' ? '/' : p;
  }

  function buildHeader() {
    var path = currentPath();
    var links = NAV.map(function (n) {
      var active = n.match.indexOf(path) !== -1 ? ' aria-current="page"' : '';
      return '<a href="' + n.href + '"' + active + '>' + n.label + '</a>';
    }).join('');
    var header = document.createElement('header');
    header.className = 'cy-header';
    header.innerHTML =
      '<a class="cy-header__logo" href="/index.html" aria-label="城瘾首页">城瘾</a>' +
      '<button class="cy-burger" aria-label="菜单" aria-expanded="false" aria-controls="cyNav">' +
        '<span></span><span></span><span></span></button>' +
      '<nav class="cy-nav" id="cyNav" aria-label="主导航">' + links + '</nav>';
    var burger = header.querySelector('.cy-burger');
    var nav = header.querySelector('.cy-nav');

    function isOpen() {
      return nav.getAttribute('data-open') === 'true';
    }
    function setOpen(open) {
      nav.setAttribute('data-open', String(open));
      burger.setAttribute('aria-expanded', String(open));
    }

    burger.addEventListener('click', function () {
      setOpen(!isOpen());
    });
    // 移动端菜单是一层盖住页面的面板,要能退出:
    // Esc 关闭并把焦点还给汉堡按钮;点面板外部关闭;点导航链接后收起。
    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !isOpen()) return;
      setOpen(false);
      burger.focus();
    });
    document.addEventListener('click', function (event) {
      if (!isOpen()) return;
      if (nav.contains(event.target) || burger.contains(event.target)) return;
      setOpen(false);
    });
    nav.addEventListener('click', function (event) {
      if (event.target.closest && event.target.closest('a')) setOpen(false);
    });

    return header;
  }

  function buildFooter() {
    var footer = document.createElement('footer');
    footer.className = 'cy-footer';
    footer.innerHTML =
      '<div class="cy-footer__top">' +
        '<div>' +
          '<div class="cy-footer__brand">城瘾</div>' +
          '<p class="cy-footer__tag">把城市变成一场真人解谜游戏。</p>' +
        '</div>' +
        '<div class="cy-footer__cols">' +
          '<div class="cy-footer__col"><h4>探索</h4>' +
            '<a href="/index.html">首页</a><a href="/ip.html">IP 世界</a>' +
            '<a href="/build.html">共建</a><a href="/d20.html">d20 判定</a></div>' +
          '<div class="cy-footer__col"><h4>合作</h4>' +
            '<a href="/about.html">联系我们</a><a href="/build.html">商家 / 俱乐部</a></div>' +
          '<div class="cy-footer__col"><h4>法律</h4>' +
            '<a href="/privacy.html">隐私政策</a><a href="/terms.html">用户协议</a></div>' +
        '</div>' +
      '</div>' +
      '<div class="cy-footer__bottom">' +
        // 版权年份取当前年,避免写死的年份跨年即错(页脚出现在每一页上)
        '<span>&copy; ' + new Date().getFullYear() + ' 城瘾</span>' +
        // ============================ 上线阻断项 ============================
        // 这里是占位,不是备案信息。境内正式站点必须展示真实 ICP 备案号,
        // 备案号需由业务方提供,任何人不得编造或猜测。
        // 替换时:把下面这段整体换成 <a href="https://beian.miit.gov.cn/">沪ICP备XXXXXXXX号</a>,
        // 并把 data-cy-icp 的值从 "placeholder" 改成 "ok"(冒烟测试按这个断言)。
        // 关联:REVIEW.md F11。
        // ==================================================================
        '<span data-cy-icp="placeholder">ICP 备案信息待补</span>' +
      '</div>';
    return footer;
  }

  // 站壳节点的 inert 状态。页面可能在站壳挂载前就打开模态,所以状态存在这里,
  // mount() 时补上,不依赖「站壳一定先挂载」的时序。
  var inertState = false;

  function shellNodes() {
    return [document.querySelector('.cy-header'), document.querySelector('.cy-footer')];
  }

  function applyInert() {
    shellNodes().forEach(function (el) {
      if (!el) return;
      if (inertState) {
        el.inert = true;
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.inert = false;
        el.removeAttribute('aria-hidden');
      }
    });
  }

  /* 对外接口(单一事实源的一部分):
     cyShell.setInert(true)        —— 打开模态时把站壳 header/footer 移出可访问树与焦点顺序
     cyShell.setChromeHidden(true) —— 全屏浮层期间收起固定顶栏,免得 z-index:1000 的顶栏压住浮层。
                                      实际隐藏由 site-shell.css 的 body[data-cy-chrome="hidden"] 负责,
                                      页面也可以直接设这个 data 属性,不必依赖本 JS。 */
  window.cyShell = {
    setInert: function (on) {
      inertState = !!on;
      applyInert();
    },
    setChromeHidden: function (on) {
      if (on) document.body.setAttribute('data-cy-chrome', 'hidden');
      else document.body.removeAttribute('data-cy-chrome');
    }
  };

  // 占位没换掉就上线是合规风险,这里在控制台留一条显式告警
  // (与 about.html 对缺失 API 基地址的处理同一套路),别让它静默过去。
  function warnPlaceholders() {
    var icp = document.querySelector('[data-cy-icp="placeholder"]');
    if (icp && window.console) {
      console.warn('[城瘾] 页脚 ICP 备案信息仍是占位文案,上线前必须替换为真实备案号(见 site-shell.js)。');
    }
  }

  function mount() {
    if (!document.querySelector('.cy-header')) {
      document.body.insertBefore(buildHeader(), document.body.firstChild);
    }
    if (!document.querySelector('.cy-footer')) {
      document.body.appendChild(buildFooter());
    }
    applyInert();
    warnPlaceholders();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
