// Superior Solutions Consulting — header, menu, reveals, scroll thread, pointer effects

(function () {
  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Header: solid border once scrolled, tucks away on scroll down ---------- */
  var lastY = window.scrollY;
  function updateHeader() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 24);
    var menuOpen = nav.classList.contains('open');
    if (!menuOpen && y > 480 && y > lastY + 4) header.classList.add('tucked');
    else if (y < lastY - 4 || y <= 480) header.classList.remove('tucked');
    lastY = y;
    var max = root.scrollHeight - window.innerHeight;
    header.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
  }

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  /* ---------- Hero headline: split into words for a staggered entrance ---------- */
  var h1 = document.querySelector('.hero h1.split');
  if (h1) {
    var words = h1.textContent.trim().split(/\s+/);
    h1.setAttribute('aria-label', h1.textContent.trim());
    h1.innerHTML = words.map(function (w, i) {
      return '<span class="w" aria-hidden="true" style="--i:' + i + '">' + w + '</span>';
    }).join(' ');
    h1.classList.add('is-split');
    requestAnimationFrame(function () { requestAnimationFrame(function () { h1.classList.add('in'); }); });
  }

  /* ---------- Copy email button ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var label = btn.querySelector('span');
    var use = btn.querySelector('use');
    btn.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
        btn.classList.add('done');
        label.textContent = 'Copied';
        use.setAttribute('href', '#i-check');
        setTimeout(function () {
          btn.classList.remove('done');
          label.textContent = 'Copy address';
          use.setAttribute('href', '#i-copy');
        }, 2000);
      });
    });
  });

  /* ---------- Contact form: send in the background, confirm on the page ---------- */
  var form = document.querySelector('.contact-form');
  var success = document.querySelector('.form-success');
  if (form && success && window.fetch) {
    var submitBtn = form.querySelector('[type="submit"]');
    var formError = form.querySelector('.form-error');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      formError.hidden = true;
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        form.hidden = true;
        success.hidden = false;
        success.focus({ preventScroll: true });
      }).catch(function () {
        formError.hidden = false;
      }).then(function () {
        submitBtn.disabled = false;
      });
    });
    success.querySelector('button').addEventListener('click', function () {
      success.hidden = true;
      form.hidden = false;
      form.querySelector('input:not([type="hidden"])').focus();
    });
  }

  /* ---------- Pointer effects (desktop only) ---------- */
  if (finePointer && !reduceMotion) {
    var hero = document.querySelector('.hero');
    var heroLogo = document.querySelector('.hero-logo');
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--hx', (px * 100).toFixed(2) + '%');
      hero.style.setProperty('--hy', (py * 100).toFixed(2) + '%');
      heroLogo.style.setProperty('--ty', ((px - 0.5) * 14).toFixed(2) + 'deg');
      heroLogo.style.setProperty('--tx', ((0.5 - py) * 10).toFixed(2) + 'deg');
    });
    hero.addEventListener('pointerleave', function () {
      heroLogo.style.setProperty('--tx', '0deg');
      heroLogo.style.setProperty('--ty', '0deg');
    });

    document.querySelectorAll('.spot').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Fallback when IntersectionObserver is missing ---------- */
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
    return;
  }

  /* ---------- Reveal on scroll ---------- */
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });

  /* ---------- Active nav link ---------- */
  var links = {};
  nav.querySelectorAll('a:not(.btn)').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var link = links[entry.target.id];
      if (link) link.classList.toggle('active', entry.isIntersecting);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['capabilities', 'about', 'contact'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) spy.observe(el);
  });

  /* ---------- Scroll thread ----------
     One line runs from the hero's scroll cue down the left gutter, through a node at each
     highlight ([data-node]), and ends at the footer mark. It draws itself as you scroll
     and lights each node (and the element it marks) as the glowing head passes. */
  var SVG = 'http://www.w3.org/2000/svg';
  var startEl = document.querySelector('[data-thread-start]');
  var endEl = document.querySelector('[data-thread-end]');
  var targets = Array.prototype.slice.call(document.querySelectorAll('[data-node]'));

  var svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('class', 'thread');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML =
    '<defs><linearGradient id="thread-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#c9ced6" stop-opacity=".25"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>' +
    '<path class="track"/><path class="trail"/><g class="nodes"></g><circle class="head" r="3"/>';
  document.body.appendChild(svg);
  var track = svg.querySelector('.track');
  var trail = svg.querySelector('.trail');
  var grad = svg.querySelector('#thread-grad');
  var nodeLayer = svg.querySelector('.nodes');
  var head = svg.querySelector('.head');

  var total = 0, samples = [], nodes = [], built = false;

  // Layout position on the page, ignoring transforms (reveal animations shift elements temporarily)
  function pageBox(el) {
    var x = 0, y = 0, e = el;
    while (e) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight };
  }

  function build() {
    svg.setAttribute('height', 0); // don't let a stale size hold the page open while measuring
    var docW = root.clientWidth;
    var docH = root.scrollHeight;
    svg.setAttribute('width', docW);
    svg.setAttribute('height', docH);
    svg.setAttribute('viewBox', '0 0 ' + docW + ' ' + docH);

    // Gutter just left of the content column
    var wrap = pageBox(document.querySelector('#capabilities .wrap'));
    var pad = parseFloat(getComputedStyle(document.querySelector('#capabilities .wrap')).paddingLeft);
    var contentLeft = wrap.x + pad;
    var gx = contentLeft > 120 ? contentLeft - 48 : Math.max(10, contentLeft / 2);

    var s = pageBox(startEl);
    var e = pageBox(endEl);
    var pts = [{ x: s.x + s.w / 2, y: s.y }];
    var marks = [];
    targets.forEach(function (el) {
      if (!el.offsetParent) return; // hidden (e.g. the form after it's sent)
      var b = pageBox(el);
      var p = { x: gx, y: b.y + b.h / 2 };
      pts.push(p);
      marks.push({ el: el, x: p.x, y: p.y });
    });
    pts.push({ x: e.x + e.w / 2, y: e.y - 6 }); // land just above the footer S

    // Smooth vertical S-curves between points, swaying gently in the gutter like the logo's swoosh
    var d = 'M' + pts[0].x + ' ' + pts[0].y;
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i];
      var dy = b.y - a.y;
      var sway = (a.x === gx && b.x === gx) ? (i % 2 ? 18 : -18) : 0;
      if (gx < 40 && sway) sway = sway / 3;
      d += ' C' + (a.x + sway) + ' ' + (a.y + dy * 0.5) + ' ' + (b.x + sway) + ' ' + (b.y - dy * 0.5) + ' ' + b.x + ' ' + b.y;
    }
    track.setAttribute('d', d);
    trail.setAttribute('d', d);
    grad.setAttribute('y1', pts[0].y);
    grad.setAttribute('y2', pts[pts.length - 1].y);

    total = trail.getTotalLength();
    trail.style.strokeDasharray = total + ' ' + total;

    // Length-by-height lookup so scroll position maps to how far the line has drawn
    samples = [];
    var steps = 400;
    for (var k = 0; k <= steps; k++) {
      var len = total * k / steps;
      samples.push({ len: len, y: trail.getPointAtLength(len).y });
    }

    // Nodes
    nodeLayer.innerHTML = '';
    nodes = marks.map(function (m) {
      var g = document.createElementNS(SVG, 'g');
      g.innerHTML = '<circle class="node-ring" cx="' + m.x + '" cy="' + m.y + '" r="5"/>' +
                    '<circle class="node" cx="' + m.x + '" cy="' + m.y + '" r="4.5"/>';
      nodeLayer.appendChild(g);
      return { g: g, el: m.el, y: m.y, lit: false };
    });
    built = true;
    draw();
  }

  function lengthAtY(y) {
    if (y <= samples[0].y) return 0;
    for (var i = 1; i < samples.length; i++) {
      if (samples[i].y >= y) {
        var a = samples[i - 1], b = samples[i];
        var t = (y - a.y) / ((b.y - a.y) || 1);
        return a.len + (b.len - a.len) * t;
      }
    }
    return total;
  }

  function draw() {
    if (!built) return;
    var atBottom = window.scrollY + window.innerHeight >= root.scrollHeight - 2;
    var headY = reduceMotion ? Infinity : (atBottom ? Infinity : window.scrollY + window.innerHeight * 0.62);
    var len = Math.min(total, lengthAtY(headY));
    trail.style.strokeDashoffset = total - len;
    var p = trail.getPointAtLength(len);
    head.setAttribute('cx', p.x);
    head.setAttribute('cy', p.y);
    head.style.opacity = len > 2 && len < total - 2 ? 1 : 0;
    nodes.forEach(function (n) {
      var on = p.y >= n.y - 1;
      if (on !== n.lit) {
        n.lit = on;
        n.g.classList.toggle('lit', on);
        n.el.classList.toggle('lit', on);
      }
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateHeader();
      draw();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  updateHeader();

  // Rebuild whenever layout shifts (fonts, images, resize)
  var rebuildTimer;
  function scheduleBuild() {
    clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(build, 120);
  }
  if ('ResizeObserver' in window) new ResizeObserver(scheduleBuild).observe(document.body);
  window.addEventListener('resize', scheduleBuild);
  window.addEventListener('load', build);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleBuild);
  build();
})();
