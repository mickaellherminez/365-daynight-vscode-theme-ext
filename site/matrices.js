// Monthly distances are exported by scripts/themes/report.py from the same
// measurements used by themes:variety. No color distances are estimated here.
const VARIANTS = {
  light: 'Light', dark: 'Dark',
  hcLight: 'High Contrast Light', hcDark: 'High Contrast',
};
const MEASURES = {
  background: { label: 'Editor background', report: 'Editor background' },
  syntax: { label: 'Syntax · six roles', report: 'Syntax (6 roles)' },
};
const REPO = 'https://github.com/mickaellherminez/365-daynight-vscode-theme-ext';

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function monthLabel(month) {
  const label = make('span');
  const short = make('span', '', month.short);
  short.setAttribute('aria-hidden', 'true');
  label.append(short, make('span', 'sr', month.name));
  return label;
}

function number(value) {
  return value.toFixed(1);
}

function band(value, threshold) {
  if (value < threshold) return 0;
  if (value < threshold * 2) return 1;
  if (value < threshold * 4) return 2;
  return 3;
}

function pairsOf(grid) {
  const pairs = [];
  for (let row = 0; row < grid.length; row++) {
    for (let column = row + 1; column < grid.length; column++) pairs.push(grid[row][column]);
  }
  return pairs;
}

/**
 * Draw two accessible 12 × 12 tables from the report, with one common legend.
 * The month/variant selector of the page remains the source of the active theme.
 * Table cells are ordinary data cells, not hundreds of keyboard stops.
 */
export function createMatrices(container, months, comparisons, thresholds, onSelectMonth) {
  if (months.length !== 12) throw new Error('Monthly matrices require twelve months.');
  // Text thresholds are deliberately not used for color-distance measurements.
  // The separate variety threshold is exported with each report measure.
  void thresholds;
  let currentMonth = 0;
  let currentMode = 'light';
  let measure = 'background';
  let lastMonth = null;

  container.classList.add('matrices');
  const controls = make('div', 'matrix-controls');
  const measureLabel = make('label', 'matrix-field');
  measureLabel.append(make('span', '', 'Compare'));
  const measureSelect = make('select', 'matrix-select');
  measureSelect.setAttribute('aria-label', 'Monthly difference measurement');
  for (const [key, descriptor] of Object.entries(MEASURES)) {
    const option = make('option', '', descriptor.label);
    option.value = key;
    measureSelect.append(option);
  }
  measureLabel.append(measureSelect);
  const variant = make('p', 'matrix-variant');
  controls.append(measureLabel, variant);

  const legend = make('div', 'matrix-legend');
  legend.setAttribute('aria-label', 'Shared color-distance scale');
  const context = make('p', 'matrix-context');
  const panels = make('div', 'matrix-panels');
  const beforePanel = make('section', 'matrix-panel');
  const currentPanel = make('section', 'matrix-panel');
  const beforeTitle = make('h4', 'matrix-panel-title', 'Before · 0.12.0');
  const currentTitle = make('h4', 'matrix-panel-title', 'Now · 1.0.0');
  const beforeStats = make('p', 'matrix-summary');
  const currentStats = make('p', 'matrix-summary');
  const beforeScroll = make('div', 'matrix-scroll');
  const currentScroll = make('div', 'matrix-scroll');
  for (const [scroll, label] of [[beforeScroll, 'Before the redesign'], [currentScroll, 'After the redesign']]) {
    scroll.tabIndex = 0;
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('aria-label', `${label}: monthly color-distance table. Scroll horizontally if needed.`);
  }
  beforePanel.append(beforeTitle, beforeStats, beforeScroll);
  currentPanel.append(currentTitle, currentStats, currentScroll);
  panels.append(beforePanel, currentPanel);

  const explorer = make('div', 'matrix-explorer');
  const pairControls = make('div', 'matrix-pair-controls');
  const pairSelects = ['First month', 'Second month'].map((label, index) => {
    const field = make('label', 'matrix-field');
    field.append(make('span', '', label));
    const select = make('select', 'matrix-select');
    select.setAttribute('aria-label', `${label} in monthly comparison`);
    months.forEach((month, monthIndex) => {
      const option = make('option', '', month.name);
      option.value = String(monthIndex);
      select.append(option);
    });
    select.value = String(index);
    field.append(select);
    pairControls.append(field);
    return select;
  });
  const apply = make('button', 'matrix-apply', 'Apply first month');
  apply.type = 'button';
  apply.addEventListener('click', () => onSelectMonth(Number(pairSelects[0].value)));
  pairControls.append(apply);
  const pairResult = make('p', 'matrix-pair-result');
  pairResult.setAttribute('role', 'status');
  pairResult.setAttribute('aria-live', 'polite');
  pairResult.setAttribute('aria-atomic', 'true');
  explorer.append(make('p', 'eyebrow', 'Read one pair'), pairControls, pairResult);

  const method = make('details', 'matrix-method');
  method.append(make('summary', '', 'How these distances are measured'));
  method.append(make('p', '', 'CIE76 distance in CIELAB: ΔE = √((ΔL*)² + (Δa*)² + (Δb*)²). Editor background compares editor.background directly. Syntax is the arithmetic mean of the six distances for keyword, function, string, number, class and comment, comparing each role with the same role in the other month.'));
  method.append(make('p', '', 'The diagonal compares a month with itself. Each table contains 66 unique pairs; the other half repeats them. Values are rounded to one decimal in the audit export. The shaded ranges and the minimum distance are project rules for variety, not WCAG requirements or a guarantee of what every person will perceive.'));
  const links = make('p', 'matrix-source-links');
  const source = make('a', '', 'Measurements and limits');
  source.href = `${REPO}/blob/main/docs/AUDIT.md`;
  const script = make('a', '', 'Variety calculation');
  script.href = `${REPO}/blob/main/scripts/themes/variety.py`;
  const data = make('a', '', 'Download the audit JSON');
  data.href = 'audit-report.json';
  links.append(source, document.createTextNode(' · '), script, document.createTextNode(' · '), data);
  method.append(links);
  container.append(controls, context, legend, panels, explorer, method);

  function threshold() {
    const entry = comparisons[currentMode].variety.find((row) => row.measure === MEASURES[measure].report);
    if (!entry || !Number.isFinite(entry.threshold)) throw new Error(`Missing variety threshold: ${currentMode} ${measure}`);
    return entry.threshold;
  }

  function summary(grid, minimum) {
    const pairs = pairsOf(grid);
    const below = pairs.filter((value) => value < minimum).length;
    const average = pairs.reduce((sum, value) => sum + value, 0) / pairs.length;
    return `Mean ${number(average)} ΔE · ${below}/${pairs.length} pairs below ${minimum}`;
  }

  function drawTable(grid, era, minimum) {
    if (!Array.isArray(grid) || grid.length !== 12 || grid.some((row) => !Array.isArray(row) || row.length !== 12 || row.some((value) => !Number.isFinite(value)))) {
      throw new Error(`Invalid monthly matrix: ${currentMode} ${era} ${measure}`);
    }
    const table = make('table', 'matrix-table');
    const caption = make('caption', 'sr', `${era}, ${VARIANTS[currentMode]}, ${MEASURES[measure].label}. Monthly differences in ΔE CIE76.`);
    table.append(caption);
    const head = make('thead');
    const header = make('tr');
    const corner = make('th', 'matrix-corner', 'Month');
    corner.scope = 'col';
    header.append(corner);
    months.forEach((month, index) => {
      const cell = make('th', index === currentMonth ? 'is-current-month' : '');
      cell.scope = 'col';
      cell.append(monthLabel(month));
      header.append(cell);
    });
    head.append(header);
    table.append(head);
    const body = make('tbody');
    grid.forEach((values, row) => {
      const line = make('tr');
      const label = make('th', row === currentMonth ? 'is-current-month' : '');
      label.scope = 'row';
      label.append(monthLabel(months[row]));
      line.append(label);
      values.forEach((value, column) => {
        const cell = make('td');
        cell.dataset.row = String(row);
        cell.dataset.column = String(column);
        if (row === column) {
          cell.className = 'matrix-diagonal';
          const dash = make('span', '', '—');
          dash.setAttribute('aria-hidden', 'true');
          cell.append(dash, make('span', 'sr', 'Same month'));
        } else {
          cell.className = `matrix-cell matrix-band-${band(value, minimum)}`;
          cell.textContent = number(value);
          cell.dataset.value = String(value);
          cell.title = `${months[row].name} / ${months[column].name}: ${number(value)} ΔE CIE76${value < minimum ? `, below the project threshold of ${minimum}` : ''}`;
          if (value < minimum) cell.append(make('span', 'sr', ', below the project threshold'));
        }
        if (row === currentMonth || column === currentMonth) cell.classList.add('is-current-month');
        line.append(cell);
      });
      body.append(line);
    });
    table.append(body);
    return table;
  }

  function updatePair() {
    const first = Number(pairSelects[0].value);
    const second = Number(pairSelects[1].value);
    const grids = comparisons[currentMode].grids;
    const before = grids.before ? grids.before[measure][first][second] : null;
    const current = grids.current[measure][first][second];
    const names = `${months[first].name} / ${months[second].name}`;
    pairResult.textContent = first === second
      ? `${names}: the same month, ΔE 0.0.`
      : `${names} · ${VARIANTS[currentMode]} · ${MEASURES[measure].label}. Before: ${before == null ? 'no earlier variant' : `${number(before)} ΔE`}. Now: ${number(current)} ΔE.`;
    for (const cell of panels.querySelectorAll('td[data-row]')) {
      const row = Number(cell.dataset.row), column = Number(cell.dataset.column);
      cell.classList.toggle('is-pair', (row === first && column === second) || (row === second && column === first));
    }
    apply.disabled = first === currentMonth;
    apply.setAttribute('aria-label', `Apply ${months[first].name} to the website`);
  }

  function render() {
    const minimum = threshold();
    const comparison = comparisons[currentMode];
    const ranges = [`< ${minimum}`, `${minimum}–< ${minimum * 2}`, `${minimum * 2}–< ${minimum * 4}`, `≥ ${minimum * 4}`];
    legend.replaceChildren(...ranges.map((label, index) => {
      const item = make('span', 'matrix-legend-item');
      const tile = make('span', `matrix-legend-tile matrix-band-${index}`);
      tile.setAttribute('aria-hidden', 'true');
      item.append(tile, make('span', '', `${label} ΔE`));
      return item;
    }));
    variant.textContent = `${VARIANTS[currentMode]} · normal vision`;
    context.textContent = `Project minimum: ${minimum} ΔE CIE76. Hatched cells fall below it. The outlined row and column are ${months[currentMonth].name}.`;
    currentStats.textContent = summary(comparison.grids.current[measure], minimum);
    currentScroll.replaceChildren(drawTable(comparison.grids.current[measure], 'After the redesign, version 1.0.0', minimum));
    if (comparison.grids.before) {
      beforeStats.textContent = summary(comparison.grids.before[measure], minimum);
      beforeScroll.replaceChildren(drawTable(comparison.grids.before[measure], 'Before the redesign, version 0.12.0', minimum));
      beforeScroll.tabIndex = 0;
    } else {
      beforeStats.textContent = 'No earlier variant';
      beforeScroll.replaceChildren(make('p', 'matrix-no-baseline', 'High Contrast Light was not available in 0.12.0, so there is no earlier palette to compare.'));
      beforeScroll.removeAttribute('tabindex');
    }
    updatePair();
  }
  measureSelect.addEventListener('change', () => {
    measure = measureSelect.value;
    render();
  });
  pairSelects.forEach((select) => select.addEventListener('change', updatePair));

  function update(monthIndex, mode) {
    if (!Number.isInteger(monthIndex) || monthIndex < 0 || monthIndex > 11 || !Object.hasOwn(VARIANTS, mode) || !comparisons[mode]) {
      throw new Error('Unknown month or variant for monthly matrices.');
    }
    currentMonth = monthIndex;
    currentMode = mode;
    if (lastMonth !== monthIndex) {
      pairSelects[0].value = String(monthIndex);
      if (lastMonth == null) pairSelects[1].value = String((monthIndex + 1) % 12);
      lastMonth = monthIndex;
    }
    const palette = months[monthIndex][mode];
    for (const key of ['bg', 'text', 'panel', 'accent', 'onAccent']) container.style.setProperty(`--matrix-${key}`, palette[key]);
    render();
  }
  return { update };
}
