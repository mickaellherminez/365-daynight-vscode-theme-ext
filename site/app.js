import { createPicker } from './picker.js';
import { createContrastChart } from './contrast-chart.js';
import { createMatrices } from './matrices.js';
import { createVisionPanel } from './vision.js';
import { t, tNodes, ltr, isolate, ratio as formatRatio, monthNames, shortDate } from './i18n.js';

const root = document.documentElement;
const { months, comparisons, thresholds } = JSON.parse(document.getElementById('theme-data').textContent);
// Month names come from the page language; theme names stay those of VS Code.
months.forEach((month, index) => Object.assign(month, monthNames[index]));
const modes = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'hcLight', label: 'High Contrast Light' },
  { key: 'hcDark', label: 'High Contrast' },
];
// The header chip uses the short month name; the dialog and the measurements keep the full one.
const chipLabel = (month, label) => `${month.short} · ${label}`;
const systemAppearance = window.matchMedia('(prefers-color-scheme: dark)');
let monthIndex = Number(root.dataset.month);
let mode = root.dataset.mode;
let manualMode = false;
let manualMonth = false;
let split = 54;

// The same TypeScript file is drawn in both halves, using audited token colors.
const code = [
  [['// Switch the theme when the day starts or ends', 'comment']],
  [],
  [['const', 'keyword'], [' ', 'variable'], ['DAY_START', 'variable.readonly'], [' = ', 'operator'], ['7', 'number'], [';', 'punctuation']],
  [['const', 'keyword'], [' ', 'variable'], ['NIGHT_START', 'variable.readonly'], [' = ', 'operator'], ['19', 'number'], [';', 'punctuation']],
  [],
  [['export class', 'keyword'], [' ', 'variable'], ['ThemeSchedule', 'class'], [' {', 'punctuation']],
  [['  ', 'variable'], ['constructor', 'keyword'], ['(', 'punctuation'], ['private readonly', 'keyword'], [' label: ', 'variable'], ['string', 'class'], [') {}', 'punctuation']],
  [],
  [['  ', 'variable'], ['isDay', 'function'], ['(date = ', 'variable'], ['new', 'keyword'], [' ', 'variable'], ['Date', 'class'], ['()): ', 'punctuation'], ['boolean', 'class'], [' {', 'punctuation']],
  [['    ', 'variable'], ['const', 'keyword'], [' hour = date.', 'variable'], ['getHours', 'function'], ['();', 'punctuation']],
  [['    ', 'variable'], ['return', 'keyword'], [' hour ', 'variable'], ['>=', 'operator'], [' ', 'variable'], ['DAY_START', 'variable.readonly'], [' && ', 'operator'], ['hour ', 'variable'], ['< ', 'operator'], ['NIGHT_START', 'variable.readonly'], [';', 'punctuation']],
  [['  }', 'punctuation']],
  [],
  [['  ', 'variable'], ['current', 'function'], ['(): ', 'punctuation'], ['string', 'class'], [' {', 'punctuation']],
  [['    ', 'variable'], ['return', 'keyword'], [' this.', 'variable'], ['isDay', 'function'], ['() ? ', 'punctuation'], ["'Light'", 'string'], [' : ', 'punctuation'], ["'Dark'", 'string'], [';', 'punctuation']],
  [['  }', 'punctuation']],
  [['}', 'punctuation']],
];
const miniCode = [
  [['// Day or night?', 'comment']], [],
  [['const', 'keyword'], [' ', 'variable'], ['DAY', 'variable.readonly'], [' = ', 'operator'], ['7', 'number'], [';', 'punctuation']], [],
  [['class', 'keyword'], [' ', 'variable'], ['Schedule', 'class'], [' {', 'punctuation']],
  [['  ', 'variable'], ['isDay', 'function'], ['(h: ', 'variable'], ['number', 'class'], [') {', 'punctuation']],
  [['    ', 'variable'], ['return', 'keyword'], [' h ', 'parameter'], ['>= ', 'operator'], ['DAY', 'variable.readonly'], [';', 'punctuation']],
  [['  }', 'punctuation']],
  [['  ', 'variable'], ['label', 'function'], ['(h: ', 'variable'], ['number', 'class'], [') {', 'punctuation']],
  [['    ', 'variable'], ['return', 'keyword'], [' this.', 'variable'], ['isDay', 'function'], ['(h)', 'punctuation']],
  [['      ? ', 'punctuation'], ["'Light'", 'string'], [' : ', 'punctuation'], ["'Dark'", 'string'], [';', 'punctuation']],
  [['  }', 'punctuation']], [['}', 'punctuation']],
];
const ratio = (value) => formatRatio(Math.floor(value * 10) / 10, 1);
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};

function editorWindow(palette, label, mini = false) {
  const editor = element('div', 'editor-window');
  for (const [key, value] of Object.entries({
    bg: palette.bg, text: palette.text, accent: palette.accent,
    muted: palette.ui.lineNumber, panel: palette.ui.tabBg, line: palette.ui.editorBorder,
    titleBg: palette.ui.titleBg, titleText: palette.ui.titleText,
    tabBg: palette.ui.tabBg, tabText: palette.ui.tabText,
    tabActiveBg: palette.ui.tabActiveBg, tabActiveText: palette.ui.tabActiveText,
    tabBorder: palette.ui.tabBorder, statusBg: palette.ui.statusBg, statusText: palette.ui.statusText,
  })) editor.style.setProperty(`--editor-${key}`, value);
  const title = element('div', 'editor-titlebar');
  if (mini) title.textContent = 'schedule.ts';
  else {
    title.append(element('span', 'editor-label', label));
    title.append(element('span', 'editor-file', 'schedule.ts — aurora-app'));
  }
  editor.append(title);
  if (!mini) {
    const tabs = element('div', 'editor-tabs');
    tabs.append(element('span', 'editor-tab', 'schedule.ts'));
    editor.append(tabs);
  }
  const lines = element('div', 'editor-code');
  (mini ? miniCode : code).forEach((tokens, index) => {
    const line = element('div', 'code-line');
    line.append(element('span', 'line-number', String(index + 1)));
    for (const [text, token] of tokens) {
      const span = element('span', token === 'comment' ? 'code-comment' : '', text);
      const semantic = palette.semanticTokens[token];
      span.style.color = typeof semantic === 'string' ? semantic : semantic?.foreground || palette.tokens[token];
      const fontStyle = (typeof semantic === 'object' ? semantic.fontStyle : null) || palette.tokenStyles[token] || '';
      if (fontStyle.includes('italic')) span.style.fontStyle = 'italic';
      if (fontStyle.includes('bold')) span.style.fontWeight = '700';
      if (fontStyle.includes('underline')) span.style.textDecoration = 'underline';
      if (fontStyle.includes('strikethrough')) span.style.textDecoration = 'line-through';
      line.append(span);
    }
    lines.append(line);
  });
  editor.append(lines);
  if (!mini) {
    const status = element('div', 'editor-status');
    status.append(element('span', '', `‹  ${months[monthIndex].name}  ›`), element('span', '', `${label}     TypeScript`));
    editor.append(status);
  }
  return editor;
}

const pickers = [
  createPicker(document.getElementById('hero-picker'), months, choose),
  createPicker(document.getElementById('dialog-picker'), months, choose),
];

const modeButtons = [];
document.querySelectorAll('.mode-options').forEach((group) => {
  modes.forEach(({ key, label }) => {
    const button = element('button', 'mode-button');
    button.type = 'button';
    button.dataset.mode = key;
    const disc = element('span', 'mode-disc');
    disc.setAttribute('aria-hidden', 'true');
    button.append(disc, element('span', '', label));
    button.addEventListener('click', () => choose({ mode: key }));
    group.append(button);
    modeButtons.push(button);
  });
});

const variantCards = modes.map(({ key, label }) => {
  const button = element('button', 'variant-card');
  button.type = 'button';
  button.dataset.mode = key;
  const preview = element('div', 'variant-preview');
  preview.setAttribute('aria-hidden', 'true');
  const caption = element('span');
  caption.append(element('span', 'variant-name', label), element('span', 'variant-stat'), element('span', 'sr variant-action'));
  button.append(preview, caption);
  button.addEventListener('click', () => choose({ mode: key }));
  document.getElementById('variant-grid').append(button);
  return button;
});

const chartMonth = document.getElementById('chart-month');
const chartVariant = document.getElementById('chart-variant');
months.forEach((month, index) => {
  const option = element('option', '', month.name);
  option.value = String(index);
  chartMonth.append(option);
});
modes.forEach(({ key, label }) => {
  const option = element('option', '', label);
  option.value = key;
  chartVariant.append(option);
});
chartMonth.addEventListener('change', () => choose({ month: Number(chartMonth.value) }));
chartVariant.addEventListener('change', () => choose({ mode: chartVariant.value }));
const contrastChart = createContrastChart(document.getElementById('syntax-chart'), document.getElementById('syntax-summary'), thresholds);
const visionPanel = createVisionPanel(document.getElementById('vision-panel'), code, thresholds);
const matrices = createMatrices(document.getElementById('monthly-matrices'), months, comparisons, thresholds,
  (month) => choose({ month }));

function swatch(color) {
  const node = element('span');
  node.style.background = color;
  return node;
}

function update(announce = false) {
  const month = months[monthIndex];
  const palette = month[mode];
  root.dataset.month = String(monthIndex);
  root.dataset.mode = mode;
  root.style.colorScheme = mode === 'dark' || mode === 'hcDark' ? 'dark' : 'light';
  for (const key of ['bg', 'text', 'accent', 'muted', 'panel', 'panelText', 'line', 'rule', 'onAccent', 'link', 'shadow']) {
    root.style.setProperty(`--${key}`, palette[key]);
  }
  chartMonth.value = String(monthIndex);
  chartVariant.value = mode;
  contrastChart.update(palette);
  visionPanel.update(palette);
  matrices.update(monthIndex, mode);
  const label = modes.find((item) => item.key === mode).label;
  document.querySelectorAll('[data-month-name]').forEach((node) => { node.textContent = month.name; });
  document.querySelectorAll('[data-mode-label]').forEach((node) => { node.textContent = label; });
  document.querySelectorAll('[data-selection]').forEach((node) => { node.textContent = `${month.name} · ${label}`; });
  document.querySelectorAll('[data-chip-label]').forEach((node) => { node.textContent = chipLabel(month, label); });
  document.querySelectorAll('.theme-chip[data-tooltip]').forEach((node) => { node.dataset.tooltip = `${month.name} · ${label}`; });
  pickers.forEach((picker) => picker.update(monthIndex, mode));
  modeButtons.forEach((button) => {
    const p = month[button.dataset.mode];
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
    button.style.setProperty('--disc-bg', p.bg);
    button.style.setProperty('--disc-text', p.text);
    button.style.setProperty('--disc-accent', p.accent);
  });
  document.getElementById('text-contrast').replaceChildren(isolate(ratio(palette.contrast.text)));
  document.getElementById('accent-contrast').replaceChildren(isolate(ratio(palette.contrast.accent)));
  document.getElementById('current-swatches').replaceChildren(...[month.light.bg, month.light.accent, month.dark.bg, month.dark.accent].map(swatch));
  const highContrast = mode.startsWith('hc');
  const dayKey = highContrast ? 'hcLight' : 'light';
  const nightKey = highContrast ? 'hcDark' : 'dark';
  const dayLabel = highContrast ? 'High Contrast Light' : 'Light';
  const nightLabel = highContrast ? 'High Contrast' : 'Dark';
  document.getElementById('compare-day').replaceChildren(editorWindow(month[dayKey], dayLabel));
  document.getElementById('compare-night').replaceChildren(editorWindow(month[nightKey], nightLabel));
  document.getElementById('compare-day-label').textContent = dayLabel;
  document.getElementById('compare-night-label').textContent = nightLabel;
  document.getElementById('compare-handle').setAttribute('aria-label', t('app.compareLabel', { day: dayLabel, night: nightLabel }));
  document.getElementById('compare-handle').setAttribute('aria-valuetext', t('app.compareValue', { day: dayLabel, night: nightLabel, percent: Math.round(split) }));
  variantCards.forEach((button) => {
    const key = button.dataset.mode;
    const p = month[key];
    button.setAttribute('aria-pressed', String(key === mode));
    // Le nom accessible reprend le texte affiché, complété pour les lecteurs d'écran (WCAG 2.5.3)
    button.querySelector('.variant-action').textContent = t('app.applyVariant', { month: month.name, variant: modes.find((item) => item.key === key).label });
    button.querySelector('.variant-preview').replaceChildren(editorWindow(p, '', true));
    button.querySelector('.variant-stat').replaceChildren(tNodes('app.variantStat', { text: ltr(ratio(p.contrast.text)), accent: ltr(ratio(p.contrast.accent)) }));
  });
  document.querySelectorAll('#month-options button').forEach((button, index) => {
    button.setAttribute('aria-pressed', String(index === monthIndex));
  });
  document.getElementById('method-swatches').replaceChildren(...[
    palette.bg, palette.panel, palette.text, palette.muted, palette.accent,
    palette.tokens.keyword, palette.tokens.string, palette.tokens.function,
  ].map(swatch));
  document.getElementById('method-variants').replaceChildren(...modes.map(({ key, label: name }) => {
    const p = month[key];
    const item = element('div');
    const preview = element('div', 'mini');
    preview.style.background = p.bg;
    [p.tokens.keyword, p.tokens.string, p.tokens.function].forEach((color, i) => {
      const line = swatch(color);
      line.style.width = ['70%', '45%', '60%'][i];
      preview.append(line);
    });
    item.append(preview, element('p', '', name));
    return item;
  }));
  if (announce) document.getElementById('selection-status').textContent = t('app.status', { month: month.name, variant: label, text: ratio(palette.contrast.text), accent: ratio(palette.contrast.accent) });
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function choose(selection) {
  if (Number.isInteger(selection.month) && selection.month >= 0 && selection.month < months.length) {
    monthIndex = selection.month;
    manualMonth = true;
  }
  if (modes.some((item) => item.key === selection.mode)) {
    mode = selection.mode;
    manualMode = true;
  }
  // Cross-fade the page into the new palette where the browser supports it and motion is welcome.
  // A quick new choice skips the running fade; that rejection is expected, so it is silenced.
  if (document.startViewTransition && !reducedMotion.matches) document.startViewTransition(() => update(true)).ready.catch(() => {});
  else update(true);
}

// Each day keeps the exact colors of its month; no interpolated palettes.
let displayedYear;
function drawYear(now) {
  displayedYear = now.getFullYear();
  const lengths = months.map((_, i) => new Date(displayedYear, i + 1, 0).getDate());
  const strip = document.getElementById('year-strip');
  const options = document.getElementById('month-options');
  strip.replaceChildren();
  options.replaceChildren();
  months.forEach((month, index) => {
    const button = element('button', '', month.short);
    button.type = 'button';
    button.style.flex = `${lengths[index]} 1 0`;
    // Le nom accessible commence par le texte affiché (WCAG 2.5.3)
    button.setAttribute('aria-label', t('app.monthButton', { short: month.short, month: month.name }));
    button.addEventListener('click', () => choose({ month: index }));
    options.append(button);
    for (let day = 0; day < lengths[index]; day++) {
      const column = element('div', 'year-day');
      column.append(
        swatch(month.light.bg),
        swatch(month.light.accent),
        swatch(month.dark.bg),
      );
      column.dataset.month = String(index);
      strip.append(column);
    }
  });
}
function updateToday(now) {
  const year = now.getFullYear();
  if (year !== displayedYear) drawYear(now);
  const daysInYear = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / 86400000;
  const today = (Date.UTC(year, now.getMonth(), now.getDate()) - Date.UTC(year, 0, 1)) / 86400000;
  const position = `${(today + .5) / daysInYear * 100}%`;
  const marker = document.getElementById('today-marker');
  marker.style.setProperty('--today', position);
  marker.textContent = t('app.today', { date: shortDate(now) });
  marker.setAttribute('aria-label', t('app.todayLabel', { today: marker.textContent, month: months[now.getMonth()].name }));
  let line = document.querySelector('.today-line');
  if (!line) {
    line = element('span', 'today-line');
    line.setAttribute('aria-hidden', 'true');
    document.querySelector('.year-calendar').append(line);
  }
  line.style.left = position;
}
document.getElementById('today-marker').addEventListener('click', () => {
  monthIndex = new Date().getMonth();
  manualMonth = false;
  update(true);
});

const dialog = document.getElementById('theme-dialog');
document.querySelectorAll('[data-open-picker]').forEach((button) => {
  button.addEventListener('click', () => dialog.showModal());
});
document.getElementById('close-picker').addEventListener('click', () => dialog.close());

// The language menu is a native <details>: it opens without JavaScript. Here it also closes
// with Escape (focus back on its button), after a click outside, or when focus leaves it.
for (const menu of document.querySelectorAll('[data-language-menu]')) {
  const toggle = menu.querySelector('summary');
  menu.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menu.open) return;
    menu.open = false;
    toggle.focus();
  });
  menu.addEventListener('focusout', (event) => {
    if (menu.open && event.relatedTarget && !menu.contains(event.relatedTarget)) menu.open = false;
  });
  document.addEventListener('click', (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
}
dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});

const handle = document.getElementById('compare-handle');
const comparison = document.getElementById('comparison');
function setSplit(value) {
  split = Math.min(94, Math.max(6, value));
  comparison.style.setProperty('--split', `${split}%`);
  handle.setAttribute('aria-valuenow', String(Math.round(split)));
  const day = document.getElementById('compare-day-label').textContent;
  const night = document.getElementById('compare-night-label').textContent;
  const status = t('app.compareValue', { day, night, percent: Math.round(split) });
  handle.setAttribute('aria-valuetext', status);
  document.getElementById('compare-status').textContent = status;
}
handle.addEventListener('keydown', (event) => {
  const steps = { ArrowUp: -2, ArrowLeft: -2, ArrowDown: 2, ArrowRight: 2, PageUp: -10, PageDown: 10 };
  const next = event.key === 'Home' ? 6 : event.key === 'End' ? 94 : steps[event.key] == null ? null : split + steps[event.key];
  if (next == null) return;
  event.preventDefault();
  setSplit(next);
});
let dragOffset = 0;
handle.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;
  const box = handle.getBoundingClientRect();
  dragOffset = event.clientY - (box.top + box.height / 2);
  handle.setPointerCapture(event.pointerId);
  event.preventDefault();
  handle.focus({ preventScroll: true });
});
handle.addEventListener('pointermove', (event) => {
  if (!handle.hasPointerCapture(event.pointerId)) return;
  const box = comparison.getBoundingClientRect();
  setSplit((event.clientY - dragOffset - box.top) / box.height * 100);
});
for (const type of ['pointerup', 'pointercancel']) {
  handle.addEventListener(type, (event) => {
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
  });
}
systemAppearance.addEventListener('change', (event) => {
  if (!manualMode) {
    mode = event.matches ? 'dark' : 'light';
    update();
  }
});
// Keep the marker and automatic month current when a tab stays open overnight.
let displayedDate;
function refreshDate() {
  const now = new Date();
  const date = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
  if (date === displayedDate) return;
  displayedDate = date;
  updateToday(now);
  if (!manualMonth) monthIndex = now.getMonth();
  update();
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshDate(); });
window.setInterval(refreshDate, 60000);
const scale = document.querySelector('.scale');
scale.style.setProperty('--lowest', `${(Number(scale.dataset.lowest) - 1) / 20 * 100}%`);
refreshDate();
setSplit(split);
// Only reveal interactive sections after every control is initialized.
root.classList.add('js');

// The header chip keeps the width of its longest label, so a longer theme name
// never pushes it to a new line and moves the page when the theme changes.
function reserveSelectionWidth() {
  for (const node of document.querySelectorAll('[data-chip-label]')) {
    const current = node.textContent;
    node.style.minWidth = '0px';
    let widest = 0;
    for (const month of months) {
      for (const item of modes) {
        node.textContent = chipLabel(month, item.label);
        widest = Math.max(widest, node.getBoundingClientRect().width);
      }
    }
    node.textContent = current;
    node.style.minWidth = `${Math.ceil(widest)}px`;
  }
}
// The comparison sentence names the month and both themes: it keeps the height of its longest version.
function reserveComparisonHeight() {
  const sentence = document.getElementById('compare-day-label').closest('p');
  const parts = [...sentence.querySelectorAll('[data-month-name], #compare-day-label, #compare-night-label')];
  const current = parts.map((node) => node.textContent);
  sentence.style.minHeight = '0px';
  let tallest = 0;
  for (const month of months) {
    for (const [day, night] of [['Light', 'Dark'], ['High Contrast Light', 'High Contrast']]) {
      for (const node of parts) {
        node.textContent = node.id === 'compare-day-label' ? day : node.id === 'compare-night-label' ? night : month.name;
      }
      tallest = Math.max(tallest, sentence.getBoundingClientRect().height);
    }
  }
  parts.forEach((node, i) => { node.textContent = current[i]; });
  sentence.style.minHeight = `${Math.ceil(tallest)}px`;
}
// Anchors and keyboard focus stop below the sticky header, never under it.
const siteHeader = document.querySelector('.site-header');
function measureHeader() {
  root.style.setProperty('--header-height', `${Math.ceil(siteHeader.getBoundingClientRect().height)}px`);
}
function reserveTextSpace() {
  reserveSelectionWidth();
  reserveComparisonHeight();
  measureHeader();
}
let scrollFrame = 0;
window.addEventListener('scroll', () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    scrollFrame = 0;
    siteHeader.classList.toggle('scrolled', window.scrollY > 0);
  });
}, { passive: true });
siteHeader.classList.toggle('scrolled', window.scrollY > 0);
// Escape hides an open tooltip until the pointer or the focus moves again (WCAG 1.4.13).
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') root.classList.add('tooltips-off');
});
for (const type of ['pointermove', 'focusin']) {
  document.addEventListener(type, () => root.classList.remove('tooltips-off'), { passive: true });
}
reserveTextSpace();
if (document.fonts) document.fonts.ready.then(reserveTextSpace);
let resizeFrame = 0;
window.addEventListener('resize', () => {
  window.cancelAnimationFrame(resizeFrame);
  resizeFrame = window.requestAnimationFrame(reserveTextSpace);
});
