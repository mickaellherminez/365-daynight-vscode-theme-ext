const assert = require('assert');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { pagePalette, pageValues, render, themeData, validateOutput, build, syntaxTokens } = require('../../scripts/site/build.cjs');
const report = require('../../docs/audit-report.json');
const manifest = require('../../package.json');
const variantLabels = { light: 'Light', dark: 'Dark', hcLight: 'High Contrast Light', hcDark: 'High Contrast' };
const published = (name) => {
	const source = manifest.contributes.themes.find((theme) => theme.label === name);
	return JSON.parse(fs.readFileSync(path.join(__dirname, '../..', source.path), 'utf8'));
};

const luminance = (hex) => {
	const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
		.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
	const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (high + 0.05) / (low + 0.05);
};

suite('Landing page', () => {
	for (const variant of ['Light', 'Dark', 'High Contrast Light', 'High Contrast']) {
		test(`${variant}: the page text is readable in each month`, () => {
			for (const theme of report.variants[variant].themes) {
				const palette = pagePalette(theme);
				for (const color of ['text', 'accent', 'muted', 'link']) {
					assert.ok(contrast(palette[color], palette.bg) >= 4.5, `${theme.name} ${color}`);
				}
			}
		});
	}

	test('all 48 published palettes have readable buttons and visible focus borders', () => {
		const { months } = themeData(report);
		assert.strictEqual(months.length, 12);
		assert.strictEqual(months[0].name, 'January');
		assert.strictEqual(months[11].short, 'Dec');
		for (const month of months) {
			for (const variant of ['light', 'dark', 'hcLight', 'hcDark']) {
				const palette = month[variant];
				assert.ok(contrast(palette.onAccent, palette.accent) >= 4.5, `${palette.name}: button text`);
				assert.ok(contrast(palette.line, palette.bg) >= 3, `${palette.name}: focus border`);
				assert.ok(contrast(palette.text, palette.panel) >= 4.5, `${palette.name}: panel text`);
				assert.strictEqual(palette.tokens.variable, palette.text);
				assert.ok(Math.abs(palette.contrast.text - contrast(palette.text, palette.bg)) < 0.01);
				assert.ok(Math.abs(palette.contrast.accent - contrast(palette.accent, palette.bg)) < 0.01);
			}
		}
	});

	test('every website palette and preview surface is taken from its published VS Code theme', () => {
		const { months } = themeData(report);
		for (const month of months) {
			for (const [key, variant] of Object.entries(variantLabels)) {
				const palette = month[key];
				const theme = published(palette.name);
				const c = theme.colors;
				const actual = report.variants[variant].themes.find((entry) => entry.name === palette.name);
				const roles = {
					bg: 'editor.background', text: 'editor.foreground', accent: 'button.background',
					onAccent: 'button.foreground', link: 'textLink.foreground', panel: 'editorGroupHeader.tabsBackground',
					panelText: 'titleBar.activeForeground', line: 'focusBorder', rule: 'editorGroup.border', shadow: 'widget.shadow',
				};
				for (const [property, role] of Object.entries(roles)) assert.strictEqual(palette[property], c[role], `${palette.name}: ${role}`);
				const uiRoles = {
					titleBg: 'titleBar.activeBackground', titleText: 'titleBar.activeForeground',
					tabBg: 'editorGroupHeader.tabsBackground', tabText: 'tab.inactiveForeground',
					tabActiveBg: 'tab.activeBackground', tabActiveText: 'tab.activeForeground', tabBorder: 'tab.activeBorderTop',
					statusBg: 'statusBar.background', statusText: 'statusBar.foreground',
					lineNumber: 'editorLineNumber.foreground', editorBorder: 'editorGroup.border',
				};
				for (const [property, role] of Object.entries(uiRoles)) assert.strictEqual(palette.ui[property], c[role], `${palette.name}: ${role}`);
				assert.deepStrictEqual(palette.tokens, actual.colors.tokens, `${palette.name}: syntax colors`);
				assert.deepStrictEqual(palette.syntaxContrast, actual.syntaxContrast, `${palette.name}: graph measurements`);
				assert.deepStrictEqual(palette.semanticTokens, theme.semanticTokenColors);
				assert.strictEqual(palette.tokenStyles.comment, 'italic');
				assert.strictEqual(palette.tokenStyles.invalid, 'underline');
				for (const [foreground, background] of [['titleText', 'titleBg'], ['tabText', 'tabBg'], ['tabActiveText', 'tabActiveBg'], ['statusText', 'statusBg']]) {
					assert.ok(contrast(palette.ui[foreground], palette.ui[background]) >= 4.5, `${palette.name}: ${foreground}`);
				}
			}
		}
	});

	test('a stale audit cannot silently supply a different syntax color or contrast to the website', () => {
		const differentColor = JSON.parse(JSON.stringify(report));
		differentColor.variants.Light.themes[0].colors.tokens.keyword = '#000000';
		assert.throws(() => themeData(differentColor), /Stale audit syntax color/);
		const differentContrast = JSON.parse(JSON.stringify(report));
		differentContrast.variants.Light.themes[0].syntaxContrast.keyword = 1;
		assert.throws(() => themeData(differentContrast), /Stale audit syntax contrast/);
	});

	test('syntax resolution respects later TextMate rules and preserves their declared styles', () => {
		const result = syntaxTokens({ colors: { 'editor.foreground': '#123456' }, tokenColors: [
			{ scope: 'keyword, comment', settings: { foreground: '#abcdef', fontStyle: 'italic' } },
			{ scope: ['keyword'], settings: { foreground: '#654321', fontStyle: '' } },
		] });
		assert.strictEqual(result.tokens.keyword, '#654321');
		assert.strictEqual(result.tokens.comment, '#abcdef');
		assert.strictEqual(result.tokens.variable, '#123456');
		assert.strictEqual(result.styles.comment, 'italic');
		assert.strictEqual(result.styles.keyword, '');
	});

	test('comparison graphs retain the actual before/current matrices and missing HC Light baseline', () => {
		const { comparisons, thresholds } = themeData(report);
		assert.deepStrictEqual(thresholds, report.thresholds);
		for (const [key, label] of Object.entries(variantLabels)) {
			assert.deepStrictEqual(comparisons[key], { grids: report.variants[label].grids, variety: report.variants[label].variety });
			for (const period of ['before', 'current']) {
				const grids = comparisons[key].grids[period];
				if (key === 'hcLight' && period === 'before') { assert.strictEqual(grids, null); continue; }
				for (const metric of ['background', 'syntax']) {
					assert.strictEqual(grids[metric].length, 12);
					grids[metric].forEach((row, i) => {
						assert.strictEqual(row.length, 12);
						assert.strictEqual(row[i], 0);
						row.forEach((value, j) => { assert.ok(Number.isFinite(value) && value >= 0); assert.strictEqual(value, grids[metric][j][i]); });
					});
				}
			}
		}
	});

	test('every placeholder of the page has a value', () => {
		const template = fs.readFileSync(path.join(__dirname, '../../site/index.html'), 'utf8');
		assert.doesNotMatch(render(template, pageValues(report)), /\{\{/);
	});

	test('an unknown placeholder is an error', () => {
		assert.throws(() => render('{{NOPE}}', {}), /Unknown placeholder/);
	});

	test('the figures come from the audit report', () => {
		const values = pageValues(report);
		assert.strictEqual(values.THEMES, '48');
		assert.strictEqual(values.CHECKS_PASSED, report.checks.passed.toLocaleString('en-US'));
		assert.deepStrictEqual(JSON.parse(values.THEME_DATA), themeData(report));
	});

	test('build output cannot replace source directories or their parents', () => {
		const root = path.resolve(__dirname, '../..');
		for (const directory of [root, path.dirname(root), path.join(root, 'site'), path.join(root, 'site', 'dist'), path.join(root, 'themes')]) {
			assert.throws(() => validateOutput(directory), /must not overwrite/);
		}
		assert.strictEqual(validateOutput(path.join(root, 'site-dist')), path.join(root, 'site-dist'));
	});

	test('build includes the measured data, video and every local page asset', function () {
		this.timeout(15000);
		const output = fs.mkdtempSync(path.join(os.tmpdir(), '365-site-test-'));
		try {
			build(output);
			const page = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
			assert.doesNotMatch(page, /\{\{/);
			assert.doesNotMatch(page, /365-day-night-brand|tablette 820\.html/);
			assert.deepStrictEqual(JSON.parse(fs.readFileSync(path.join(output, 'audit-report.json'), 'utf8')), report);
			assert.ok(fs.statSync(path.join(output, 'media', 'demo-months.mp4')).size > 0);
			assert.ok(fs.statSync(path.join(output, 'media', 'demo-poster.jpg')).size > 0);
			for (const [, url] of page.matchAll(/(?:src|href)="([^"]+)"/g)) {
				if (/^(?:[a-z]+:|\/\/|#)/i.test(url)) continue;
				assert.ok(fs.existsSync(path.join(output, url.split(/[?#]/)[0])), `Missing page asset: ${url}`);
			}
		} finally {
			fs.rmSync(output, { recursive: true, force: true });
		}
	});
});

suite('Landing page vision scores', () => {
	const { SCORES, SIMULATED_VIEWS } = require('../../scripts/site/build.cjs');
	const data = themeData(report);

	test('every month and variant carries the 9 scores and the 4 simulations of the audit report', () => {
		for (const month of data.months) {
			for (const key of ['light', 'dark', 'hcLight', 'hcDark']) {
				const theme = month[key];
				assert.deepStrictEqual(Object.keys(theme.scores).sort(), [...SCORES].sort(), theme.name);
				for (const view of SIMULATED_VIEWS) {
					assert.ok(theme.simulated[view].background, `${theme.name} ${view}`);
					assert.strictEqual(Object.keys(theme.simulated[view].tokens).length, 14, `${theme.name} ${view}`);
				}
			}
		}
	});

	test('the page scores are the audit report scores', () => {
		const dark = data.months[9].dark;
		const measured = report.variants.Dark.themes.find((theme) => theme.name === dark.name);
		assert.deepStrictEqual(dark.scores, measured.scores);
	});

	test('the vision panel is on the page, with its module', () => {
		const html = fs.readFileSync(path.join(__dirname, '../../site/index.html'), 'utf8');
		assert.match(html, /id="vision-panel"/);
		assert.ok(fs.existsSync(path.join(__dirname, '../../site/vision.js')));
	});
});

suite('Landing page limits and references', () => {
	const { limitsHtml } = require('../../scripts/site/build.cjs');
	const audit = fs.readFileSync(path.join(__dirname, '../../docs/AUDIT.md'), 'utf8');

	test('the limits on the page come from the audit report', () => {
		const html = limitsHtml(audit);
		assert.match(html, /No testing with real users yet/);
		assert.strictEqual((html.match(/<li>/g) || []).length, (audit.split('## Limits of this audit')[1].match(/^- /gm) || []).length);
	});

	test('the limits are escaped and keep their links', () => {
		assert.strictEqual(limitsHtml('## Limits of this audit\n' + '- **A** <b> [x](https://e.com)\n'.repeat(5)).split('\n')[0],
			'      <li><strong>A</strong> &lt;b&gt; <a href="https://e.com">x</a></li>');
	});

	test('a report without limits stops the build', () => {
		assert.throws(() => limitsHtml('# Nothing'), /no limits section/);
	});

	test('every reference with a DOI links to doi.org', () => {
		const html = fs.readFileSync(path.join(__dirname, '../../site/index.html'), 'utf8');
		for (const doi of ['10.1109/TVCG.2009.113', '10.1002/col.20070', '10.1364/JOSAA.29.000313']) {
			assert.ok(html.includes(`https://doi.org/${doi}`), doi);
		}
	});
});

suite('Landing page security', () => {
	const htaccess = fs.readFileSync(path.join(__dirname, '../../site/.htaccess'), 'utf8');
	const { productionCsp } = require('../../scripts/site/check.cjs');

	test('the production CSP allows only scripts from the page itself', () => {
		const csp = productionCsp();
		assert.match(csp, /default-src 'none'/);
		assert.match(csp, /script-src 'self'(;|$)/);
		assert.doesNotMatch(csp, /unsafe-eval/);
		assert.doesNotMatch(csp.match(/script-src[^;]*/)[0], /unsafe-inline/);
		assert.match(csp, /frame-ancestors 'none'/);
	});

	test('the hosting forces HTTPS and sends the security headers', () => {
		for (const rule of ['Strict-Transport-Security', 'X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Options -Indexes', 'R=301']) {
			assert.ok(htaccess.includes(rule), rule);
		}
	});

	test('the page has no inline script', () => {
		const html = fs.readFileSync(path.join(__dirname, '../../site/index.html'), 'utf8');
		const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/json)[^>]*>/g)];
		assert.deepStrictEqual(inline.map((match) => match[0]), []);
	});

	test('the build publishes neither the internal README nor source maps', function () {
		this.timeout(20000);
		const out = fs.mkdtempSync(path.join(os.tmpdir(), 'site-sec-'));
		try {
			build(path.join(out, 'dist'));
			const files = fs.readdirSync(path.join(out, 'dist'), { recursive: true }).map(String);
			assert.ok(!files.includes('README.md'));
			assert.ok(files.includes('.htaccess'));
			assert.ok(!files.some((file) => file.endsWith('.map')));
		} finally {
			fs.rmSync(out, { recursive: true, force: true });
		}
	});
});

suite('Landing page social preview', () => {
	const SITE = 'https://365daynight.mickaellherminez.net/';

	test('the og:image of the page is an absolute address on the site', () => {
		const html = fs.readFileSync(path.join(__dirname, '../../site/index.html'), 'utf8');
		const image = html.match(/<meta property="og:image" content="([^"]+)">/);
		assert.ok(image, 'og:image is missing');
		assert.ok(image[1].startsWith(SITE), image[1]);
	});

	test('the build always publishes the og:image file it points to', function () {
		this.timeout(20000);
		const html = fs.readFileSync(path.join(__dirname, '../../site/index.html'), 'utf8');
		const file = html.match(/<meta property="og:image" content="([^"]+)">/)[1].slice(SITE.length);
		const out = fs.mkdtempSync(path.join(os.tmpdir(), 'site-og-'));
		try {
			build(path.join(out, 'dist'));
			assert.ok(fs.existsSync(path.join(out, 'dist', file)), `missing in the build: ${file}`);
		} finally {
			fs.rmSync(out, { recursive: true, force: true });
		}
	});
});

suite('Landing page header', () => {
	const html = fs.readFileSync(path.join(__dirname, '../../site/index.html'), 'utf8');
	const nav = html.match(/<nav aria-label="Main navigation">([\s\S]*?)<\/nav>/)[1];

	test('icon links keep their text, hidden visually on phones only', () => {
		const links = [...nav.matchAll(/<a class="nav-link"[^>]*>([\s\S]*?)<\/a>/g)].map((match) => match[1]);
		assert.strictEqual(links.length, 2);
		for (const link of links) {
			assert.match(link, /<svg[^>]*aria-hidden="true"/);
			assert.match(link, /<span class="nav-text">\S[^<]*<\/span>/);
		}
	});

	test('the theme chip names its action after the visible label', () => {
		const chip = nav.match(/<button class="theme-chip[\s\S]*?<\/button>/)[0];
		assert.match(chip, /data-chip-label[^>]*>[^<]+<\/span><span class="sr">, choose month and theme<\/span>/);
		assert.doesNotMatch(chip, /aria-label=/, 'an aria-label would hide the visible label from the accessible name');
	});
});
