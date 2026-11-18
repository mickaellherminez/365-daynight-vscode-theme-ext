'use strict';

// Dessine le graphique des totaux de downloads.csv : downloads.svg, puis downloads.png rendu par Google Chrome.
// Usage : node scripts/stats/chart.cjs <dossier de la branche stats> <CHANGELOG.md>
//
// - Deux panneaux, un par registre, car leurs échelles n'ont rien à voir : le Marketplace (installations, mises à
//   jour et téléchargements) et Open VSX (téléchargements).
// - Les totaux cumulés, tels que publiés. Un jour non mesuré (statut carried) n'a pas de point : la courbe le
//   traverse en pointillés jusqu'au jour mesuré suivant, donc le rattrapage après un trou est étalé, sans faux pic.
// - Un repère par version publiée, lu dans le CHANGELOG.
// - Une seule image, avec son propre fond clair, lisible sur une page claire comme sombre.
// Le PNG n'est rendu que si le SVG a changé ; le SVG n'est écrit qu'après un rendu réussi.

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { pathToFileURL } = require('url');
const { parseCsv } = require('./collect.cjs');

const CSV = 'downloads.csv';
const SVG = 'downloads.svg';
const PNG = 'downloads.png';
const WIDTH = 960;
const HEIGHT = 624;
const SCALE = 2;

const COLORS = {
	surface: '#fcfcfb',
	border: '#e3e2de',
	grid: '#ebeae6',
	marker: '#a9a8a2',
	primary: '#0b0b0b',
	secondary: '#52514e',
	muted: '#6b6a65',
};
const FONT = "-apple-system, 'Segoe UI', 'Helvetica Neue', Arial, 'Liberation Sans', 'DejaVu Sans', sans-serif";

// Une couleur par mesure, la même dans les deux panneaux pour les téléchargements.
const MEASURES = {
	install: { name: 'Installs', color: '#2a78d6' },
	update: { name: 'Updates', color: '#eb6834' },
	download: { name: 'Downloads', color: '#0f9a72' },
};
const PANELS = [
	{
		source: 'marketplace', title: 'Visual Studio Marketplace', top: 162, height: 170, releaseLabels: true,
		series: [['marketplace_download', 'download'], ['marketplace_install', 'install'], ['marketplace_update', 'update']],
	},
	{
		source: 'openvsx', title: 'Open VSX', top: 410, height: 130, releaseLabels: false,
		series: [['openvsx_download', 'download']],
	},
];
const LEFT = 84;
const RIGHT = WIDTH - 32 - 132;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const number = (value) => value.toLocaleString('en-US');
const round = (value) => Math.round(value * 10) / 10;

function dayIndex(date, first) {
	return Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${first}T00:00:00Z`)) / 86400000);
}

function dateOf(first, days) {
	const date = new Date(`${first}T00:00:00Z`);
	date.setUTCDate(date.getUTCDate() + days);
	return date;
}

function longDate(date) {
	const [year, month, day] = date.split('-').map(Number);
	return `${MONTHS[month - 1]} ${day}, ${year}`;
}

/** Les versions publiées et leur date, lues dans les titres « ## [x.y.z] - AAAA-MM-JJ » du CHANGELOG, de la plus ancienne à la plus récente */
function releases(changelog) {
	return [...changelog.matchAll(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})/gm)]
		.map(([, version, date]) => ({ version, date }))
		.sort((a, b) => a.date.localeCompare(b.date));
}

/** Une plateforme est mesurée ce jour-là si ses valeurs sont là et n'ont pas été recopiées de la veille */
function isMeasured(row, source, column) {
	return row[column] !== null && row.status !== 'carried' && row.status !== `carried:${source}`;
}

/** Les points mesurés d'une série, et les jours non mesurés qui les séparent */
function points(rows, source, column) {
	const first = rows[0].date;
	return rows.filter((row) => isMeasured(row, source, column)).map((row) => ({ day: dayIndex(row.date, first), value: row[column] }));
}

/** Un pas « rond » (1, 2, 2,5 ou 5 × 10ⁿ) pour environ quatre intervalles */
function niceStep(range) {
	const raw = range / 4;
	const power = 10 ** Math.floor(Math.log10(raw));
	return [1, 2, 2.5, 5, 10].map((factor) => factor * power).find((step) => step >= raw);
}

/** L'axe vertical d'un panneau : bornes arrondies aux graduations, qui ne descendent pas sous zéro */
function yAxis(values) {
	let min = Math.min(...values);
	let max = Math.max(...values);
	if (min === max) {
		const pad = Math.max(5, Math.ceil(max * 0.01));
		min = Math.max(0, min - pad);
		max += pad;
	}
	const step = niceStep(max - min);
	const low = Math.floor(min / step) * step;
	const high = Math.ceil(max / step) * step;
	const ticks = [];
	for (let tick = low; tick <= high + step / 1000; tick += step) ticks.push(Math.round(tick * 100) / 100);
	return { low, high, ticks };
}

/** Les graduations de dates : des jours tant que la série est courte, puis le premier de chaque mois */
function xTicks(first, span) {
	if (span <= 120) {
		const step = [1, 2, 7, 14, 28].find((candidate) => span / candidate <= 9) ?? 28;
		const ticks = [];
		for (let day = 0; day <= span; day += step) {
			const date = dateOf(first, day);
			ticks.push({ day, label: `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}` });
		}
		return ticks;
	}
	const months = [];
	for (let day = 1; day <= span; day++) {
		const date = dateOf(first, day);
		if (date.getUTCDate() === 1) months.push({ day, date });
	}
	const every = Math.ceil(months.length / 9);
	return months.filter((_, index) => index % every === 0).map(({ day, date }, index) => ({
		day,
		label: date.getUTCMonth() === 0 || index === 0 ? `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}` : MONTHS[date.getUTCMonth()],
	}));
}

/** Écarte verticalement les étiquettes de fin de courbe pour qu'elles ne se chevauchent pas */
function spreadLabels(labels, top, bottom, gap = 16) {
	const sorted = [...labels].sort((a, b) => a.y - b.y);
	sorted.forEach((label, index) => {
		label.labelY = Math.max(label.y, index > 0 ? sorted[index - 1].labelY + gap : top);
	});
	for (let index = sorted.length - 1; index >= 0; index--) {
		const limit = index === sorted.length - 1 ? bottom : sorted[index + 1].labelY - gap;
		sorted[index].labelY = Math.min(sorted[index].labelY, limit);
	}
	return labels;
}

function line(x1, y1, x2, y2, stroke, extra = '') {
	return `<line x1="${round(x1)}" y1="${round(y1)}" x2="${round(x2)}" y2="${round(y2)}" stroke="${stroke}"${extra}/>`;
}

function text(x, y, content, { size = 12, color = COLORS.secondary, anchor = 'start', weight = 400 } = {}) {
	return `<text x="${round(x)}" y="${round(y)}" font-size="${size}" fill="${color}" text-anchor="${anchor}"${weight === 400 ? '' : ` font-weight="${weight}"`}>${content}</text>`;
}

/** Largeur approchée d'un texte de 12 px, faute de pouvoir le mesurer sans navigateur */
function textWidth(label) {
	return [...label].reduce((width, char) => width + (/[ilIjtfr.,;:'| ]/.test(char) ? 3.4 : /[mwMW]/.test(char) ? 9.5 : 6.6), 0);
}

function legend(y) {
	const items = [];
	let x = 32;
	const key = (draw, label) => {
		items.push(draw(x), text(x + 22, y + 4, escape(label)));
		x += 22 + textWidth(label) + 24;
	};
	for (const measure of Object.values(MEASURES)) {
		key((at) => line(at, y, at + 16, y, measure.color, ' stroke-width="2" stroke-linecap="round"'), measure.name);
	}
	key((at) => line(at + 8, y - 7, at + 8, y + 7, COLORS.marker, ' stroke-dasharray="2 2"'), 'Release');
	key((at) => line(at, y, at + 16, y, COLORS.secondary, ' stroke-width="2" stroke-dasharray="3 3"'), 'Not measured, copied from the day before');
	return items.join('');
}

function panel(spec, rows, span, versions) {
	const first = rows[0].date;
	const bottom = spec.top + spec.height;
	const x = (day) => (span === 0 ? (LEFT + RIGHT) / 2 : LEFT + (day / span) * (RIGHT - LEFT));
	const series = spec.series.map(([column, measure]) => ({ column, ...MEASURES[measure], points: points(rows, spec.source, column) }))
		.filter((entry) => entry.points.length > 0);
	const values = series.flatMap((entry) => entry.points.map((point) => point.value));
	const parts = [text(32, spec.top - 28, escape(spec.title), { size: 14, color: COLORS.primary, weight: 600 })];
	if (values.length === 0) {
		parts.push(text(LEFT, spec.top + spec.height / 2, 'No measured day yet.'));
		return { svg: parts.join(''), latest: [] };
	}
	const axis = yAxis(values);
	const y = (value) => bottom - ((value - axis.low) / (axis.high - axis.low)) * spec.height;

	for (const tick of axis.ticks) {
		parts.push(line(LEFT, y(tick), RIGHT, y(tick), COLORS.grid), text(LEFT - 8, y(tick) + 4, number(tick), { anchor: 'end' }));
	}
	for (const tick of xTicks(first, span)) {
		parts.push(line(x(tick.day), bottom, x(tick.day), bottom + 4, COLORS.border), text(x(tick.day), bottom + 18, tick.label, { anchor: 'middle' }));
	}

	// Les versions, du jour de leur publication ; une étiquette trop proche de la précédente est omise.
	let lastLabel = -Infinity;
	for (const release of versions) {
		const day = dayIndex(release.date, first);
		if (day < 0 || day > span) continue;
		parts.push(line(x(day), spec.top, x(day), bottom, COLORS.marker, ' stroke-dasharray="2 2"'));
		if (spec.releaseLabels && x(day) - lastLabel >= 48) {
			parts.push(text(x(day), spec.top - 12, escape(release.version), { size: 11, color: COLORS.muted, anchor: 'middle' }));
			lastLabel = x(day);
		}
	}

	const labels = [];
	for (const entry of series) {
		const solid = [];
		const dashed = [];
		entry.points.forEach((point, index) => {
			const at = `${round(x(point.day))},${round(y(point.value))}`;
			const previous = entry.points[index - 1];
			if (!previous) solid.push(`M${at}`);
			else if (point.day === previous.day + 1) solid.push(`L${at}`);
			else {
				dashed.push(`M${round(x(previous.day))},${round(y(previous.value))}L${at}`);
				solid.push(`M${at}`);
			}
		});
		const stroke = `fill="none" stroke="${entry.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
		if (dashed.length) parts.push(`<path d="${dashed.join('')}" ${stroke} stroke-dasharray="3 4"/>`);
		parts.push(`<path d="${solid.join('')}" ${stroke}/>`);
		const last = entry.points.at(-1);
		parts.push(`<circle cx="${round(x(last.day))}" cy="${round(y(last.value))}" r="4" fill="${entry.color}" stroke="${COLORS.surface}" stroke-width="2"/>`);
		labels.push({ entry, last, y: y(last.value) });
	}

	// Les étiquettes de fin, en couleur de texte : le point coloré porte l'identité de la série.
	for (const label of spreadLabels(labels, spec.top + 4, bottom)) {
		const dotX = x(label.last.day);
		if (dotX < RIGHT - 1 || Math.abs(label.labelY - label.y) > 1) {
			parts.push(line(dotX + 6, label.y, RIGHT + 8, label.labelY, COLORS.border));
		}
		parts.push(`<text x="${RIGHT + 12}" y="${round(label.labelY + 4)}" font-size="12.5"><tspan fill="${COLORS.secondary}">${escape(label.entry.name)}</tspan> <tspan fill="${COLORS.primary}" font-weight="600">${number(label.last.value)}</tspan></text>`);
	}

	const latest = series.map((entry) => `${entry.name.toLowerCase()} ${number(entry.points.at(-1).value)}`);
	return { svg: parts.join(''), latest };
}

/** Le SVG complet du graphique, à partir des lignes de downloads.csv et des versions publiées */
function renderSvg(rows, versions = []) {
	if (rows.length === 0) throw new Error(`${CSV} has no line`);
	const first = rows[0].date;
	const lastDate = rows.at(-1).date;
	const span = dayIndex(lastDate, first);
	const drawn = PANELS.map((spec) => ({ spec, ...panel(spec, rows, span, versions) }));
	const title = 'Installs and downloads of 365 Day &amp; Night';
	const description = `Running totals per day, from ${longDate(first)} to ${longDate(lastDate)} (UTC). `
		+ drawn.map(({ spec, latest }) => `${spec.title}: ${latest.join(', ') || 'no measured day'}.`).join(' ')
		+ ' Downloads and updates count events, not users.';
	return [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" font-family="${escape(FONT)}" style="font-variant-numeric: tabular-nums">`,
		`<title>${title}</title><desc>${escape(description)}</desc>`,
		`<rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" fill="${COLORS.surface}" stroke="${COLORS.border}"/>`,
		text(32, 44, title, { size: 20, color: COLORS.primary, weight: 600 }),
		text(32, 68, 'Running totals per day (UTC), as each registry publishes them. Downloads and updates count events, not users.', { size: 13 }),
		legend(96),
		...drawn.map(({ svg }) => svg),
		text(32, HEIGHT - 22, 'Exact numbers: downloads.csv in the stats branch of the GitHub repository.', { size: 12, color: COLORS.muted }),
		text(WIDTH - 32, HEIGHT - 22, `Last day: ${longDate(lastDate)}`, { size: 12, color: COLORS.muted, anchor: 'end' }),
		'</svg>',
		'',
	].join('\n');
}

function chromePath() {
	const candidates = [process.env.CHROME_PATH, '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium-browser'];
	const found = candidates.find((candidate) => candidate && fs.existsSync(candidate));
	if (!found) throw new Error('Google Chrome not found: set CHROME_PATH');
	return found;
}

/** La largeur et la hauteur lues dans l'en-tête d'un PNG, ou null si ce n'en est pas un */
function pngSize(buffer) {
	if (buffer.length < 24 || buffer.toString('latin1', 1, 4) !== 'PNG' || buffer.toString('latin1', 12, 16) !== 'IHDR') return null;
	return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

/** Rend le SVG en PNG avec Chrome sans interface, dans un dossier temporaire, puis vérifie l'image obtenue */
function renderPng(svg, target, chrome = chromePath()) {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'stats-chart-'));
	try {
		const page = path.join(tmp, 'chart.html');
		const output = path.join(tmp, 'chart.png');
		fs.writeFileSync(page, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0}</style>${svg}`);
		const args = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-extensions',
			`--force-device-scale-factor=${SCALE}`, `--window-size=${WIDTH},${HEIGHT}`, `--user-data-dir=${path.join(tmp, 'profile')}`, `--screenshot=${output}`];
		// Comme Playwright sous Linux : la page est un fichier local sans script, écrit juste avant.
		if (process.platform === 'linux') args.push('--no-sandbox');
		execFileSync(chrome, [...args, pathToFileURL(page).href], { stdio: ['ignore', 'pipe', 'pipe'], timeout: 60000 });
		const size = fs.existsSync(output) ? pngSize(fs.readFileSync(output)) : null;
		if (!size || size.width !== WIDTH * SCALE || size.height !== HEIGHT * SCALE) {
			throw new Error(`Chrome did not write a ${WIDTH * SCALE}×${HEIGHT * SCALE} PNG: ${size ? `${size.width}×${size.height}` : 'no image'}`);
		}
		fs.copyFileSync(output, target);
	} finally {
		fs.rmSync(tmp, { recursive: true, force: true });
	}
}

/** Met à jour downloads.svg et downloads.png dans le dossier de la branche stats ; renvoie ce qui a été fait */
function chart(dir, changelog, { render = renderPng, log = console.log } = {}) {
	const csv = path.join(dir, CSV);
	if (!fs.existsSync(csv)) {
		log(`There is no ${CSV} yet: no chart.`);
		return 'skipped';
	}
	const rows = parseCsv(fs.readFileSync(csv, 'utf8'));
	if (rows.length === 0) {
		log(`${CSV} has no line yet: no chart.`);
		return 'skipped';
	}
	const svg = renderSvg(rows, releases(changelog));
	const svgFile = path.join(dir, SVG);
	const pngFile = path.join(dir, PNG);
	if (fs.existsSync(pngFile) && fs.existsSync(svgFile) && fs.readFileSync(svgFile, 'utf8') === svg) {
		log('The chart is up to date.');
		return 'unchanged';
	}
	render(svg, pngFile);
	fs.writeFileSync(svgFile, svg);
	log(`The chart now ends on ${rows.at(-1).date}.`);
	return 'drawn';
}

module.exports = { WIDTH, HEIGHT, SCALE, releases, isMeasured, points, yAxis, xTicks, spreadLabels, renderSvg, pngSize, renderPng, chromePath, chart };

if (require.main === module) {
	const [dir, changelog] = process.argv.slice(2);
	if (!dir || !changelog) {
		console.error('Usage: node scripts/stats/chart.cjs <folder of the stats branch> <CHANGELOG.md>');
		process.exit(2);
	}
	try {
		chart(path.resolve(dir), fs.readFileSync(changelog, 'utf8'));
	} catch (error) {
		console.error(`::error::${error.message}`);
		process.exitCode = 1;
	}
}
