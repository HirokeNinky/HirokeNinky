/* Hiroke Ninky — mobile nav drawer controller
   Wires up the hamburger button injected in each page's header so the
   nav (.nav-right) becomes a real off-canvas menu on phones/tablets. */
(function () {
  function init() {
    var toggle = document.querySelector('.nav-hamburger');
    var nav = document.getElementById('navRight') || document.querySelector('.nav-right');
    var scrim = document.getElementById('navScrim') || document.querySelector('.nav-scrim');
    if (!toggle || !nav) return;

    function isOpen() { return nav.classList.contains('is-open'); }

    function open() {
      nav.classList.add('is-open');
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      if (scrim) scrim.classList.add('is-visible');
      document.body.classList.add('nav-locked');
    }

    function close() {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      if (scrim) scrim.classList.remove('is-visible');
      document.body.classList.remove('nav-locked');
    }

    toggle.addEventListener('click', function () {
      isOpen() ? close() : open();
    });

    if (scrim) scrim.addEventListener('click', close);

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && isOpen()) close();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
