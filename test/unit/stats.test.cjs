const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { URL } = require('url');
const { HEADER, parseCsv, formatCsv, readMarketplace, readOpenVsx, pending, update, collect } = require('../../scripts/stats/collect.cjs');

const MARKETPLACE = { marketplace_install: 1016, marketplace_update: 820, marketplace_download: 1606 };
const OPENVSX = { openvsx_download: 10151 };
const BOTH = { marketplace: MARKETPLACE, openvsx: OPENVSX };
const NONE = { marketplace_install: null, marketplace_update: null, marketplace_download: null, openvsx_download: null };

/** Les réponses des deux API, sous la forme qu'elles ont réellement */
function marketplaceAnswer(install = 1016, update = 820, download = 1606) {
	const statistics = [['install', install], ['averagerating', 5], ['updateCount', update], ['downloadCount', download]]
		.map(([statisticName, value]) => ({ statisticName, value }));
	return { results: [{ extensions: [{ statistics }] }] };
}

function row(date, status = 'ok', values = { ...MARKETPLACE, ...OPENVSX }) {
	return { date, ...values, status };
}

suite('Download statistics', () => {
	suite('CSV file', () => {
		test('a written file reads back the same, with empty cells for missing values', () => {
			const rows = [row('2026-11-11'), row('2026-11-12', 'partial', { ...MARKETPLACE, openvsx_download: null })];
			const text = formatCsv(rows);
			assert.strictEqual(text.split('\n')[0], HEADER.join(','));
			assert.match(text, /^2026-11-12,1016,820,1606,,partial$/m);
			assert.deepStrictEqual(parseCsv(text), rows);
		});

		test('an empty file has no line', () => {
			assert.deepStrictEqual(parseCsv(''), []);
		});

		test('an unexpected file is refused instead of being overwritten', () => {
			assert.throws(() => parseCsv('date,downloads\n2026-11-11,3\n'), /unexpected header/);
			assert.throws(() => parseCsv(formatCsv([row('2026-11-12'), row('2026-11-11')])), /unsorted date/);
			assert.throws(() => parseCsv(formatCsv([row('2026-11-11', 'maybe')])), /unknown status/);
			assert.throws(() => parseCsv(`${HEADER.join(',')}\n2026-11-11,1,2,-3,4,ok\n`), /not a valid count/);
		});
	});

	suite('API answers', () => {
		test('reads the three Marketplace statistics as they are, without adding them up', () => {
			assert.deepStrictEqual(readMarketplace(marketplaceAnswer()), MARKETPLACE);
		});

		test('reads the Open VSX total', () => {
			assert.deepStrictEqual(readOpenVsx({ version: '1.0.1', downloadCount: 10151 }), OPENVSX);
		});

		test('refuses a missing, negative or non-integer value', () => {
			assert.throws(() => readMarketplace({ results: [] }), /no statistics/);
			assert.throws(() => readMarketplace(marketplaceAnswer(1016, null)), /updateCount/);
			assert.throws(() => readMarketplace(marketplaceAnswer(-1)), /install/);
			assert.throws(() => readOpenVsx({ downloadCount: 1.5 }), /downloadCount/);
			assert.throws(() => readOpenVsx({}), /downloadCount/);
		});
	});

	suite('Line of the day', () => {
		test('only the registries that are still missing are asked again', () => {
			assert.deepStrictEqual(pending(undefined), ['marketplace', 'openvsx']);
			assert.deepStrictEqual(pending(row('2026-11-11')), []);
			assert.deepStrictEqual(pending(row('2026-11-11', 'partial', { ...MARKETPLACE, openvsx_download: null })), ['openvsx']);
			assert.deepStrictEqual(pending(row('2026-11-11', 'carried:marketplace')), ['marketplace']);
			assert.deepStrictEqual(pending(row('2026-11-11', 'carried')), ['marketplace', 'openvsx']);
		});

		test('the first line is written when both registries answer', () => {
			const { rows, outcome } = update([], '2026-11-11', BOTH, false);
			assert.strictEqual(outcome, 'ok');
			assert.deepStrictEqual(rows, [row('2026-11-11')]);
		});

		test('totals equal to the previous day are recorded as a measured day', () => {
			const { rows, outcome } = update([row('2026-11-11')], '2026-11-12', BOTH, false);
			assert.strictEqual(outcome, 'ok');
			assert.deepStrictEqual(rows.at(-1), row('2026-11-12'));
		});

		test('before 18:00, a missing registry leaves a partial line with empty cells', () => {
			const { rows, outcome, missing } = update([row('2026-11-11')], '2026-11-12', { marketplace: MARKETPLACE }, false);
			assert.strictEqual(outcome, 'partial');
			assert.deepStrictEqual(missing, ['openvsx']);
			assert.deepStrictEqual(rows.at(-1), row('2026-11-12', 'partial', { ...MARKETPLACE, openvsx_download: null }));
		});

		test('a later run completes a partial line and keeps the values already read', () => {
			const partial = row('2026-11-12', 'partial', { ...MARKETPLACE, openvsx_download: null });
			const { rows, outcome } = update([row('2026-11-11'), partial], '2026-11-12', { openvsx: { openvsx_download: 10200 } }, false);
			assert.strictEqual(outcome, 'ok');
			assert.deepStrictEqual(rows.at(-1), row('2026-11-12', 'ok', { ...MARKETPLACE, openvsx_download: 10200 }));
		});

		test('from 18:00, a missing registry is copied from the previous day and named in the status', () => {
			const previous = row('2026-11-11', 'ok', { ...MARKETPLACE, openvsx_download: 9000 });
			const { rows, outcome } = update([previous], '2026-11-12', { marketplace: { ...MARKETPLACE, marketplace_install: 1020 } }, true);
			assert.strictEqual(outcome, 'carried');
			assert.deepStrictEqual(rows.at(-1), row('2026-11-12', 'carried:openvsx', { ...MARKETPLACE, marketplace_install: 1020, openvsx_download: 9000 }));
		});

		test('from 18:00, no answer at all copies every value', () => {
			const { rows, outcome } = update([row('2026-11-11')], '2026-11-12', {}, true);
			assert.strictEqual(outcome, 'carried');
			assert.deepStrictEqual(rows.at(-1), row('2026-11-12', 'carried'));
		});

		test('a manual run can still turn a copied line into a measured one', () => {
			const lines = [row('2026-11-11'), row('2026-11-12', 'carried:marketplace')];
			const marketplace = { ...MARKETPLACE, marketplace_install: 1030 };
			const { rows, outcome } = update(lines, '2026-11-12', { marketplace }, true);
			assert.strictEqual(outcome, 'ok');
			assert.deepStrictEqual(rows.at(-1), row('2026-11-12', 'ok', { ...marketplace, ...OPENVSX }));
		});

		test('without a previous day, nothing is written until the line is complete', () => {
			const { rows, outcome } = update([], '2026-11-11', { marketplace: MARKETPLACE }, true);
			assert.strictEqual(outcome, 'skipped');
			assert.deepStrictEqual(rows, []);
		});

		test('days without any run are copied, so the series has no gap', () => {
			const { rows } = update([row('2026-11-09')], '2026-11-12', BOTH, false);
			assert.deepStrictEqual(rows.map((line) => [line.date, line.status]),
				[['2026-11-09', 'ok'], ['2026-11-10', 'carried'], ['2026-11-11', 'carried'], ['2026-11-12', 'ok']]);
		});

		test('a past day left partial is finished with the values of the day before', () => {
			const lines = [row('2026-11-10'), row('2026-11-11', 'partial', { ...NONE, openvsx_download: 10300 })];
			const { rows } = update(lines, '2026-11-12', BOTH, false);
			assert.deepStrictEqual(rows[1], row('2026-11-11', 'carried:marketplace', { ...MARKETPLACE, openvsx_download: 10300 }));
		});

		test('the year boundary and leap days are counted', () => {
			assert.deepStrictEqual(update([row('2027-12-31')], '2028-01-01', BOTH, false).rows.length, 2);
			assert.deepStrictEqual(update([row('2028-02-28')], '2028-03-01', BOTH, false).rows.map((line) => line.date),
				['2028-02-28', '2028-02-29', '2028-03-01']);
		});

		test('a counter going down is kept and reported', () => {
			const { rows, decreases } = update([row('2026-11-11')], '2026-11-12', { ...BOTH, marketplace: { ...MARKETPLACE, marketplace_update: 819 } }, false);
			assert.strictEqual(rows.at(-1).marketplace_update, 819);
			assert.deepStrictEqual(decreases, ['marketplace_update went down from 820 to 819']);
		});
	});

	suite('Run', () => {
		let dir;
		setup(() => { dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stats-')); });
		teardown(() => { fs.rmSync(dir, { recursive: true, force: true }); });

		/** Un faux fetch : chaque plateforme répond, ou échoue avec une erreur HTTP */
		function fakeFetch({ marketplace = true, openvsx = true } = {}) {
			const calls = [];
			const fetch = async (url) => {
				calls.push(new URL(url).host);
				const up = url.includes('marketplace') ? marketplace : openvsx;
				const body = url.includes('marketplace') ? marketplaceAnswer() : { downloadCount: 10151 };
				return { ok: up, status: up ? 200 : 503, json: async () => body };
			};
			return { fetch, calls };
		}

		const csv = () => fs.readFileSync(path.join(dir, 'downloads.csv'), 'utf8');
		const at = (time) => new Date(`2026-11-12T${time}:00Z`);

		test('writes the line and the branch README, then makes no call once the line is complete', async () => {
			const logs = [];
			const first = fakeFetch();
			assert.strictEqual(await collect(dir, { fetch: first.fetch, now: at('00:17'), log: (line) => logs.push(line) }), 0);
			assert.match(csv(), /^2026-11-12,1016,820,1606,10151,ok$/m);
			assert.match(fs.readFileSync(path.join(dir, 'README.md'), 'utf8'), /^# Download statistics/);

			const second = fakeFetch();
			assert.strictEqual(await collect(dir, { fetch: second.fetch, now: at('06:17'), log: () => {} }), 0);
			assert.deepStrictEqual(second.calls, []);
		});

		test('an early failure only warns, and the 18:00 run copies the missing value then fails', async () => {
			fs.writeFileSync(path.join(dir, 'downloads.csv'), formatCsv([row('2026-11-11')]));
			const logs = [];
			const log = (line) => logs.push(line);
			assert.strictEqual(await collect(dir, { fetch: fakeFetch({ openvsx: false }).fetch, now: at('00:17'), log }), 0);
			assert.ok(logs.some((line) => line.startsWith('::warning::openvsx could not be read: HTTP 503')));
			assert.match(csv(), /^2026-11-12,1016,820,1606,,partial$/m);

			const retry = fakeFetch({ openvsx: false });
			assert.strictEqual(await collect(dir, { fetch: retry.fetch, now: at('18:17'), log }), 1);
			assert.deepStrictEqual(retry.calls, ['open-vsx.org']);
			assert.match(csv(), /^2026-11-12,1016,820,1606,10151,carried:openvsx$/m);
			assert.ok(logs.at(-1).startsWith('::error::openvsx could not be read on 2026-11-12'));
		});

		test('the very first run writes nothing when a registry fails, and fails only from 18:00', async () => {
			const failing = fakeFetch({ marketplace: false });
			assert.strictEqual(await collect(dir, { fetch: failing.fetch, now: at('00:17'), log: () => {} }), 0);
			assert.strictEqual(fs.existsSync(path.join(dir, 'downloads.csv')), false);
			assert.strictEqual(await collect(dir, { fetch: failing.fetch, now: at('18:17'), log: () => {} }), 1);
			assert.strictEqual(fs.existsSync(path.join(dir, 'downloads.csv')), false);
		});

		test('a network error is handled like an HTTP error', async () => {
			fs.writeFileSync(path.join(dir, 'downloads.csv'), formatCsv([row('2026-11-11')]));
			const fetch = async () => { throw new Error('getaddrinfo ENOTFOUND'); };
			assert.strictEqual(await collect(dir, { fetch, now: at('12:17'), log: () => {} }), 0);
			assert.deepStrictEqual(parseCsv(csv()).at(-1), row('2026-11-12', 'partial', NONE));
		});
	});
});
