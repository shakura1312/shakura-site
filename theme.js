// Footer "light mode/dark mode" toggle, plus the palette colours.
// Loaded in <head> so the theme and colours apply before the page paints (no flash).
// The site is dark by default, whatever the device setting, until the visitor picks light with the toggle.
// With JavaScript off, the site follows the device setting and the accent green is used throughout.
(function () {
  var root = document.documentElement;

  root.dataset.theme = 'dark';
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch (e) {}

  function sync() {
    var buttons = document.querySelectorAll('.theme button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].value === root.dataset.theme));
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

  // Palette (blue and purple brightened from #1464DE and #9E20E2 to read on black), each with the
  // text colour that reads on it. A new random colour, never the same twice running, for: each text
  // selection (--sel), each link hover (--hl), each project picked from the home headline (--tg), and
  // the home page wordmark on every load or return (--mark).
  var palette = { '#41AD49': '#000', '#FCEF65': '#000', '#4A8CFF': '#000', '#BD5CFF': '#000', '#FF0303': '#fff' };
  var colours = Object.keys(palette), last = {};
  function paint(name) {
    var c;
    do { c = colours[Math.floor(Math.random() * colours.length)]; } while (c === last[name]);
    last[name] = c;
    root.style.setProperty('--' + name, c);
    if (name === 'sel') root.style.setProperty('--sel-fg', palette[c]);
  }

  paint('sel');
  var selecting = false;
  document.addEventListener('selectionchange', function () {
    var s = document.getSelection(), has = !!s && !s.isCollapsed;
    if (has && !selecting) paint('sel');
    selecting = has;
  });

  paint('hl');
  document.addEventListener('mouseover', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (a && !a.contains(e.relatedTarget)) paint('hl');
  });

  paint('tg');
  window.addEventListener('hashchange', function () { paint('tg'); });

  if (root.classList.contains('home')) {
    paint('mark');
    window.addEventListener('pageshow', function (e) { if (e.persisted) paint('mark'); });
  }
})();
