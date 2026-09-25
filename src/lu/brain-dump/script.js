const STORAGE_KEY = 'brainDump.entries.v1';
const THEME_KEY = 'brainDump.theme';
const NAME_KEY = 'brainDump.userName';
const DOC_TITLE = 'Brain Dump — Diário';

const MOOD_LABELS = ['Zero', 'Indo...', 'Ok', 'Bem', 'Excelente'];
const MOOD_COLORS = ['#a13f3f', '#c9793f', '#c7a83f', '#8aab55', '#4f9d6c'];
const SCHEDULE_HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
const MONTHS_SHORT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const MONTHS_LONG = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const WEEKDAYS_LONG = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

const ICONS = {
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.4"/></svg>',
  paper: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v4h4"/><path d="M9 13h6M9 16h6M9 10h2"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 4h8v4a4 4 0 0 1-8 0V4z"/><path d="M8 5H5a2 2 0 0 0 2 4M16 5h3a2 2 0 0 1-2 4"/><path d="M9 13h6l1 7H8l1-7z"/><path d="M9 20h6"/></svg>',
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7"/><path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 19h14"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/><path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/><path d="M10 11v6M14 11v6"/></svg>',
};

/* ---------- date helpers ---------- */

function pad2(n) { return String(n).padStart(2, '0'); }
function isoFromDate(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
function todayDate() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }
function todayISO() { return isoFromDate(todayDate()); }
function parseISO(iso) { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); }
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
function addMonths(date, n) { const d = new Date(date); d.setMonth(d.getMonth() + n); return d; }
function maxAllowedISO() { return isoFromDate(addMonths(todayDate(), 2)); }
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function scheduleLabel(h) { if (h === 6) return '6 AM'; if (h === 12) return '12 PM'; return h > 12 ? String(h - 12) : String(h); }
function formatBR(iso) { return iso.split('-').reverse().join('/'); }
function escapeHtml(str) { return String(str || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function stripHtml(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || '';
}

/* ---------- storage ---------- */

function loadEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveEntries(obj) { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); }

function emptyEntry() {
  return {
    hora: '', lugar: '',
    mood: 2,
    feelings: ['', '', ''],
    moreEnergy: '',
    mainProject: '',
    whyImportant: ['', '', ''],
    smallAction: '',
    gratitude: '',
    workUntil: '',
    brainDump: '',
    notes: ['', '', ''],
    schedule: {},
    challenge: '', when: '', blockers: '',
    updatedAt: '',
  };
}

function isEntryEmpty(data) {
  if (!data) return true;
  const plain = ['hora', 'lugar', 'moreEnergy', 'mainProject', 'smallAction', 'gratitude', 'workUntil', 'brainDump', 'challenge', 'when', 'blockers'];
  if (plain.some(f => stripHtml(data[f]).trim() !== '')) return false;
  const arrays = ['feelings', 'whyImportant', 'notes'];
  if (arrays.some(f => (data[f] || []).some(v => stripHtml(v).trim() !== ''))) return false;
  if (Object.values(data.schedule || {}).some(v => stripHtml(v).trim() !== '')) return false;
  if (typeof data.mood === 'number' && data.mood !== 2) return false;
  return true;
}

function deleteEntry(dateIso) {
  const all = loadEntries();
  delete all[dateIso];
  saveEntries(all);
}

function confirmDelete(dateIso, data) {
  if (isEntryEmpty(data)) return true;
  return confirm(`Apagar tudo do dia ${formatBR(dateIso)}? Essa ação não pode ser desfeita.`);
}

/* ---------- name ---------- */

function getUserName() { return localStorage.getItem(NAME_KEY) || ''; }
function setUserName(name) {
  const trimmed = (name || '').trim();
  if (trimmed) localStorage.setItem(NAME_KEY, trimmed);
  else localStorage.removeItem(NAME_KEY);
}

/* ---------- theme ---------- */

function initTheme() {
  if (localStorage.getItem(THEME_KEY) === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
}
function themeIcon() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? ICONS.sun : ICONS.moon;
}
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) { document.documentElement.removeAttribute('data-theme'); localStorage.setItem(THEME_KEY, 'light'); }
  else { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem(THEME_KEY, 'dark'); }
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.innerHTML = themeIcon();
}

/* ---------- mood color ---------- */

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHex(rgb) {
  return '#' + rgb.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}
function moodColorAt(value) {
  const v = Math.max(0, Math.min(4, value));
  const i = Math.min(3, Math.floor(v));
  const t = v - i;
  const a = hexToRgb(MOOD_COLORS[i]), b = hexToRgb(MOOD_COLORS[i + 1]);
  return rgbToHex(a.map((c, idx) => c + (b[idx] - c) * t));
}

/* ---------- topbar / brand ---------- */

function brandMarkup() {
  const name = getUserName();
  return `
    <div class="brand">
      <img src="assets/logo.png" alt="logo">
      <div class="brand-text">
        <span class="brand-name">Brain Dump</span>
        ${name ? `<span class="brand-sub">de ${escapeHtml(name)}</span>` : ''}
      </div>
    </div>`;
}

function topbarMarkup(showDelete) {
  return `
    <div class="topbar">
      ${brandMarkup()}
      <div class="topbar-actions">
        ${showDelete ? `<button class="icon-btn danger" id="delete-day" title="Apagar este dia">${ICONS.trash}</button>` : ''}
        <button class="icon-btn" id="theme-toggle" title="Alternar tema">${themeIcon()}</button>
      </div>
    </div>`;
}

function kbdHintsMarkup() {
  return `<div class="kbd-hints">Dica: <kbd>Tab</kbd> avança pro próximo campo, <kbd>Shift</kbd> + <kbd>Tab</kbd> volta. Selecione um texto pra formatar (negrito, itálico, cor). Setas ←/→ mudam o termômetro de humor quando ele está em foco.</div>`;
}

/* ---------- rich text toolbar ---------- */

let savedRange = null;
let activeEditable = null;

function findEditableAncestor(node) {
  const el = node && node.nodeType === 3 ? node.parentElement : node;
  return el ? el.closest('[contenteditable="true"]') : null;
}

function persistActiveEditable() {
  if (activeEditable && typeof activeEditable.__persist === 'function') activeEditable.__persist();
}

function restoreSavedSelection() {
  if (!savedRange || !activeEditable) return;
  activeEditable.focus();
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(savedRange);
}

function positionFormatToolbar(range) {
  const toolbar = document.getElementById('format-toolbar');
  const rect = range.getBoundingClientRect();
  if (!rect.width && !rect.height) return;
  toolbar.classList.add('visible');
  const tw = toolbar.offsetWidth, th = toolbar.offsetHeight;
  let left = rect.left + rect.width / 2 - tw / 2;
  let top = rect.top - th - 10;
  if (top < 8) top = rect.bottom + 10;
  left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
  toolbar.style.left = `${left}px`;
  toolbar.style.top = `${top}px`;
}

function hideFormatToolbar() {
  const toolbar = document.getElementById('format-toolbar');
  if (toolbar) toolbar.classList.remove('visible');
}

function updateFormatToolbarVisibility() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) { hideFormatToolbar(); return; }
  const range = sel.getRangeAt(0);
  const editable = findEditableAncestor(range.startContainer);
  if (!editable || !document.body.contains(editable)) { hideFormatToolbar(); return; }
  activeEditable = editable;
  savedRange = range.cloneRange();
  positionFormatToolbar(range);
}

function initFormatToolbar() {
  const toolbar = document.createElement('div');
  toolbar.id = 'format-toolbar';
  toolbar.className = 'format-toolbar';
  toolbar.innerHTML = `
    <button type="button" class="fmt-btn" data-cmd="bold" title="Negrito"><b>N</b></button>
    <button type="button" class="fmt-btn" data-cmd="italic" title="Itálico"><i>I</i></button>
    <button type="button" class="fmt-btn" data-cmd="underline" title="Sublinhado"><u>S</u></button>
    <span class="fmt-sep"></span>
    <label class="fmt-swatch" title="Cor do texto">Aa<input type="color" id="fmt-color-input" value="#b1512f"></label>
    <label class="fmt-swatch fmt-swatch-hl" title="Destacar">Hl<input type="color" id="fmt-hl-input" value="#fbeec0"></label>
    <span class="fmt-sep"></span>
    <button type="button" class="fmt-btn fmt-clear" data-cmd="removeFormat" title="Limpar formatação">Limpar</button>`;
  document.body.appendChild(toolbar);

  toolbar.querySelectorAll('.fmt-btn[data-cmd]').forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      document.execCommand(btn.dataset.cmd);
      persistActiveEditable();
    });
  });

  const colorInput = toolbar.querySelector('#fmt-color-input');
  colorInput.addEventListener('input', () => {
    restoreSavedSelection();
    document.execCommand('foreColor', false, colorInput.value);
    colorInput.closest('.fmt-swatch').style.setProperty('--swatch-color', colorInput.value);
    persistActiveEditable();
  });

  const hlInput = toolbar.querySelector('#fmt-hl-input');
  hlInput.addEventListener('input', () => {
    restoreSavedSelection();
    document.execCommand('hiliteColor', false, hlInput.value);
    hlInput.closest('.fmt-swatch').style.setProperty('--swatch-color', hlInput.value);
    persistActiveEditable();
  });

  document.addEventListener('selectionchange', updateFormatToolbarVisibility);
  document.addEventListener('scroll', hideFormatToolbar, true);
  window.addEventListener('resize', hideFormatToolbar);
  document.addEventListener('mousedown', (e) => {
    if (toolbar.contains(e.target)) return;
    if (e.target.closest && e.target.closest('[contenteditable="true"]')) return;
    hideFormatToolbar();
  });
}

function insertLineBreakAtCursor() {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);
  range.deleteContents();
  const br = document.createElement('br');
  range.insertNode(br);
  range.setStartAfter(br);
  range.setEndAfter(br);
  sel.removeAllRanges();
  sel.addRange(range);
}

function wireEditable(el, getSet) {
  el.innerHTML = getSet.get() || '';
  const commit = () => getSet.set(el.innerHTML);
  el.__persist = commit;
  el.addEventListener('input', commit);
  el.addEventListener('blur', () => {
    if (!el.textContent.trim() && !el.querySelector('img')) { el.innerHTML = ''; commit(); }
  });
  const singleLine = el.dataset.singleLine === '1';
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!singleLine) { insertLineBreakAtCursor(); commit(); }
    }
  });
}

/* ---------- gauge ---------- */

const GAUGE_CX = 150, GAUGE_CY = 122;
const GAUGE_VB = { x: -20, y: 0, w: 340, h: 150 };
let gaugeInstanceCounter = 0;

function gaugeSvg(moodIndex) {
  const gid = `mood-grad-${gaugeInstanceCounter++}`;
  const activeColor = moodColorAt(moodIndex);
  const ticks = [0, 1, 2, 3, 4].map(i => {
    const angleDeg = 180 - i * 45;
    const rad = angleDeg * Math.PI / 180;
    const rOuter = 96, rInner = 82, rLabel = 102;
    const x1 = GAUGE_CX + rOuter * Math.cos(rad), y1 = GAUGE_CY - rOuter * Math.sin(rad);
    const x2 = GAUGE_CX + rInner * Math.cos(rad), y2 = GAUGE_CY - rInner * Math.sin(rad);
    const lx = GAUGE_CX + rLabel * Math.cos(rad), ly = GAUGE_CY - rLabel * Math.sin(rad);
    const isActive = i === Math.round(moodIndex);
    const style = isActive ? ` style="fill:${activeColor}"` : '';
    return `<line class="gauge-tick" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>
      <text class="gauge-label${isActive ? ' active' : ''}" data-i="${i}" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle"${style}>${MOOD_LABELS[i]}</text>`;
  }).join('');
  const rotation = moodIndex * 45 - 90;
  return `
    <svg class="gauge-svg" id="gauge-svg" viewBox="${GAUGE_VB.x} ${GAUGE_VB.y} ${GAUGE_VB.w} ${GAUGE_VB.h}">
      <defs>
        <linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="0%">
          ${MOOD_COLORS.map((c, i) => `<stop offset="${i * 25}%" stop-color="${c}"/>`).join('')}
        </linearGradient>
      </defs>
      <path class="gauge-arc" style="stroke:url(#${gid})" d="M${GAUGE_CX - 96},${GAUGE_CY} A96,96 0 0 1 ${GAUGE_CX + 96},${GAUGE_CY}"/>
      ${ticks}
      <g class="gauge-needle" id="gauge-needle" style="transform-origin:${GAUGE_CX}px ${GAUGE_CY}px; transform: rotate(${rotation}deg)">
        <line x1="${GAUGE_CX}" y1="${GAUGE_CY}" x2="${GAUGE_CX}" y2="${GAUGE_CY - 76}" style="stroke:${activeColor}"/>
      </g>
      <circle class="gauge-hub-ring" cx="${GAUGE_CX}" cy="${GAUGE_CY}" r="11" style="stroke:${activeColor}"/>
      <circle class="gauge-hub" cx="${GAUGE_CX}" cy="${GAUGE_CY}" r="5" style="fill:${activeColor}"/>
    </svg>`;
}

function setupGauge(wrap, draft, persistDraft) {
  const svg = wrap.querySelector('#gauge-svg');
  const needleGroup = wrap.querySelector('#gauge-needle');
  const caption = document.getElementById('mood-caption');
  let dragging = false;

  function pivotPoint() {
    const rect = svg.getBoundingClientRect();
    return {
      x: rect.left + rect.width * ((GAUGE_CX - GAUGE_VB.x) / GAUGE_VB.w),
      y: rect.top + rect.height * ((GAUGE_CY - GAUGE_VB.y) / GAUGE_VB.h),
    };
  }

  function angleFromEvent(evt) {
    const p = pivotPoint();
    const dx = evt.clientX - p.x;
    const dy = p.y - evt.clientY;
    const raw = Math.atan2(dy, dx) * 180 / Math.PI;
    const deg = raw >= 0 ? raw : (dx >= 0 ? 0 : 180);
    return Math.max(0, Math.min(180, deg));
  }

  function paintColor(value) {
    const color = moodColorAt(value);
    const line = needleGroup.querySelector('line');
    if (line) line.style.stroke = color;
    const hub = wrap.querySelector('.gauge-hub');
    if (hub) hub.style.fill = color;
    const ring = wrap.querySelector('.gauge-hub-ring');
    if (ring) ring.style.stroke = color;
    caption.style.color = color;
    return color;
  }

  function setActiveLabel(value, color) {
    const idx = Math.max(0, Math.min(4, Math.round(value)));
    wrap.querySelectorAll('.gauge-label').forEach(l => {
      const isActive = +l.dataset.i === idx;
      l.classList.toggle('active', isActive);
      l.style.fill = isActive ? color : '';
    });
    caption.textContent = MOOD_LABELS[idx];
  }

  function settleAt(value) {
    const clamped = Math.max(0, Math.min(4, value));
    needleGroup.classList.remove('dragging');
    needleGroup.style.transform = `rotate(${clamped * 45 - 90}deg)`;
    const color = paintColor(clamped);
    setActiveLabel(clamped, color);
    draft.mood = clamped;
    persistDraft();
  }

  function onMove(evt) {
    if (!dragging) return;
    const deg = angleFromEvent(evt);
    needleGroup.style.transform = `rotate(${90 - deg}deg)`;
    const value = (180 - deg) / 45;
    const color = paintColor(value);
    setActiveLabel(value, color);
  }

  function onUp(evt) {
    if (!dragging) return;
    dragging = false;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    const deg = angleFromEvent(evt);
    settleAt((180 - deg) / 45);
  }

  svg.addEventListener('pointerdown', (evt) => {
    dragging = true;
    needleGroup.classList.add('dragging');
    onMove(evt);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    evt.preventDefault();
  });

  wrap.querySelectorAll('.gauge-label').forEach(label => {
    label.style.cursor = 'pointer';
    label.addEventListener('click', () => settleAt(+label.dataset.i));
  });

  wrap.addEventListener('keydown', (evt) => {
    if (evt.key === 'ArrowLeft') { settleAt(Math.max(0, Math.round(draft.mood) - 1)); evt.preventDefault(); }
    if (evt.key === 'ArrowRight') { settleAt(Math.min(4, Math.round(draft.mood) + 1)); evt.preventDefault(); }
  });
}

/* ---------- editable field markup helper ---------- */

function editableDiv({ field, index, hour, placeholder, cls, singleLine }) {
  const attrs = [
    'contenteditable="true"',
    'tabindex="0"',
    `class="editable-field${cls ? ' ' + cls : ''}"`,
    `data-field="${field}"`,
  ];
  if (index !== undefined) attrs.push(`data-index="${index}"`);
  if (hour !== undefined) attrs.push(`data-hour="${hour}"`);
  if (placeholder) attrs.push(`data-placeholder="${escapeHtml(placeholder)}"`);
  if (singleLine) attrs.push('data-single-line="1"');
  return `<div ${attrs.join(' ')}></div>`;
}

/* ---------- home view ---------- */

function historyCard(dateIso, data, todayIso) {
  const d = parseISO(dateIso);
  const mood = typeof data.mood === 'number' ? data.mood : 2;
  const preview = stripHtml(data.mainProject) || stripHtml(data.challenge) || stripHtml(data.brainDump) || '';
  const isFuture = dateIso > todayIso;
  return `
    <div class="history-card${isFuture ? ' history-card-future' : ''}" data-goto="${dateIso}" role="button" tabindex="0">
      <div class="history-card-top">
        <div class="history-card-date">
          <span class="history-card-day">${pad2(d.getDate())}</span>
          <span class="history-card-month">${MONTHS_SHORT[d.getMonth()]}${dateIso === todayIso ? ' · hoje' : ''}</span>
        </div>
        <div class="history-card-top-actions">
          <button type="button" class="history-card-delete" data-delete="${dateIso}" title="Apagar este dia">${ICONS.trash}</button>
          <span class="history-card-mood" style="background:${moodColorAt(mood)}"></span>
        </div>
      </div>
      <div class="history-card-preview">${escapeHtml(preview.slice(0, 90)) || 'Sem anotações ainda.'}</div>
    </div>`;
}

function renderHome(app) {
  const entries = loadEntries();
  const dates = Object.keys(entries).sort((a, b) => b.localeCompare(a));
  const todayIso = todayISO();

  app.innerHTML = `
    <div class="view">
      ${topbarMarkup(false)}

      <div class="home-hero">
        <h1>Seu diário, um dia por vez</h1>
        <p>Escreva hoje, planeje os próximos meses, revisite quando quiser.</p>
      </div>

      <div class="name-row">
        <label for="user-name-input">Seu nome</label>
        <input type="text" id="user-name-input" placeholder="Como te chamamos?" value="${escapeHtml(getUserName())}">
      </div>

      <div class="home-panel">
        <form class="new-entry-form" id="new-entry-form">
          <label for="new-entry-date">Abrir dia</label>
          <input type="date" id="new-entry-date" value="${todayIso}" max="${maxAllowedISO()}">
          <button type="submit" class="pill-btn">${ICONS.plus}Abrir</button>
        </form>
        <button class="pill-btn ghost" id="export-btn">${ICONS.download}Exportar</button>
      </div>

      <div class="history-heading">
        <h2>Histórico</h2>
        <span>${dates.length} ${dates.length === 1 ? 'dia registrado' : 'dias registrados'}</span>
      </div>

      ${dates.length === 0
        ? `<div class="history-empty">Nenhum dia registrado ainda. Abra um dia acima para começar.</div>`
        : `<div class="history-grid">${dates.map(d => historyCard(d, entries[d], todayIso)).join('')}</div>`}

      <div class="health-tip">
        <span class="health-tip-icon">💡</span>
        <p>O app Saúde do iPhone também tem um jeito de registrar seu humor (aba Mente, "Estado de Espírito") com perguntas parecidas com essas, todos os dias. Vale usar os dois em conjunto.</p>
      </div>

      <div class="home-footer"><img src="assets/logo.png" alt="logo"></div>
    </div>`;

  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  const nameInput = document.getElementById('user-name-input');
  nameInput.addEventListener('input', () => {
    setUserName(nameInput.value);
    const brandText = document.querySelector('.brand-text');
    let sub = document.querySelector('.brand-sub');
    const val = nameInput.value.trim();
    if (val) {
      if (sub) sub.textContent = `de ${val}`;
      else {
        sub = document.createElement('span');
        sub.className = 'brand-sub';
        sub.textContent = `de ${val}`;
        brandText.appendChild(sub);
      }
    } else if (sub) sub.remove();
  });

  document.getElementById('new-entry-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const val = document.getElementById('new-entry-date').value || todayIso;
    location.hash = `#/entry/${val}`;
  });
  document.getElementById('export-btn').addEventListener('click', handleExport);

  app.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => { location.hash = `#/entry/${el.dataset.goto}`; });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); location.hash = `#/entry/${el.dataset.goto}`; }
    });
  });

  app.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dateIso = btn.dataset.delete;
      const all = loadEntries();
      if (confirmDelete(dateIso, all[dateIso])) {
        deleteEntry(dateIso);
        renderHome(app);
      }
    });
  });
}

/* ---------- entry view ---------- */

function entryPageMarkup() {
  return `
    <div class="page page-left">
      <div class="meta-strip">
        <div class="meta-cell"><label>${ICONS.clock}Hora</label>${editableDiv({ field: 'hora', placeholder: '07:30', singleLine: true })}</div>
        <div class="meta-cell"><label>${ICONS.pin}Lugar</label>${editableDiv({ field: 'lugar', placeholder: 'Em casa', singleLine: true })}</div>
        <div class="meta-cell"><label>Data</label><div class="meta-static" id="entry-date-static"></div></div>
      </div>

      <div class="mood-block">
        <div class="section-label">Hoje me sinto <span class="hint">(arraste)</span></div>
        <div class="gauge-wrap" id="gauge-wrap" tabindex="0"></div>
        <div class="mood-caption" id="mood-caption"></div>
      </div>

      <div class="field-block">
        <div class="section-label">Me sinto assim pois</div>
        <div class="bullet-list">${[0, 1, 2].map(i => `<div class="bullet-row">${editableDiv({ field: 'feelings', index: i, singleLine: true })}</div>`).join('')}</div>
      </div>

      <div class="field-block">
        <div class="section-label">Para ter mais energia posso</div>
        ${editableDiv({ field: 'moreEnergy', cls: 'lined-textarea' })}
      </div>

      <div class="field-block">
        <div class="section-label">Hoje meu projeto principal é</div>
        ${editableDiv({ field: 'mainProject', cls: 'lined-textarea' })}
      </div>

      <div class="two-col">
        <div class="field-block">
          <div class="section-label">Este projeto é importante porque</div>
          <div class="bullet-list">${[0, 1, 2].map(i => `<div class="bullet-row">${editableDiv({ field: 'whyImportant', index: i, singleLine: true })}</div>`).join('')}</div>
        </div>
        <div class="field-block">
          <div class="section-label">Uma pequena ação seria</div>
          ${editableDiv({ field: 'smallAction', cls: 'lined-textarea' })}
          <div class="section-label">Sinto gratidão por</div>
          ${editableDiv({ field: 'gratitude', cls: 'lined-textarea' })}
        </div>
      </div>

      <div class="hours-box">
        <div class="section-label">Hoje eu vou trabalhar até</div>
        <div class="hours-input-row">${editableDiv({ field: 'workUntil', placeholder: '18:00', cls: 'hours-input-field', singleLine: true })}<span>horas</span></div>
      </div>

      <img src="assets/logo.png" class="page-logo" alt="logo">
    </div>

    <div class="page page-right">
      <div class="field-block" style="flex:1;display:flex;flex-direction:column;">
        <div class="section-label">${ICONS.paper}Brain dump <span class="hint">(o que precisa ser feito?)</span></div>
        ${editableDiv({ field: 'brainDump', cls: 'brain-dump-area' })}
      </div>

      <div class="notes-lines">${[0, 1, 2].map(i => editableDiv({ field: 'notes', index: i, singleLine: true, cls: 'notes-line' })).join('')}</div>

      <div class="schedule-block">
        <div class="section-label">${ICONS.paper}Prioridade a cada hora <span class="hint">(o que não pode passar de hoje?)</span></div>
        <div class="schedule-edge">${ICONS.sun}</div>
        ${SCHEDULE_HOURS.map(h => `<div class="schedule-row"><label>${scheduleLabel(h)}</label>${editableDiv({ field: 'schedule', hour: h, singleLine: true })}</div>`).join('')}
        <div class="schedule-edge">${ICONS.moon}</div>
      </div>

      <div class="challenge-block">
        <div class="section-label">${ICONS.trophy}Qual o desafio hoje?</div>
        <div class="challenge-field">${editableDiv({ field: 'challenge', placeholder: 'Descreva o desafio', singleLine: true })}</div>
        <div class="challenge-field"><label>Quando vou fazer?</label>${editableDiv({ field: 'when', singleLine: true })}</div>
        <div class="challenge-field"><label>O que pode me atrapalhar?</label>${editableDiv({ field: 'blockers', singleLine: true })}</div>
      </div>

      <img src="assets/logo.png" class="page-logo" alt="logo">
    </div>`;
}

function renderEntry(app, dateIso) {
  const store = loadEntries();
  const draft = store[dateIso] ? JSON.parse(JSON.stringify(store[dateIso])) : emptyEntry();
  if (typeof draft.mood !== 'number') draft.mood = 2;
  const d = parseISO(dateIso);
  const todayIso = todayISO();
  const maxIso = maxAllowedISO();
  const prevIso = isoFromDate(addDays(d, -1));
  const nextIso = isoFromDate(addDays(d, 1));
  const nextDisabled = nextIso > maxIso;
  const yesterdayIso = isoFromDate(addDays(todayDate(), -1));
  const tomorrowIso = isoFromDate(addDays(todayDate(), 1));
  let activeQuick = null;
  if (dateIso === yesterdayIso) activeQuick = 'yesterday';
  else if (dateIso === todayIso) activeQuick = 'today';
  else if (dateIso === tomorrowIso) activeQuick = 'tomorrow';
  const quickCls = (key) => {
    if (activeQuick === key) return 'quick-nav-btn current';
    if (key === 'today' && activeQuick === null) return 'quick-nav-btn cta';
    return 'quick-nav-btn ghost';
  };

  app.innerHTML = `
    <div class="view">
      ${topbarMarkup(true)}

      <div class="entry-toolbar">
        <a class="pill-btn ghost" href="#/">${ICONS.home}Início</a>
        <div class="entry-nav">
          <button class="icon-btn" id="prev-day" title="Dia anterior">${ICONS.arrowLeft}</button>
          <div class="entry-today-label">
            ${capitalize(WEEKDAYS_LONG[d.getDay()])}
            <small>${d.getDate()} de ${MONTHS_LONG[d.getMonth()]} de ${d.getFullYear()}${dateIso === todayIso ? ' · hoje' : ''}</small>
          </div>
          <button class="icon-btn" id="next-day" title="Próximo dia" ${nextDisabled ? 'disabled style="opacity:.35;cursor:default"' : ''}>${ICONS.arrowRight}</button>
        </div>
        <div class="entry-toolbar-right">
          <div class="quick-nav">
            <a class="${quickCls('yesterday')}" href="#/entry/${yesterdayIso}">Ontem</a>
            <a class="${quickCls('today')}" href="#/entry/${todayIso}">Hoje</a>
            <a class="${quickCls('tomorrow')}" href="#/entry/${tomorrowIso}">Amanhã</a>
          </div>
          <div class="entry-date-jump">
            <span>Ir para</span>
            <input type="date" id="jump-date" value="${dateIso}" max="${maxIso}">
          </div>
        </div>
      </div>

      <div class="spread">${entryPageMarkup()}</div>
      ${kbdHintsMarkup()}
    </div>`;

  document.getElementById('entry-date-static').textContent = `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  document.getElementById('gauge-wrap').innerHTML = gaugeSvg(draft.mood);
  const caption = document.getElementById('mood-caption');
  caption.textContent = MOOD_LABELS[Math.max(0, Math.min(4, Math.round(draft.mood)))];
  caption.style.color = moodColorAt(draft.mood);

  function persistDraft() {
    const all = loadEntries();
    draft.updatedAt = new Date().toISOString();
    all[dateIso] = draft;
    saveEntries(all);
  }

  app.querySelectorAll('[data-field]').forEach(el => {
    const field = el.dataset.field;
    if (el.dataset.index !== undefined) {
      const idx = +el.dataset.index;
      wireEditable(el, {
        get: () => (draft[field] || ['', '', ''])[idx],
        set: (html) => { if (!Array.isArray(draft[field])) draft[field] = ['', '', '']; draft[field][idx] = html; persistDraft(); },
      });
    } else if (el.dataset.hour !== undefined) {
      const hr = el.dataset.hour;
      wireEditable(el, {
        get: () => (draft[field] || {})[hr],
        set: (html) => { if (!draft[field]) draft[field] = {}; draft[field][hr] = html; persistDraft(); },
      });
    } else {
      wireEditable(el, {
        get: () => draft[field],
        set: (html) => { draft[field] = html; persistDraft(); },
      });
    }
  });

  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('prev-day').addEventListener('click', () => { location.hash = `#/entry/${prevIso}`; });
  if (!nextDisabled) document.getElementById('next-day').addEventListener('click', () => { location.hash = `#/entry/${nextIso}`; });
  document.getElementById('jump-date').addEventListener('change', (e) => {
    if (e.target.value) location.hash = `#/entry/${e.target.value}`;
  });

  const deleteBtn = document.getElementById('delete-day');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      const all = loadEntries();
      if (confirmDelete(dateIso, all[dateIso])) {
        deleteEntry(dateIso);
        location.hash = '#/';
      }
    });
  }

  setupGauge(document.getElementById('gauge-wrap'), draft, persistDraft);
}

/* ---------- export / print ---------- */

function printableSpread(dateIso, data) {
  const d = parseISO(dateIso);
  const mood = typeof data.mood === 'number' ? data.mood : 2;
  const feelings = data.feelings || ['', '', ''];
  const whyImportant = data.whyImportant || ['', '', ''];
  const notes = data.notes || ['', '', ''];
  const schedule = data.schedule || {};

  return `
    <div class="spread">
      <div class="page page-left">
        <div class="meta-strip">
          <div class="meta-cell"><label>${ICONS.clock}Hora</label><div class="meta-static">${data.hora || ''}</div></div>
          <div class="meta-cell"><label>${ICONS.pin}Lugar</label><div class="meta-static">${data.lugar || ''}</div></div>
          <div class="meta-cell"><label>Data</label><div class="meta-static">${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}</div></div>
        </div>

        <div class="mood-block">
          <div class="section-label">Hoje me sinto</div>
          ${gaugeSvg(mood)}
          <div class="mood-caption" style="color:${moodColorAt(mood)}">${MOOD_LABELS[Math.max(0, Math.min(4, Math.round(mood)))]}</div>
        </div>

        <div class="field-block">
          <div class="section-label">Me sinto assim pois</div>
          <div class="bullet-list">${feelings.map(f => `<div class="bullet-row"><span class="static-line">${f || ''}</span></div>`).join('')}</div>
        </div>

        <div class="field-block">
          <div class="section-label">Para ter mais energia posso</div>
          <div class="lined-textarea static-block">${data.moreEnergy || ''}</div>
        </div>

        <div class="field-block">
          <div class="section-label">Hoje meu projeto principal é</div>
          <div class="lined-textarea static-block">${data.mainProject || ''}</div>
        </div>

        <div class="two-col">
          <div class="field-block">
            <div class="section-label">Este projeto é importante porque</div>
            <div class="bullet-list">${whyImportant.map(f => `<div class="bullet-row"><span class="static-line">${f || ''}</span></div>`).join('')}</div>
          </div>
          <div class="field-block">
            <div class="section-label">Uma pequena ação seria</div>
            <div class="lined-textarea static-block">${data.smallAction || ''}</div>
            <div class="section-label">Sinto gratidão por</div>
            <div class="lined-textarea static-block">${data.gratitude || ''}</div>
          </div>
        </div>

        <div class="hours-box">
          <div class="section-label">Hoje eu vou trabalhar até</div>
          <div class="hours-input-row"><span class="static-line">${data.workUntil || ''}</span><span>horas</span></div>
        </div>

        <img src="assets/logo.png" class="page-logo" alt="logo">
      </div>

      <div class="page page-right">
        <div class="field-block" style="flex:1;display:flex;flex-direction:column;">
          <div class="section-label">${ICONS.paper}Brain dump</div>
          <div class="brain-dump-area static-block">${data.brainDump || ''}</div>
        </div>

        <div class="notes-lines">${notes.map(n => `<span class="static-line">${n || ''}</span>`).join('')}</div>

        <div class="schedule-block">
          <div class="section-label">${ICONS.paper}Prioridade a cada hora</div>
          <div class="schedule-edge">${ICONS.sun}</div>
          ${SCHEDULE_HOURS.map(h => `<div class="schedule-row"><label>${scheduleLabel(h)}</label><span class="static-line">${schedule[h] || ''}</span></div>`).join('')}
          <div class="schedule-edge">${ICONS.moon}</div>
        </div>

        <div class="challenge-block">
          <div class="section-label">${ICONS.trophy}Qual o desafio hoje?</div>
          <div class="challenge-field"><span class="static-line">${data.challenge || ''}</span></div>
          <div class="challenge-field"><label>Quando vou fazer?</label><span class="static-line">${data.when || ''}</span></div>
          <div class="challenge-field"><label>O que pode me atrapalhar?</label><span class="static-line">${data.blockers || ''}</span></div>
        </div>

        <img src="assets/logo.png" class="page-logo" alt="logo">
      </div>
    </div>`;
}

function handleExport() {
  const entries = loadEntries();
  const dates = Object.keys(entries).sort();
  if (dates.length === 0) { alert('Nenhuma entrada para exportar ainda.'); return; }
  const proceed = confirm('Isso vai abrir a caixa de impressão do seu navegador.\n\nNo destino, escolha "Salvar como PDF" para exportar todos os dias em um arquivo só.\n\nContinuar?');
  if (!proceed) return;
  const printRoot = document.getElementById('print-root');
  printRoot.innerHTML = dates.map(d => printableSpread(d, entries[d])).join('');
  document.title = `Brain Dump - Exportado ${todayISO()}`;
  window.print();
}

window.addEventListener('afterprint', () => {
  document.title = DOC_TITLE;
  const printRoot = document.getElementById('print-root');
  if (printRoot) printRoot.innerHTML = '';
});

/* ---------- router ---------- */

function parseHash() {
  const h = location.hash || '#/';
  const m = h.match(/^#\/entry\/(\d{4}-\d{2}-\d{2})$/);
  if (m) return { view: 'entry', date: m[1] };
  return { view: 'home' };
}

function render() {
  const app = document.getElementById('app');
  hideFormatToolbar();
  const route = parseHash();
  if (route.view === 'entry') renderEntry(app, route.date);
  else renderHome(app);
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initFormatToolbar();
  render();
});
