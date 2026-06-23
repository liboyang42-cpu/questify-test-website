/* 城瘾 WebGL 能力检测与静态降级(M2-24)。
   同步脚本,放各 3D 页 <head>,供 3D 初始化前调用。 */
(function () {
  window.cyWebGLSupported = function () {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl') || c.getContext('experimental-webgl')));
    } catch (e) { return false; }
  };

  // 在指定容器内显示静态降级卡片(3D 不可用时)
  window.cyShowWebGLFallback = function (container, opts) {
    if (!container) return;
    opts = opts || {};
    if (container.querySelector('.cy-webgl-fallback')) return;
    var d = document.createElement('div');
    d.className = 'cy-webgl-fallback';
    d.setAttribute('role', 'note');
    d.innerHTML =
      '<div class="cy-webgl-fallback__inner">' +
        '<p class="cy-webgl-fallback__t">' +
          (opts.title || '此内容需要 3D 渲染(WebGL)') + '</p>' +
        '<p class="cy-webgl-fallback__d">' +
          (opts.text || '你的浏览器或设备暂不支持 WebGL,无法显示 3D 效果;页面其余内容不受影响。') +
        '</p>' +
      '</div>';
    container.appendChild(d);
  };
})();
