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

	suite('Month controls', () => {
		const NEXT = 'extension.nextMonth';
		const PREVIOUS = 'extension.previousMonth';
		const CURRENT = 'extension.currentMonth';
		const NOVEMBER = new Date(2026, 10, 10, 12, 0);
		const MARCH_DARK = '365 03-March Dark';

		test('three adjacent items show the arrows, the month and the variant', () => {
			load({ theme: MARCH_DARK });

			const [previous, center, next] = [fake.itemFor(PREVIOUS), fake.statusBarItem, fake.itemFor(NEXT)];
			assert.ok(previous && center && next);
			assert.ok(previous.priority > center.priority && center.priority > next.priority);
			assert.strictEqual(new Set([previous.alignment, center.alignment, next.alignment]).size, 1);
			assert.ok(previous.visible && center.visible && next.visible);
			assert.strictEqual(center.text, '03 DRK');
			assert.strictEqual(previous.text, '$(chevron-left)');
			assert.strictEqual(next.text, '$(chevron-right)');
		});

		test('no VS Code item can slip between the three items', () => {
			load({ theme: MARCH_DARK });

			// VS Code place ses propres éléments de 100,1 à 100,5 : les nôtres doivent rester du même côté
			for (const item of [fake.itemFor(PREVIOUS), fake.statusBarItem, fake.itemFor(NEXT)]) {
				assert.ok(item.priority > 99 && item.priority < 100, `${item.id}: ${item.priority}`);
			}
			assert.ok(fake.itemFor(PREVIOUS).priority - fake.itemFor(NEXT).priority < 0.1);
		});

		test('the month always has two digits and the round icon is gone', () => {
			load({ theme: '365 12-December High Contrast' });
			assert.strictEqual(fake.statusBarItem.text, '12 HCT');
			fake.dispose();

			load({ theme: '365 01-January Light' });
			assert.strictEqual(fake.statusBarItem.text, '01 LGT');
		});

		test('the arrows change the month and keep the variant', async () => {
			load({ theme: MARCH_DARK });

			await fake.run(NEXT);
			assert.strictEqual(fake.theme(), '365 04-April Dark');
			assert.strictEqual(fake.statusBarItem.text, '04 DRK');

			await fake.run(PREVIOUS);
			await fake.run(PREVIOUS);
			assert.strictEqual(fake.theme(), '365 02-February Dark');

			fake.dispose();
			load({ theme: '365 05-May High Contrast' });
			await fake.run(NEXT);
			assert.strictEqual(fake.theme(), '365 06-June High Contrast');
		});

		test('December is followed by January, and January by December backwards', async () => {
			load({ theme: '365 12-December Light' });
			await fake.run(NEXT);
			assert.strictEqual(fake.theme(), '365 01-January Light');

			await fake.run(PREVIOUS);
			assert.strictEqual(fake.theme(), '365 12-December Light');
		});

		test('the center item and the commands keep the displayed month', async () => {
			load({ theme: MARCH_DARK });

			await fake.run(TOGGLE);
			assert.strictEqual(fake.theme(), '365 03-March Light');

			await fake.run('extension.setHighContrastTheme');
			assert.strictEqual(fake.theme(), '365 03-March High Contrast');

			await fake.run('extension.setDarkTheme');
			assert.strictEqual(fake.theme(), MARCH_DARK);
		});

		test('going back to the current month keeps the variant', async () => {
			load({ theme: MARCH_DARK, now: NOVEMBER });

			await fake.run(CURRENT);

			assert.strictEqual(fake.theme(), '365 11-November Dark');
			assert.strictEqual(fake.statusBarItem.text, '11 DRK');
		});

		test('fast clicks on an arrow are grouped into one change', async () => {
			load({ theme: MARCH_DARK });

			fake.commands.get(NEXT)();
			fake.commands.get(NEXT)();
			fake.commands.get(NEXT)();
			await fake.settle();

			assert.deepStrictEqual(fake.writes, ['365 06-June Dark']);
			assert.strictEqual(fake.statusBarItem.text, '06 DRK');
		});

		test('opposite fast clicks cancel each other', async () => {
			load({ theme: MARCH_DARK });

			fake.commands.get(NEXT)();
			fake.commands.get(PREVIOUS)();
			await fake.settle();

			assert.deepStrictEqual(fake.writes, []);
			assert.strictEqual(fake.theme(), MARCH_DARK);
		});

		test('a failed change keeps the displayed month and shows an error', async () => {
			load({ theme: MARCH_DARK, failWrites: true });

			await fake.run(NEXT);

			assert.strictEqual(fake.statusBarItem.text, '03 DRK');
			assert.strictEqual(fake.errorMessages.length, 1);
		});

		test('a dark theme picked after a 365 dark theme hides the arrows and the number', async () => {
			load({ theme: MARCH_DARK, now: NOVEMBER });
			assert.strictEqual(fake.statusBarItem.text, '03 DRK');

			await fake.setTheme('Monokai');

			assert.strictEqual(fake.statusBarItem.text, 'DRK');
			assert.strictEqual(fake.itemFor(PREVIOUS).visible, false);
			assert.strictEqual(fake.itemFor(NEXT).visible, false);
			assert.deepStrictEqual(fake.getThemeState(), { type: ThemeType.DARK, month: undefined });
		});

		test('a 365 theme picked in the theme picker updates the month', async () => {
			load({ theme: MARCH_DARK, now: NOVEMBER });

			await fake.setTheme('365 07-July Dark');

			assert.strictEqual(fake.statusBarItem.text, '07 DRK');
		});

		test('another theme hides the arrows and the month number', async () => {
			load({ theme: 'Monokai', now: NOVEMBER });

			assert.strictEqual(fake.itemFor(PREVIOUS).visible, false);
			assert.strictEqual(fake.itemFor(NEXT).visible, false);
			assert.strictEqual(fake.statusBarItem.visible, true);
			assert.strictEqual(fake.statusBarItem.text, 'DRK');

			await fake.run(TOGGLE);
			assert.strictEqual(fake.theme(), '365 11-November Dark');
			assert.strictEqual(fake.itemFor(NEXT).visible, true);
			assert.strictEqual(fake.statusBarItem.text, '11 DRK');

			await fake.setTheme('Dracula');
			assert.strictEqual(fake.itemFor(NEXT).visible, false);
		});

		test('from another theme, the month commands start from the current month', async () => {
			load({ theme: 'Monokai', now: NOVEMBER });

			await fake.run(NEXT);

			assert.strictEqual(fake.theme(), '365 12-December Dark');
		});
	});

	suite('Tooltip and screen reader labels', () => {
		const NOVEMBER = new Date(2026, 10, 10, 12, 0);
		const NEXT = 'extension.nextMonth';
		const PREVIOUS = 'extension.previousMonth';
		const CURRENT_LINK = '(command:extension.currentMonth)';
		const HIGH_CONTRAST_LINK = '(command:extension.setHighContrastTheme)';

		test('the tooltip shows the full theme name and what a click does', () => {
			load({ theme: '365 10-October Dark', now: NOVEMBER });

			const tooltip = fake.statusBarItem.tooltip.value;
			assert.ok(tooltip.includes('October Dark'));
			assert.ok(tooltip.includes('Click to switch to Light'));
		});

		test('the tooltip offers the current month only when another month is displayed', async () => {
			load({ theme: '365 10-October Dark', now: NOVEMBER });
			assert.ok(fake.statusBarItem.tooltip.value.includes(CURRENT_LINK));

			await fake.run('extension.currentMonth');
			assert.ok(!fake.statusBarItem.tooltip.value.includes(CURRENT_LINK));
		});

		test('the tooltip offers High Contrast, except when it is already active', async () => {
			load({ theme: '365 11-November Dark', now: NOVEMBER });
			assert.ok(fake.statusBarItem.tooltip.value.includes(HIGH_CONTRAST_LINK));

			await fake.run('extension.setHighContrastTheme');
			assert.ok(fake.statusBarItem.tooltip.value.includes('November High Contrast'));
			assert.ok(!fake.statusBarItem.tooltip.value.includes(HIGH_CONTRAST_LINK));
		});

		test('the tooltip links only run the expected commands', () => {
			load({ theme: '365 10-October Dark', now: NOVEMBER });

			const { value, isTrusted } = fake.statusBarItem.tooltip;
			const linked = [...value.matchAll(/\(command:([^)]+)\)/g)].map((match) => match[1]);
			assert.deepStrictEqual(linked, ['extension.currentMonth', 'extension.setHighContrastTheme']);
			assert.deepStrictEqual(isTrusted, { enabledCommands: ['extension.currentMonth', 'extension.setHighContrastTheme'] });
		});

		test('the tooltip follows the High Contrast setting', async () => {
			load({ theme: '365 11-November Dark', now: NOVEMBER });
			assert.ok(fake.statusBarItem.tooltip.value.includes('Click to switch to Light'));

			await fake.setSetting('365DayNight.toggleIncludesHighContrast', true);
			assert.ok(fake.statusBarItem.tooltip.value.includes('Click to switch to High Contrast'));
		});

		test('the current month link appears when the real month changes', async () => {
			load({ theme: '365 11-November Dark', now: NOVEMBER });
			assert.ok(!fake.statusBarItem.tooltip.value.includes(CURRENT_LINK));

			fake.setNow(new Date(2026, 11, 1, 9, 0));
			await fake.runAutoCheck();

			assert.ok(fake.statusBarItem.tooltip.value.includes(CURRENT_LINK));
		});

		test('with another theme, the tooltip explains the first click', () => {
			load({ theme: 'Monokai', now: NOVEMBER });

			const tooltip = fake.statusBarItem.tooltip.value;
			assert.ok(tooltip.includes('Click to apply the 365 Dark theme'));
			assert.ok(!tooltip.includes(CURRENT_LINK));
			assert.ok(tooltip.includes(HIGH_CONTRAST_LINK));
		});

		test('screen readers get a label and a role on the three items', async () => {
			load({ theme: '365 12-December Light', now: NOVEMBER });

			assert.deepStrictEqual(fake.itemFor(PREVIOUS).accessibilityInformation, { label: 'Previous month: November', role: 'button' });
			assert.deepStrictEqual(fake.itemFor(NEXT).accessibilityInformation, { label: 'Next month: January', role: 'button' });
			assert.deepStrictEqual(fake.statusBarItem.accessibilityInformation, { label: 'December Light. Click to switch to Dark.', role: 'button' });

			await fake.run(NEXT);
			assert.deepStrictEqual(fake.itemFor(NEXT).accessibilityInformation, { label: 'Next month: February', role: 'button' });
			assert.strictEqual(fake.statusBarItem.accessibilityInformation.label, 'January Light. Click to switch to Dark.');
		});

		test('the arrows name the month they lead to in their tooltip', () => {
			load({ theme: '365 03-March Dark', now: NOVEMBER });

			assert.strictEqual(fake.itemFor(PREVIOUS).tooltip, 'Previous month: February');
			assert.strictEqual(fake.itemFor(NEXT).tooltip, 'Next month: April');
		});

		test('the visible text stays short', () => {
			load({ theme: '365 03-March Dark', now: NOVEMBER });

			assert.strictEqual(fake.statusBarItem.text, '03 DRK');
		});
	});

	suite('Selected month in automatic mode', () => {
		const autoSettings = { '365DayNight.enable': true };
		const OCTOBER_NOON = new Date(2026, 9, 10, 12, 0);
		const OCTOBER_NIGHT = new Date(2026, 9, 10, 22, 0);

		/** Rouvre l'extension avec la même mémoire : rechargement, nouvelle fenêtre ou redémarrage */
		const reopen = async (now, settings = autoSettings) => {
			const { globalState } = fake;
			const theme = fake.theme();
			fake.dispose();
			load({ theme, settings, globalState, now });
			await fake.settle();
		};

		const startInOctober = async (now = OCTOBER_NOON) => {
			load({ theme: 'Monokai', settings: autoSettings, now });
			await fake.settle();
		};

		test('day and night keep alternating on the month selected with the arrows', async () => {
			await startInOctober();
			assert.strictEqual(fake.theme(), '365 10-October Light');

			await fake.run('extension.previousMonth');
			assert.strictEqual(fake.theme(), '365 09-September Light');

			fake.setNow(OCTOBER_NIGHT);
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), '365 09-September Dark');

			fake.setNow(new Date(2026, 9, 11, 9, 0));
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), '365 09-September Light');
		});

		test('a month picked in the theme picker counts as selected too', async () => {
			await startInOctober();

			await fake.setTheme('365 03-March Light');
			fake.setNow(OCTOBER_NIGHT);
			await fake.runAutoCheck();

			assert.strictEqual(fake.theme(), '365 03-March Dark');
		});

		test('March selected on October 10 lasts until November 1, even after a restart', async () => {
			await startInOctober();
			await fake.setTheme('365 03-March Light');

			await reopen(new Date(2026, 9, 20, 22, 0));
			assert.strictEqual(fake.theme(), '365 03-March Dark');
			assert.strictEqual(fake.statusBarItem.text, '03 DRK');

			await reopen(new Date(2026, 9, 31, 12, 0));
			assert.strictEqual(fake.theme(), '365 03-March Light');

			fake.setNow(new Date(2026, 9, 31, 23, 59));
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), '365 03-March Dark');

			fake.setNow(new Date(2026, 10, 1, 0, 0));
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), '365 11-November Dark');
			assert.strictEqual(fake.statusBarItem.text, '11 DRK');
		});

		test('the selection ends even if VS Code stayed closed on November 1', async () => {
			await startInOctober();
			await fake.setTheme('365 03-March Light');

			await reopen(new Date(2026, 10, 5, 12, 0));

			assert.strictEqual(fake.theme(), '365 11-November Light');
		});

		test('a restart after the selection ended does not select the old month again', async () => {
			await startInOctober();
			await fake.setTheme('365 03-March Light');
			const { globalState } = fake;
			fake.dispose();

			// VS Code rouvre sur l'ancien thème en novembre, mode automatique désactivé
			load({ theme: '365 03-March Light', settings: {}, globalState, now: new Date(2026, 10, 5, 12, 0) });
			await fake.setSetting('365DayNight.enable', true);

			assert.strictEqual(fake.theme(), '365 11-November Light');
		});

		test('the same month a year later does not extend the selection', async () => {
			await startInOctober();
			await fake.setTheme('365 03-March Light');

			await reopen(new Date(2027, 9, 10, 12, 0));

			assert.strictEqual(fake.theme(), '365 10-October Light');
		});

		test('going back to the current month ends the selection', async () => {
			await startInOctober();
			await fake.setTheme('365 03-March Light');

			await fake.run('extension.currentMonth');
			assert.strictEqual(fake.theme(), '365 10-October Light');

			fake.setNow(OCTOBER_NIGHT);
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), '365 10-October Dark');
		});

		test('reaching the current month with the arrows ends the selection', async () => {
			await startInOctober();
			await fake.run('extension.previousMonth');
			await fake.run('extension.nextMonth');

			fake.setNow(OCTOBER_NIGHT);
			await fake.runAutoCheck();

			assert.strictEqual(fake.theme(), '365 10-October Dark');
		});

		test('High Contrast keeps the selected month and stays High Contrast', async () => {
			await startInOctober(OCTOBER_NIGHT);
			await fake.setTheme('365 03-March High Contrast');

			fake.setNow(new Date(2026, 9, 11, 9, 0));
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), '365 03-March High Contrast');

			fake.setNow(new Date(2026, 10, 1, 9, 0));
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), '365 11-November High Contrast');
		});

		test('a theme from another publisher does not cancel the selection', async () => {
			await startInOctober();
			await fake.setTheme('365 03-March Light');
			await fake.setTheme('Dracula');

			fake.setNow(OCTOBER_NIGHT);
			await fake.runAutoCheck();

			assert.strictEqual(fake.theme(), '365 03-March Dark');
		});

		test('a month selected before turning automatic mode on is kept', async () => {
			load({ theme: '365 10-October Light', settings: {}, now: OCTOBER_NOON });
			await fake.run('extension.previousMonth');

			await fake.setSetting('365DayNight.enable', true);

			assert.strictEqual(fake.theme(), '365 09-September Light');
		});

		test('changing variant writes nothing when the month does not change', async () => {
			load({ theme: '365 03-March Light', settings: {}, now: OCTOBER_NOON });
			await fake.run('extension.setDarkTheme');
			const writes = fake.globalStateWrites;
			assert.strictEqual(writes, 1);

			await fake.run(TOGGLE);
			await fake.run(TOGGLE);
			assert.strictEqual(fake.globalStateWrites, writes);

			fake.dispose();
			load({ theme: '365 10-October Light', settings: {}, now: OCTOBER_NOON });
			await fake.run(TOGGLE);
			assert.strictEqual(fake.globalStateWrites, 0);
		});

		test('checks do not write the selection again and again', async () => {
			await startInOctober();
			await fake.setTheme('365 03-March Light');

			const writes = fake.globalStateWrites;
			await fake.runAutoCheck();
			await fake.runAutoCheck();

			assert.strictEqual(fake.globalStateWrites, writes);
		});
	});

	suite('When clicking the button', () => {
		const withHighContrast = { '365DayNight.toggleIncludesHighContrast': true };

		test('Dark goes back to Light in one click', async () => {
			load({ theme: DARK });

			await fake.run(TOGGLE);

			assert.strictEqual(fake.theme(), LIGHT);
		});

		test('High Contrast stays out of the cycle by default', async () => {
			load({ theme: LIGHT });

			await fake.run(TOGGLE);
			assert.strictEqual(fake.theme(), DARK);
			await fake.run(TOGGLE);
			assert.strictEqual(fake.theme(), LIGHT);
		});

		test('the setting adds High Contrast to the cycle', async () => {
			load({ theme: LIGHT, settings: withHighContrast });

			await fake.run(TOGGLE);
			assert.strictEqual(fake.theme(), DARK);
			await fake.run(TOGGLE);
			assert.strictEqual(fake.theme(), HIGH_CONTRAST);
			await fake.run(TOGGLE);
			assert.strictEqual(fake.theme(), LIGHT);
		});

		test('the setting is taken into account without a reload', async () => {
			load({ theme: DARK });

			await fake.setSetting('365DayNight.toggleIncludesHighContrast', true);
			await fake.run(TOGGLE);

			assert.strictEqual(fake.theme(), HIGH_CONTRAST);
		});

		test('the High Contrast command still works', async () => {
			load({ theme: LIGHT });

			await fake.run('extension.setHighContrastTheme');

			assert.strictEqual(fake.theme(), HIGH_CONTRAST);
		});
	});

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

		test('changing the button setting does not replace a theme picked by hand', async () => {
			await startAtNight();
			await fake.setTheme('Dracula');

			await fake.setSetting('365DayNight.toggleIncludesHighContrast', true);

			assert.strictEqual(fake.theme(), 'Dracula');
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
		test('the button changes without any notification', async () => {
			load({ theme: LIGHT });
			const text = fake.statusBarItem.text;

			await fake.run(TOGGLE);
			await fake.runTimeouts();

			assert.strictEqual(fake.theme(), DARK);
			assert.notStrictEqual(fake.statusBarItem.text, text);
			assert.deepStrictEqual(fake.getThemeState(), { type: ThemeType.DARK, month: MONTH });
			assert.deepStrictEqual(fake.infoMessages, []);
			assert.deepStrictEqual(fake.errorMessages, []);
		});

		test('fast clicks follow the cycle, even before VS Code activates each theme', async () => {
			load({ theme: LIGHT, holdThemeEvents: true, settings: { '365DayNight.toggleIncludesHighContrast': true } });

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
			assert.deepStrictEqual(fake.infoMessages, []);
			assert.strictEqual(fake.errorMessages.length, 1);
		});

		test('a theme that VS Code activates a little later reports nothing', async () => {
			load({ theme: LIGHT, holdThemeEvents: true });

			await fake.run(TOGGLE);
			fake.deliverThemeEvent();
			await fake.settle();
			await fake.runTimeouts();

			assert.deepStrictEqual(fake.infoMessages, []);
			assert.deepStrictEqual(fake.errorMessages, []);
		});

		test('fast clicks report nothing once the last theme is active', async () => {
			load({ theme: LIGHT, holdThemeEvents: true, settings: { '365DayNight.toggleIncludesHighContrast': true } });

			fake.commands.get(TOGGLE)();
			fake.commands.get(TOGGLE)();
			await fake.settle();

			// Le délai d'attente du premier clic ne doit pas juger le thème du second
			assert.strictEqual(fake.timeouts.size, 1);

			fake.deliverThemeEvent();
			fake.deliverThemeEvent();
			await fake.settle();
			await fake.runTimeouts();

			assert.deepStrictEqual(fake.infoMessages, []);
			assert.deepStrictEqual(fake.errorMessages, []);
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
