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

	suite('In automatic mode', () => {
		const NOVEMBER_NIGHT = new Date(2026, 10, 10, 22, 0);
		const NOVEMBER_DARK = getThemeLabel(ThemeType.DARK, NOVEMBER_NIGHT);
		const NOVEMBER_LIGHT = getThemeLabel(ThemeType.LIGHT, NOVEMBER_NIGHT);
		const autoSettings = { '365DayNight.enable': true };

		/**
		 * Rouvre l'extension avec la même mémoire : rechargement, nouvelle fenêtre ou redémarrage
		 * @param {Date} now
		 */
		const reopen = async (now) => {
			const { globalState } = fake;
			const theme = fake.theme();
			fake.dispose();
			load({ theme, settings: autoSettings, globalState, now });
			await fake.settle();
		};

		const startAtNight = async () => {
			load({ theme: 'Monokai', settings: autoSettings, now: NOVEMBER_NIGHT });
			await fake.settle();
			assert.strictEqual(fake.theme(), NOVEMBER_DARK);
		};

		test('a theme picked by hand survives a reload, a new window or a restart', async () => {
			await startAtNight();

			await fake.setTheme('Dracula');
			await reopen(NOVEMBER_NIGHT);

			assert.strictEqual(fake.theme(), 'Dracula');
			assert.deepStrictEqual(fake.writes, []);
		});

		test('a choice made with a command survives too', async () => {
			await startAtNight();

			await fake.run('extension.setLightTheme');
			assert.strictEqual(fake.theme(), NOVEMBER_LIGHT);
			await reopen(NOVEMBER_NIGHT);

			assert.strictEqual(fake.theme(), NOVEMBER_LIGHT);
		});

		test('a choice survives later checks of the same period', async () => {
			await startAtNight();

			await fake.setTheme('Dracula');
			fake.setNow(new Date(2026, 10, 10, 23, 30));
			await fake.runAutoCheck();

			assert.strictEqual(fake.theme(), 'Dracula');
		});

		test('switching resumes when the day starts', async () => {
			await startAtNight();
			await fake.setTheme('Dracula');

			fake.setNow(new Date(2026, 10, 11, 7, 0));
			await fake.runAutoCheck();

			assert.strictEqual(fake.theme(), NOVEMBER_LIGHT);
		});

		test('switching resumes at the next period, even if VS Code was closed meanwhile', async () => {
			await startAtNight();
			await fake.setTheme('Dracula');

			await reopen(new Date(2026, 10, 11, 12, 0));

			assert.strictEqual(fake.theme(), NOVEMBER_LIGHT);
		});

		test('switching resumes when the month changes', async () => {
			await startAtNight();
			await fake.setTheme('Dracula');

			const december = new Date(2026, 11, 1, 22, 0);
			fake.setNow(december);
			await fake.runAutoCheck();

			assert.strictEqual(fake.theme(), getThemeLabel(ThemeType.DARK, december));
		});

		test('the same month in a later year counts as a new period', async () => {
			await startAtNight();
			await fake.setTheme('Dracula');

			await reopen(new Date(2027, 10, 10, 22, 0));

			assert.strictEqual(fake.theme(), NOVEMBER_DARK);
		});

		test('a failed change is not remembered: another window tries again', async () => {
			load({ theme: 'Monokai', settings: autoSettings, now: NOVEMBER_NIGHT, failWrites: true });
			await fake.settle();
			assert.strictEqual(fake.theme(), 'Monokai');

			await reopen(NOVEMBER_NIGHT);

			assert.strictEqual(fake.theme(), NOVEMBER_DARK);
		});

		test('changing a 365DayNight setting applies the matching theme again', async () => {
			await startAtNight();
			await fake.setTheme('Dracula');

			await fake.setSetting('365DayNight.mode', 'day');

			assert.strictEqual(fake.theme(), NOVEMBER_LIGHT);
		});

		test('changing a 365DayNight setting applies the theme again even within the same period', async () => {
			await startAtNight();
			await fake.setTheme('Dracula');

			await fake.setSetting('365DayNight.mode', 'night');

			assert.strictEqual(fake.theme(), NOVEMBER_DARK);
		});

		test('turning automatic mode off forgets the period without writing at every check', async () => {
			await startAtNight();

			await fake.setSetting('365DayNight.enable', false);
			assert.strictEqual(fake.globalState.size, 0);

			const writes = fake.globalStateWrites;
			await fake.runAutoCheck();
			await fake.runAutoCheck();
			assert.strictEqual(fake.globalStateWrites, writes);
		});
	});

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
			load({ theme: 'Monokai', settings: { '365DayNight.mode': 'night' }, failWrites: true });
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

	suite('When VS Code follows the system color mode', () => {
		const following = { theme: LIGHT, settings: { 'window.autoDetectColorScheme': true } };

		test('a command does not write the setting nor announce a success', async () => {
			load(following);
			const text = fake.statusBarItem.text;

			await fake.run(TOGGLE);
			await fake.runTimeouts();

			assert.deepStrictEqual(fake.writes, []);
			assert.deepStrictEqual(fake.infoMessages, []);
			assert.strictEqual(fake.statusBarItem.text, text);
			assert.strictEqual(fake.errorMessages.length, 1);
			assert.ok(fake.errorMessages[0].includes('window.autoDetectColorScheme'));
		});

		test('the automatic mode stays silent, then applies the theme once the setting is off', async () => {
			load({ theme: 'Monokai', settings: { ...following.settings, '365DayNight.enable': true, '365DayNight.mode': 'night' } });
			await fake.settle();
			await fake.runAutoCheck();

			assert.deepStrictEqual(fake.writes, []);
			assert.deepStrictEqual(fake.errorMessages, []);

			await fake.setSetting('window.autoDetectColorScheme', false);
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), DARK);
		});
	});

	suite('When the system uses high contrast', () => {
		test('a change that VS Code does not activate is reported, not announced as a success', async () => {
			load({ theme: 'Monokai', systemHighContrast: true });

			await fake.run('extension.setLightTheme');
			await fake.runTimeouts();

			assert.deepStrictEqual(fake.infoMessages, []);
			assert.strictEqual(fake.errorMessages.length, 1);
			assert.ok(fake.errorMessages[0].includes('window.autoDetectHighContrast'));
			assert.strictEqual(fake.getThemeState().type, ThemeType.HIGH_CONTRAST);
		});

		test('nothing is reported once VS Code no longer follows it', async () => {
			load({ theme: LIGHT, systemHighContrast: true, settings: { 'window.autoDetectHighContrast': false } });

			await fake.run(TOGGLE);
			await fake.runTimeouts();

			assert.strictEqual(fake.theme(), DARK);
			assert.deepStrictEqual(fake.errorMessages, []);
			assert.strictEqual(fake.infoMessages.length, 1);
		});

		test('the message does not blame high contrast when the detection is off', async () => {
			load({ theme: LIGHT, holdThemeEvents: true, settings: { 'window.autoDetectHighContrast': false } });

			await fake.run(TOGGLE);
			fake.pendingThemeEvents.length = 0;
			await fake.runTimeouts();

			assert.strictEqual(fake.errorMessages.length, 1);
			assert.ok(!fake.errorMessages[0].includes('window.autoDetectHighContrast'));
		});

		test('a high contrast theme picked by hand is not mistaken for it', async () => {
			load({ theme: HIGH_CONTRAST });

			await fake.run(TOGGLE);
			await fake.runTimeouts();

			assert.strictEqual(fake.theme(), LIGHT);
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

			assert.deepStrictEqual(fake.infoMessages, []);

			fake.pendingThemeEvents.length = 0;
			await fake.runTimeouts();
			assert.strictEqual(fake.getThemeState().type, ThemeType.LIGHT);
			assert.deepStrictEqual(fake.infoMessages, []);
			assert.strictEqual(fake.errorMessages.length, 1);
		});

		test('the success message waits for VS Code to activate the theme', async () => {
			load({ theme: LIGHT, holdThemeEvents: true });

			await fake.run(TOGGLE);
			assert.deepStrictEqual(fake.infoMessages, []);

			fake.deliverThemeEvent();
			await fake.settle();
			assert.strictEqual(fake.infoMessages.length, 1);
		});

		test('fast clicks announce only the last theme', async () => {
			load({ theme: LIGHT, holdThemeEvents: true });

			fake.commands.get(TOGGLE)();
			fake.commands.get(TOGGLE)();
			await fake.settle();

			// Le délai d'attente du premier clic ne doit pas juger le thème du second
			assert.strictEqual(fake.timeouts.size, 1);

			fake.deliverThemeEvent();
			fake.deliverThemeEvent();
			await fake.settle();

			assert.deepStrictEqual(fake.infoMessages, [`Theme changed to ${HIGH_CONTRAST}`]);
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
