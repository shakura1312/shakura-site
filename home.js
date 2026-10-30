// Home page: the glowing green card bounces around the window like an old screensaver. Each time it hits
// the left or right edge it shows the next project from the grid (image, title, description, code).
// It pauses under the pointer so its links can be clicked, and the ✕ puts it away.
// Without JavaScript the card stays hidden.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var card = document.querySelector('.feature');
    var items = document.querySelectorAll('.grid li');
    if (!card || !items.length) return;

    var projects = [].map.call(items, function (li) {
      var a = li.querySelector('a');
      return {
        href: a.getAttribute('href'), external: a.target === '_blank',
        img: li.querySelector('img').getAttribute('src'),
        title: li.querySelector('.title').textContent.replace(/^(MArch|BDes) thesis: /, ''),
        desc: li.querySelector('.desc').textContent, code: li.querySelector('.code').textContent
      };
    });
    var link = card.querySelector('.t'), shown = -1;
    function next() {
      shown = (shown + 1) % projects.length;
      var p = projects[shown];
      card.querySelector('.tint img').src = p.img;
      link.textContent = p.title;
      link.href = p.href;
      if (p.external) { link.target = '_blank'; link.rel = 'noopener'; }
      else { link.removeAttribute('target'); link.removeAttribute('rel'); }
      card.querySelector('.d').textContent = p.desc;
      card.querySelector('.c').textContent = p.code;
    }
    next();
    card.hidden = false;
    card.querySelector('.feature-close').addEventListener('click', function () { card.hidden = true; });

    var x = 40, y = 120, vx = 1.4, vy = 1.1, paused = false, EDGE = 16;
    card.addEventListener('mouseenter', function () { paused = true; });
    card.addEventListener('mouseleave', function () { paused = false; });
    card.addEventListener('focusin', function () { paused = true; });
    card.addEventListener('focusout', function () { paused = false; });
    function frame() {
      var maxX = document.documentElement.clientWidth - card.offsetWidth - EDGE;
      var maxY = window.innerHeight - card.offsetHeight - EDGE;
      if (!paused) {
        x += vx; y += vy;
        if (x <= EDGE || x >= maxX) { vx = -vx; x = Math.max(EDGE, Math.min(x, maxX)); next(); }
        if (y <= EDGE || y >= maxY) { vy = -vy; y = Math.max(EDGE, Math.min(y, maxY)); }
      }
      card.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      if (!card.hidden) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
})();
