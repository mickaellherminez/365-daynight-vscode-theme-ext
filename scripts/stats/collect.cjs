'use strict';

// Enregistre chaque jour les totaux d'installations et de téléchargements de l'extension, lus dans les API
// publiques du Visual Studio Marketplace et d'Open VSX, sans jeton.
// Usage : node scripts/stats/collect.cjs <dossier de la branche stats>
//
// Une ligne par jour UTC dans downloads.csv, avec les totaux bruts et un statut :
// - ok : les deux plateformes ont répondu, même si leurs totaux n'ont pas bougé ;
// - partial : une plateforme manque encore, un prochain lancement la retentera ;
// - carried, carried:marketplace, carried:openvsx : à partir de 18 h UTC, la valeur manquante est recopiée de la
//   veille pour que la série n'ait pas de trou, et le statut dit laquelle n'a pas été mesurée.
// Code de sortie : 0 si la ligne est complète ou si un prochain lancement peut encore la compléter, 1 si une valeur
// a dû être recopiée ou si rien n'a pu être écrit après 18 h.

const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const EXTENSION = 'mickaellherminez.365-daynight-vscode-theme-ext';
const FILE = 'downloads.csv';
const BRANCH_README = path.join(__dirname, 'branch-readme.md');
const FINAL_HOUR = 18; // dernier lancement de la journée (18:17 UTC)
const TIMEOUT = 30000;

const SOURCES = {
	marketplace: ['marketplace_install', 'marketplace_update', 'marketplace_download'],
	openvsx: ['openvsx_download'],
};
const COLUMNS = [...SOURCES.marketplace, ...SOURCES.openvsx];
const HEADER = ['date', ...COLUMNS, 'status'];
const ALL = Object.keys(SOURCES);

/** Un total doit être un entier positif ou nul */
function count(value, name) {
	if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${name} is not a valid count: ${JSON.stringify(value)}`);
	return value;
}

/** Lit downloads.csv ; refuse un fichier inattendu plutôt que de l'écraser */
function parseCsv(text) {
	const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
	if (lines.length === 0) return [];
	if (lines[0] !== HEADER.join(',')) throw new Error(`unexpected header in ${FILE}: ${lines[0]}`);
	let previous = '';
	return lines.slice(1).map((line, index) => {
		const cells = line.split(',');
		if (cells.length !== HEADER.length) throw new Error(`line ${index + 2} of ${FILE} has ${cells.length} cells`);
		const [date, ...rest] = cells;
		const status = rest.pop();
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date <= previous) throw new Error(`line ${index + 2} of ${FILE}: bad or unsorted date ${date}`);
		if (!/^(ok|partial|carried(:marketplace|:openvsx)?)$/.test(status)) throw new Error(`line ${index + 2} of ${FILE}: unknown status ${status}`);
		previous = date;
		const row = { date, status };
		COLUMNS.forEach((column, i) => { row[column] = rest[i] === '' ? null : count(Number(rest[i]), column); });
		return row;
	});
}

function formatCsv(rows) {
	const lines = rows.map((row) => [row.date, ...COLUMNS.map((column) => row[column] ?? ''), row.status].join(','));
	return [HEADER.join(','), ...lines].join('\n') + '\n';
}

/** Les trois statistiques du Marketplace ; downloadCount n'est pas la somme des deux autres, donc rien n'est recalculé */
function readMarketplace(json) {
	const statistics = json?.results?.[0]?.extensions?.[0]?.statistics;
	if (!Array.isArray(statistics)) throw new Error('the Marketplace answer has no statistics');
	const value = (name) => count(statistics.find((entry) => entry.statisticName === name)?.value, `Marketplace ${name}`);
	return {
		marketplace_install: value('install'),
		marketplace_update: value('updateCount'),
		marketplace_download: value('downloadCount'),
	};
}

function readOpenVsx(json) {
	return { openvsx_download: count(json?.downloadCount, 'Open VSX downloadCount') };
}

async function getJson(fetch, url, options = {}) {
	const response = await fetch(url, { ...options, signal: globalThis.AbortSignal.timeout(TIMEOUT) });
	if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).host}`);
	return response.json();
}

const FETCHERS = {
	marketplace: async (fetch) => readMarketplace(await getJson(fetch, 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', Accept: 'application/json;api-version=3.0-preview.1' },
		body: JSON.stringify({ filters: [{ criteria: [{ filterType: 7, value: EXTENSION }] }], flags: 256 }),
	})),
	openvsx: async (fetch) => readOpenVsx(await getJson(fetch, `https://open-vsx.org/api/${EXTENSION.replace('.', '/')}`)),
};

/** Les plateformes encore à mesurer pour une ligne : toutes sans ligne, aucune si elle est ok */
function pending(row) {
	if (!row) return ALL;
	if (row.status === 'ok') return [];
	if (row.status === 'partial') return ALL.filter((source) => SOURCES[source].some((column) => row[column] === null));
	return row.status === 'carried' ? ALL : [row.status.slice('carried:'.length)];
}

function carriedStatus(sources) {
	return sources.length === ALL.length ? 'carried' : `carried:${sources[0]}`;
}

/** Recopie de la ligne précédente les valeurs des plateformes non mesurées */
function carry(row, previous, sources) {
	for (const source of sources) for (const column of SOURCES[source]) row[column] = previous[column];
	row.status = carriedStatus(sources);
}

function addDays(date, days) {
	const next = new Date(`${date}T00:00:00Z`);
	next.setUTCDate(next.getUTCDate() + days);
	return next.toISOString().slice(0, 10);
}

/**
 * Calcule le nouveau contenu du fichier à partir des lignes existantes et des mesures du jour.
 * measured : les valeurs reçues, par plateforme ; final : vrai à partir de 18 h UTC.
 * Renvoie les lignes, le résultat (ok, partial, carried ou skipped) et les baisses de compteur constatées.
 */
function update(rows, today, measured, final) {
	const result = rows.filter((row) => row.date < today).map((row) => ({ ...row }));
	// Une journée passée restée partielle (lancement de 18 h manqué) est terminée avec les valeurs de la veille.
	result.forEach((row, index) => {
		if (row.status === 'partial' && index > 0) carry(row, result[index - 1], pending(row));
	});
	let previous = result.at(-1);
	// Des jours entiers sans lancement : recopiés eux aussi, pour qu'il n'y ait aucun trou.
	if (previous) {
		for (let date = addDays(previous.date, 1); date < today; date = addDays(date, 1)) {
			previous = { ...previous, date, status: 'carried' };
			result.push(previous);
		}
	}

	const existing = rows.find((row) => row.date === today);
	const row = existing ? { ...existing } : { date: today, status: 'partial', ...Object.fromEntries(COLUMNS.map((column) => [column, null])) };
	const before = pending(existing);
	for (const source of before) if (measured[source]) Object.assign(row, measured[source]);
	const missing = before.filter((source) => !measured[source]);

	const decreases = previous
		? before.filter((source) => measured[source]).flatMap((source) => SOURCES[source])
			.filter((column) => row[column] < previous[column])
			.map((column) => `${column} went down from ${previous[column]} to ${row[column]}`)
		: [];

	let outcome;
	if (missing.length === 0) {
		row.status = 'ok';
		outcome = 'ok';
	} else if (!previous) {
		// Sans veille, rien ne peut être recopié : la première ligne n'est écrite que complète.
		return { rows: result, outcome: 'skipped', missing, decreases };
	} else if (final) {
		carry(row, previous, missing);
		outcome = 'carried';
	} else if (row.status.startsWith('carried')) {
		row.status = carriedStatus(missing); // nouvel essai manuel d'une ligne déjà recopiée
		outcome = 'carried';
	} else {
		for (const source of missing) for (const column of SOURCES[source]) row[column] = null;
		row.status = 'partial';
		outcome = 'partial';
	}
	result.push(row);
	return { rows: result, outcome, missing, decreases };
}

async function collect(dir, { fetch = globalThis.fetch, now = new Date(), log = console.log } = {}) {
	const file = path.join(dir, FILE);
	const today = now.toISOString().slice(0, 10);
	const final = now.getUTCHours() >= FINAL_HOUR;
	const rows = fs.existsSync(file) ? parseCsv(fs.readFileSync(file, 'utf8')) : [];

	// Le README de la branche suit celui des sources.
	const readme = fs.readFileSync(BRANCH_README, 'utf8');
	const readmeFile = path.join(dir, 'README.md');
	if (!fs.existsSync(readmeFile) || fs.readFileSync(readmeFile, 'utf8') !== readme) fs.writeFileSync(readmeFile, readme);

	const todo = pending(rows.find((row) => row.date === today));
	if (todo.length === 0) {
		log(`The line of ${today} is already complete.`);
		return 0;
	}

	const measured = {};
	for (const source of todo) {
		try {
			measured[source] = await FETCHERS[source](fetch);
			log(`${source}: ${JSON.stringify(measured[source])}`);
		} catch (error) {
			log(`::warning::${source} could not be read: ${error.message}`);
		}
	}

	const { rows: next, outcome, missing, decreases } = update(rows, today, measured, final);
	for (const decrease of decreases) log(`::notice::${decrease}. The registry may have corrected its numbers.`);
	if (outcome !== 'skipped') fs.writeFileSync(file, formatCsv(next));

	const names = missing.join(' and ');
	switch (outcome) {
		case 'ok':
			log(`The line of ${today} is complete.`);
			return 0;
		case 'partial':
			log(`::warning::${names} still missing for ${today}; the next run will try again.`);
			return 0;
		case 'carried':
			log(`::error::${names} could not be read on ${today}; the values of the previous day were copied, with the status ${next.at(-1).status}.`);
			return 1;
		default:
			if (final) {
				log(`::error::${names} could not be read on ${today}, and there is no previous day to copy: nothing was written.`);
				return 1;
			}
			log(`::warning::${names} could not be read on ${today}; nothing was written, the next run will try again.`);
			return 0;
	}
}

module.exports = { HEADER, parseCsv, formatCsv, readMarketplace, readOpenVsx, pending, update, collect };

if (require.main === module) {
	const dir = process.argv[2];
	if (!dir) {
		console.error('Usage: node scripts/stats/collect.cjs <folder of the stats branch>');
		process.exit(2);
	}
	collect(path.resolve(dir)).then((code) => { process.exitCode = code; }, (error) => {
		console.error(`::error::${error.message}`);
		process.exitCode = 1;
	});
}
