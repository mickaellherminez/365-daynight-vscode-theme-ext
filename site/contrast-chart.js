// Accessible, dependency-free chart. The table is both the graphic and its data.
const LABELS = {
  keyword: 'Keyword', function: 'Function', string: 'String', number: 'Number',
  class: 'Class / type', comment: 'Comment', variable: 'Variable', operator: 'Operator',
  punctuation: 'Punctuation', tag: 'Tag', attribute: 'Attribute', regex: 'Regular expression',
  'JSON key': 'JSON key', invalid: 'Invalid code',
};
const ROLES = Object.keys(LABELS);
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
};
const position = value => `${(value - 1) / 20 * 100}%`;

export function createContrastChart(container, summary, thresholds) {
  const region = element('div', 'contrast-scroll');
  region.tabIndex = 0;
  region.setAttribute('role', 'region');
  region.setAttribute('aria-label', 'Syntax text contrast. Scroll horizontally to see all columns on a small screen.');
  const table = element('table', 'contrast-table');
  const caption = element('caption', 'sr');
  const head = element('thead');
  const headRow = element('tr');
  for (const label of ['Syntax role', 'Exact color', 'Contrast on a 1:1–21:1 scale', 'Ratio / level']) {
    const cell = element('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  }
  head.append(headRow);
  const body = element('tbody');
  const rows = ROLES.map(role => {
    const row = element('tr');
    row.dataset.token = role;
    const label = element('th', '', LABELS[role]);
    label.scope = 'row';
    const color = element('td', 'contrast-color');
    const colorContent = element('span', 'contrast-color-value');
    const swatch = element('span', 'contrast-swatch');
    swatch.setAttribute('aria-hidden', 'true');
    const hex = element('code');
    colorContent.append(swatch, hex);
    color.append(colorContent);
    const graphic = element('td', 'contrast-graphic');
    graphic.setAttribute('aria-hidden', 'true');
    const track = element('div', 'contrast-track');
    const fill = element('span', 'contrast-fill');
    const aa = element('span', 'contrast-threshold threshold-aa');
    const aaa = element('span', 'contrast-threshold threshold-aaa');
    aa.style.left = position(thresholds.textContrast);
    aaa.style.left = position(thresholds.textContrastHighContrast);
    track.append(fill, aa, aaa);
    graphic.append(track);
    const data = element('td', 'contrast-value');
    const value = element('span', 'contrast-ratio');
    const level = element('span', 'contrast-level');
    data.append(value, level);
    row.append(label, color, graphic, data);
    body.append(row);
    return { role, row, swatch, hex, fill, value, level };
  });
  const foot = element('tfoot');
  const footRow = element('tr');
  const note = element('td', 'contrast-axis-note', 'Text contrast');
  note.colSpan = 2;
  const axis = element('td', 'contrast-axis');
  axis.setAttribute('aria-hidden', 'true');
  const axisContent = element('div', 'contrast-axis-inner');
  for (const [label, value, className] of [
    ['1:1', 1, 'axis-start'], [`AA · ${thresholds.textContrast}`, thresholds.textContrast, ''],
    [`AAA · ${thresholds.textContrastHighContrast}`, thresholds.textContrastHighContrast, ''], ['21:1', 21, 'axis-end'],
  ]) {
    const tick = element('span', className, label);
    tick.style.left = position(value);
    axisContent.append(tick);
  }
  axis.append(axisContent);
  footRow.append(note, axis, element('td'));
  foot.append(footRow);
  table.append(caption, head, body, foot);
  region.append(table);
  const scrollHint = element('p', 'chart-scroll-hint', 'On a small screen, scroll the chart horizontally to see every value.');
  container.append(region, scrollHint);
  return {
    update(palette) {
      caption.textContent = `${palette.name}: exact syntax colors and text contrast against ${palette.bg}.`;
      let aaCount = 0, aaaCount = 0;
      for (const row of rows) {
        const ratio = palette.syntaxContrast[row.role];
        const color = palette.tokens[row.role];
        const aa = ratio >= thresholds.textContrast;
        const aaa = ratio >= thresholds.textContrastHighContrast;
        aaCount += Number(aa);
        aaaCount += Number(aaa);
        row.hex.textContent = color.toUpperCase();
        row.swatch.style.backgroundColor = color;
        row.fill.style.backgroundColor = color;
        row.fill.style.width = position(ratio);
        row.value.textContent = `${ratio.toFixed(2)}:1`;
        row.level.textContent = aaa ? 'AA + AAA' : aa ? 'AA' : 'Below AA';
        row.row.dataset.ratio = String(ratio);
        row.row.dataset.color = color;
      }
      summary.textContent = `${aaCount} of ${rows.length} syntax colors meet ${thresholds.textContrast}:1 (AA). ${aaaCount} of ${rows.length} meet ${thresholds.textContrastHighContrast}:1 (AAA). Editor background: ${palette.bg.toUpperCase()}.`;
      table.style.backgroundColor = palette.bg;
    },
  };
}
