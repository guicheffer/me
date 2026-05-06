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

    // Ring expands on hover over links / buttons — skip non-interactive cards
    attachHoverCursor = function(root) {
      root.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        if (el._cursorBound) return;
        if (el.classList.contains('consulting-item')) return;
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
      'consulting.title':                    'AI <span>Consulting</span>',
      'consulting.intro':                    'I help companies, from startups to enterprises, and individuals looking to grow; move faster and ship with confidence by embedding AI deeply into their engineering and product workflows.',
      'consulting.services.title':           'What I can do for you',
      'consulting.services.teams.title':     'Training & AI adoption',
      'consulting.services.teams.desc':      'Workshops and 1:1 sessions for teams and individuals. I help you get genuinely good with AI tools, not just aware of them, so you start shipping work that would have taken three times as long before.',
      'consulting.services.sdlc.title':      'AI-driven development lifecycle',
      'consulting.services.sdlc.desc':       'I help engineering teams reshape how they build: from smarter code review to context-aware agents in the loop. The goal is speed you can trust, not speed that breaks things.',
      'consulting.services.tools.title':     'In-house AI tooling',
      'consulting.services.tools.desc':      'Build internal tools that actually get used. I help design and ship AI-powered workflows that cut busywork, surface what matters, and keep your data where it belongs.',
      'consulting.services.strategy.title':  'AI strategy & enablement',
      'consulting.services.strategy.desc':   'Not sure where to start? I look at what you\'re already doing, find the two or three things AI can change the most, and hand you a clear plan, not a slide deck.',
      'consulting.services.data.title':      'Data privacy & AI governance',
      'consulting.services.data.desc':       'Adopting AI without losing control of your data. I help you set boundaries that make sense: what goes in, what stays out, and how to stay compliant without slowing everything down.',
      'consulting.services.intro.title':     'Just a conversation',
      'consulting.services.intro.desc':      'Not sure what you need yet? That\'s fine. A relaxed, no-strings chat is often the best first step, and it costs nothing.',
      'consulting.contact.title':            'Let's talk',
      'consulting.contact.sub':              'no commitment, no pitch deck. Pick a channel.',
      'consulting.contact.cta.calendly':     'Book a free 30-min call',
      'consulting.contact.cta.linkedin':     'Message on LinkedIn',
      'consulting.contact.cta.prices':      'View pricing',
      'prices.back':               'Back to consulting',
      'prices.title':              'Pricing <span>&amp; Packages</span>',
      'prices.intro':              'Every engagement is different, so these are starting points — not fixed rules. We\'ll figure out the right format together before anything is agreed.',
      'prices.free.badge':         'Always free',
      'prices.free.name':          'Intro call',
      'prices.free.note':          '15 min · no commitment',
      'prices.free.f1':            'Quick chat to understand your situation',
      'prices.free.f2':            'I\'ll tell you honestly if I can help',
      'prices.free.f3':            'No prep needed, just show up',
      'prices.free.cta':           'Book on Calendly',
      'prices.starter.badge':      'Most popular',
      'prices.starter.name':       'Intro Session',
      'prices.starter.note':       '2h session + 1h follow-up within 2 weeks',
      'prices.starter.f1':         'Deep-dive into your specific challenge',
      'prices.starter.f2':         'Written summary of what we covered',
      'prices.starter.f3':         '1h follow-up: call or async, as we agree',
      'prices.starter.f4':         'Good for individuals or small teams',
      'prices.starter.cta':        'Get in touch',
      'prices.project.name':       'Project Sprint',
      'prices.project.note':       'Fixed scope · varies per client',
      'prices.project.f1':         'Workflow audit + prioritised AI roadmap',
      'prices.project.f2':         'Up to 5h of async support over 3 weeks',
      'prices.project.f3':         'Review session at the end',
      'prices.project.f4':         'Good for teams starting an AI initiative',
      'prices.project.cta':        'Let\'s talk scope',
      'prices.retainer.name':      'Monthly Retainer',
      'prices.retainer.note':      '/ month · ongoing support',
      'prices.retainer.f1':        'Regular check-ins, format up to us',
      'prices.retainer.f2':        'Async availability throughout the month',
      'prices.retainer.f3':        'Hands-on help as things come up',
      'prices.retainer.f4':        'Cancel any time, no lock-in',
      'prices.retainer.cta':       'Let\'s talk',
      'prices.aitools.title':      'AI tool costs are separate',
      'prices.aitools.desc':       'Any AI subscriptions we use together — <a href="https://claude.ai/download" target="_blank" rel="noopener noreferrer">Claude Desktop</a> for exploratory work, <a href="https://docs.anthropic.com/en/docs/claude-code" target="_blank" rel="noopener noreferrer">Claude Code CLI</a> for engineering workflows, GitHub Copilot, or others — are billed to you directly. I work with preference for Claude; it\'s what I use every day and know best. But I\'ll always recommend what actually fits your context.',
      'prices.payment.label':      'Payments via',
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
      'consulting.title':                    'IA & <span>Consultoria</span>',
      'consulting.intro':                    'Ajudo empresas, de startups a grandes corporações, e profissionais que querem crescer; a se moverem mais rápido e com mais confiança, integrando IA nos seus fluxos de engenharia e produto.',
      'consulting.services.title':           'O que posso fazer por você',
      'consulting.services.teams.title':     'Treinamento e adoção de IA',
      'consulting.services.teams.desc':      'Workshops e sessões individuais para times e autônomos. Te ajudo a ficar de verdade bom com IA, não só familiarizado, para que você entregue em horas o que antes levava dias.',
      'consulting.services.sdlc.title':      'Ciclo de desenvolvimento orientado por IA',
      'consulting.services.sdlc.desc':       'Ajudo times de engenharia a mudar como desenvolvem: desde revisões de código mais inteligentes até agentes no fluxo. O objetivo é velocidade em que você confia, não velocidade que quebra coisas.',
      'consulting.services.tools.title':     'Ferramentas de IA internas',
      'consulting.services.tools.desc':      'Ferramentas internas que as pessoas realmente usam. Ajudo a desenhar e construir fluxos com IA que cortam trabalho manual, trazem o que importa à superfície e mantêm seus dados onde devem estar.',
      'consulting.services.strategy.title':  'Estratégia e capacitação em IA',
      'consulting.services.strategy.desc':   'Não sabe por onde começar? Olho para o que você já faz, identifico as duas ou três coisas que a IA pode mudar mais, e entrego um plano claro, não uma apresentação.',
      'consulting.services.data.title':      'Privacidade de dados e governança de IA',
      'consulting.services.data.desc':       'Adotar IA sem perder o controle dos seus dados. Ajudo a definir limites que fazem sentido: o que entra, o que fica de fora, e como manter conformidade sem travar tudo.',
      'consulting.services.intro.title':     'Só uma conversa',
      'consulting.services.intro.desc':      'Ainda não sabe o que precisa? Tudo bem. Uma conversa tranquila e sem compromisso costuma ser o melhor primeiro passo, e não custa nada.',
      'consulting.contact.title':            'Fala comigo',
      'consulting.contact.sub':              'sem compromisso, sem pitch deck. Escolha um canal.',
      'consulting.contact.cta.calendly':     'Agendar call gratuita de 30 min',
      'consulting.contact.cta.linkedin':     'Mensagem no LinkedIn',
      'consulting.contact.cta.prices':      'Ver preços',
      'prices.back':               'Voltar para consultoria',
      'prices.title':              'Preços <span>&amp; Pacotes</span>',
      'prices.intro':              'Cada projeto é diferente, então esses são pontos de partida — não regras fixas. A gente define o formato certo juntos antes de qualquer coisa.',
      'prices.free.badge':         'Sempre gratuito',
      'prices.free.name':          'Intro call',
      'prices.free.note':          '15 min · sem compromisso',
      'prices.free.f1':            'Bate-papo rápido para entender sua situação',
      'prices.free.f2':            'Te digo com honestidade se consigo ajudar',
      'prices.free.f3':            'Sem preparação necessária, só apareça',
      'prices.free.cta':           'Agendar no Calendly',
      'prices.starter.badge':      'Mais popular',
      'prices.starter.name':       'Sessão Introdutória',
      'prices.starter.note':       '2h de sessão + 1h de follow-up em até 2 semanas',
      'prices.starter.f1':         'Mergulho fundo no seu desafio específico',
      'prices.starter.f2':         'Resumo escrito do que cobrimos',
      'prices.starter.f3':         '1h de follow-up: call ou assíncrono, como combinarmos',
      'prices.starter.f4':         'Ideal para indivíduos ou times pequenos',
      'prices.starter.cta':        'Entrar em contato',
      'prices.project.name':       'Sprint de Projeto',
      'prices.project.note':       'Escopo fixo · varia por cliente',
      'prices.project.f1':         'Diagnóstico de fluxo + roadmap de IA priorizado',
      'prices.project.f2':         'Até 5h de suporte assíncrono em 3 semanas',
      'prices.project.f3':         'Sessão de revisão ao final',
      'prices.project.f4':         'Ideal para times iniciando uma iniciativa de IA',
      'prices.project.cta':        'Vamos falar sobre o escopo',
      'prices.retainer.name':      'Retainer Mensal',
      'prices.retainer.note':      '/ mês · suporte contínuo',
      'prices.retainer.f1':        'Check-ins regulares, formato combinamos',
      'prices.retainer.f2':        'Disponibilidade assíncrona durante o mês',
      'prices.retainer.f3':        'Ajuda prática conforme as coisas surgem',
      'prices.retainer.f4':        'Cancele quando quiser, sem lock-in',
      'prices.retainer.cta':       'Vamos conversar',
      'prices.aitools.title':      'Custos de ferramentas de IA são separados',
      'prices.aitools.desc':       'Qualquer assinatura de IA que usarmos juntos — <a href="https://claude.ai/download" target="_blank" rel="noopener noreferrer">Claude Desktop</a> para exploração, <a href="https://docs.anthropic.com/en/docs/claude-code" target="_blank" rel="noopener noreferrer">Claude Code CLI</a> para fluxos de engenharia, GitHub Copilot, ou outros — é cobrada diretamente a você. Trabalho com preferência pelo Claude; é o que uso todo dia e conheço melhor. Mas sempre recomendo o que realmente faz sentido no seu contexto.',
      'prices.payment.label':      'Pagamentos via',
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
      'consulting.title':                    'KI-<span>Beratung</span>',
      'consulting.intro':                    'Ich helfe Unternehmen, von Startups bis zu Konzernen, sowie Einzelpersonen, die wachsen wollen; schneller zu liefern und mit mehr Zuversicht, indem KI tief in Engineering- und Produkt-Workflows eingebettet wird.',
      'consulting.services.title':           'Was ich für dich tun kann',
      'consulting.services.teams.title':     'Training & KI-Einführung',
      'consulting.services.teams.desc':      'Workshops und 1:1-Sessions für Teams und Einzelpersonen. Ich helfe dir, KI-Tools wirklich zu beherrschen, nicht nur zu kennen, sodass du Arbeit erledigst, die früher dreimal so lang gedauert hätte.',
      'consulting.services.sdlc.title':      'KI-getriebener Entwicklungszyklus',
      'consulting.services.sdlc.desc':       'Ich helfe Engineering-Teams, ihre Arbeitsweise zu verändern: von klügeren Code-Reviews bis zu Agenten im Entwicklungsfluss. Das Ziel ist Geschwindigkeit, der man vertrauen kann.',
      'consulting.services.tools.title':     'Interne KI-Werkzeuge',
      'consulting.services.tools.desc':      'Interne Tools, die tatsächlich genutzt werden. Ich helfe dabei, KI-gestützte Workflows zu entwickeln, die Routinearbeit kürzen, das Wesentliche sichtbar machen und deine Daten dort lassen, wo sie hingehören.',
      'consulting.services.strategy.title':  'KI-Strategie & Enablement',
      'consulting.services.strategy.desc':   'Weißt du nicht, wo du anfangen sollst? Ich schaue mir an, was du schon machst, finde die zwei oder drei Stellen, wo KI am meisten bringt, und gebe dir einen klaren Plan, kein Pitch-Deck.',
      'consulting.services.data.title':      'Datenschutz & KI-Governance',
      'consulting.services.data.desc':       'KI einführen, ohne die Kontrolle über deine Daten zu verlieren. Ich helfe dir, sinnvolle Grenzen zu setzen: was rein darf, was draußen bleibt, und wie du compliant bleibst, ohne alles zu bremsen.',
      'consulting.services.intro.title':     'Einfach reden',
      'consulting.services.intro.desc':      'Noch nicht sicher, was du brauchst? Kein Problem. Ein entspanntes, unverbindliches Gespräch ist oft der beste erste Schritt, und kostet nichts.',
      'consulting.contact.title':            'Lass uns reden',
      'consulting.contact.sub':              'kein Commitment, kein Pitch-Deck. Wähl einen Kanal.',
      'consulting.contact.cta.calendly':     'Kostenloses 30-min-Gespräch buchen',
      'consulting.contact.cta.linkedin':     'Nachricht auf LinkedIn',
      'consulting.contact.cta.prices':      'Preise ansehen',
      'prices.back':               'Zurück zur Beratung',
      'prices.title':              'Preise <span>&amp; Pakete</span>',
      'prices.intro':              'Jedes Engagement ist anders, daher sind das Ausgangspunkte — keine festen Regeln. Wir finden gemeinsam das richtige Format, bevor irgendetwas vereinbart wird.',
      'prices.free.badge':         'Immer kostenlos',
      'prices.free.name':          'Intro-Call',
      'prices.free.note':          '15 Min. · unverbindlich',
      'prices.free.f1':            'Kurzes Gespräch, um deine Situation zu verstehen',
      'prices.free.f2':            'Ich sage dir ehrlich, ob ich helfen kann',
      'prices.free.f3':            'Keine Vorbereitung nötig, einfach erscheinen',
      'prices.free.cta':           'Bei Calendly buchen',
      'prices.starter.badge':      'Am beliebtesten',
      'prices.starter.name':       'Intro-Session',
      'prices.starter.note':       '2h Session + 1h Follow-up innerhalb 2 Wochen',
      'prices.starter.f1':         'Tiefer Einblick in deine spezifische Herausforderung',
      'prices.starter.f2':         'Schriftliche Zusammenfassung des Gesprächs',
      'prices.starter.f3':         '1h Follow-up: Call oder asynchron, wie wir es vereinbaren',
      'prices.starter.f4':         'Gut für Einzelpersonen oder kleine Teams',
      'prices.starter.cta':        'Kontakt aufnehmen',
      'prices.project.name':       'Projekt-Sprint',
      'prices.project.note':       'Fester Umfang · variiert je nach Kunde',
      'prices.project.f1':         'Workflow-Analyse + priorisierte KI-Roadmap',
      'prices.project.f2':         'Bis zu 5h asynchroner Support über 3 Wochen',
      'prices.project.f3':         'Abschlussgespräch am Ende',
      'prices.project.f4':         'Gut für Teams, die eine KI-Initiative starten',
      'prices.project.cta':        'Umfang besprechen',
      'prices.retainer.name':      'Monatliches Retainer',
      'prices.retainer.note':      '/ Monat · laufender Support',
      'prices.retainer.f1':        'Regelmäßige Check-ins, Format nach Absprache',
      'prices.retainer.f2':        'Asynchrone Verfügbarkeit im ganzen Monat',
      'prices.retainer.f3':        'Konkrete Hilfe, wenn Dinge auftauchen',
      'prices.retainer.f4':        'Jederzeit kündbar, kein Lock-in',
      'prices.retainer.cta':       'Lass uns reden',
      'prices.aitools.title':      'KI-Tool-Kosten sind separat',
      'prices.aitools.desc':       'Alle KI-Abonnements, die wir gemeinsam nutzen — <a href="https://claude.ai/download" target="_blank" rel="noopener noreferrer">Claude Desktop</a> für explorative Arbeit, <a href="https://docs.anthropic.com/en/docs/claude-code" target="_blank" rel="noopener noreferrer">Claude Code CLI</a> für Engineering-Workflows, GitHub Copilot oder andere — werden direkt dir berechnet. Ich arbeite bevorzugt mit Claude; das ist das Tool, das ich täglich nutze und am besten kenne. Aber ich empfehle immer, was wirklich zu deinem Kontext passt.',
      'prices.payment.label':      'Zahlung per',
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
      'consulting.title':                    'IA & <span>Consultoría</span>',
      'consulting.intro':                    'Ayudo a empresas, desde startups hasta grandes corporaciones, y a profesionales que quieren crecer; a moverse más rápido y entregar con confianza, integrando IA en sus flujos de trabajo de ingeniería y producto.',
      'consulting.services.title':           'Lo que puedo hacer por ti',
      'consulting.services.teams.title':     'Formación y adopción de IA',
      'consulting.services.teams.desc':      'Talleres y sesiones individuales para equipos y autónomos. Te ayudo a dominar de verdad las herramientas de IA, no solo a conocerlas, para entregar en horas lo que antes llevaba días.',
      'consulting.services.sdlc.title':      'Ciclo de desarrollo impulsado por IA',
      'consulting.services.sdlc.desc':       'Ayudo a los equipos de ingeniería a cambiar cómo construyen: desde revisiones de código más inteligentes hasta agentes en el flujo. El objetivo es velocidad en la que puedes confiar.',
      'consulting.services.tools.title':     'Herramientas de IA internas',
      'consulting.services.tools.desc':      'Herramientas internas que la gente realmente usa. Ayudo a diseñar y construir flujos con IA que reducen el trabajo manual, sacan a la superficie lo que importa y mantienen tus datos donde deben estar.',
      'consulting.services.strategy.title':  'Estrategia y habilitación de IA',
      'consulting.services.strategy.desc':   '¿No sabes por dónde empezar? Miro lo que ya haces, identifico las dos o tres cosas que la IA puede cambiar más, y te doy un plan claro, no una presentación.',
      'consulting.services.data.title':      'Privacidad de datos y gobernanza de IA',
      'consulting.services.data.desc':       'Adoptar IA sin perder el control de tus datos. Te ayudo a establecer límites que tienen sentido: qué entra, qué se queda fuera, y cómo cumplir sin frenar todo.',
      'consulting.services.intro.title':     'Solo una charla',
      'consulting.services.intro.desc':      '¿Aún no sabes qué necesitas? No pasa nada. Una conversación tranquila y sin compromiso suele ser el mejor primer paso, y no cuesta nada.',
      'consulting.contact.title':            'Hablemos',
      'consulting.contact.sub':              'sin compromiso, sin pitch deck. Elige un canal.',
      'consulting.contact.cta.calendly':     'Reservar llamada gratuita de 30 min',
      'consulting.contact.cta.linkedin':     'Mensaje en LinkedIn',
      'consulting.contact.cta.prices':      'Ver precios',
      'prices.back':               'Volver a consultoría',
      'prices.title':              'Precios <span>&amp; Paquetes</span>',
      'prices.intro':              'Cada proyecto es diferente, así que estos son puntos de partida — no reglas fijas. Juntos encontraremos el formato adecuado antes de acordar nada.',
      'prices.free.badge':         'Siempre gratis',
      'prices.free.name':          'Intro call',
      'prices.free.note':          '15 min · sin compromiso',
      'prices.free.f1':            'Charla rápida para entender tu situación',
      'prices.free.f2':            'Te digo con honestidad si puedo ayudarte',
      'prices.free.f3':            'Sin preparación necesaria, solo aparece',
      'prices.free.cta':           'Reservar en Calendly',
      'prices.starter.badge':      'Más popular',
      'prices.starter.name':       'Sesión Introductoria',
      'prices.starter.note':       '2h de sesión + 1h de follow-up en 2 semanas',
      'prices.starter.f1':         'Inmersión profunda en tu desafío específico',
      'prices.starter.f2':         'Resumen escrito de lo que cubrimos',
      'prices.starter.f3':         '1h de follow-up: llamada o asíncrono, como acordemos',
      'prices.starter.f4':         'Ideal para individuos o equipos pequeños',
      'prices.starter.cta':        'Ponerse en contacto',
      'prices.project.name':       'Sprint de Proyecto',
      'prices.project.note':       'Alcance fijo · varía por cliente',
      'prices.project.f1':         'Auditoría de flujo + hoja de ruta de IA priorizada',
      'prices.project.f2':         'Hasta 5h de soporte asíncrono en 3 semanas',
      'prices.project.f3':         'Sesión de revisión al final',
      'prices.project.f4':         'Ideal para equipos que inician una iniciativa de IA',
      'prices.project.cta':        'Hablemos del alcance',
      'prices.retainer.name':      'Retainer Mensual',
      'prices.retainer.note':      '/ mes · soporte continuo',
      'prices.retainer.f1':        'Check-ins regulares, formato a acordar',
      'prices.retainer.f2':        'Disponibilidad asíncrona durante el mes',
      'prices.retainer.f3':        'Ayuda práctica cuando surgen cosas',
      'prices.retainer.f4':        'Cancela cuando quieras, sin lock-in',
      'prices.retainer.cta':       'Hablemos',
      'prices.aitools.title':      'Los costes de herramientas de IA son aparte',
      'prices.aitools.desc':       'Cualquier suscripción de IA que usemos juntos — <a href="https://claude.ai/download" target="_blank" rel="noopener noreferrer">Claude Desktop</a> para exploración, <a href="https://docs.anthropic.com/en/docs/claude-code" target="_blank" rel="noopener noreferrer">Claude Code CLI</a> para flujos de ingeniería, GitHub Copilot u otros — se factura directamente a ti. Trabajo con preferencia por Claude; es lo que uso cada día y conozco mejor. Pero siempre recomiendo lo que realmente encaja con tu contexto.',
      'prices.payment.label':      'Pagos via',
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
