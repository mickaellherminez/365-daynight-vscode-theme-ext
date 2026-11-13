'use strict';
/* global window, document -- code run inside the browser page */

// Contrôle la page construite dans site-dist/ avec un vrai navigateur, sous la CSP de production :
// accessibilité (axe-core), erreurs, ressources manquantes et débordement horizontal.
// Usage : node scripts/site/check.cjs [dossier construit]

const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');
const { chromium } = require('playwright-core');

const ROOT = path.join(__dirname, '..', '..');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
	'.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.txt': 'text/plain' };
const VIEWS = [[360, 'light'], [820, 'dark'], [1280, 'light'], [1280, 'dark']];
const VARIANTS = [null, 'hcDark', 'hcLight'];
// English gets every size and variant; each translation is checked on a phone and a desktop.
const TRANSLATION_VIEWS = [[360, 'light'], [1280, 'dark']];
const { LANGUAGES, languagePath, loadLocale } = require('./build.cjs');

/** La CSP de production, lue dans site/.htaccess pour ne pas la recopier */
function productionCsp() {
	const match = fs.readFileSync(path.join(ROOT, 'site', '.htaccess'), 'utf8').match(/Content-Security-Policy "([^"]+)"/);
	if (!match) throw new Error('No Content-Security-Policy in site/.htaccess');
	return match[1].replace(/;\s*upgrade-insecure-requests/, '');
}

function chromePath() {
	const candidates = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium-browser'];
	const found = candidates.find((candidate) => candidate && fs.existsSync(candidate));
	if (!found) throw new Error('Google Chrome not found: set CHROME_PATH');
	return found;
}

function serve(dir, csp) {
	const server = http.createServer((request, response) => {
		const file = path.join(dir, decodeURIComponent(new URL(request.url, 'http://x').pathname));
		const target = file.endsWith(path.sep) ? path.join(file, 'index.html') : file;
		if (!target.startsWith(dir) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
			response.writeHead(404).end();
			return;
		}
		response.writeHead(200, { 'Content-Type': TYPES[path.extname(target)] || 'application/octet-stream', 'Content-Security-Policy': csp });
		fs.createReadStream(target).pipe(response);
	});
	return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

/** Report the console errors, script errors and failed requests of a page. */
function watchErrors(page, where, problems) {
	page.on('console', (message) => { if (message.type() === 'error') problems.push(`${where}: console error: ${message.text()}`); });
	page.on('pageerror', (error) => problems.push(`${where}: script error: ${error.message}`));
	page.on('response', (response) => { if (response.status() >= 400) problems.push(`${where}: ${response.status()} ${response.url()}`); });
}

/** Language and direction of the page, and a header on one line. */
async function checkLanguage(page, code, where, problems) {
	const { dir } = loadLocale(code).meta;
	const html = await page.evaluate(() => [document.documentElement.lang, document.documentElement.dir]);
	if (html.join() !== [code, dir].join()) problems.push(`${where}: <html> has lang="${html[0]}" dir="${html[1]}"`);
	const header = await page.evaluate(() => document.querySelector('.site-header').getBoundingClientRect().height);
	if (header > 100) problems.push(`${where}: the header wraps (${Math.round(header)}px high)`);
}

/** The language menu opens, lists every language, fits the screen and closes with Escape. */
async function checkLanguageMenu(page, where, problems) {
	await page.click('.language-toggle');
	const listed = await page.$$eval('.language-list a', (links) => links.map((link) => link.hreflang));
	if (listed.join() !== LANGUAGES.join()) problems.push(`${where}: the language menu lists ${listed.join(', ')}`);
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
	if (overflow > 0) problems.push(`${where}: the open language menu is ${overflow}px wider than the screen`);
	await page.keyboard.press('Escape');
	if (await page.$eval('[data-language-menu]', (menu) => menu.open)) problems.push(`${where}: Escape does not close the language menu`);
}

/** axe-core in each theme variant to test (null: the variant shown first). */
async function checkAccessibility(page, axe, variants, where, problems) {
	for (const variant of variants) {
		if (variant) {
			await page.selectOption('#chart-variant', variant);
			await page.waitForTimeout(200);
		}
		await page.evaluate(axe);
		const violations = await page.evaluate(async () => (await window.axe.run(document, {
			runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
		})).violations.map((v) => `${v.id} (${v.nodes.length})`));
		violations.forEach((v) => problems.push(`${where} ${variant || 'default'}: axe ${v}`));
	}
}

/**
 * Color codes, ratios and ΔE values read left to right in every language: each one sits in a
 * <bdi dir="ltr">, also after a change of month, variant and measure.
 */
async function checkIsolation(page, where, problems) {
	await page.selectOption('#chart-month', '6');
	await page.selectOption('.matrix-select >> nth=0', 'syntax');
	const loose = await page.evaluate(() => {
		const isolated = (node) => node.closest('bdi[dir="ltr"]') && window.getComputedStyle(node.closest('bdi')).direction === 'ltr';
		const found = [];
		for (const node of document.querySelectorAll('.contrast-color code, .contrast-ratio, .matrix-legend-item > :last-child, #text-contrast, #accent-contrast')) {
			if (!isolated(node.firstElementChild || node)) found.push(node.textContent);
		}
		for (const node of document.querySelectorAll('#syntax-summary, .matrix-summary, .matrix-pair-result, .matrix-context, .score-formula, .variant-stat')) {
			const text = [...node.childNodes].filter((child) => child.nodeType === 3).map((child) => child.textContent).join(' ');
			const match = text.match(/#[0-9A-F]{6}|\d+(?:[.,]\d+)?:1|\d\s?ΔE|ΔE\s?\d/);
			if (match) found.push(match[0]);
		}
		return found;
	});
	loose.forEach((text) => problems.push(`${where}: "${text}" is not isolated left to right`));
}

/** No horizontal scrolling and no video that plays on its own. */
async function checkLayout(page, where, problems) {
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
	if (overflow > 0) problems.push(`${where}: page is ${overflow}px wider than the screen`);
	if (await page.evaluate(() => document.querySelector('video').autoplay)) problems.push(`${where}: the video plays on its own`);
}

/** One page of one language, at one size and color scheme. */
async function checkView(browser, axe, url, code, [width, scheme], problems) {
	const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: scheme });
	const page = await context.newPage();
	const where = `${code} ${width}px ${scheme}`;
	watchErrors(page, where, problems);
	await page.goto(url, { waitUntil: 'networkidle' });
	await checkLanguage(page, code, where, problems);
	await checkLanguageMenu(page, where, problems);
	await checkAccessibility(page, axe, code === 'en' ? VARIANTS : [null], where, problems);
	await checkLayout(page, where, problems);
	await checkIsolation(page, where, problems);
	await context.close();
}

async function check(dir) {
	const server = await serve(dir, productionCsp());
	const base = `http://127.0.0.1:${server.address().port}/`;
	const axe = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
	const browser = await chromium.launch({ executablePath: chromePath() });
	const problems = [];
	try {
		for (const code of LANGUAGES) {
			for (const view of code === 'en' ? VIEWS : TRANSLATION_VIEWS) {
				await checkView(browser, axe, base + languagePath(code), code, view, problems);
			}
		}
	} finally {
		await browser.close();
		server.close();
	}
	return problems;
}

if (require.main === module) {
	check(path.resolve(process.argv[2] || path.join(ROOT, 'site-dist'))).then((problems) => {
		problems.forEach((problem) => console.error(`::error::${problem}`));
		console.log(`Site check: ${problems.length} problem(s) in ${LANGUAGES.length} languages, at ${VIEWS.length} sizes and ${VARIANTS.length} variants in English`);
		process.exitCode = problems.length ? 1 : 0;
	}, (error) => {
		console.error(error);
		process.exitCode = 1;
	});
}

module.exports = { productionCsp };
