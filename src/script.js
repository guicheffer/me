// guicheffer.me — main script
// dev:  human-readable with comments
// prod: run `make build` to minify into dist/

(() => {
  /* ── Theme (light / dark) ───────────────────────────────── */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // Persist theme across visits
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  /* ── SPA routing ─────────────────────────────────────────── */
  // Sections are identified by hash: #skills → section-skills, else section-about
  function getSection() {
    const hash = window.location.hash.replace('#', '');
    return hash === 'skills' ? 'skills' : 'about';
  }

  function showSection(name) {
    const current = document.querySelector('.page-section.active');
    const next = document.getElementById(`section-${name}`);
    if (!next || current === next) return;

    // Update nav active state
    document.querySelectorAll('nav a[data-section]').forEach((a) => {
      a.classList.toggle('active', a.dataset.section === name);
    });

    // Animate out current, animate in next
    if (current) current.classList.remove('active');

    next.classList.add('entering');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        next.classList.remove('entering');
        next.classList.add('active');
        // Trigger fade-up animations for the new section
        triggerFadeUps(next);
      });
    });
  }

  // Intercept internal nav link clicks (those with data-section)
  document.querySelectorAll('nav a[data-section]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const section = link.dataset.section;
      // External links (blog etc.) have no data-section, skip those
      if (!section) return;
      e.preventDefault();
      const hash = section === 'about' ? '' : `#${section}`;
      history.pushState(null, '', `/${hash}`);
      showSection(section);
    });
  });

  // Handle browser back/forward
  window.addEventListener('popstate', () => showSection(getSection()));

  // Load the right section on initial page load
  showSection(getSection());

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

  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');

  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.body.appendChild(overlay);

  function openSidebar() {
    sidebar.classList.add('show');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  menuToggle?.addEventListener('click', () => {
    if (!isMobile) return;
    sidebar.classList.contains('show') ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  // Close sidebar when a nav link is tapped on mobile
  document.querySelectorAll('nav a').forEach((a) => {
    a.addEventListener('click', () => {
      if (isMobile) closeSidebar();
    });
  });

  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    if (!isMobile) closeSidebar();
  });

  /* ── Avatar easter egg ───────────────────────────────────── */
  const avatar = document.querySelector('.profile-pic img');
  if (avatar) {
    avatar.addEventListener('click', () => {
      avatar.classList.remove('bounce');
      void avatar.offsetWidth;
      avatar.classList.add('bounce');
    });
  }

  /* ── Email copy-to-clipboard ─────────────────────────────── */
  const emailLink = document.querySelector('a[href^="mailto:"]');
  if (emailLink) {
    emailLink.classList.add('tooltip');
    const tip = document.createElement('span');
    tip.className = 'tooltip-text';
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
})();
