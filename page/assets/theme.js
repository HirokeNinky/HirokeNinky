/* Hiroke Ninky — Oni-Tech theme effects
   Injects the backdrop layers, draws a lightweight ember/rune particle
   canvas, and reveals sections as they scroll into view. */
(function(){
  // 1) Inject backdrop layers once, at the very start of <body>
  function injectBackdrop(){
    if (document.querySelector('.on-backdrop')) return;
    var wrap = document.createElement('div');
    wrap.className = 'on-backdrop';
    wrap.innerHTML = '<div class="on-symbol-layer"></div>';
    document.body.insertBefore(wrap, document.body.firstChild);

    var scan = document.createElement('div');
    scan.className = 'on-scanlines';
    document.body.insertBefore(scan, document.body.firstChild);

    var canvas = document.createElement('canvas');
    canvas.id = 'on-ember-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
  }

  // 2) Ember / rune particle field
  function startEmbers(){
    var canvas = document.getElementById('on-ember-canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var glyphs = ['鬼','魂','焔','影','雷','ꦱ','ꦸ','꧁','꧂','●','◆'];
    var particles = [];
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var count = Math.min(60, Math.floor(window.innerWidth / 22));
    if (reduceMotion) count = 0;

    function resize(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function spawn(){
      var palette = ['#ff2d55', '#f2b957', '#8b5cf6', '#33e8ff'];
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        size: 8 + Math.random() * 14,
        speed: 0.25 + Math.random() * 0.6,
        drift: (Math.random() - 0.5) * 0.4,
        glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: 0.08 + Math.random() * 0.22,
        life: Math.random() * 1
      };
    }
    for (var i = 0; i < count; i++){
      var p = spawn();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    function tick(){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++){
        var p = particles[i];
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y < -40){ particles[i] = spawn(); continue; }
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.font = p.size + 'px "Noto Serif JP", serif';
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fillText(p.glyph, p.x, p.y);
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(tick);
    }
    if (count > 0) requestAnimationFrame(tick);
  }

  // 3) Reveal sections/cards on scroll
  function startReveal(){
    // Auto-tag legacy component classes so older markup keeps working...
    var auto = document.querySelectorAll(
      '.social-box, .story-card, .about-grid, .profile-sidebar, .join-header, .post-card, .elegant-card, .on-reveal-auto'
    );
    auto.forEach(function(el){ el.classList.add('on-reveal'); });

    // ...but the real source of truth is any element already marked
    // .on-reveal in the markup (fixes cards that were invisible because
    // they were never picked up by the legacy selector list above).
    var targets = document.querySelectorAll('.on-reveal');

    // Stagger siblings inside the same reveal group for a cascading feel
    var seen = new Map();
    targets.forEach(function(el){
      var parent = el.parentElement || document.body;
      var i = seen.get(parent) || 0;
      el.style.setProperty('--on-delay', Math.min(i, 8) * 90 + 'ms');
      seen.set(parent, i + 1);
    });

    if (!('IntersectionObserver' in window)){
      targets.forEach(function(el){ el.classList.add('on-in'); });
      return;
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add('on-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function(el){ io.observe(el); });
  }

  // 4) Ambient "fuse" scroll progress bar
  function startProgressBar(){
    if (document.querySelector('.on-progress')) return;
    var bar = document.createElement('div');
    bar.className = 'on-progress';
    bar.innerHTML = '<i></i>';
    document.body.appendChild(bar);
    var fill = bar.querySelector('i');
    var ticking = false;
    function update(){
      var h = document.documentElement;
      var max = (h.scrollHeight - h.clientHeight) || 1;
      var pct = Math.max(0, Math.min(1, window.scrollY / max));
      fill.style.width = (pct * 100) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if (!ticking){ requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // 5) Tilt micro-interaction for .on-tilt cards (mouse only, respects
  // prefers-reduced-motion, degrades to no-op on touch)
  function startTilt(){
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || matchMedia('(hover: none)').matches) return;
    var cards = document.querySelectorAll('.on-tilt');
    cards.forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(700px) rotateX(' + (py * -7) + 'deg) rotateY(' + (px * 9) + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }

  // 6) Timeline "fuse fill" line, keyed off .lore-timeline (no-op elsewhere)
  function startTimelineFill(){
    var el = document.querySelector('.lore-timeline');
    if (!el) return;
    var ticking = false;
    function update(){
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight;
      var visible = Math.min(rect.height, Math.max(0, (vh * 0.8) - rect.top));
      var pct = rect.height > 0 ? Math.max(0, Math.min(1, visible / rect.height)) : 0;
      el.style.setProperty('--fill', (pct * 100) + '%');
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if (!ticking){ requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // 7) Duality toggle (Sealed / Unleashed), keyed off .duality-panel
  function startDuality(){
    var panel = document.querySelector('.duality-panel');
    if (!panel) return;
    var btns = panel.querySelectorAll('.duality-btn');
    btns.forEach(function(btn){
      btn.addEventListener('click', function(){
        var mode = btn.getAttribute('data-mode');
        panel.setAttribute('data-mode', mode);
        btns.forEach(function(b){
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
      });
    });
  }

  // 8) Full-screen preloader: shown from first paint (markup lives in each
  // page's HTML so it's visible even before this script runs), hidden once
  // the page has actually finished loading. Also re-shown briefly as an
  // "entering page" transition when navigating to another internal page.
  function startLoader(){
    var loader = document.getElementById('on-loader');
    if (!loader) return;

    var tagEl = loader.querySelector('[data-tag]');
    var tags = [
      'Membuka gerbang antar dunia…',
      'Menyalakan bara iblis…',
      'Menyusun garis torii…',
      'Merangkai filosofi Jawa…',
      'Menstabilkan dua jiwa…'
    ];
    var ti = 0, tagTimer = null;
    if (tagEl){
      tagTimer = setInterval(function(){
        ti = (ti + 1) % tags.length;
        tagEl.style.opacity = 0;
        setTimeout(function(){ tagEl.textContent = tags[ti]; tagEl.style.opacity = 1; }, 200);
      }, 1100);
    }

    var start = Date.now();
    var minTime = 550;
    var hidden = false;
    function hide(){
      if (hidden) return;
      hidden = true;
      var wait = Math.max(0, minTime - (Date.now() - start));
      setTimeout(function(){
        loader.classList.add('on-loader-hide');
        loader.setAttribute('aria-hidden', 'true');
        if (tagTimer) clearInterval(tagTimer);
      }, wait);
    }
    if (document.readyState === 'complete'){ hide(); }
    else { window.addEventListener('load', hide); }
    setTimeout(hide, 4000); // safety net if 'load' never fires cleanly

    // Re-arm + fade back in when leaving to another internal page
    document.addEventListener('click', function(e){
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest('a');
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 ||
          href.indexOf('tel:') === 0 || href.indexOf('javascript:') === 0) return;
      var url;
      try { url = new URL(href, window.location.href); } catch (err) { return; }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.hash) return;

      e.preventDefault();
      hidden = false;
      loader.classList.remove('on-loader-hide');
      loader.removeAttribute('aria-hidden');
      setTimeout(function(){ window.location.href = url.href; }, 420);
    });

    window.addEventListener('pageshow', function(e){
      if (e.persisted){
        hidden = true;
        loader.classList.add('on-loader-hide');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function(){
    startLoader();
    injectBackdrop();
    startEmbers();
    startReveal();
    startProgressBar();
    startTilt();
    startTimelineFill();
    startDuality();
  });
})();
