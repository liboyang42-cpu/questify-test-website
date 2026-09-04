/* 城瘾官网共享站壳 —— 单一事实源:导航/页脚/当前栏目/移动菜单。
   用法:页面 <head> 引 site-shell.css,<body> 末引 <script src="/site-shell.js" defer>。
   自动注入 header(body 首)与 footer(body 末),按路径高亮当前栏目。
   body[data-cy-shell="footer"] 只注入页脚(IP 页自带顶栏)。 */
(function () {
  var NAV = [
    { label: '探索', href: '/index.html', match: ['/', '/index.html', '/apechain.html', '/deploy.html', '/d20.html'] },
    { label: 'IP', href: '/ip.html', match: ['/ip.html'] },
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
      '<a class="cy-header__logo" href="/index.html" aria-label="城瘾首页"><img src="/assets/logo.png" alt=""></a>' +
      '<button class="cy-burger" aria-label="菜单" aria-expanded="false" aria-controls="cyNav">' +
        '<span></span><span></span><span></span></button>' +
      '<nav class="cy-nav" id="cyNav" aria-label="主导航">' + links + '</nav>';
    var burger = header.querySelector('.cy-burger');
    var nav = header.querySelector('.cy-nav');
    burger.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      burger.setAttribute('aria-expanded', String(!open));
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
            '<a href="/index.html">首页</a><a href="/apechain.html">产品能力</a>' +
            '<a href="/ip.html">IP 世界</a><a href="/build.html">共建</a></div>' +
          '<div class="cy-footer__col"><h4>合作</h4>' +
            '<a href="/about.html">联系我们</a><a href="/build.html">商家 / 俱乐部</a></div>' +
        '</div>' +
      '</div>' +
      '<div class="cy-footer__bottom">' +
        '<span>&copy; 2026 城瘾hub · 上海城瘾科技有限公司</span>' +
        '<span class="cy-footer__meta">' +
          '<a href="https://chein.ink" target="_blank" rel="noopener noreferrer">chein.ink</a>' +
          '<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">沪ICP备2026043558号-1</a>' +
        '</span>' +
      '</div>';
    return footer;
  }

  function mount() {
    var shell = document.body.getAttribute('data-cy-shell') || 'all';
    if (shell !== 'footer' && !document.querySelector('.cy-header')) {
      document.body.insertBefore(buildHeader(), document.body.firstChild);
    }
    if (!document.querySelector('.cy-footer')) {
      document.body.appendChild(buildFooter());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
