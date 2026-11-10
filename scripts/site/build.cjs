'use strict';

// Construit la landing page dans site-dist/, à partir de site/ et du rapport d'audit.
// Usage : node scripts/site/build.cjs [dossier de sortie]

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
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

/**
 * @param {object} report Contenu de docs/audit-report.json
 * @returns {Record<string, string>} Valeurs à placer dans la page
 */
function pageValues(report) {
	const themes = Object.values(report.variants).flatMap((variant) => variant.themes);
	const totals = themes.map((theme) => theme.checks.total);
	const lowest = Math.min(...themes.map((theme) => theme.contrast.lowestText));
	const data = themeData(report);
	return {
		THEMES: String(report.themeCount),
		CHECKS_PASSED: report.checks.passed.toLocaleString('en-US'),
		CHECKS_TOTAL: report.checks.total.toLocaleString('en-US'),
		CHECKS_MIN: String(Math.min(...totals)),
		CHECKS_MAX: String(Math.max(...totals)),
		LOWEST_TEXT: lowest.toFixed(2),
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

function build(out) {
	out = validateOutput(out);
	const report = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'audit-report.json'), 'utf8'));
	fs.rmSync(out, { recursive: true, force: true });
	fs.cpSync(path.join(ROOT, 'site'), out, { recursive: true });
	fs.copyFileSync(path.join(ROOT, 'docs', 'audit-report.json'), path.join(out, 'audit-report.json'));
	const page = path.join(out, 'index.html');
	fs.writeFileSync(page, render(fs.readFileSync(page, 'utf8'), pageValues(report)));
	return out;
}

if (require.main === module) {
	console.log(`Built: ${build(path.resolve(process.argv[2] || path.join(ROOT, 'site-dist')))}`);
}

module.exports = { pagePalette, pageValues, render, themeData, validateOutput, build, syntaxTokens };
