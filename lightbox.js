// Click a project image to see it enlarged over the blurred page. Closes with the green "close ✕",
// a click outside the image, or Esc. Without JavaScript the images simply aren't clickable.
// Images inside links (the ARC1031 cow, which opens the booklet PDF) keep their link instead.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var images = document.querySelectorAll('.gallery img');
    if (!images.length || !window.HTMLDialogElement) return;

    var box = document.createElement('dialog');
    box.className = 'lightbox';
    box.setAttribute('aria-label', 'Enlarged image');
    box.innerHTML = '<button type="button" class="lightbox-close">close ✕</button><img alt="">';
    document.body.appendChild(box);
    var big = box.querySelector('img');

    function close() { box.close(); }
    box.querySelector('.lightbox-close').addEventListener('click', close);
    // The dialog is only as big as the image, so a click on it that isn't on the image or button is the backdrop.
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    box.addEventListener('close', function () { big.removeAttribute('src'); });

    for (var i = 0; i < images.length; i++) {
      var img = images[i];
      if (img.closest('a')) continue;
      img.classList.add('zoomable');
      img.tabIndex = 0;
      img.addEventListener('click', open);
      img.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open.call(this); }
      });
    }

    function open() {
      big.src = this.currentSrc || this.src;
      big.alt = this.alt;
      box.showModal();
    }
  });
})();
