'use strict';

// Construit la landing page dans site-dist/, à partir de site/ et du rapport d'audit.
// Usage : node scripts/site/build.cjs [dossier de sortie]

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SITE = 'https://365daynight.mickaellherminez.net/';
const LOCALE_DIR = path.join(ROOT, 'site', 'i18n');
// Same order as the language links of the README. English is the reference and stays at the root.
const LANGUAGES = ['en', 'fr', 'es', 'de', 'pt', 'ru', 'zh', 'ja', 'hi', 'ar'];
const REPO = 'https://github.com/mickaellherminez/365-daynight-vscode-theme-ext';
const ID = 'mickaellherminez.365-daynight-vscode-theme-ext';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const VARIANTS = { light: 'Light', dark: 'Dark', hcLight: 'High Contrast Light', hcDark: 'High Contrast' };
const TOKEN_SCOPES = {
	comment: 'comment', keyword: 'keyword', function: 'entity.name.function', string: 'string',
	number: 'constant.numeric', class: 'entity.name.class', variable: 'variable', operator: 'keyword.operator',
	punctuation: 'punctuation', tag: 'entity.name.tag', attribute: 'entity.other.attribute-name',
	regex: 'string.regexp', 'JSON key': 'support.type.property-name.json', invalid: 'invalid',
};

/** Read the published theme even when the caller starts from an audit entry. */
function publishedTheme(theme) {
	if (theme.colors['editor.background']) return theme;
	const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
	const source = manifest.contributes.themes.find((entry) => entry.label === theme.name);
	if (!source) throw new Error(`Missing published theme: ${theme.name}`);
	return JSON.parse(fs.readFileSync(path.join(ROOT, source.path), 'utf8'));
}

/** Exact VS Code interface roles, without generated or interpolated colors. */
function pagePalette(theme) {
	const { colors } = publishedTheme(theme);
	return {
		bg: colors['editor.background'],
		text: colors['editor.foreground'],
		accent: colors['button.background'],
		onAccent: colors['button.foreground'],
		link: colors['textLink.foreground'],
		muted: contrast(colors.descriptionForeground, colors['editor.background']) >= 4.5
			? colors.descriptionForeground : colors['editor.foreground'],
		panel: colors['editorGroupHeader.tabsBackground'],
		panelText: colors['titleBar.activeForeground'],
		line: colors.focusBorder,
		rule: colors['editorGroup.border'],
		shadow: colors['widget.shadow'],
	};
}

function luminance(hex) {
	const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
		.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
	return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(first, second) {
	const [high, low] = [luminance(first), luminance(second)].sort((a, b) => b - a);
	return (high + 0.05) / (low + 0.05);
}

/** Resolve the same representative TextMate scopes as the audit; the last rule wins. */
const SIMULATED_VIEWS = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];
const SCORES = ['protanopia', 'deuteranopia', 'tritanopia', 'protanomaly', 'deuteranomaly', 'tritanomaly',
	'achromatopsia', 'lowVision20/40', 'lowVision20/80'];

function syntaxTokens(theme) {
	const tokens = {};
	const styles = {};
	for (const rule of theme.tokenColors || []) {
		const scopes = Array.isArray(rule.scope) ? rule.scope : (rule.scope || '').split(',');
		for (const [name, probe] of Object.entries(TOKEN_SCOPES)) {
			if (!scopes.some((scope) => scope.trim() === probe)) continue;
			if (rule.settings?.foreground) tokens[name] = rule.settings.foreground;
			if ('fontStyle' in (rule.settings || {})) styles[name] = rule.settings.fontStyle;
		}
	}
	if (!tokens.variable) tokens.variable = theme.colors['editor.foreground'];
	return { tokens, styles };
}

/** Complete les mesures du rapport avec les surfaces des themes publies. */
function themeData(report) {
	const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
	const sources = new Map(manifest.contributes.themes.map((theme) => [theme.label, theme.path]));
	const months = MONTHS.map((name, index) => {
		const month = { name, short: name.slice(0, 3) };
		for (const [key, variant] of Object.entries(VARIANTS)) {
			const measured = report.variants[variant].themes.find((theme) => theme.name.startsWith(`365 ${String(index + 1).padStart(2, '0')}-`));
			if (!measured || !sources.has(measured.name)) {
				throw new Error(`Missing published theme: ${name} ${variant}`);
			}
			const published = JSON.parse(fs.readFileSync(path.join(ROOT, sources.get(measured.name)), 'utf8'));
			const palette = pagePalette(published);
			const { tokens, styles } = syntaxTokens(published);
			if (measured.colors.background !== palette.bg) throw new Error(`Stale audit background: ${measured.name}`);
			for (const view of SIMULATED_VIEWS) {
				if (!measured.simulated?.[view]?.background) throw new Error(`Missing simulated colors: ${measured.name}, ${view}`);
			}
			for (const score of SCORES) {
				if (typeof measured.scores?.[score] !== 'number') throw new Error(`Missing vision score: ${measured.name}, ${score}`);
			}
			for (const [role, color] of Object.entries(tokens)) {
				if (measured.colors.tokens[role] !== color) throw new Error(`Stale audit syntax color: ${measured.name}, ${role}`);
				const value = Number(contrast(color, palette.bg).toFixed(2));
				if (measured.syntaxContrast[role] !== value) throw new Error(`Stale audit syntax contrast: ${measured.name}, ${role}`);
			}
			const c = published.colors;
			month[key] = {
				...palette,
				tokens,
				tokenStyles: styles,
				semanticTokens: published.semanticTokenColors,
				syntaxContrast: measured.syntaxContrast,
				scores: measured.scores,
				simulated: measured.simulated,
				contrast: { text: Number(contrast(palette.text, palette.bg).toFixed(2)), accent: Number(contrast(palette.accent, palette.bg).toFixed(2)) },
				ui: {
					titleBg: c['titleBar.activeBackground'], titleText: c['titleBar.activeForeground'],
					tabBg: c['editorGroupHeader.tabsBackground'], tabText: c['tab.inactiveForeground'],
					tabActiveBg: c['tab.activeBackground'], tabActiveText: c['tab.activeForeground'], tabBorder: c['tab.activeBorderTop'],
					statusBg: c['statusBar.background'], statusText: c['statusBar.foreground'],
					lineNumber: c['editorLineNumber.foreground'], editorBorder: c['editorGroup.border'],
				},
				name: measured.name,
			};
		}
		return month;
	});
	const comparisons = Object.fromEntries(Object.entries(VARIANTS).map(([key, label]) => [key, {
		grids: report.variants[label].grids,
		variety: report.variants[label].variety,
	}]));
	return { months, comparisons, thresholds: report.thresholds };
}

/** Path of a language from the site root: "" for English, "fr/" for French. */
const languagePath = (code) => (code === 'en' ? '' : `${code}/`);

/** Read one translation file of site/i18n/. */
function loadLocale(code) {
	const file = path.join(LOCALE_DIR, `${code}.json`);
	if (!fs.existsSync(file)) throw new Error(`Missing translation file: site/i18n/${code}.json`);
	return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** Tags and attributes of an HTML fragment, sorted: a translation may reorder them, not change them. */
const markup = (text) => [...text.matchAll(/<\/?[a-z][^>]*>/gi)].map((match) => match[0]).sort();
/** {{placeholders}} of a text, sorted. */
const placeholders = (text) => [...text.matchAll(/\{\{\w+\}\}/g)].map((match) => match[0]).sort();

/** A translated text: filled in, with the links, elements and placeholders of English. */
function compareText(value, base, key, problems) {
	if (typeof value !== 'string' || !value.trim()) { problems.push(`${key}: missing text`); return; }
	if (markup(value).join() !== markup(base).join()) problems.push(`${key}: the HTML differs from English`);
	if (placeholders(value).join() !== placeholders(base).join()) problems.push(`${key}: the {{placeholders}} differ from English`);
}

/** Compare a translated value with English, key by key, at any depth. */
function compareTree(value, base, key, problems) {
	if (typeof base === 'string') { compareText(value, base, key, problems); return; }
	if (Array.isArray(base)) {
		if (!Array.isArray(value) || value.length !== base.length) { problems.push(`${key}: expected ${base.length} entries`); return; }
		base.forEach((item, index) => compareTree(value[index], item, `${key}[${index}]`, problems));
		return;
	}
	if (value == null || typeof value !== 'object') { problems.push(`${key}: missing`); return; }
	const path = (name) => (key ? `${key}.${name}` : name);
	for (const name of Object.keys(base)) compareTree(value[name], base[name], path(name), problems);
	for (const name of Object.keys(value).filter((item) => !(item in base))) problems.push(`${path(name)}: not in English`);
}

/**
 * A translation has exactly the keys of English, every text is filled in, and keeps the same
 * links, elements and {{placeholders}}. Only the words change.
 */
function validateLocale(locale, reference = loadLocale('en'), where = locale.meta?.code || '?') {
	const problems = [];
	const parts = (source) => ({ months: source.months, page: source.page, js: source.js });
	compareTree(parts(locale), parts(reference), '', problems);
	const meta = locale.meta || {};
	for (const field of ['code', 'name', 'dir', 'ogLocale'].filter((name) => !meta[name])) problems.push(`meta.${field}: missing`);
	if (!['ltr', 'rtl'].includes(meta.dir)) problems.push('meta.dir: must be ltr or rtl');
	if (problems.length) throw new Error(`Translation ${where}:\n  ${problems.join('\n  ')}`);
	return locale;
}

/**
 * The limits of the audit report. English reads docs/AUDIT.md; a translation gives the same
 * items in the same Markdown, and must keep their number and links when the report changes.
 */
function localeLimits(locale, audit) {
	const source = limitItems(audit);
	if (locale.meta.code === 'en') return source;
	const items = locale.limits;
	const links = (lines) => lines.map((line) => [...line.matchAll(/\]\((https:\/\/[^)\s]+)\)/g)].map((match) => match[1]).join());
	if (!Array.isArray(items) || items.length !== source.length) {
		throw new Error(`Translation ${locale.meta.code}: limits must have the ${source.length} items of docs/AUDIT.md`);
	}
	if (links(items).join('|') !== links(source).join('|')) throw new Error(`Translation ${locale.meta.code}: the links of the limits differ from docs/AUDIT.md`);
	return items;
}

/** Placeholders {{t:key}} of the page, filled from the "page" texts of a language. */
function translate(template, page) {
	return template.replace(/\{\{t:([\w.]+)\}\}/g, (_, key) => {
		const text = key.split('.').reduce((node, part) => (node == null ? node : node[part]), page);
		if (typeof text !== 'string') throw new Error(`Unknown translation key: ${key}`);
		return text;
	});
}

/** A technical expression (ratio, code) that reads left to right in every language, Arabic included. */
const isolate = (text) => `<bdi dir="ltr">${text}</bdi>`;
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** JSON placed in a <script> element: "<" is escaped so no text can close the element. */
const scriptJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

/** The compact language menu of the header, a native disclosure that works without JavaScript. */
function languageMenu(locale, locales, root) {
	const code = locale.meta.code;
	const items = locales.map(({ meta }) => {
		const current = meta.code === code ? ' aria-current="page"' : '';
		return `      <li><a href="${root + languagePath(meta.code) || './'}" hreflang="${meta.code}" lang="${meta.code}"${current}>`
			+ `<span class="language-name">${escapeHtml(meta.name)}</span><span class="language-code" aria-hidden="true">${meta.code.toUpperCase()}</span></a></li>`;
	}).join('\n');
	return `    <details class="language-menu" data-language-menu>
    <summary class="nav-link language-toggle" data-tooltip="${locale.page.header.language}">
      <svg class="nav-icon" width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="8" cy="8" r="6.6"/><path d="M1.4 8h13.2M8 1.4c-3.6 3.7-3.6 9.5 0 13.2M8 1.4c3.6 3.7 3.6 9.5 0 13.2"/></g></svg>
      <span class="nav-text">${code.toUpperCase()}</span><span class="sr">${locale.page.header.languageAction.replace('{{name}}', escapeHtml(locale.meta.name))}</span>
      <svg class="chip-chevron" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
    </summary>
    <ul class="language-list">
${items}
    </ul>
    </details>`;
}

/** The same links in the footer, for readers who reach the end of the page. */
function languageList(locale, locales, root) {
	const links = locales.map(({ meta }) => {
		const current = meta.code === locale.meta.code ? ' aria-current="page"' : '';
		return `<li><a href="${root + languagePath(meta.code) || './'}" hreflang="${meta.code}" lang="${meta.code}"${current}>${escapeHtml(meta.name)}</a></li>`;
	}).join('');
	return `<nav class="footer-languages" aria-label="${locale.page.header.languages}"><ul>${links}</ul></nav>`;
}

/**
 * @param {object} report Contenu de docs/audit-report.json
 * @param {object} [locale] Traduction de site/i18n/ (anglais par défaut)
 * @param {object[]} [locales] Toutes les traductions, pour le choix de la langue
 * @returns {Record<string, string>} Valeurs à placer dans la page
 */
function pageValues(report, locale = loadLocale('en'), locales = [locale]) {
	const themes = Object.values(report.variants).flatMap((variant) => variant.themes);
	const totals = themes.map((theme) => theme.checks.total);
	const lowest = Math.min(...themes.map((theme) => theme.contrast.lowestText));
	const data = themeData(report);
	const code = locale.meta.code;
	const root = code === 'en' ? '' : '../';
	const format = (value, digits = 0) => value.toLocaleString(locale.meta.numberLocale || code, { minimumFractionDigits: digits, maximumFractionDigits: digits });
	return {
		LANG: code,
		DIR: locale.meta.dir,
		OG_LOCALE: locale.meta.ogLocale,
		ROOT: root,
		CANONICAL_URL: SITE + languagePath(code),
		ALTERNATES: [...locales.map(({ meta }) => `<link rel="alternate" hreflang="${meta.code}" href="${SITE + languagePath(meta.code)}">`),
			`<link rel="alternate" hreflang="x-default" href="${SITE}">`].join('\n'),
		LANGUAGE_MENU: languageMenu(locale, locales, root),
		LANGUAGE_LIST: languageList(locale, locales, root),
		LOCALE_DATA: scriptJson({ meta: locale.meta, months: locale.months, js: locale.js }),
		LIMITS: itemsHtml(localeLimits(locale, fs.readFileSync(path.join(ROOT, 'docs', 'AUDIT.md'), 'utf8'))),
		THEMES: format(report.themeCount),
		CHECKS_PASSED: format(report.checks.passed),
		CHECKS_TOTAL: format(report.checks.total),
		CHECKS_MIN: format(Math.min(...totals)),
		CHECKS_MAX: format(Math.max(...totals)),
		LOWEST_TEXT: lowest.toFixed(2),
		LOWEST_TEXT_NUMBER: format(lowest, 2),
		LOWEST_TEXT_RATIO: isolate(`${format(lowest, 2)}:1`),
		AA_LEVEL: format(report.thresholds.textContrast, 1),
		AA_RATIO: isolate(`${format(report.thresholds.textContrast, 1)}:1`),
		THEME_DATA: JSON.stringify(data),
		INITIAL_CSS: Object.entries(pagePalette(publishedTheme(report.variants.Light.themes[10])))
			.map(([key, value]) => `--${key}:${value}`).join(';'),
		PALETTES: JSON.stringify({
			light: data.months.map(({ light: { bg, text, accent, muted } }) => ({ bg, text, accent, muted })),
			dark: data.months.map(({ dark: { bg, text, accent, muted } }) => ({ bg, text, accent, muted })),
		}),
		MARKETPLACE_URL: `https://marketplace.visualstudio.com/items?itemName=${ID}`,
		OPENVSX_URL: 'https://open-vsx.org/extension/mickaellherminez/365-daynight-vscode-theme-ext',
		REPO_URL: REPO,
		AUDIT_URL: `${REPO}/blob/main/docs/AUDIT.md`,
		TESTERS_URL: `${REPO}/issues/47`,
		LICENSE_URL: `${REPO}/blob/main/LICENSE`,
	};
}

/** Limites du rapport d'audit, en Markdown, une par élément */
function limitItems(markdown) {
	const section = markdown.split('## Limits of this audit')[1];
	if (!section) throw new Error('The audit report has no limits section');
	const items = section.split('\n').filter((line) => line.startsWith('- ')).map((line) => line.slice(2));
	if (items.length < 5) throw new Error('The limits section of the audit report looks incomplete');
	return items;
}

/** Éléments Markdown des limites, convertis en éléments de liste HTML */
function itemsHtml(items) {
	const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return items.map((item) => `      <li>${escape(item)
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\[([^\]]+)\]\((https:\/\/[^)\s]+)\)/g, '<a href="$2">$1</a>')}</li>`).join('\n');
}

/** Limites du rapport d'audit, converties en éléments de liste HTML */
function limitsHtml(markdown) {
	return itemsHtml(limitItems(markdown));
}

/** Remplace les {{MARQUES}} ; une marque sans valeur est une erreur */

function render(template, values) {
	return template.replace(/\{\{([A-Z_]+)\}\}/g, (_, key) => {
		if (!(key in values)) {
			throw new Error(`Unknown placeholder: ${key}`);
		}
		return values[key];
	});
}

function validateOutput(out) {
	const target = path.resolve(out);
	const contains = (parent, child) => {
		const relative = path.relative(parent, child);
		return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
	};
	if (contains(target, ROOT) || ['site', 'themes', 'docs', 'assets', 'scripts', 'test', '.git', 'node_modules'].some((name) => contains(path.join(ROOT, name), target))) {
		throw new Error('Build output must not overwrite the repository or its source directories');
	}
	return target;
}

/** Toutes les traductions, vérifiées, dans l'ordre du menu ; un fichier en trop est une erreur. */
function loadLocales() {
	const files = fs.readdirSync(LOCALE_DIR).filter((file) => file.endsWith('.json')).map((file) => file.slice(0, -5)).sort();
	if (files.join() !== [...LANGUAGES].sort().join()) throw new Error(`site/i18n/ must contain exactly: ${LANGUAGES.join(', ')}`);
	const reference = loadLocale('en');
	return LANGUAGES.map((code) => {
		const locale = validateLocale(loadLocale(code), reference, code);
		if (locale.meta.code !== code) throw new Error(`site/i18n/${code}.json: meta.code must be ${code}`);
		return locale;
	});
}

/** La page d'une langue, prête à publier. */
function renderPage(template, report, locale, locales) {
	return render(translate(template, locale.page), pageValues(report, locale, locales));
}

function build(out) {
	out = validateOutput(out);
	const report = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'audit-report.json'), 'utf8'));
	const locales = loadLocales();
	const template = fs.readFileSync(path.join(ROOT, 'site', 'index.html'), 'utf8');
	fs.rmSync(out, { recursive: true, force: true });
	// Le README du dossier est une documentation interne, et les traductions sont déjà dans chaque page.
	fs.cpSync(path.join(ROOT, 'site'), out, { recursive: true, filter: (source) => !['README.md', 'i18n'].includes(path.relative(path.join(ROOT, 'site'), source)) });
	fs.copyFileSync(path.join(ROOT, 'docs', 'audit-report.json'), path.join(out, 'audit-report.json'));
	for (const locale of locales) {
		const page = path.join(out, languagePath(locale.meta.code), 'index.html');
		fs.mkdirSync(path.dirname(page), { recursive: true });
		fs.writeFileSync(page, renderPage(template, report, locale, locales));
	}
	return out;
}

if (require.main === module) {
	console.log(`Built: ${build(path.resolve(process.argv[2] || path.join(ROOT, 'site-dist')))}`);
}

module.exports = { LANGUAGES, languagePath, limitItems, loadLocale, loadLocales, localeLimits, renderPage, translate, validateLocale, limitsHtml, SCORES, SIMULATED_VIEWS, pagePalette, pageValues, render, themeData, validateOutput, build, syntaxTokens };
