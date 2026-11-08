'use strict';

// Extrait du CHANGELOG les notes d'une version, pour la release GitHub.
// Usage : node scripts/release-notes.cjs <version>

const fs = require('fs');
const path = require('path');

/**
 * @param {string} changelog Contenu du CHANGELOG
 * @param {string} version Par exemple 0.13.1
 * @returns {string | null} Les notes de cette version, ou null si la section manque ou est vide
 */
function releaseNotes(changelog, version) {
	const lines = changelog.split(/\r?\n/);
	const start = lines.findIndex((line) => line.startsWith(`## [${version}]`));
	if (start === -1) {
		return null;
	}
	const rest = lines.slice(start + 1);
	const end = rest.findIndex((line) => line.startsWith('## '));
	const notes = (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
	return notes || null;
}

if (require.main === module) {
	const version = process.argv[2];
	if (!version) {
		console.error('Usage: node scripts/release-notes.cjs <version>');
		process.exit(2);
	}
	const notes = releaseNotes(fs.readFileSync(path.join(__dirname, '..', 'CHANGELOG.md'), 'utf8'), version);
	if (!notes) {
		console.error(`::error::CHANGELOG.md has no notes for version ${version}`);
		process.exit(1);
	}
	console.log(notes);
}

module.exports = { releaseNotes };
