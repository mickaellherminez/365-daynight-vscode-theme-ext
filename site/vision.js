// Code seen through each simulated vision, and the vision scores of the audit report.
const VIEWS = [
  { key: 'normal', label: 'Normal vision' },
  { key: 'protanopia', label: 'Protanopia' },
  { key: 'deuteranopia', label: 'Deuteranopia' },
  { key: 'tritanopia', label: 'Tritanopia' },
  { key: 'achromatopsia', label: 'Achromatopsia' },
];
const MACHADO = 'https://doi.org/10.1109/TVCG.2009.113';
const SCORES = [
  { key: 'protanopia', label: 'Protanopia', formula: 'Share of the 21 pairs of main syntax colors that stay at least ΔE {d} apart, simulated at full severity.', ref: ['Machado et al., 2009', MACHADO] },
  { key: 'deuteranopia', label: 'Deuteranopia', formula: 'Same calculation, for deuteranopia.', ref: ['Machado et al., 2009', MACHADO] },
  { key: 'tritanopia', label: 'Tritanopia', formula: 'Same calculation, for tritanopia.', ref: ['Machado et al., 2009', MACHADO] },
  { key: 'protanomaly', label: 'Protanomaly (partial)', formula: 'Same calculation for severities 0.1 to 0.9, keeping the lowest result.', ref: ['Machado et al., 2009', MACHADO] },
  { key: 'deuteranomaly', label: 'Deuteranomaly (partial)', formula: 'Same, for partial deuteranopia.', ref: ['Machado et al., 2009', MACHADO] },
  { key: 'tritanomaly', label: 'Tritanomaly (partial)', formula: 'Same, for partial tritanopia.', ref: ['Machado et al., 2009', MACHADO] },
  { key: 'achromatopsia', label: 'Achromatopsia', formula: 'Share of the same pairs that stay at least ΔE {d} apart in lightness alone.', ref: ['Relative luminance of sRGB', 'https://www.w3.org/TR/WCAG22/#dfn-relative-luminance'] },
  { key: 'lowVision20/40', label: 'Low vision 20/40', formula: 'Share of the text checks at 4.5:1 or more.', ref: ['WCAG 2.2, 1.4.3', 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'] },
  { key: 'lowVision20/80', label: 'Low vision 20/80', formula: 'Share of the text checks at 7:1 or more.', ref: ['WCAG 2.2, 1.4.6', 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html'] },
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
  group.setAttribute('aria-label', 'Choose a simulated vision');
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
  region.setAttribute('aria-label', 'Vision scores. Scroll horizontally to see all columns on a small screen.');
  const table = element('table', 'score-table');
  const caption = element('caption', 'sr');
  const headRow = element('tr');
  for (const label of ['Vision situation', 'Score out of 100', 'Formula', 'Reference']) {
    const cell = element('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  }
  const head = element('thead');
  head.append(headRow);
  const body = element('tbody');
  const rows = SCORES.map((score) => {
    const row = element('tr');
    const name = element('th', '', score.label);
    name.scope = 'row';
    const value = element('td', 'score-value');
    const number = element('span', 'score-number');
    const track = element('span', 'score-track');
    track.setAttribute('aria-hidden', 'true');
    const fill = element('span', 'score-fill');
    track.append(fill);
    value.append(number, track);
    const formula = element('td', 'score-formula', score.formula.replace('{d}', thresholds.colorDistinctionDeltaE));
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
  const note = element('p', 'chart-note', 'Scores help to choose a theme for your vision. A score of 100 means that every pair or text check passes the rule, not that the theme suits everyone.');
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
      ? `${palette.name}, as designed.`
      : `${palette.name}, simulated for ${label.toLowerCase()}: score ${score} out of 100.`;
  }

  return {
    update(palette) {
      current = palette;
      caption.textContent = `${palette.name}: vision scores out of 100, with their formula and reference.`;
      for (const { score, number, fill } of rows) {
        const value = palette.scores[score.key];
        number.textContent = String(value);
        fill.style.width = `${value}%`;
      }
      draw();
    },
  };
}
