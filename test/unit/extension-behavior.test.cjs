const assert = require('assert');
const { loadExtension } = require('../helpers/fake-vscode.cjs');
const { ThemeType, getThemeLabel } = require('../../theme-logic');

const TOGGLE = 'extension.toggleTheme';
const LIGHT = getThemeLabel(ThemeType.LIGHT);
const DARK = getThemeLabel(ThemeType.DARK);
const HIGH_CONTRAST = getThemeLabel(ThemeType.HIGH_CONTRAST);
const MONTH = new Date().getMonth() + 1;

suite('Extension behavior', () => {
	/** @type {ReturnType<typeof loadExtension>} */
	let fake;

	const load = (options) => {
		fake = loadExtension(options);
		return fake;
	};

	teardown(() => fake.dispose());

	suite('When writing the setting fails', () => {
		test('the button and the state do not change', async () => {
			load({ theme: LIGHT });
			const text = fake.statusBarItem.text;
			fake.failWrites = true;

			await fake.run(TOGGLE);

			assert.strictEqual(fake.statusBarItem.text, text);
			assert.deepStrictEqual(fake.getThemeState(), { type: ThemeType.LIGHT, month: MONTH });
		});

		test('an error is shown instead of a success message', async () => {
			load({ theme: LIGHT });
			fake.failWrites = true;

			await fake.run(TOGGLE);

			assert.strictEqual(fake.errorMessages.length, 1);
			assert.ok(fake.errorMessages[0].includes('simulated write failure'));
			assert.deepStrictEqual(fake.infoMessages, []);
		});

		test('the next automatic check retries until it succeeds, then stops', async () => {
			load({ theme: 'Monokai', settings: { '365DayNight.mode': 'night' } });
			fake.failWrites = true;
			await enableAutoMode(fake);
			assert.notStrictEqual(fake.theme(), DARK);

			await fake.runAutoCheck();
			assert.notStrictEqual(fake.theme(), DARK);

			fake.failWrites = false;
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), DARK);

			const writes = fake.writes.length;
			await fake.runAutoCheck();
			assert.strictEqual(fake.writes.length, writes);
		});

		test('the automatic check reports the failure only once per period', async () => {
			load({ theme: 'Monokai', settings: { '365DayNight.mode': 'night' } });
			fake.failWrites = true;
			await enableAutoMode(fake);

			await fake.runAutoCheck();
			await fake.runAutoCheck();

			assert.strictEqual(fake.errorMessages.length, 1);
		});
	});

	suite('When a workspace setting masks the theme', () => {
		const masked = { theme: 'Monokai', workspaceSettings: { 'workbench.colorTheme': 'Monokai' } };

		test('a command does not write the setting nor announce a success', async () => {
			load(masked);
			const text = fake.statusBarItem.text;

			await fake.run(TOGGLE);

			assert.deepStrictEqual(fake.writes, []);
			assert.deepStrictEqual(fake.infoMessages, []);
			assert.strictEqual(fake.errorMessages.length, 1);
			assert.ok(fake.errorMessages[0].includes('workspace'));
			assert.strictEqual(fake.statusBarItem.text, text);
		});

		test('the automatic mode stays silent and applies the theme once the setting is removed', async () => {
			load({ ...masked, settings: { '365DayNight.mode': 'night' } });
			await enableAutoMode(fake);
			await fake.runAutoCheck();

			assert.deepStrictEqual(fake.writes, []);
			assert.deepStrictEqual(fake.errorMessages, []);

			fake.removeWorkspaceSetting('workbench.colorTheme');
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), DARK);
		});

		test('the same theme in the workspace does not count as masking', async () => {
			load({ theme: DARK, workspaceSettings: { 'workbench.colorTheme': DARK } });

			await fake.commands.get('extension.setDarkTheme')();
			await fake.settle();

			assert.deepStrictEqual(fake.errorMessages, []);
		});
	});

	suite('When changing the theme succeeds', () => {
		test('the button changes and a success message is shown', async () => {
			load({ theme: LIGHT });
			const text = fake.statusBarItem.text;

			await fake.run(TOGGLE);

			assert.strictEqual(fake.theme(), DARK);
			assert.notStrictEqual(fake.statusBarItem.text, text);
			assert.deepStrictEqual(fake.getThemeState(), { type: ThemeType.DARK, month: MONTH });
			assert.strictEqual(fake.infoMessages.length, 1);
		});

		test('fast clicks follow the cycle, even before VS Code activates each theme', async () => {
			load({ theme: LIGHT, holdThemeEvents: true });

			fake.commands.get(TOGGLE)();
			fake.commands.get(TOGGLE)();
			await fake.settle();
			assert.strictEqual(fake.theme(), HIGH_CONTRAST);

			// VS Code signale encore le thème précédent : le bouton ne doit pas revenir en arrière
			fake.deliverThemeEvent();
			assert.strictEqual(fake.getThemeState().type, ThemeType.HIGH_CONTRAST);

			await fake.run(TOGGLE);
			assert.strictEqual(fake.theme(), LIGHT);
		});

		test('the button shows the active theme if VS Code never activates the requested one', async () => {
			load({ theme: LIGHT, holdThemeEvents: true });

			await fake.run(TOGGLE);
			assert.strictEqual(fake.getThemeState().type, ThemeType.DARK);

			fake.pendingThemeEvents.length = 0;
			await fake.runTimeouts();
			assert.strictEqual(fake.getThemeState().type, ThemeType.LIGHT);
		});

		test('a theme picked elsewhere right after a click is taken into account', async () => {
			load({ theme: LIGHT, holdThemeEvents: true });
			await fake.run(TOGGLE);

			await fake.configurationUpdate('Default Light Modern');
			fake.pendingThemeEvents.length = 0;
			fake.pendingThemeEvents.push(1);
			fake.deliverThemeEvent();

			assert.deepStrictEqual(fake.getThemeState(), { type: ThemeType.LIGHT, month: undefined });
		});
	});
});

/**
 * Active le mode automatique, comme le ferait l'utilisateur dans ses réglages
 * @param {ReturnType<typeof loadExtension>} fake
 */
async function enableAutoMode(fake) {
	await fake.setSetting('365DayNight.enable', true);
}
