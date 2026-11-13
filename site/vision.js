// Code seen through each simulated vision, and the vision scores of the audit report.
import { t, num, ratio, inSentence } from './i18n.js';

const VIEWS = ['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'].map((key) => ({ key, label: t(`vision.views.${key}`) }));
const MACHADO = ['Machado et al., 2009', 'https://doi.org/10.1109/TVCG.2009.113'];
const SCORES = [
  { key: 'protanopia', ref: MACHADO },
  { key: 'deuteranopia', ref: MACHADO },
  { key: 'tritanopia', ref: MACHADO },
  { key: 'protanomaly', ref: MACHADO },
  { key: 'deuteranomaly', ref: MACHADO },
  { key: 'tritanomaly', ref: MACHADO },
  { key: 'achromatopsia', ref: [t('vision.luminanceRef'), 'https://www.w3.org/TR/WCAG22/#dfn-relative-luminance'] },
  { key: 'lowVision20/40', ref: ['WCAG 2.2, 1.4.3', 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'] },
  { key: 'lowVision20/80', ref: ['WCAG 2.2, 1.4.6', 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html'] },
];
// Roles of the drawn code that the audit does not measure take the closest measured role.
const ROLE = { 'variable.readonly': 'variable', parameter: 'variable' };
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};

export function createVisionPanel(container, code, thresholds) {
  let view = 'normal';
  let current = null;
  const group = element('div', 'vision-views');
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', t('vision.group'));
  const buttons = VIEWS.map(({ key, label }) => {
    const button = element('button', 'vision-view', label);
    button.type = 'button';
    button.dataset.view = key;
    button.addEventListener('click', () => { view = key; draw(); });
    group.append(button);
    return button;
  });
  const preview = element('pre', 'vision-code');
  preview.setAttribute('aria-hidden', 'true');
  const status = element('p', 'chart-summary');
  status.setAttribute('aria-live', 'polite');

  const region = element('div', 'contrast-scroll');
  region.tabIndex = 0;
  region.setAttribute('role', 'region');
  region.setAttribute('aria-label', t('vision.region'));
  const table = element('table', 'score-table');
  const caption = element('caption', 'sr');
  const headRow = element('tr');
  for (const label of [t('vision.situation'), t('vision.score'), t('vision.formula'), t('vision.reference')]) {
    const cell = element('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  }
  const head = element('thead');
  head.append(headRow);
  const body = element('tbody');
  const rows = SCORES.map((score) => {
    const row = element('tr');
    const name = element('th', '', t(`vision.scores.${score.key}.label`));
    name.scope = 'row';
    const value = element('td', 'score-value');
    const number = element('span', 'score-number');
    const track = element('span', 'score-track');
    track.setAttribute('aria-hidden', 'true');
    const fill = element('span', 'score-fill');
    track.append(fill);
    value.append(number, track);
    const formula = element('td', 'score-formula', t(`vision.scores.${score.key}.formula`, {
      d: num(thresholds.colorDistinctionDeltaE), aa: ratio(thresholds.textContrast, 1), aaa: ratio(thresholds.textContrastHighContrast, 0),
    }));
    const reference = element('td', 'score-ref');
    const link = element('a', '', score.ref[0]);
    link.href = score.ref[1];
    reference.append(link);
    row.append(name, value, formula, reference);
    body.append(row);
    return { score, number, fill };
  });
  table.append(caption, head, body);
  region.append(table);
  const note = element('p', 'chart-note', t('vision.note'));
  container.append(group, preview, status, region, note);

  function draw() {
    const palette = current;
    const seen = view === 'normal'
      ? { background: palette.bg, tokens: palette.tokens }
      : palette.simulated[view];
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
    preview.style.background = seen.background;
    preview.replaceChildren(...code.map((line) => {
      const row = element('span', 'vision-line');
      for (const [text, role] of line) {
        const span = element('span', '', text);
        span.style.color = seen.tokens[ROLE[role] || role] || seen.tokens.variable;
        const style = palette.tokenStyles?.[ROLE[role] || role] || '';
        if (style.includes('italic')) span.style.fontStyle = 'italic';
        if (style.includes('bold')) span.style.fontWeight = '700';
        const lines = ['underline', 'strikethrough'].filter((word) => style.includes(word));
        if (lines.length) span.style.textDecoration = lines.map((word) => (word === 'strikethrough' ? 'line-through' : word)).join(' ');
        row.append(span);
      }
      return row;
    }));
    const label = VIEWS.find((item) => item.key === view).label;
    const score = view === 'normal' ? null : palette.scores[view];
    status.textContent = score == null
      ? t('vision.normal', { theme: palette.name })
      : t('vision.simulated', { theme: palette.name, vision: inSentence(label), score: num(score) });
  }

  return {
    update(palette) {
      current = palette;
      caption.textContent = t('vision.caption', { theme: palette.name });
      for (const { score, number, fill } of rows) {
        const value = palette.scores[score.key];
        number.textContent = num(value);
        fill.style.width = `${value}%`;
      }
      draw();
    },
  };
}
