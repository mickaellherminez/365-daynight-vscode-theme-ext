const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { formatCsv } = require('../../scripts/stats/collect.cjs');
const { WIDTH, HEIGHT, SCALE, releases, isMeasured, points, yAxis, xTicks, spreadLabels, renderSvg, pngSize, renderPng, chromePath, chart } = require('../../scripts/stats/chart.cjs');

const VALUES = { marketplace_install: 1016, marketplace_update: 819, marketplace_download: 1595, openvsx_download: 10159 };

function row(date, status = 'ok', values = {}) {
	return { date, ...VALUES, ...values, status };
}

const CHANGELOG = `# Changelog

## [Unreleased]

## [1.0.4] - 2026-11-18

## [1.0.3] - 2026-11-17

## [0.13.2] - 2026-11-09 - Pre-release
`;

suite('Download chart', () => {
	suite('Data', () => {
		test('reads the releases of the CHANGELOG, oldest first, without Unreleased', () => {
			assert.deepStrictEqual(releases(CHANGELOG), [
				{ version: '0.13.2', date: '2026-11-09' },
				{ version: '1.0.3', date: '2026-11-17' },
				{ version: '1.0.4', date: '2026-11-18' },
			]);
		});

		test('a copied value is not a measured day, for its registry only', () => {
			assert.ok(isMeasured(row('2026-11-11'), 'marketplace', 'marketplace_install'));
			assert.ok(!isMeasured(row('2026-11-11', 'carried'), 'openvsx', 'openvsx_download'));
			assert.ok(!isMeasured(row('2026-11-11', 'carried:marketplace'), 'marketplace', 'marketplace_install'));
			assert.ok(isMeasured(row('2026-11-11', 'carried:marketplace'), 'openvsx', 'openvsx_download'));
			assert.ok(!isMeasured(row('2026-11-11', 'partial', { openvsx_download: null }), 'openvsx', 'openvsx_download'));
			assert.ok(isMeasured(row('2026-11-11', 'partial', { openvsx_download: null }), 'marketplace', 'marketplace_install'));
		});

		test('the points of a series skip the copied days and keep their position in time', () => {
			const rows = [row('2026-11-11'), row('2026-11-12', 'carried:openvsx'), row('2026-11-13', 'ok', { openvsx_download: 10400 })];
			assert.deepStrictEqual(points(rows, 'openvsx', 'openvsx_download'), [{ day: 0, value: 10159 }, { day: 2, value: 10400 }]);
			assert.strictEqual(points(rows, 'marketplace', 'marketplace_install').length, 3);
		});
	});

	suite('Axes', () => {
		test('the vertical axis has round ticks around the data', () => {
			assert.deepStrictEqual(yAxis([819, 1676]).ticks, [750, 1000, 1250, 1500, 1750]);
			assert.deepStrictEqual(yAxis([10159, 11303]).ticks, [10000, 10500, 11000, 11500]);
		});

		test('a flat series gets a visible range, never below zero', () => {
			const axis = yAxis([1016]);
			assert.ok(axis.low < 1016 && axis.high > 1016);
			assert.ok(yAxis([0]).low === 0);
		});

		test('dates are ticked by day while the series is short, then by month', () => {
			assert.deepStrictEqual(xTicks('2026-11-11', 7).map((tick) => tick.label), ['Nov 11', 'Nov 12', 'Nov 13', 'Nov 14', 'Nov 15', 'Nov 16', 'Nov 17', 'Nov 18']);
			assert.ok(xTicks('2026-11-11', 60).length <= 10);
			const months = xTicks('2026-11-11', 200).map((tick) => tick.label);
			assert.deepStrictEqual(months.slice(0, 3), ['Dec 2026', 'Jan 2027', 'Feb']);
			assert.ok(xTicks('2026-11-11', 1000).length <= 10);
		});

		test('end labels are spread apart and stay inside the panel', () => {
			const labels = spreadLabels([{ y: 100 }, { y: 104 }, { y: 200 }], 50, 200);
			assert.ok(labels[1].labelY - labels[0].labelY >= 16);
			assert.ok(labels.every((label) => label.labelY >= 50 && label.labelY <= 200));
		});
	});

	suite('Image', () => {
		const rows = [row('2026-11-11'), row('2026-11-12', 'carried'), row('2026-11-13', 'ok', { marketplace_install: 1024, openvsx_download: 11303 })];

		test('the SVG has a title, a description with the latest totals, both registries and the releases', () => {
			const svg = renderSvg(rows, releases('## [1.0.3] - 2026-11-12\n## [0.1.0] - 2025-01-01\n'));
			assert.match(svg, /^<svg [^>]*width="960" height="624"/);
			assert.match(svg, /<title>Installs and downloads of 365 Day &amp; Night<\/title>/);
			assert.match(svg, /<desc>[^<]*Visual Studio Marketplace: downloads 1,595, installs 1,024, updates 819\. Open VSX: downloads 11,303\./);
			assert.match(svg, />1\.0\.3</);
			assert.doesNotMatch(svg, />0\.1\.0</, 'a release before the first day is left out');
		});

		test('a copied day is crossed with a dashed line, not drawn as a point', () => {
			const svg = renderSvg(rows);
			assert.strictEqual((svg.match(/stroke-dasharray="3 4"/g) || []).length, 4, 'one dashed segment per series');
			assert.doesNotMatch(renderSvg([row('2026-11-11'), row('2026-11-12')]), /stroke-dasharray="3 4"/);
		});

		test('a single day is enough to draw a chart', () => {
			assert.match(renderSvg([row('2026-11-11')]), /<circle /);
		});

		test('reads the size of a PNG and refuses anything else', () => {
			const header = Buffer.alloc(24);
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(header);
			header.write('IHDR', 12, 'latin1');
			header.writeUInt32BE(1920, 16);
			header.writeUInt32BE(1248, 20);
			assert.deepStrictEqual(pngSize(header), { width: 1920, height: 1248 });
			assert.strictEqual(pngSize(Buffer.from('<svg/>')), null);
		});
	});

	suite('Files in the stats branch', () => {
		let dir;
		setup(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stats-chart-test-')); });
		teardown(() => fs.rmSync(dir, { recursive: true, force: true }));

		function fakeRender() {
			const calls = [];
			const render = (svg, target) => { calls.push(svg); fs.writeFileSync(target, 'png'); };
			return { calls, render };
		}

		test('draws nothing before the first line of data', () => {
			const { calls, render } = fakeRender();
			assert.strictEqual(chart(dir, CHANGELOG, { render, log: () => {} }), 'skipped');
			assert.strictEqual(calls.length, 0);
		});

		test('renders the PNG only when the SVG changes', () => {
			fs.writeFileSync(path.join(dir, 'downloads.csv'), formatCsv([row('2026-11-11')]));
			const { calls, render } = fakeRender();
			const options = { render, log: () => {} };
			assert.strictEqual(chart(dir, CHANGELOG, options), 'drawn');
			assert.ok(fs.existsSync(path.join(dir, 'downloads.svg')) && fs.existsSync(path.join(dir, 'downloads.png')));
			assert.strictEqual(chart(dir, CHANGELOG, options), 'unchanged');
			fs.writeFileSync(path.join(dir, 'downloads.csv'), formatCsv([row('2026-11-11'), row('2026-11-12')]));
			assert.strictEqual(chart(dir, CHANGELOG, options), 'drawn');
			assert.strictEqual(calls.length, 2);
		});

		test('a failed rendering writes no SVG, so the next run tries again', () => {
			fs.writeFileSync(path.join(dir, 'downloads.csv'), formatCsv([row('2026-11-11')]));
			const render = () => { throw new Error('no Chrome'); };
			assert.throws(() => chart(dir, CHANGELOG, { render, log: () => {} }), /no Chrome/);
			assert.ok(!fs.existsSync(path.join(dir, 'downloads.svg')));
		});

		test('Chrome renders a PNG at twice the size of the SVG', function () {
			let chrome;
			try { chrome = chromePath(); } catch { this.skip(); }
			this.timeout(60000);
			const target = path.join(dir, 'downloads.png');
			renderPng(renderSvg([row('2026-11-11'), row('2026-11-12', 'ok', { openvsx_download: 10257 })]), target, chrome);
			assert.deepStrictEqual(pngSize(fs.readFileSync(target)), { width: WIDTH * SCALE, height: HEIGHT * SCALE });
		});
	});
});
