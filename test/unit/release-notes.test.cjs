const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { version } = require('../../package.json');
const { releaseNotes } = require('../../scripts/release-notes.cjs');

const CHANGELOG = [
	'# Changelog',
	'',
	'## [Unreleased]',
	'',
	'## [1.2.0] - 2026-01-02 - Pre-release',
	'',
	'### Fixed',
	'- Second fix',
	'',
	'## [1.1.0] - 2026-01-01',
	'',
	'### Added',
	'- First feature',
	'',
].join('\n');

suite('Release notes', () => {
	test('returns only the section of the requested version', () => {
		assert.strictEqual(releaseNotes(CHANGELOG, '1.2.0'), '### Fixed\n- Second fix');
	});

	test('reads the last section up to the end of the file', () => {
		assert.strictEqual(releaseNotes(CHANGELOG, '1.1.0'), '### Added\n- First feature');
	});

	test('finds nothing for an unknown or empty version', () => {
		assert.strictEqual(releaseNotes(CHANGELOG, '9.9.9'), null);
		assert.strictEqual(releaseNotes(CHANGELOG, 'Unreleased'), null);
	});

	test('does not confuse a version with a longer one', () => {
		assert.strictEqual(releaseNotes('## [1.1.10]\n- Other\n', '1.1.1'), null);
	});

	test('the current version has notes in the CHANGELOG', () => {
		const changelog = fs.readFileSync(path.join(__dirname, '../../CHANGELOG.md'), 'utf8');
		assert.ok(releaseNotes(changelog, version), `no notes for ${version}`);
	});
});
