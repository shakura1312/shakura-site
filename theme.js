// Footer "light mode/dark mode" toggle. The site's only script.
// Loaded in <head> so a saved choice applies before the page paints (no flash).
// With no saved choice, or with JavaScript off, the site follows the device setting.
(function () {
  var root = document.documentElement;
  var dark = window.matchMedia('(prefers-color-scheme: dark)');

  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch (e) {}

  function current() {
    return root.dataset.theme || (dark.matches ? 'dark' : 'light');
  }

  function sync() {
    var buttons = document.querySelectorAll('.theme button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].value === current()));
    }
    var toggles = document.querySelectorAll('.theme');
    for (var j = 0; j < toggles.length; j++) toggles[j].hidden = false;
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.theme button');
    if (!b) return;
    root.dataset.theme = b.value;
    try { localStorage.setItem('theme', b.value); } catch (e) {}
    sync();
  });

  document.addEventListener('DOMContentLoaded', sync);
  if (dark.addEventListener) dark.addEventListener('change', sync);
})();
