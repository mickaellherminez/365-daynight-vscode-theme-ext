const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { contributes } = require('../../package.json');
const previous = require('../fixtures/public-api-0.12.0.json');

// Les utilisateurs de la 0.12.0 gardent leur réglage après la mise à jour : VS Code retient le thème choisi
// par son libellé, les raccourcis par l'identifiant de commande, et les réglages par leur nom.
suite('Compatibility with version 0.12.0', () => {
	test('the 36 original theme labels still exist, with the same variant', () => {
		assert.strictEqual(previous.themes.length, 36);
		for (const { label, uiTheme } of previous.themes) {
			const theme = contributes.themes.find((entry) => entry.label === label);
			assert.ok(theme, `missing theme: ${label}`);
			assert.strictEqual(theme.uiTheme, uiTheme, label);
			assert.ok(fs.existsSync(path.join(__dirname, '../..', theme.path)), `missing file: ${theme.path}`);
		}
	});

	test('the new themes are only the High Contrast Light themes', () => {
		const original = new Set(previous.themes.map((theme) => theme.label));
		const added = contributes.themes.filter((theme) => !original.has(theme.label));
		assert.strictEqual(added.length, 12);
		for (const theme of added) {
			assert.match(theme.label, /^365 \d{2}-[A-Z][a-z]+ High Contrast Light$/);
			assert.strictEqual(theme.uiTheme, 'hc-light');
		}
	});

	test('every public command of 0.12.0 still exists', () => {
		const commands = contributes.commands.map((entry) => entry.command);
		for (const command of previous.commands) {
			assert.ok(commands.includes(command), `missing command: ${command}`);
		}
	});

	test('every setting of 0.12.0 keeps its name, type, default and values', () => {
		const settings = contributes.configuration.properties;
		for (const [name, expected] of Object.entries(previous.settings)) {
			const setting = settings[name];
			assert.ok(setting, `missing setting: ${name}`);
			assert.strictEqual(setting.type, expected.type, name);
			assert.deepStrictEqual(setting.default, expected.default, name);
			for (const value of expected.enum || []) {
				assert.ok(setting.enum.includes(value), `${name}: missing value ${value}`);
			}
		}
	});
});
