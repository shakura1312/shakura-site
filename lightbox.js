// Click a project image to see it enlarged over the blurred page, then step through the project's images
// like a carousel: the green ← → arrows, the arrow keys, or a swipe on a phone (it wraps around at the ends).
// Closes with the green "close ✕", a click outside the image, or Esc. Without JavaScript the images simply
// aren't clickable. Images inside links (the ARC1031 cow, which opens the booklet PDF) keep their link instead.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var images = [].filter.call(document.querySelectorAll('.gallery img'), function (img) { return !img.closest('a'); });
    if (!images.length || !window.HTMLDialogElement) return;

    var box = document.createElement('dialog');
    box.className = 'lightbox';
    box.setAttribute('aria-label', 'Enlarged image');
    box.innerHTML = '<button type="button" class="lightbox-close">close ✕</button>' +
      '<button type="button" class="lightbox-prev" aria-label="Previous image">←</button>' +
      '<button type="button" class="lightbox-next" aria-label="Next image">→</button><img alt="">';
    document.body.appendChild(box);
    var big = box.querySelector('img');
    if (images.length < 2) box.classList.add('single');

    function close() { box.close(); }
    box.querySelector('.lightbox-close').addEventListener('click', close);
    box.querySelector('.lightbox-prev').addEventListener('click', function () { step(-1); });
    box.querySelector('.lightbox-next').addEventListener('click', function () { step(1); });
    // The dialog is only as big as the image, so a click on it that isn't on the image or a button is the backdrop.
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    box.addEventListener('close', function () { big.removeAttribute('src'); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    var touchX = null;
    box.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    });

    images.forEach(function (img, i) {
      img.classList.add('zoomable');
      img.tabIndex = 0;
      img.addEventListener('click', function () { open(i); });
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    // Size: as large as fits with a 60px margin on every side, even if that means scaling the image up.
    // The enlarged image must also be at least 15% larger than in the grid; for the few very wide images
    // that already nearly fill the page width, the margin shrinks as needed, but never below 20px.
    var MARGIN = 60, MIN_MARGIN = 20, ratio = 1, current = 0;
    function fitWidth(m) {
      return Math.min(document.documentElement.clientWidth - 2 * m, (window.innerHeight - 2 * m) * ratio);
    }
    function fit() {
      var want = images[current].getBoundingClientRect().width * 1.15;
      var w = Math.max(fitWidth(MARGIN), Math.min(fitWidth(MIN_MARGIN), want));
      big.style.width = w + 'px';
      big.style.height = w / ratio + 'px';
    }
    window.addEventListener('resize', function () { if (box.open) fit(); });

    function show(i) {
      current = (i + images.length) % images.length;
      var img = images[current];
      ratio = (+img.getAttribute('width') || img.naturalWidth) / (+img.getAttribute('height') || img.naturalHeight);
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      fit();
    }
    function step(d) { show(current + d); }
    function open(i) {
      box.showModal();
      show(i);
    }
  });
})();
