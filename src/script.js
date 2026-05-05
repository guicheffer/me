// guicheffer.me — main script
// dev:  human-readable with comments
// prod: run `make build` to minify into dist/

(() => {
  const html = document.documentElement;

  // attachHoverCursor is defined in the cursor section below;
  // declared here so the i18n section (at the bottom) can call it.
  let attachHoverCursor = null;

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
    if (window.location.pathname.startsWith('/skills')) return 'skills';
    if (window.location.pathname.startsWith('/consulting')) return 'consulting';
    return 'about';
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

  // Intercept internal nav + inline SPA links (nav links don't change; inline ones are re-bound via applyLang)
  document.querySelectorAll('nav a[data-section]').forEach((link) => {
    link.dataset.spaBound = '1';
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
      glowX += (mouseX - glowX) * 0.35;
      glowY += (mouseY - glowY) * 0.35;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top  = glowY + 'px';
      if (Math.abs(mouseX - glowX) > 0.1 || Math.abs(mouseY - glowY) > 0.1) {
        requestAnimationFrame(animateGlow);
      } else {
        rafRunning = false;
      }
    }

    // Ring expands on hover over links / buttons — add to existing + future elements
    attachHoverCursor = function(root) {
      root.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        if (el._cursorBound) return;
        el._cursorBound = true;
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
      });
    };

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
  const TRAIL_DIST = 42; // px between ripples while moving

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
    }, 650);
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
      }, 650);
    }
  });

  function stopHold() {
    isHolding = false;
    clearInterval(idleTimer);
    idleTimer = null;
  }

  document.addEventListener('mouseup', stopHold);
  document.addEventListener('mouseleave', stopHold);

  /* ── i18n ────────────────────────────────────────────────── */
  const TRANSLATIONS = {
    en: {
      'nav.about':        'about me',
      'nav.skills':       'skills',
      'nav.consulting':   'consulting',
      '404.title':        'Page not found',
      '404.desc':         'This page disappeared, but I am still here.',
      '404.cta':          'take me to about me',
      'about.bio':        'I\'m a Staff Software Engineer @ <a href="https://www.hellofresh.de/" target="_blank" rel="noopener noreferrer">HelloFresh</a>, leading GenAI enablement, shaping an AI-driven software development lifecycle, and applying context engineering best practices along the way. Passionate about JavaScript, complex frontend applications, and great user experiences — plus a fan of chocolates.',
      'about.consulting': '<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Need help with AI adoption? <a href="/consulting" data-section="consulting" class="consulting-cta-link">See my consulting services.</a>',
      'cv.chat':          '<i class="fa-solid fa-phone" aria-hidden="true"></i> Want to chat? Schedule a call, <a target="_blank" href="https://calendly.com/guicheffer" rel="noopener noreferrer"> here</a>.',
      'cv.cv':            '<i class="fa-solid fa-id-card" aria-hidden="true"></i> Need my CV? Grab it on <a target="_blank" href="https://docs.google.com/document/d/1n3Tsnop2Ek7tyWDuGOzFYsZlJjhdNWMC2fgv0WvwDQk/edit?usp=sharing" rel="noopener noreferrer"> Docs </a> or download it in <a target="_blank" href="https://docs.google.com/document/d/1n3Tsnop2Ek7tyWDuGOzFYsZlJjhdNWMC2fgv0WvwDQk/export?format=pdf" rel="noopener noreferrer"> .pdf</a>.',
      'cv.cover':         '<i class="fa-solid fa-envelope" aria-hidden="true"></i> Looking for a cover letter? Message me <a href="https://linkedin.com/in/guicheffer/" target="_blank" rel="noopener noreferrer">on LinkedIn</a>!',
      'about.opensource': 'latest open source stuff',
      'consulting.intro': 'I help companies — from startups to enterprises — move faster and ship with confidence by embedding AI deeply into their engineering and product workflows.',
      'consulting.services.title':           'What I can do for you',
      'consulting.services.tools.title':     'In-house AI tooling',
      'consulting.services.tools.desc':      'Design and build internal AI-powered tools that automate repetitive tasks, surface insights, and accelerate your team — without sending your data to third-party SaaS.',
      'consulting.services.data.title':      'Data privacy & AI governance',
      'consulting.services.data.desc':       'Navigate AI adoption with confidence. I help you build guardrails that protect sensitive data, meet compliance requirements, and maintain full ownership of your context.',
      'consulting.services.sdlc.title':      'AI-driven development lifecycle',
      'consulting.services.sdlc.desc':       'From context engineering to AI-augmented code review, I help engineering teams reshape their SDLC to ship faster, with fewer regressions and higher developer confidence.',
      'consulting.services.strategy.title':  'AI strategy & enablement',
      'consulting.services.strategy.desc':   'Not sure where to start? I\'ll audit your current workflows, identify the highest-leverage AI opportunities, and give you a concrete, prioritised roadmap — not just a deck.',
      'consulting.services.teams.title':     'Team training & upskilling',
      'consulting.services.teams.desc':      'Hands-on workshops and coaching so your engineers and product people know how to prompt well, use AI agents effectively, and stay critical of what the models produce.',
      'consulting.contact.title':            'Let\'s talk',
      'consulting.contact.schedule':         '<i class="fa-solid fa-calendar-check" aria-hidden="true"></i> Schedule a free 30-minute intro call <a target="_blank" href="https://calendly.com/guicheffer" rel="noopener noreferrer">on Calendly</a>.',
      'consulting.contact.email':            '<i class="fa-solid fa-envelope" aria-hidden="true"></i> Or drop me a line at <a href="mailto:hi@guicheffer.me">hi@guicheffer.me</a> — I read every message.',
      'consulting.contact.linkedin':         '<i class="fa-brands fa-linkedin" aria-hidden="true"></i> You can also reach me <a href="https://linkedin.com/in/guicheffer/" target="_blank" rel="noopener noreferrer">on LinkedIn</a>.',
      'skills.title':     ' Some of my skills',
      'skills.lang':      'Programming Languages & Tools:',
      'skills.how':       '💻 How?',
      'skills.people':    'People-driven',
      'skills.leader':    'Team Leader',
      'skills.mobile':    'Mobile-First, Responsive Design',
      'skills.agile':     'Agile Development & Scrum-ish',
      'skills.testing':   'Cross Browser Testing & Debugging',
      'skills.teams':     'Cross-Functional Teams',
      'skills.hiring':    'Love hiring <i class="fa-solid fa-heart" aria-hidden="true"></i>',
      'tooltip.copied':   'copied!',
    },
    pt: {
      'nav.about':        'sobre mim',
      'nav.skills':       'habilidades',
      'nav.consulting':   'consultoria',
      '404.title':        'Página não encontrada',
      '404.desc':         'Essa página sumiu, mas eu ainda estou aqui.',
      '404.cta':          'voltar para sobre mim',
      'about.bio':        'Sou Staff Software Engineer na <a href="https://www.hellofresh.de/" target="_blank" rel="noopener noreferrer">HelloFresh</a>, liderando a adoção de GenAI, definindo um ciclo de desenvolvimento de software orientado por IA e aplicando boas práticas de context engineering no caminho. Apaixonado por JavaScript, aplicações frontend complexas e ótimas experiências de usuário — e fã de chocolates.',
      'about.consulting': '<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Precisa de ajuda com adoção de IA? <a href="/consulting" data-section="consulting" class="consulting-cta-link">Veja meus serviços de consultoria.</a>',
      'cv.chat':          '<i class="fa-solid fa-phone" aria-hidden="true"></i> Quer conversar? Agende uma call <a target="_blank" href="https://calendly.com/guicheffer" rel="noopener noreferrer"> aqui</a>.',
      'cv.cv':            '<i class="fa-solid fa-id-card" aria-hidden="true"></i> Precisa do meu CV? Veja no <a target="_blank" href="https://docs.google.com/document/d/1n3Tsnop2Ek7tyWDuGOzFYsZlJjhdNWMC2fgv0WvwDQk/edit?usp=sharing" rel="noopener noreferrer"> Docs </a> ou baixe em <a target="_blank" href="https://docs.google.com/document/d/1n3Tsnop2Ek7tyWDuGOzFYsZlJjhdNWMC2fgv0WvwDQk/export?format=pdf" rel="noopener noreferrer"> .pdf</a>.',
      'cv.cover':         '<i class="fa-solid fa-envelope" aria-hidden="true"></i> Precisa de uma carta de apresentação? Me chame <a href="https://linkedin.com/in/guicheffer/" target="_blank" rel="noopener noreferrer">no LinkedIn</a>!',
      'about.opensource': 'projetos open source recentes',
      'consulting.intro': 'Ajudo empresas — de startups a grandes corporações — a se moverem mais rápido e com mais confiança, integrando IA profundamente nos seus fluxos de engenharia e produto.',
      'consulting.services.title':           'O que posso fazer por você',
      'consulting.services.tools.title':     'Ferramentas de IA internas',
      'consulting.services.tools.desc':      'Projeto e construção de ferramentas internas com IA que automatizam tarefas repetitivas, geram insights e aceleram seu time — sem enviar seus dados para SaaS de terceiros.',
      'consulting.services.data.title':      'Privacidade de dados e governança de IA',
      'consulting.services.data.desc':       'Adote IA com segurança. Ajudo a construir guardrails que protegem dados sensíveis, atendem requisitos de conformidade e mantêm o controle total sobre seu contexto.',
      'consulting.services.sdlc.title':      'Ciclo de desenvolvimento orientado por IA',
      'consulting.services.sdlc.desc':       'De context engineering a code review com IA, ajudo times de engenharia a remodelar seu SDLC para entregar mais rápido, com menos regressões e mais confiança.',
      'consulting.services.strategy.title':  'Estratégia e capacitação em IA',
      'consulting.services.strategy.desc':   'Não sabe por onde começar? Faço um diagnóstico dos seus fluxos atuais, identifico as oportunidades de maior impacto com IA e entrego um roadmap concreto — não só slides.',
      'consulting.services.teams.title':     'Treinamento e capacitação de times',
      'consulting.services.teams.desc':      'Workshops e mentoria práticos para que seus engenheiros e pessoas de produto saibam usar IA de forma eficaz, prompts bem escritos e senso crítico sobre o que os modelos produzem.',
      'consulting.contact.title':            'Vamos conversar',
      'consulting.contact.schedule':         '<i class="fa-solid fa-calendar-check" aria-hidden="true"></i> Agende uma call introdutória gratuita de 30 minutos <a target="_blank" href="https://calendly.com/guicheffer" rel="noopener noreferrer">no Calendly</a>.',
      'consulting.contact.email':            '<i class="fa-solid fa-envelope" aria-hidden="true"></i> Ou me mande um e-mail em <a href="mailto:hi@guicheffer.me">hi@guicheffer.me</a> — eu leio tudo.',
      'consulting.contact.linkedin':         '<i class="fa-brands fa-linkedin" aria-hidden="true"></i> Você também pode me encontrar <a href="https://linkedin.com/in/guicheffer/" target="_blank" rel="noopener noreferrer">no LinkedIn</a>.',
      'skills.title':     ' Algumas das minhas habilidades',
      'skills.lang':      'Linguagens de Programação & Ferramentas:',
      'skills.how':       '💻 Como?',
      'skills.people':    'Foco em pessoas',
      'skills.leader':    'Líder de equipe',
      'skills.mobile':    'Mobile-First, Design Responsivo',
      'skills.agile':     'Desenvolvimento Ágil & Scrum-ish',
      'skills.testing':   'Testes Cross Browser & Debugging',
      'skills.teams':     'Times Multifuncionais',
      'skills.hiring':    'Adoro contratar <i class="fa-solid fa-heart" aria-hidden="true"></i>',
      'tooltip.copied':   'copiado!',
    },
    de: {
      'nav.about':        'über mich',
      'nav.skills':       'fähigkeiten',
      'nav.consulting':   'beratung',
      '404.title':        'Seite nicht gefunden',
      '404.desc':         'Diese Seite ist verschwunden, aber ich bin noch hier.',
      '404.cta':          'zurück zu über mich',
      'about.bio':        'Ich bin Staff Software Engineer bei <a href="https://www.hellofresh.de/" target="_blank" rel="noopener noreferrer">HelloFresh</a>, leite die GenAI-Einführung, gestalte einen KI-gestützten Software-Entwicklungszyklus und wende dabei Best Practices im Context Engineering an. Leidenschaftlich für JavaScript, komplexe Frontend-Anwendungen und großartige Nutzererlebnisse — und ein Schokoladenliebhaber.',
      'about.consulting': '<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Hilfe bei der KI-Einführung gesucht? <a href="/consulting" data-section="consulting" class="consulting-cta-link">Meine Beratungsleistungen ansehen.</a>',
      'cv.chat':          '<i class="fa-solid fa-phone" aria-hidden="true"></i> Möchtest du reden? Termin vereinbaren <a target="_blank" href="https://calendly.com/guicheffer" rel="noopener noreferrer"> hier</a>.',
      'cv.cv':            '<i class="fa-solid fa-id-card" aria-hidden="true"></i> Lebenslauf gewünscht? Ansehen auf <a target="_blank" href="https://docs.google.com/document/d/1n3Tsnop2Ek7tyWDuGOzFYsZlJjhdNWMC2fgv0WvwDQk/edit?usp=sharing" rel="noopener noreferrer"> Docs </a> oder herunterladen als <a target="_blank" href="https://docs.google.com/document/d/1n3Tsnop2Ek7tyWDuGOzFYsZlJjhdNWMC2fgv0WvwDQk/export?format=pdf" rel="noopener noreferrer"> .pdf</a>.',
      'cv.cover':         '<i class="fa-solid fa-envelope" aria-hidden="true"></i> Anschreiben gewünscht? Schreib mir <a href="https://linkedin.com/in/guicheffer/" target="_blank" rel="noopener noreferrer">auf LinkedIn</a>!',
      'about.opensource': 'neueste Open-Source-Projekte',
      'consulting.intro': 'Ich helfe Unternehmen — von Startups bis zu Konzernen — schneller zu liefern und mit mehr Zuversicht zu arbeiten, indem KI tief in ihre Engineering- und Produkt-Workflows eingebettet wird.',
      'consulting.services.title':           'Was ich für dich tun kann',
      'consulting.services.tools.title':     'Interne KI-Werkzeuge',
      'consulting.services.tools.desc':      'Design und Entwicklung interner KI-gestützter Tools, die repetitive Aufgaben automatisieren, Erkenntnisse liefern und dein Team beschleunigen — ohne deine Daten an Drittanbieter zu senden.',
      'consulting.services.data.title':      'Datenschutz & KI-Governance',
      'consulting.services.data.desc':       'KI-Einführung mit Vertrauen. Ich helfe dir, Leitplanken zu bauen, die sensible Daten schützen, Compliance-Anforderungen erfüllen und die vollständige Kontrolle über deinen Kontext sichern.',
      'consulting.services.sdlc.title':      'KI-getriebener Entwicklungszyklus',
      'consulting.services.sdlc.desc':       'Von Context Engineering bis KI-gestütztem Code Review helfe ich Engineering-Teams, ihren SDLC umzugestalten — für schnellere Lieferung, weniger Regressionen und höheres Vertrauen.',
      'consulting.services.strategy.title':  'KI-Strategie & Enablement',
      'consulting.services.strategy.desc':   'Weißt du nicht, wo du anfangen sollst? Ich analysiere deine aktuellen Workflows, identifiziere die wirkungsvollsten KI-Chancen und liefere eine konkrete, priorisierte Roadmap — kein leeres Deck.',
      'consulting.services.teams.title':     'Team-Training & Upskilling',
      'consulting.services.teams.desc':      'Praxisnahe Workshops und Coaching, damit deine Entwickler und Produktmenschen wissen, wie man effektiv prompted, KI-Agenten nutzt und die Modellergebnisse kritisch bewertet.',
      'consulting.contact.title':            'Lass uns reden',
      'consulting.contact.schedule':         '<i class="fa-solid fa-calendar-check" aria-hidden="true"></i> Vereinbare ein kostenloses 30-minütiges Erstgespräch <a target="_blank" href="https://calendly.com/guicheffer" rel="noopener noreferrer">auf Calendly</a>.',
      'consulting.contact.email':            '<i class="fa-solid fa-envelope" aria-hidden="true"></i> Oder schreib mir an <a href="mailto:hi@guicheffer.me">hi@guicheffer.me</a> — ich lese jede Nachricht.',
      'consulting.contact.linkedin':         '<i class="fa-brands fa-linkedin" aria-hidden="true"></i> Du kannst mich auch <a href="https://linkedin.com/in/guicheffer/" target="_blank" rel="noopener noreferrer">auf LinkedIn</a> erreichen.',
      'skills.title':     ' Einige meiner Fähigkeiten',
      'skills.lang':      'Programmiersprachen & Werkzeuge:',
      'skills.how':       '💻 Wie?',
      'skills.people':    'Menschenzentriert',
      'skills.leader':    'Teamleiter',
      'skills.mobile':    'Mobile-First, Responsives Design',
      'skills.agile':     'Agile Entwicklung & Scrum-ish',
      'skills.testing':   'Cross-Browser-Testing & Debugging',
      'skills.teams':     'Funktionsübergreifende Teams',
      'skills.hiring':    'Ich liebe es einzustellen <i class="fa-solid fa-heart" aria-hidden="true"></i>',
      'tooltip.copied':   'kopiert!',
    },
    es: {
      'nav.about':        'sobre mí',
      'nav.skills':       'habilidades',
      'nav.consulting':   'consultoría',
      '404.title':        'Página no encontrada',
      '404.desc':         'Esta página desapareció, pero yo sigo aquí.',
      '404.cta':          'volver a sobre mí',
      'about.bio':        'Soy Staff Software Engineer en <a href="https://www.hellofresh.de/" target="_blank" rel="noopener noreferrer">HelloFresh</a>, liderando la adopción de GenAI, definiendo un ciclo de desarrollo de software impulsado por IA y aplicando buenas prácticas de context engineering en el proceso. Apasionado por JavaScript, aplicaciones frontend complejas y grandes experiencias de usuario — y fanático del chocolate.',
      'about.consulting': '<i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> ¿Necesitas ayuda con la adopción de IA? <a href="/consulting" data-section="consulting" class="consulting-cta-link">Mira mis servicios de consultoría.</a>',
      'cv.chat':          '<i class="fa-solid fa-phone" aria-hidden="true"></i> ¿Quieres charlar? Programa una llamada <a target="_blank" href="https://calendly.com/guicheffer" rel="noopener noreferrer"> aquí</a>.',
      'cv.cv':            '<i class="fa-solid fa-id-card" aria-hidden="true"></i> ¿Necesitas mi CV? Vélo en <a target="_blank" href="https://docs.google.com/document/d/1n3Tsnop2Ek7tyWDuGOzFYsZlJjhdNWMC2fgv0WvwDQk/edit?usp=sharing" rel="noopener noreferrer"> Docs </a> o descárgalo en <a target="_blank" href="https://docs.google.com/document/d/1n3Tsnop2Ek7tyWDuGOzFYsZlJjhdNWMC2fgv0WvwDQk/export?format=pdf" rel="noopener noreferrer"> .pdf</a>.',
      'cv.cover':         '<i class="fa-solid fa-envelope" aria-hidden="true"></i> ¿Buscas una carta de presentación? Escríbeme <a href="https://linkedin.com/in/guicheffer/" target="_blank" rel="noopener noreferrer">en LinkedIn</a>!',
      'about.opensource': 'proyectos open source recientes',
      'consulting.intro': 'Ayudo a empresas — desde startups hasta grandes corporaciones — a moverse más rápido y entregar con confianza, integrando IA profundamente en sus flujos de trabajo de ingeniería y producto.',
      'consulting.services.title':           'Lo que puedo hacer por ti',
      'consulting.services.tools.title':     'Herramientas de IA internas',
      'consulting.services.tools.desc':      'Diseño y desarrollo de herramientas internas con IA que automatizan tareas repetitivas, generan insights y aceleran a tu equipo — sin enviar tus datos a SaaS de terceros.',
      'consulting.services.data.title':      'Privacidad de datos y gobernanza de IA',
      'consulting.services.data.desc':       'Adopta IA con confianza. Te ayudo a crear barreras que protegen datos sensibles, cumplen requisitos de cumplimiento y mantienen el control total sobre tu contexto.',
      'consulting.services.sdlc.title':      'Ciclo de desarrollo impulsado por IA',
      'consulting.services.sdlc.desc':       'Desde context engineering hasta revisión de código con IA, ayudo a los equipos de ingeniería a rediseñar su SDLC para entregar más rápido, con menos regresiones y mayor confianza.',
      'consulting.services.strategy.title':  'Estrategia y habilitación de IA',
      'consulting.services.strategy.desc':   '¿No sabes por dónde empezar? Analizo tus flujos de trabajo actuales, identifico las oportunidades de mayor impacto con IA y entrego un roadmap concreto y priorizado — no solo diapositivas.',
      'consulting.services.teams.title':     'Formación y capacitación de equipos',
      'consulting.services.teams.desc':      'Talleres prácticos y coaching para que tus ingenieros y personas de producto sepan hacer prompts efectivos, usar agentes de IA y mantener sentido crítico sobre lo que producen los modelos.',
      'consulting.contact.title':            'Hablemos',
      'consulting.contact.schedule':         '<i class="fa-solid fa-calendar-check" aria-hidden="true"></i> Programa una llamada introductoria gratuita de 30 minutos <a target="_blank" href="https://calendly.com/guicheffer" rel="noopener noreferrer">en Calendly</a>.',
      'consulting.contact.email':            '<i class="fa-solid fa-envelope" aria-hidden="true"></i> O escríbeme a <a href="mailto:hi@guicheffer.me">hi@guicheffer.me</a> — leo cada mensaje.',
      'consulting.contact.linkedin':         '<i class="fa-brands fa-linkedin" aria-hidden="true"></i> También puedes encontrarme <a href="https://linkedin.com/in/guicheffer/" target="_blank" rel="noopener noreferrer">en LinkedIn</a>.',
      'skills.title':     ' Algunas de mis habilidades',
      'skills.lang':      'Lenguajes de programación & herramientas:',
      'skills.how':       '💻 ¿Cómo?',
      'skills.people':    'Orientado a personas',
      'skills.leader':    'Líder de equipo',
      'skills.mobile':    'Mobile-First, Diseño Responsivo',
      'skills.agile':     'Desarrollo Ágil & Scrum-ish',
      'skills.testing':   'Pruebas Cross Browser & Debugging',
      'skills.teams':     'Equipos Multifuncionales',
      'skills.hiring':    'Me encanta contratar <i class="fa-solid fa-heart" aria-hidden="true"></i>',
      'tooltip.copied':   '¡copiado!',
    },
  };

  function detectLang() {
    // One-time migration: old script saved auto-detected lang under 'lang' key.
    // That key is unreliable (was set even for auto-detects), so clear it.
    localStorage.removeItem('lang');

    // Only use saved pref if the user explicitly chose it via the picker.
    // Otherwise always re-detect from the browser so a system language change
    // is picked up on next visit.
    const manual = localStorage.getItem('lang-manual');
    if (manual && TRANSLATIONS[manual]) return manual;
    const langs = navigator.languages || [navigator.language || 'en'];
    for (const l of langs) {
      const code = l.split('-')[0].toLowerCase();
      if (TRANSLATIONS[code]) return code;
    }
    return 'en';
  }

  function applyLang(lang, persist) {
    const t = TRANSLATIONS[lang];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (t[key] !== undefined) el.textContent = t[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.dataset.i18nHtml;
      if (t[key] !== undefined) el.innerHTML = t[key];
    });

    // Update tooltip text
    const tip = document.querySelector('.tooltip-text');
    if (tip) tip.textContent = t['tooltip.copied'] || 'copied!';

    // Update active state on lang option buttons
    document.querySelectorAll('.lang-option').forEach((btn) => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    document.documentElement.lang = lang;

    // Only persist when the user manually picked the language
    if (persist) localStorage.setItem('lang-manual', lang);

    // Re-bind cursor hover listeners to any newly created links
    if (attachHoverCursor) attachHoverCursor(document);

    // Re-bind SPA navigation to any inline data-section links recreated by i18n
    document.querySelectorAll('a[data-section]:not([data-spa-bound])').forEach((link) => {
      link.dataset.spaBound = '1';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(link.dataset.section, true);
      });
    });
  }

  // Detect on load and apply (no persist — browser lang changes should be respected)
  applyLang(detectLang(), false);

  // Lang picker toggle
  const langToggle   = document.getElementById('lang-toggle');
  const langDropdown = document.getElementById('lang-dropdown');
  const langPicker   = document.getElementById('lang-picker');

  langToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langDropdown.classList.contains('open');
    langDropdown.classList.toggle('open', !isOpen);
    langToggle.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
  });

  document.querySelectorAll('.lang-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyLang(btn.dataset.lang, true);
      langDropdown.classList.remove('open');
      langToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (langPicker && !langPicker.contains(e.target)) {
      langDropdown?.classList.remove('open');
      langToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  // Close dropdown on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && langDropdown?.classList.contains('open')) {
      langDropdown.classList.remove('open');
      langToggle?.setAttribute('aria-expanded', 'false');
      langToggle?.focus();
    }
  });

  /* ── Background globe ────────────────────────────────────── */
  const globeCanvas = document.getElementById('globe-canvas');
  if (globeCanvas) {
    const ctx = globeCanvas.getContext('2d');
    const POINT_COUNT = 160;
    const CONNECT_DIST = 0.34;
    let globeRaf = 0;
    let rotation = 0;

    const points = [];
    for (let i = 0; i < POINT_COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      points.push({ phi, theta });
    }

    function resizeGlobe() {
      const rect = globeCanvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      globeCanvas.width = rect.width * dpr;
      globeCanvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeGlobe();
    window.addEventListener('resize', resizeGlobe);

    function project(phi, theta, rot) {
      const x = Math.sin(phi) * Math.cos(theta + rot);
      const y = Math.cos(phi);
      const z = Math.sin(phi) * Math.sin(theta + rot);
      return { x, y, z };
    }

    function drawGlobe() {
      if (html.getAttribute('data-reduce-motion') === 'true') {
        globeRaf = 0;
        return;
      }

      const w = globeCanvas.clientWidth;
      const h = globeCanvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.42;

      ctx.clearRect(0, 0, w, h);

      const isDark = html.getAttribute('data-theme') !== 'light';
      const baseColor = isDark ? '168, 85, 247' : '124, 58, 237';

      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.1);
      grad.addColorStop(0, `rgba(${baseColor}, 0.7)`);
      grad.addColorStop(0.4, `rgba(${baseColor}, 0.3)`);
      grad.addColorStop(0.7, `rgba(${baseColor}, 0.08)`);
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.1, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      const projected = points.map(p => {
        const { x, y, z } = project(p.phi, p.theta, rotation);
        return {
          sx: cx + x * r,
          sy: cy + y * r,
          z,
        };
      });

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          if (a.z < 0 && b.z < 0) continue;
          const dx = (a.sx - b.sx) / r;
          const dy = (a.sy - b.sy) / r;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * Math.min(a.z + 0.5, 1) * Math.min(b.z + 0.5, 1) * 1;
            if (alpha > 0.01) {
              ctx.beginPath();
              ctx.moveTo(a.sx, a.sy);
              ctx.lineTo(b.sx, b.sy);
              ctx.strokeStyle = `rgba(${baseColor}, ${alpha})`;
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }
          }
        }
      }

      for (const p of projected) {
        if (p.z < -0.1) continue;
        const alpha = Math.min(1, Math.max(0, (p.z + 0.3) * 1.2));
        const size = 2.6 + p.z * 1.8;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${baseColor}, ${alpha})`;
        ctx.fill();
      }

      rotation += 0.003;
      globeRaf = requestAnimationFrame(drawGlobe);
    }

    function startGlobe() {
      if (!globeRaf && html.getAttribute('data-reduce-motion') !== 'true') {
        globeRaf = requestAnimationFrame(drawGlobe);
      }
    }

    function stopGlobe() {
      if (globeRaf) {
        cancelAnimationFrame(globeRaf);
        globeRaf = 0;
      }
    }

    startGlobe();
    perfToggle?.addEventListener('click', () => {
      setTimeout(() => {
        if (html.getAttribute('data-reduce-motion') === 'true') stopGlobe();
        else startGlobe();
      }, 50);
    });
  }

  /* ── 404 scene parallax ─────────────────────────────────── */
  const notFoundScene = document.querySelector('[data-not-found-scene]');
  if (notFoundScene) {
    const canParallax = window.matchMedia('(hover: hover) and (pointer: fine)');
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    function isMotionReduced() {
      return html.getAttribute('data-reduce-motion') === 'true';
    }

    function paintScene() {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      notFoundScene.style.setProperty('--mx', currentX.toFixed(3));
      notFoundScene.style.setProperty('--my', currentY.toFixed(3));

      if (Math.abs(targetX - currentX) > 0.002 || Math.abs(targetY - currentY) > 0.002) {
        rafId = requestAnimationFrame(paintScene);
      } else {
        rafId = 0;
      }
    }

    function queuePaint() {
      if (!rafId) rafId = requestAnimationFrame(paintScene);
    }

    function resetScene() {
      targetX = 0;
      targetY = 0;
      queuePaint();
    }

    notFoundScene.addEventListener('pointermove', (event) => {
      if (!canParallax.matches || isMotionReduced()) return;

      const rect = notFoundScene.getBoundingClientRect();
      const nextX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const nextY = ((event.clientY - rect.top) / rect.height) * 2 - 1;

      targetX = Math.max(-1, Math.min(1, nextX));
      targetY = Math.max(-1, Math.min(1, nextY));
      queuePaint();
    });

    notFoundScene.addEventListener('pointerleave', resetScene);
    perfToggle?.addEventListener('click', () => {
      if (isMotionReduced()) resetScene();
    });
  }
})();
