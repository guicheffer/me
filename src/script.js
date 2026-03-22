// guicheffer.me — main script
// dev:  human-readable with comments
// prod: run `make build` to minify into dist/

(() => {
  const html = document.documentElement;

  /* ── Theme (light / dark) ───────────────────────────────── */
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon   = document.getElementById('theme-icon');

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  /* ── Performance / animations toggle ───────────────────── */
  const perfToggle = document.getElementById('perf-toggle');
  const perfIcon   = document.getElementById('perf-icon');

  // Default: animations ON. Off = 'false' in storage.
  const perfEnabled = localStorage.getItem('perf') !== 'false';
  applyPerf(perfEnabled);

  perfToggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-reduce-motion') === 'true' ? false : true;
    // "next" here means: should we reduce motion? true = reduce, false = full
    applyPerf(!next); // applyPerf(true) = animations on
    localStorage.setItem('perf', !next ? 'true' : 'false');
  });

  function applyPerf(enabled) {
    if (enabled) {
      html.removeAttribute('data-reduce-motion');
      perfToggle?.classList.remove('perf-off');
      if (perfIcon) perfIcon.className = 'fa-solid fa-bolt';
    } else {
      html.setAttribute('data-reduce-motion', 'true');
      perfToggle?.classList.add('perf-off');
      if (perfIcon) perfIcon.className = 'fa-solid fa-bolt';
    }
    if (perfToggle) {
      perfToggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      perfToggle.setAttribute('aria-label', enabled ? 'Disable animations' : 'Enable animations');
    }
  }

  /* ── SPA routing (pathname-based) ───────────────────────── */
  // /        → about section
  // /skills  → skills section
  function getSection() {
    return window.location.pathname.startsWith('/skills') ? 'skills' : 'about';
  }

  // Animate in a section by name
  function showSection(name, updateUrl) {
    const current = document.querySelector('.page-section.active');
    const next    = document.getElementById(`section-${name}`);
    if (!next) return;

    // Update nav aria-current + active class
    document.querySelectorAll('nav a[data-section]').forEach((a) => {
      const isCurrent = a.dataset.section === name;
      a.classList.toggle('active', isCurrent);
      a.setAttribute('aria-current', isCurrent ? 'page' : 'false');
    });

    if (current === next) {
      // Already visible — just make sure fade-ups have fired
      triggerFadeUps(next);
      return;
    }

    if (current) current.classList.remove('active');

    next.classList.add('entering');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        next.classList.remove('entering');
        next.classList.add('active');
        triggerFadeUps(next);
      });
    });

    if (updateUrl) {
      const path = name === 'about' ? '/' : `/${name}`;
      history.pushState({ section: name }, '', path);
    }
  }

  // Intercept internal nav clicks
  document.querySelectorAll('nav a[data-section]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.section, true);
    });
  });

  // Browser back/forward
  window.addEventListener('popstate', () => showSection(getSection(), false));

  // Initial render — based on current pathname
  showSection(getSection(), false);

  /* ── Fade-up entrance animations ─────────────────────────── */
  let io;

  function triggerFadeUps(container) {
    const els = container.querySelectorAll('.fade-up:not(.visible)');
    if (!els.length) return;

    if (!io) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.06 }
      );
    }

    els.forEach((el, i) => {
      el.style.transitionDelay = `${i * 70}ms`;
      io.observe(el);
    });
  }

  /* ── Mobile sidebar ─────────────────────────────────────── */
  let isMobile = window.innerWidth <= 768;

  const sidebar    = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  function openSidebar() {
    sidebar.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    menuToggle?.setAttribute('aria-expanded', 'true');
  }

  function closeSidebar() {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
    menuToggle?.setAttribute('aria-expanded', 'false');
  }

  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-controls', 'sidebar');
  menuToggle?.addEventListener('click', () => {
    if (!isMobile) return;
    sidebar.classList.contains('show') ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  document.querySelectorAll('nav a').forEach((a) => {
    a.addEventListener('click', () => { if (isMobile) closeSidebar(); });
  });

  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    if (!isMobile) closeSidebar();
  });

  /* ── Avatar click → go home ──────────────────────────────── */
  const avatar = document.querySelector('.profile-pic img');
  if (avatar) {
    avatar.setAttribute('role', 'button');
    avatar.setAttribute('tabindex', '0');
    avatar.setAttribute('title', 'Go home');

    function goHome() {
      avatar.classList.remove('bounce');
      void avatar.offsetWidth;
      avatar.classList.add('bounce');
      showSection('about', true);
    }

    avatar.addEventListener('click', goHome);
    avatar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goHome(); }
    });
  }

  /* ── Email copy-to-clipboard ─────────────────────────────── */
  const emailLink = document.querySelector('a[href^="mailto:"]');
  if (emailLink) {
    emailLink.classList.add('tooltip');
    const tip = document.createElement('span');
    tip.className = 'tooltip-text';
    tip.setAttribute('role', 'status');
    tip.setAttribute('aria-live', 'polite');
    tip.textContent = 'copied!';
    emailLink.appendChild(tip);

    emailLink.addEventListener('click', (e) => {
      e.preventDefault();
      const addr = emailLink.getAttribute('href').replace('mailto:', '');
      navigator.clipboard?.writeText(addr).then(() => {
        tip.classList.add('show');
        setTimeout(() => tip.classList.remove('show'), 2000);
      });
    });
  }

  /* ── Custom cursor ───────────────────────────────────────── */
  // Only on mouse devices (fine pointer). Mobile/touch: native cursor.
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasFinePointer) {
    const cursor     = document.createElement('div');
    const cursorGlow = document.createElement('div');
    cursor.className     = 'cursor';
    cursorGlow.className = 'cursor-glow';
    cursor.setAttribute('aria-hidden', 'true');
    cursorGlow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(cursorGlow);
    document.body.appendChild(cursor);

    function syncCursorVisibility() {
      const off = html.getAttribute('data-reduce-motion') === 'true';
      cursor.style.display     = off ? 'none' : 'block';
      cursorGlow.style.display = off ? 'none' : 'block';
    }

    syncCursorVisibility();
    // Re-check whenever the perf toggle is clicked
    perfToggle?.addEventListener('click', syncCursorVisibility);

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;
    let rafRunning = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
      if (!rafRunning) { rafRunning = true; animateGlow(); }
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.2;
      glowY += (mouseY - glowY) * 0.2;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top  = glowY + 'px';
      if (Math.abs(mouseX - glowX) > 0.1 || Math.abs(mouseY - glowY) > 0.1) {
        requestAnimationFrame(animateGlow);
      } else {
        rafRunning = false;
      }
    }

    // Ring expands on hover over links / buttons — add to existing + future elements
    function attachHoverCursor(root) {
      root.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        if (el._cursorBound) return;
        el._cursorBound = true;
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
      });
    }

    attachHoverCursor(document);
  }

  /* ── Click / hold ripple (sound-wave rings) ─────────────── */
  function spawnRipple(x, y) {
    if (html.getAttribute('data-reduce-motion') === 'true') return;

    const ripple = document.createElement('div');
    ripple.className  = 'click-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top  = y + 'px';
    document.body.appendChild(ripple);

    const RINGS = 3;
    let done = 0;

    for (let i = 0; i < RINGS; i++) {
      const ring = document.createElement('div');
      ring.className = 'click-ring';
      ring.style.animationDelay = `${i * 130}ms`;
      ring.addEventListener('animationend', () => {
        done++;
        if (done === RINGS) ripple.remove();
      });
      ripple.appendChild(ring);
    }
  }

  // Single click
  document.addEventListener('click', (e) => spawnRipple(e.clientX, e.clientY));

  // Hold + move: ripples trace the mouse path like sound waves drawing a trail.
  // When idle (no movement), pulses at same spot every ~420ms.
  const TRAIL_DIST = 24; // px between ripples while moving

  let isHolding  = false;
  let holdX = 0, holdY = 0;
  let trailX = 0, trailY = 0; // last position where a trail ripple was emitted
  let idleTimer = null;

  document.addEventListener('mousedown', (e) => {
    isHolding = true;
    holdX = trailX = e.clientX;
    holdY = trailY = e.clientY;
    // Idle pulse: fires only when the mouse hasn't moved enough for trail
    idleTimer = setInterval(() => {
      if (isHolding) spawnRipple(holdX, holdY);
    }, 420);
  });

  document.addEventListener('mousemove', (e) => {
    holdX = e.clientX;
    holdY = e.clientY;

    if (!isHolding) return;

    // Emit a ripple every TRAIL_DIST pixels of movement
    const dx   = holdX - trailX;
    const dy   = holdY - trailY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist >= TRAIL_DIST) {
      spawnRipple(holdX, holdY);
      trailX = holdX;
      trailY = holdY;
      // Reset idle timer so it doesn't double-fire right after a trail ripple
      clearInterval(idleTimer);
      idleTimer = setInterval(() => {
        if (isHolding) spawnRipple(holdX, holdY);
      }, 420);
    }
  });

  function stopHold() {
    isHolding = false;
    clearInterval(idleTimer);
    idleTimer = null;
  }

  document.addEventListener('mouseup', stopHold);
  document.addEventListener('mouseleave', stopHold);
})();
