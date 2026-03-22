// guicheffer.me — main script
// dev:  human-readable with comments
// prod: run `make build` to minify into dist/

(() => {
  /* ── Mobile sidebar ─────────────────────────────────────── */
  let isMobile = window.innerWidth <= 768;

  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menu-toggle');

  // Create backdrop overlay for mobile
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

  window.addEventListener('resize', () => {
    isMobile = window.innerWidth <= 768;
    if (!isMobile) closeSidebar();
  });

  /* ── Avatar easter egg ───────────────────────────────────── */
  const avatar = document.querySelector('.profile-pic img');
  if (avatar) {
    avatar.addEventListener('click', () => {
      avatar.classList.remove('bounce');
      void avatar.offsetWidth; // force reflow to restart animation
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

  /* ── Staggered entrance animations ───────────────────────── */
  // Elements with class .fade-up animate in as they enter the viewport
  const fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    fadeEls.forEach((el, i) => {
      el.style.transitionDelay = `${i * 75}ms`;
      io.observe(el);
    });
  }
})();
