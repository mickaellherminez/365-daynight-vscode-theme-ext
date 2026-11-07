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

		test('the arrows of a High Contrast theme picked by hand show the new month at once', async () => {
			load({ theme: '365 05-May High Contrast', holdThemeEvents: true });

			await fake.run(NEXT);

			assert.strictEqual(fake.statusBarItem.text, '06 HCT');
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
			// Aussi dans le journal, qui reste après la notification
			assert.deepStrictEqual(fake.loggedErrors, [`365DayNight: ${fake.errorMessages[0]}`]);
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

	suite('Button color', () => {
		const COLOR = '365DayNight.statusBarButton';
		const items = () => [fake.itemFor('extension.previousMonth'), fake.statusBarItem, fake.itemFor('extension.nextMonth')];

		test('the three items share the same theme color', () => {
			load({ theme: '365 03-March Dark' });

			assert.deepStrictEqual(items().map((item) => item.color.id), [COLOR, COLOR, COLOR]);
		});

		test('the normal color comes back while debugging, then the theme color returns', () => {
			load({ theme: '365 03-March Dark' });

			fake.setDebugging(true);
			assert.deepStrictEqual(items().map((item) => item.color), [undefined, undefined, undefined]);

			fake.setDebugging(false);
			assert.deepStrictEqual(items().map((item) => item.color.id), [COLOR, COLOR, COLOR]);
		});

		test('a session already running when the extension starts is taken into account', () => {
			load({ theme: '365 03-March Dark' });
			fake.debugSession = { name: 'test' };

			fake.statusBarItems.forEach((item) => { item.color = 'unset'; });
			fake.setDebugging(true);

			assert.strictEqual(fake.statusBarItem.color, undefined);
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
			const commands = ['extension.currentMonth', 'extension.setHighContrastTheme', 'extension.setHighContrastLightTheme'];
			assert.deepStrictEqual(linked, commands);
			assert.deepStrictEqual(isTrusted, { enabledCommands: commands });
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

		test('a window does not fight another window that applied another theme', async () => {
			await startAtNight();

			// Une autre fenêtre, avec d'autres réglages ou une autre version, applique son thème
			fake.globalState.set('lastAutoPeriod', '2026-11 Light');
			await fake.configurationUpdate(NOVEMBER_LIGHT);
			await fake.runAutoCheck();
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), NOVEMBER_LIGHT);

			// À sa prochaine période, cette fenêtre applique de nouveau son thème
			fake.setNow(new Date(2026, 10, 11, 7, 0));
			await fake.runAutoCheck();
			fake.setNow(new Date(2026, 10, 11, 19, 0));
			await fake.runAutoCheck();
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
			assert.strictEqual(fake.globalState.get('lastAutoPeriod'), undefined);

			const writes = fake.globalStateWrites;
			await fake.runAutoCheck();
			await fake.runAutoCheck();
			assert.strictEqual(fake.globalStateWrites, writes);
		});
	});

	suite('Day and night times', () => {
		const auto = { '365DayNight.enable': true };
		const at = (hours, minutes = 0) => new Date(2026, 10, 10, hours, minutes);
		const LIGHT_NOV = '365 11-November Light';
		const DARK_NOV = '365 11-November Dark';

		const start = async (now, settings = {}) => {
			load({ theme: 'Monokai', now, settings: { ...auto, ...settings } });
			await fake.settle();
		};

		test('the configured times decide, to the minute', async () => {
			await start(at(8, 29), { '365DayNight.dayStart': '08:30', '365DayNight.nightStart': '20:15' });
			assert.strictEqual(fake.theme(), DARK_NOV);

			fake.setNow(at(8, 30));
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), LIGHT_NOV);

			fake.setNow(at(20, 15));
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), DARK_NOV);
			assert.deepStrictEqual(fake.warningMessages, []);
		});

		test('the Light theme can run past midnight', async () => {
			await start(at(23), { '365DayNight.dayStart': '20:00', '365DayNight.nightStart': '06:00' });
			assert.strictEqual(fake.theme(), LIGHT_NOV);

			fake.setNow(new Date(2026, 10, 11, 6, 0));
			await fake.runAutoCheck();
			assert.strictEqual(fake.theme(), DARK_NOV);
			assert.deepStrictEqual(fake.warningMessages, []);
		});

		test('changing a time applies it after a short pause', async () => {
			await start(at(7, 30));
			assert.strictEqual(fake.theme(), LIGHT_NOV);

			await fake.setSetting('365DayNight.dayStart', '08:00');
			await fake.runTimeouts();

			assert.strictEqual(fake.theme(), DARK_NOV);
		});

		test('a time being typed applies once, with no warning for the unfinished values', async () => {
			await start(at(7, 30));
			const writes = fake.writes.length;

			// L'éditeur de paramètres écrit la valeur pendant la saisie
			for (const value of ['', '0', '08', '08:', '08:0', '08:00']) {
				await fake.setSetting('365DayNight.dayStart', value);
			}
			assert.strictEqual(fake.theme(), LIGHT_NOV);
			// Chaque frappe repousse l'application : un seul délai reste en attente
			assert.strictEqual(fake.timeouts.size, 1);

			await fake.runTimeouts();

			assert.strictEqual(fake.theme(), DARK_NOV);
			assert.strictEqual(fake.writes.length - writes, 1);
			assert.deepStrictEqual(fake.warningMessages, []);
		});

		test('an invalid time falls back to its default, with one warning', async () => {
			await start(at(7, 30), { '365DayNight.dayStart': '25:00' });

			assert.strictEqual(fake.theme(), LIGHT_NOV);
			assert.strictEqual(fake.warningMessages.length, 1);
			assert.ok(fake.warningMessages[0].includes('365DayNight.dayStart'));

			await fake.runAutoCheck();
			await fake.runAutoCheck();
			assert.strictEqual(fake.warningMessages.length, 1);
		});

		test('a corrected time ends the warnings, and a new mistake is reported again', async () => {
			await start(at(12), { '365DayNight.dayStart': '25:00' });

			await fake.setSetting('365DayNight.dayStart', '08:00');
			await fake.runTimeouts();
			await fake.runAutoCheck();
			assert.strictEqual(fake.warningMessages.length, 1);

			await fake.setSetting('365DayNight.dayStart', '25:00');
			await fake.runTimeouts();
			assert.strictEqual(fake.warningMessages.length, 2);
		});

		test('two identical times fall back to 7:00 and 19:00, with a warning', async () => {
			await start(at(7, 30), { '365DayNight.dayStart': '12:00', '365DayNight.nightStart': '12:00' });

			assert.strictEqual(fake.theme(), LIGHT_NOV);
			assert.strictEqual(fake.warningMessages.length, 1);
		});

		test('the times are ignored, and not checked, in the other modes', async () => {
			for (const mode of ['day', 'night', 'system']) {
				await start(at(12), { '365DayNight.mode': mode, '365DayNight.dayStart': '25:00' });
				assert.deepStrictEqual(fake.warningMessages, [], mode);
				fake.dispose();
			}
			await start(at(12), { '365DayNight.enable': false, '365DayNight.dayStart': '25:00' });
			assert.deepStrictEqual(fake.warningMessages, []);
		});
	});

	suite('Offer of the automatic mode on first use', () => {
		const CLOCK = 'Follow the clock';
		const SYSTEM = 'Follow my system';
		const NO = 'No thanks';
		const OPEN_SETTINGS = 'Open Settings';
		const NOON = new Date(2026, 10, 10, 12, 0);
		const offers = () => fake.infoItems.filter((items) => items.includes(CLOCK));

		/** Premier lancement, avec un thème d'un autre éditeur */
		const start = (options = {}) => load({ theme: 'Monokai', now: NOON, firstUse: true, ...options });

		/** Répond à la proposition, puis éventuellement au message de confirmation */
		const answerWith = (choice, confirmation) => {
			fake.answer = (message, items) => (items.includes(CLOCK) ? choice : confirmation);
		};

		test('the first 365 theme picked offers the automatic mode, once', async () => {
			start();
			await fake.settle();
			assert.deepStrictEqual(offers(), []);

			await fake.setTheme('365 03-March Dark');
			assert.deepStrictEqual(offers(), [[CLOCK, SYSTEM, NO]]);

			await fake.setTheme('Monokai');
			await fake.setTheme('365 04-April Dark');
			assert.strictEqual(offers().length, 1);

			// La proposition a été faite : rien ne s'active sans réponse
			assert.strictEqual(fake.hasUserValue('365DayNight.enable'), false);
		});

		test('the status bar button bringing a 365 theme counts as a first use', async () => {
			start();

			await fake.run(TOGGLE);

			assert.strictEqual(offers().length, 1);
		});

		test('the offer is not repeated after a restart or in another window', async () => {
			start();
			await fake.setTheme('365 03-March Dark');
			const { globalState } = fake;
			fake.dispose();

			load({ theme: '365 03-March Dark', now: NOON, globalState });
			await fake.settle();
			await fake.setTheme('365 04-April Light');

			assert.deepStrictEqual(offers(), []);
		});

		test('the offer follows Settings Sync, like the answer it remembers', async () => {
			start();

			assert.ok(fake.keysForSync.includes('autoModeOffered'));
		});

		test('following the clock turns the auto mode on, and says how to change it', async () => {
			start();
			answerWith(CLOCK);

			await fake.setTheme('365 03-March Dark');

			assert.strictEqual(fake.userValue('365DayNight.enable'), true);
			assert.strictEqual(fake.hasUserValue('365DayNight.mode'), false);
			// Midi : le thème clair du mois choisi
			assert.strictEqual(fake.theme(), '365 03-March Light');
			const confirmation = fake.infoMessages.at(-1);
			assert.ok(confirmation.includes('07:00') && confirmation.includes('19:00'));
			assert.deepStrictEqual(fake.infoItems.at(-1), [OPEN_SETTINGS]);
		});

		test('following the clock keeps the hours already set, and sets the mode back to auto', async () => {
			start({ settings: { '365DayNight.mode': 'night', '365DayNight.dayStart': '08:30' } });
			answerWith(CLOCK);

			await fake.setTheme('365 03-March Dark');

			assert.strictEqual(fake.userValue('365DayNight.mode'), 'auto');
			assert.ok(fake.infoMessages.at(-1).includes('08:30'));
		});

		test('following the system turns the system mode on', async () => {
			start({ systemDark: true });
			answerWith(SYSTEM);

			await fake.setTheme('365 03-March Light');

			assert.strictEqual(fake.userValue('365DayNight.enable'), true);
			assert.strictEqual(fake.userValue('365DayNight.mode'), 'system');
			assert.strictEqual(fake.userValue('window.autoDetectColorScheme'), true);
			// Le mois choisi, en variante sombre comme le système, sans passer par le mode auto
			assert.strictEqual(fake.activeTheme(), '365 03-March Dark');
			assert.strictEqual(fake.theme(), '365 03-March Light');
			assert.ok(fake.infoMessages.at(-1).includes('system'));
			assert.deepStrictEqual(fake.infoItems.at(-1), [OPEN_SETTINGS]);
		});

		test('the confirmation opens the settings on request', async () => {
			start();
			answerWith(CLOCK, OPEN_SETTINGS);

			await fake.setTheme('365 03-March Dark');

			assert.deepStrictEqual(fake.executedCommands, [['workbench.action.openSettings', '365DayNight']]);
		});

		test('declining or closing the offer changes nothing', async () => {
			for (const choice of [NO, undefined]) {
				start();
				answerWith(choice);

				await fake.setTheme('365 03-March Dark');

				assert.strictEqual(fake.hasUserValue('365DayNight.enable'), false, String(choice));
				assert.strictEqual(fake.infoMessages.length, 1, String(choice));
				fake.dispose();
			}
			start();
		});

		test('a 365 theme already in use at startup is offered once, to existing users', async () => {
			start({ theme: '365 03-March Dark' });
			await fake.settle();

			assert.strictEqual(offers().length, 1);
		});

		test('only a focused window asks, once it gets the focus', async () => {
			start({ theme: '365 03-March Dark', focused: false });
			await fake.settle();
			assert.deepStrictEqual(offers(), []);

			fake.setFocused(true);
			fake.setFocused(false);
			fake.setFocused(true);
			await fake.settle();

			assert.strictEqual(offers().length, 1);
		});

		test('the theme picker preview does not count as a choice', async () => {
			start({ holdThemeEvents: false });

			// Aperçu seulement : le réglage n'est pas écrit
			fake.pendingThemeEvents.push(2);
			fake.deliverThemeEvent();
			await fake.settle();

			assert.deepStrictEqual(offers(), []);
		});

		test('users who already turned the automatic mode on are never asked, even after turning it off', async () => {
			start({ theme: '365 03-March Dark', settings: { '365DayNight.enable': true } });
			await fake.settle();

			await fake.setSetting('365DayNight.enable', false);
			await fake.setTheme('365 04-April Dark');

			assert.deepStrictEqual(offers(), []);
		});

		test('a failed write is reported, and the offer is not repeated', async () => {
			start();
			answerWith(CLOCK);
			fake.failWrites = true;

			await fake.configurationUpdate('365 03-March Dark');
			await fake.setTheme('365 03-March Dark');

			assert.strictEqual(fake.errorMessages.length, 1);
			assert.strictEqual(fake.hasUserValue('365DayNight.enable'), false);
			assert.strictEqual(offers().length, 1);
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

	suite('Reading the active theme outside system mode', () => {
		const PREFERRED_HC = 'workbench.preferredHighContrastColorTheme';

		test('with system high contrast, the month comes from the preferred theme', () => {
			load({ theme: '365 03-March Dark', systemHighContrast: true, systemDark: true });
			assert.strictEqual(fake.activeTheme(), 'Default High Contrast');
			assert.strictEqual(fake.statusBarItem.text, 'HCT');
			fake.dispose();

			load({ theme: '365 03-March Dark', systemHighContrast: true, systemDark: true, settings: { [PREFERRED_HC]: '365 05-May High Contrast' } });
			assert.strictEqual(fake.statusBarItem.text, '05 HCT');
		});

		test('a High Contrast theme picked by hand keeps its own month', () => {
			load({ theme: '365 03-March High Contrast', settings: { [PREFERRED_HC]: '365 05-May High Contrast' } });

			assert.strictEqual(fake.statusBarItem.text, '03 HCT');
		});

		test('with the system color mode, the month comes from the preferred theme of the active kind', async () => {
			load({
				theme: 'Monokai',
				systemDark: true,
				now: new Date(2026, 10, 10, 12, 0),
				settings: {
					'window.autoDetectColorScheme': true,
					'workbench.preferredDarkColorTheme': '365 05-May Dark',
					'workbench.preferredLightColorTheme': '365 06-June Light'
				}
			});
			assert.strictEqual(fake.statusBarItem.text, '05 DRK');

			await fake.setSystemAppearance({ dark: false });
			assert.strictEqual(fake.statusBarItem.text, '06 LGT');

			// Le système a changé de mode : personne n'a choisi de mois
			assert.strictEqual(fake.globalState.get('selectedMonth'), undefined);
		});

		test('the blocked message mentions the system mode', async () => {
			load({ theme: LIGHT, settings: { 'window.autoDetectColorScheme': true } });

			await fake.run(TOGGLE);

			assert.ok(fake.errorMessages[0].includes('365DayNight.mode'));
		});
	});

	suite('System mode', () => {
		const NEXT = 'extension.nextMonth';
		const PREVIOUS = 'extension.previousMonth';
		const CURRENT = 'extension.currentMonth';
		const DETECT = 'window.autoDetectColorScheme';
		const DETECT_HC = 'window.autoDetectHighContrast';
		const PREFERRED_LIGHT = 'workbench.preferredLightColorTheme';
		const PREFERRED_DARK = 'workbench.preferredDarkColorTheme';
		const PREFERRED_HC = 'workbench.preferredHighContrastColorTheme';
		const PREFERRED_HCL = 'workbench.preferredHighContrastLightColorTheme';
		const NOVEMBER = new Date(2026, 10, 10, 12, 0);
		const DECEMBER = new Date(2026, 11, 1, 9, 0);
		const SYSTEM = { '365DayNight.enable': true, '365DayNight.mode': 'system' };

		/** Démarre l'extension en mode system, système en mode sombre et mois de novembre */
		const start = async (options = {}) => {
			load({ theme: 'Monokai', systemDark: true, now: NOVEMBER, ...options, settings: { ...SYSTEM, ...options.settings } });
			await fake.settle();
		};

		/** Rouvre l'extension avec la même mémoire : rechargement, nouvelle fenêtre ou redémarrage */
		const reopen = async (now, settings) => {
			const { globalState } = fake;
			const kept = { '365DayNight.enable': true, '365DayNight.mode': 'system' };
			for (const key of [DETECT, PREFERRED_LIGHT, PREFERRED_DARK, PREFERRED_HC, PREFERRED_HCL]) {
				if (fake.hasUserValue(key)) {
					kept[key] = fake.userValue(key);
				}
			}
			const theme = fake.theme();
			fake.dispose();
			load({ theme, systemDark: true, settings: { ...kept, ...settings }, globalState, now });
			await fake.settle();
		};

		const assertMonthSettings = (monthLabel) => {
			assert.strictEqual(fake.userValue(PREFERRED_LIGHT), `365 ${monthLabel} Light`);
			assert.strictEqual(fake.userValue(PREFERRED_DARK), `365 ${monthLabel} Dark`);
			assert.strictEqual(fake.userValue(PREFERRED_HC), `365 ${monthLabel} High Contrast`);
		};

		suite('Following the system', () => {
			test('turning it on sets the preferred themes and the detection, not the theme setting', async () => {
				await start();

				assertMonthSettings('11-November');
				assert.strictEqual(fake.userValue(DETECT), true);
				assert.strictEqual(fake.theme(), 'Monokai');
				assert.strictEqual(fake.activeTheme(), '365 11-November Dark');
				assert.strictEqual(fake.statusBarItem.text, '11 DRK');
			});

			test('it needs the enable setting', async () => {
				load({ theme: 'Monokai', systemDark: true, now: NOVEMBER, settings: { '365DayNight.mode': 'system' } });
				await fake.settle();

				assert.deepStrictEqual(fake.writes, []);
				assert.strictEqual(fake.activeTheme(), 'Monokai');
			});

			test('the system switching between light and dark selects the matching theme', async () => {
				await start();

				await fake.setSystemAppearance({ dark: false });
				assert.strictEqual(fake.activeTheme(), '365 11-November Light');
				assert.strictEqual(fake.statusBarItem.text, '11 LGT');

				await fake.setSystemAppearance({ dark: true });
				assert.strictEqual(fake.activeTheme(), '365 11-November Dark');
				assert.strictEqual(fake.statusBarItem.text, '11 DRK');
			});

			test('system high contrast takes priority over the color mode', async () => {
				await start();

				await fake.setSystemAppearance({ highContrast: true });
				assert.strictEqual(fake.activeTheme(), '365 11-November High Contrast');
				assert.strictEqual(fake.statusBarItem.text, '11 HCT');

				await fake.setSystemAppearance({ highContrast: false });
				assert.strictEqual(fake.activeTheme(), '365 11-November Dark');
			});

			test('without a High Contrast Light theme yet, a light high contrast system shows no month', async () => {
				await start({ systemDark: false });

				await fake.setSystemAppearance({ highContrast: true });

				assert.strictEqual(fake.activeTheme(), 'Default High Contrast Light');
				assert.strictEqual(fake.statusBarItem.text, 'HCL');
				assert.strictEqual(fake.itemFor(NEXT).visible, false);
				assert.strictEqual(fake.hasUserValue(PREFERRED_HCL), false);

				// Aucun thème 365 ne peut encore le remplacer : le clic ne doit rien promettre
				assert.ok(fake.statusBarItem.tooltip.value.includes('Your system decides'));
				const writes = fake.writes.length;
				await fake.run(TOGGLE);
				assert.strictEqual(fake.writes.length, writes);
				assert.strictEqual(fake.infoMessages.length, 1);
			});

			test('the high contrast detection is left to the user', async () => {
				await start({ settings: { [DETECT_HC]: false } });

				await fake.setSystemAppearance({ highContrast: true });

				assert.strictEqual(fake.activeTheme(), '365 11-November Dark');
				assert.strictEqual(fake.userValue(DETECT_HC), false);
				fake.dispose();

				await start();
				assert.strictEqual(fake.hasUserValue(DETECT_HC), false);
			});

			test('the system switching does not count as choosing a month', async () => {
				await start();

				await fake.setSystemAppearance({ dark: false });
				await fake.setSystemAppearance({ dark: true });

				assert.strictEqual(fake.globalState.get('selectedMonth'), undefined);
			});
		});

		suite('Month changes', () => {
			test('the preferred themes follow the real month', async () => {
				await start();

				fake.setNow(DECEMBER);
				await fake.runAutoCheck();

				assertMonthSettings('12-December');
				assert.strictEqual(fake.activeTheme(), '365 12-December Dark');
				assert.strictEqual(fake.statusBarItem.text, '12 DRK');
			});

			test('they follow it even if VS Code stayed closed on the first of the month', async () => {
				await start();

				await reopen(DECEMBER);

				assertMonthSettings('12-December');
			});

			test('checks and restarts in the same month write nothing', async () => {
				await start();
				await reopen(NOVEMBER);
				const writes = fake.globalStateWrites;

				await fake.runAutoCheck();
				await fake.runAutoCheck();

				assert.deepStrictEqual(fake.writes, []);
				assert.strictEqual(fake.globalStateWrites, writes);
			});

			test('the arrows change the month of the three preferred themes', async () => {
				await start();

				await fake.run(NEXT);

				assertMonthSettings('12-December');
				assert.strictEqual(fake.activeTheme(), '365 12-December Dark');
				assert.strictEqual(fake.theme(), 'Monokai');
				assert.strictEqual(fake.statusBarItem.text, '12 DRK');

				await fake.setSystemAppearance({ dark: false });
				assert.strictEqual(fake.activeTheme(), '365 12-December Light');
			});

			test('fast clicks are grouped into one change of each preferred theme', async () => {
				await start();
				const before = fake.writes.length;

				fake.commands.get(NEXT)();
				fake.commands.get(NEXT)();
				fake.commands.get(NEXT)();
				await fake.settle();

				assert.strictEqual(fake.writes.length - before, 3);
				assertMonthSettings('02-February');
			});

			test('a selected month lasts until the next real month, even after a restart', async () => {
				await start();
				await fake.run(PREVIOUS);
				assertMonthSettings('10-October');

				await reopen(new Date(2026, 10, 20, 22, 0));
				assertMonthSettings('10-October');
				assert.strictEqual(fake.statusBarItem.text, '10 DRK');

				fake.setNow(DECEMBER);
				await fake.runAutoCheck();
				assertMonthSettings('12-December');
			});

			test('going back to the current month ends the selection', async () => {
				await start();
				await fake.run(PREVIOUS);
				assert.strictEqual(fake.globalState.get('selectedMonth').month, 10);

				await fake.run(CURRENT);

				assertMonthSettings('11-November');
				assert.strictEqual(fake.globalState.get('selectedMonth'), undefined);
			});

			test('a selected month is kept when switching to another mode', async () => {
				await start();
				await fake.run(PREVIOUS);

				await fake.setSetting('365DayNight.mode', 'auto');

				assert.strictEqual(fake.theme(), '365 10-October Light');
			});

			test('a month selected before turning the mode on is kept', async () => {
				load({ theme: '365 11-November Dark', systemDark: true, now: NOVEMBER });
				await fake.run(PREVIOUS);

				await fake.setSetting('365DayNight.mode', 'system');
				await fake.setSetting('365DayNight.enable', true);

				assertMonthSettings('10-October');
			});

			test('a month picked in the theme picker applies to the three preferred themes and is remembered', async () => {
				await start();

				await fake.setTheme('365 03-March Dark');

				assertMonthSettings('03-March');
				assert.strictEqual(fake.theme(), 'Monokai');
				assert.strictEqual(fake.statusBarItem.text, '03 DRK');

				await reopen(new Date(2026, 10, 20, 22, 0));
				assertMonthSettings('03-March');
			});

			test('another window changing a preferred theme that is not active is not a choice', async () => {
				await start();

				await fake.setSetting(PREFERRED_LIGHT, '365 12-December Light');

				assert.strictEqual(fake.userValue(PREFERRED_LIGHT), '365 12-December Light');
				assert.strictEqual(fake.userValue(PREFERRED_DARK), '365 11-November Dark');
				assert.strictEqual(fake.globalState.get('selectedMonth'), undefined);
			});

			test('a window without focus does not treat a change as a choice', async () => {
				await start();
				fake.focused = false;

				await fake.setSetting(PREFERRED_DARK, '365 03-March Dark');

				assert.strictEqual(fake.userValue(PREFERRED_LIGHT), '365 11-November Light');
				assert.strictEqual(fake.globalState.get('selectedMonth'), undefined);
			});
		});

		suite('The button', () => {
			const HIGH_CONTRAST_LINK = '(command:extension.setHighContrastTheme)';

			test('the center button explains that the system decides, and changes nothing', async () => {
				await start();
				const writes = fake.writes.length;

				await fake.run(TOGGLE);

				assert.strictEqual(fake.writes.length, writes);
				assert.strictEqual(fake.infoMessages.length, 1);
				assert.ok(fake.infoMessages[0].includes('system'));
				assert.deepStrictEqual(fake.errorMessages, []);
				assert.strictEqual(fake.activeTheme(), '365 11-November Dark');
			});

			test('the tooltip and the screen reader label say so too', async () => {
				await start();

				const tooltip = fake.statusBarItem.tooltip.value;
				assert.ok(tooltip.includes('November Dark'));
				assert.ok(tooltip.includes('Your system decides between Light and Dark'));
				assert.ok(!tooltip.includes('Click to switch'));
				assert.ok(!tooltip.includes(HIGH_CONTRAST_LINK));
				assert.strictEqual(fake.statusBarItem.accessibilityInformation.label, 'November Dark. Your system decides between Light and Dark.');
			});

			test('the tooltip still offers the current month', async () => {
				await start();

				await fake.run(NEXT);

				assert.ok(fake.statusBarItem.tooltip.value.includes('(command:extension.currentMonth)'));
			});

			test('the variant commands explain that the system decides, and change nothing', async () => {
				await start();
				const writes = fake.writes.length;

				await fake.run('extension.setLightTheme');
				await fake.run('extension.setHighContrastTheme');

				assert.strictEqual(fake.writes.length, writes);
				assert.strictEqual(fake.errorMessages.length, 2);
				assert.ok(fake.errorMessages[0].includes('Your system decides'));
				assert.strictEqual(fake.theme(), 'Monokai');
			});
		});

		suite('A theme from another publisher', () => {
			const pickDracula = async () => {
				await start();
				await fake.setTheme('Dracula');
			};

			test('the picker writes it to the active preference: no arrows and no month', async () => {
				await pickDracula();

				assert.strictEqual(fake.userValue(PREFERRED_DARK), 'Dracula');
				assert.strictEqual(fake.activeTheme(), 'Dracula');
				assert.strictEqual(fake.statusBarItem.text, 'DRK');
				assert.strictEqual(fake.itemFor(NEXT).visible, false);
				assert.ok(fake.statusBarItem.tooltip.value.includes('Click to apply the 365 Dark theme'));
			});

			test('the other preferences keep following the month', async () => {
				await pickDracula();

				fake.setNow(DECEMBER);
				await fake.runAutoCheck();

				assert.strictEqual(fake.userValue(PREFERRED_DARK), 'Dracula');
				assert.strictEqual(fake.userValue(PREFERRED_LIGHT), '365 12-December Light');
				assert.strictEqual(fake.userValue(PREFERRED_HC), '365 12-December High Contrast');

				await fake.setSystemAppearance({ dark: false });
				assert.strictEqual(fake.statusBarItem.text, '12 LGT');
				assert.strictEqual(fake.itemFor(NEXT).visible, true);
			});

			test('the center button brings back the 365 theme, which follows the months again', async () => {
				await pickDracula();

				await fake.run(TOGGLE);

				assert.strictEqual(fake.activeTheme(), '365 11-November Dark');
				assert.strictEqual(fake.statusBarItem.text, '11 DRK');
				assert.deepStrictEqual(fake.infoMessages, []);

				fake.setNow(DECEMBER);
				await fake.runAutoCheck();
				assert.strictEqual(fake.activeTheme(), '365 12-December Dark');
			});

			test('the month commands bring it back too', async () => {
				await pickDracula();

				await fake.run(NEXT);

				assertMonthSettings('12-December');
			});
		});

		suite('Leaving the mode', () => {
			const leaveWith = (key, value) => fake.setSetting(key, value);

			test('absent settings become absent again and the previous theme comes back', async () => {
				await start();

				await leaveWith('365DayNight.enable', false);

				for (const key of [DETECT, PREFERRED_LIGHT, PREFERRED_DARK, PREFERRED_HC]) {
					assert.strictEqual(fake.hasUserValue(key), false, key);
				}
				assert.strictEqual(fake.activeTheme(), 'Monokai');
				assert.strictEqual(fake.statusBarItem.text, 'DRK');
				assert.strictEqual(fake.globalState.get('systemModeBackup'), undefined);
			});

			test('existing settings get their original values back', async () => {
				const original = { [DETECT]: true, [PREFERRED_DARK]: 'Dracula', [PREFERRED_LIGHT]: 'Quiet Light', [PREFERRED_HC]: 'Default High Contrast' };
				await start({ settings: original });
				assertMonthSettings('11-November');

				await leaveWith('365DayNight.mode', 'night');

				for (const [key, value] of Object.entries(original)) {
					assert.strictEqual(fake.userValue(key), value, key);
				}
			});

			test('switching to another mode applies that mode', async () => {
				await start();

				await leaveWith('365DayNight.mode', 'auto');

				assert.strictEqual(fake.hasUserValue(DETECT), false);
				assert.strictEqual(fake.theme(), '365 11-November Light');
				assert.strictEqual(fake.activeTheme(), '365 11-November Light');
				assert.strictEqual(fake.statusBarItem.text, '11 LGT');
			});

			test('settings the user changed meanwhile are kept', async () => {
				await start();
				await fake.setSetting(PREFERRED_LIGHT, 'Quiet Light');
				await fake.setSetting(PREFERRED_DARK, undefined);

				await leaveWith('365DayNight.enable', false);

				assert.strictEqual(fake.userValue(PREFERRED_LIGHT), 'Quiet Light');
				assert.strictEqual(fake.hasUserValue(PREFERRED_DARK), false);
				assert.strictEqual(fake.hasUserValue(PREFERRED_HC), false);
			});

			test('the original values survive a restart and later months', async () => {
				await start({ settings: { [PREFERRED_DARK]: 'Dracula' } });
				await reopen(DECEMBER);
				assertMonthSettings('12-December');

				await leaveWith('365DayNight.enable', false);

				assert.strictEqual(fake.userValue(PREFERRED_DARK), 'Dracula');
				assert.strictEqual(fake.hasUserValue(PREFERRED_LIGHT), false);
			});

			test('the original values follow Settings Sync, like the settings they restore', async () => {
				await start();

				assert.ok(fake.keysForSync.includes('systemModeBackup'));
			});

			test('the original values are read again when the mode is turned on again', async () => {
				await start();
				await leaveWith('365DayNight.enable', false);
				await fake.setSetting(PREFERRED_DARK, 'Dracula');

				await fake.setSetting('365DayNight.enable', true);
				assertMonthSettings('11-November');

				await leaveWith('365DayNight.enable', false);
				assert.strictEqual(fake.userValue(PREFERRED_DARK), 'Dracula');
			});

			test('a window opened after the mode was turned off still restores the settings', async () => {
				await start();

				await reopen(NOVEMBER, { '365DayNight.enable': false });

				assert.strictEqual(fake.hasUserValue(DETECT), false);
				assert.strictEqual(fake.hasUserValue(PREFERRED_DARK), false);
			});

			test('a failed restoration is reported once, kept, and tried again', async () => {
				await start({ settings: { [PREFERRED_DARK]: 'Dracula' } });
				fake.failWrites = true;

				await leaveWith('365DayNight.enable', false);
				await fake.runAutoCheck();
				await fake.runAutoCheck();

				assert.strictEqual(fake.errorMessages.length, 1);
				assert.ok(fake.globalState.get('systemModeBackup'));

				fake.failWrites = false;
				await fake.runAutoCheck();

				assert.strictEqual(fake.userValue(PREFERRED_DARK), 'Dracula');
				assert.strictEqual(fake.globalState.get('systemModeBackup'), undefined);
			});

			test('without the mode, checks write nothing', async () => {
				await start();
				await leaveWith('365DayNight.enable', false);
				const writes = [fake.writes.length, fake.globalStateWrites];

				await fake.runAutoCheck();
				await fake.runAutoCheck();

				assert.deepStrictEqual([fake.writes.length, fake.globalStateWrites], writes);
			});
		});

		suite('When something gets in the way', () => {
			test('the user turning the detection off is respected, and the button works as usual', async () => {
				await start();

				await fake.setSetting(DETECT, false);
				assert.strictEqual(fake.activeTheme(), 'Monokai');
				assert.strictEqual(fake.statusBarItem.text, 'DRK');

				await fake.run(TOGGLE);
				assert.strictEqual(fake.theme(), '365 11-November Dark');
				assert.deepStrictEqual(fake.infoMessages, []);

				fake.setNow(DECEMBER);
				await fake.runAutoCheck();
				assert.strictEqual(fake.userValue(DETECT), false);

				await fake.setSetting('365DayNight.enable', false);
				assert.strictEqual(fake.userValue(DETECT), false);
			});

			test('a failed write is reported once per period and tried again, original values included', async () => {
				await start({ failWrites: true, settings: { [PREFERRED_DARK]: 'Dracula' } });
				await fake.runAutoCheck();

				assert.strictEqual(fake.errorMessages.length, 1);
				assert.strictEqual(fake.userValue(PREFERRED_DARK), 'Dracula');

				fake.failWrites = false;
				await fake.runAutoCheck();
				assertMonthSettings('11-November');

				await fake.setSetting('365DayNight.enable', false);
				assert.strictEqual(fake.userValue(PREFERRED_DARK), 'Dracula');
			});

			test('a window without focus waits, so that two windows never save the settings at once', async () => {
				await start({ focused: false });

				assert.deepStrictEqual(fake.writes, []);
				assert.strictEqual(fake.globalState.get('systemModeBackup'), undefined);

				fake.focused = true;
				await fake.runAutoCheck();
				assertMonthSettings('11-November');
			});

			test('settings saved earlier but now lost are saved again, even in the same month', async () => {
				const globalState = new Map([['lastAutoPeriod', '2026-11 System']]);
				await start({ globalState });

				assertMonthSettings('11-November');
				assert.ok(fake.globalState.get('systemModeBackup'));
			});

			test('once the mode is set up, a window without focus follows the month too', async () => {
				await start();
				fake.focused = false;

				fake.setNow(DECEMBER);
				await fake.runAutoCheck();

				assertMonthSettings('12-December');
			});

			test('a preferred theme set by the workspace wins, and the button shows it', async () => {
				await start({ workspaceSettings: { [PREFERRED_DARK]: 'Monokai' } });

				assert.strictEqual(fake.activeTheme(), 'Monokai');
				assert.strictEqual(fake.statusBarItem.text, 'DRK');
				assert.strictEqual(fake.itemFor(NEXT).visible, false);
				assert.strictEqual(fake.userValue(PREFERRED_DARK), '365 11-November Dark');
				assert.deepStrictEqual(fake.errorMessages, []);
			});

			test('a workspace turning the detection off gets the usual button', async () => {
				await start({ workspaceSettings: { [DETECT]: false } });

				assert.strictEqual(fake.activeTheme(), 'Monokai');

				await fake.run(TOGGLE);

				assert.strictEqual(fake.theme(), '365 11-November Dark');
				assert.deepStrictEqual(fake.infoMessages, []);
			});
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
			assert.strictEqual(fake.getThemeState().type, ThemeType.HIGH_CONTRAST_LIGHT);
		});

		test('on a light system, a High Contrast theme that VS Code ignores is reported and shows no month', async () => {
			load({ theme: '365 11-November Light', systemHighContrast: true, systemDark: false });
			assert.strictEqual(fake.activeTheme(), 'Default High Contrast Light');
			assert.strictEqual(fake.statusBarItem.text, 'HCL');

			await fake.run(TOGGLE);

			// Pendant l'attente, le bouton ne promet ni mois ni flèches
			assert.strictEqual(fake.statusBarItem.text, 'HCL');
			assert.strictEqual(fake.itemFor('extension.nextMonth').visible, false);

			await fake.runTimeouts();

			assert.strictEqual(fake.activeTheme(), 'Default High Contrast Light');
			assert.strictEqual(fake.statusBarItem.text, 'HCL');
			assert.strictEqual(fake.itemFor('extension.nextMonth').visible, false);
			assert.strictEqual(fake.errorMessages.length, 1);
			assert.ok(fake.errorMessages[0].includes('window.autoDetectHighContrast'));
		});

		test('without the high contrast detection, the button changes at once, before VS Code', async () => {
			load({ theme: HIGH_CONTRAST, holdThemeEvents: true, settings: { 'window.autoDetectHighContrast': false } });

			await fake.run(TOGGLE);

			assert.strictEqual(fake.statusBarItem.text, `${String(MONTH).padStart(2, '0')} LGT`);
		});

		test('a settings change before the delay does not hide the report', async () => {
			load({ theme: 'Monokai', systemHighContrast: true });

			await fake.run('extension.setLightTheme');
			await fake.setSetting('window.autoDetectHighContrast', true);
			await fake.runTimeouts();

			assert.strictEqual(fake.errorMessages.length, 1);
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
			assert.strictEqual(fake.statusBarItem.text, `${String(MONTH).padStart(2, '0')} LGT`);
			await fake.runTimeouts();

			assert.strictEqual(fake.theme(), LIGHT);
			assert.deepStrictEqual(fake.errorMessages, []);
		});
	});

	suite('High Contrast Light', () => {
		const OCTOBER = new Date(2026, 9, 10, 12, 0);
		const NOVEMBER = new Date(2026, 10, 10, 12, 0);
		const OCTOBER_HC = '365 10-October High Contrast';
		const OCTOBER_HCL = '365 10-October High Contrast Light';
		const NOVEMBER_HC = '365 11-November High Contrast';
		const SET_HCL = 'extension.setHighContrastLightTheme';
		const HCL_LINK = '(command:extension.setHighContrastLightTheme)';
		const PREFERRED_HCL = 'workbench.preferredHighContrastLightColorTheme';
		const SYSTEM = { '365DayNight.enable': true, '365DayNight.mode': 'system' };

		suite('The button', () => {
			test('a click switches between the two High Contrast variants', async () => {
				load({ theme: OCTOBER_HC, now: OCTOBER });
				assert.ok(fake.statusBarItem.tooltip.value.includes('Click to switch to High Contrast Light'));

				await fake.run(TOGGLE);
				assert.strictEqual(fake.theme(), OCTOBER_HCL);
				assert.strictEqual(fake.statusBarItem.text, '10 HCL');
				assert.ok(fake.statusBarItem.tooltip.value.includes('October High Contrast Light'));

				await fake.run(TOGGLE);
				assert.strictEqual(fake.theme(), OCTOBER_HC);
			});

			test('a month without High Contrast Light still goes from High Contrast to Light', async () => {
				load({ theme: NOVEMBER_HC, now: NOVEMBER });

				await fake.run(TOGGLE);

				assert.strictEqual(fake.theme(), '365 11-November Light');
			});

			test('with High Contrast in the cycle, the click goes through the four variants', async () => {
				load({ theme: '365 10-October Light', now: OCTOBER, settings: { '365DayNight.toggleIncludesHighContrast': true } });

				const seen = [];
				for (let i = 0; i < 4; i++) {
					await fake.run(TOGGLE);
					seen.push(fake.statusBarItem.text);
				}

				assert.deepStrictEqual(seen, ['10 DRK', '10 HCT', '10 HCL', '10 LGT']);
			});

			test('the arrows keep High Contrast Light where it exists, and fall back on High Contrast elsewhere', async () => {
				load({ theme: OCTOBER_HCL, now: OCTOBER });

				await fake.run('extension.nextMonth');
				assert.strictEqual(fake.theme(), NOVEMBER_HC);
				assert.strictEqual(fake.statusBarItem.text, '11 HCT');
				assert.deepStrictEqual(fake.infoMessages, []);
			});

			test('a High Contrast Light theme picked in the theme picker shows its month', async () => {
				load({ theme: 'Monokai', now: OCTOBER });

				await fake.setTheme(OCTOBER_HCL);

				assert.strictEqual(fake.statusBarItem.text, '10 HCL');
				assert.strictEqual(fake.itemFor('extension.nextMonth').visible, true);
			});
		});

		suite('The command and the tooltip', () => {
			test('the command applies High Contrast Light to the displayed month', async () => {
				load({ theme: '365 10-October Dark', now: OCTOBER });

				await fake.run(SET_HCL);

				assert.strictEqual(fake.theme(), OCTOBER_HCL);
				assert.deepStrictEqual(fake.infoMessages, []);
			});

			test('for a month without it, the command applies High Contrast and says why', async () => {
				load({ theme: '365 11-November Dark', now: NOVEMBER });

				await fake.run(SET_HCL);

				assert.strictEqual(fake.theme(), NOVEMBER_HC);
				assert.deepStrictEqual(fake.infoMessages, ['November has no High Contrast Light theme yet, so its High Contrast theme is applied.']);
			});

			test('the tooltip offers High Contrast Light only for a month that has it', () => {
				load({ theme: '365 10-October Dark', now: OCTOBER });
				assert.ok(fake.statusBarItem.tooltip.value.includes(HCL_LINK));
				fake.dispose();

				load({ theme: '365 11-November Dark', now: NOVEMBER });
				assert.ok(!fake.statusBarItem.tooltip.value.includes(HCL_LINK));
			});

			test('in High Contrast Light, the tooltip offers no High Contrast link', () => {
				load({ theme: OCTOBER_HCL, now: OCTOBER });

				assert.ok(!fake.statusBarItem.tooltip.value.includes('(command:extension.setHighContrastTheme)'));
				assert.ok(!fake.statusBarItem.tooltip.value.includes(HCL_LINK));
			});
		});

		suite('In automatic mode', () => {
			test('High Contrast Light is kept, and becomes High Contrast in a month without it', async () => {
				load({ theme: OCTOBER_HCL, now: new Date(2026, 9, 31, 22, 0), settings: { '365DayNight.enable': true } });
				await fake.settle();
				assert.strictEqual(fake.theme(), OCTOBER_HCL);

				fake.setNow(new Date(2026, 10, 1, 9, 0));
				await fake.runAutoCheck();

				assert.strictEqual(fake.theme(), NOVEMBER_HC);
			});
		});

		suite('In system mode', () => {
			const start = async (now, settings = {}) => {
				load({ theme: 'Monokai', systemDark: false, now, settings: { ...SYSTEM, ...settings } });
				await fake.settle();
			};

			test('the light high contrast preference gets the theme of the month', async () => {
				await start(OCTOBER);
				assert.strictEqual(fake.userValue(PREFERRED_HCL), OCTOBER_HCL);

				await fake.setSystemAppearance({ highContrast: true });

				assert.strictEqual(fake.activeTheme(), OCTOBER_HCL);
				assert.strictEqual(fake.statusBarItem.text, '10 HCL');
			});

			test('a month without it gives the preference its original value back', async () => {
				await start(OCTOBER);

				fake.setNow(NOVEMBER);
				await fake.runAutoCheck();

				assert.strictEqual(fake.hasUserValue(PREFERRED_HCL), false);
				assert.strictEqual(fake.userValue('workbench.preferredHighContrastColorTheme'), NOVEMBER_HC);
			});

			test('a value of the user comes back in a month without it, and the next month with it replaces it again', async () => {
				await start(OCTOBER, { [PREFERRED_HCL]: 'Solarized Light' });
				assert.strictEqual(fake.userValue(PREFERRED_HCL), OCTOBER_HCL);

				fake.setNow(NOVEMBER);
				await fake.runAutoCheck();
				assert.strictEqual(fake.userValue(PREFERRED_HCL), 'Solarized Light');

				await fake.setSetting('365DayNight.enable', false);
				assert.strictEqual(fake.userValue(PREFERRED_HCL), 'Solarized Light');
			});

			test('the arrows write High Contrast Light only for a month that has it', async () => {
				await start(NOVEMBER);
				assert.strictEqual(fake.hasUserValue(PREFERRED_HCL), false);

				await fake.run('extension.previousMonth');
				assert.strictEqual(fake.userValue(PREFERRED_HCL), OCTOBER_HCL);

				await fake.run('extension.nextMonth');
				assert.strictEqual(fake.hasUserValue(PREFERRED_HCL), false);
			});

			test('a value the user sets while it waits for a month with a theme is kept', async () => {
				await start(NOVEMBER);

				await fake.setSetting(PREFERRED_HCL, 'Solarized Light');
				await fake.run('extension.previousMonth');

				assert.strictEqual(fake.userValue(PREFERRED_HCL), 'Solarized Light');
				assert.strictEqual(fake.userValue('workbench.preferredDarkColorTheme'), '365 10-October Dark');
			});

			test('leaving the mode removes it again', async () => {
				await start(OCTOBER);

				await fake.setSetting('365DayNight.enable', false);

				assert.strictEqual(fake.hasUserValue(PREFERRED_HCL), false);
				assert.strictEqual(fake.globalState.get('systemModeBackup'), undefined);
			});

			test('a High Contrast Light theme picked while the system is light shows its month', async () => {
				await start(NOVEMBER);

				// VS Code le range dans la préférence claire, celle du mode actuel du système
				await fake.setTheme(OCTOBER_HCL);

				assert.strictEqual(fake.userValue('workbench.preferredLightColorTheme'), OCTOBER_HCL);
				assert.strictEqual(fake.activeTheme(), OCTOBER_HCL);
				assert.strictEqual(fake.statusBarItem.text, '10 HCL');
				assert.strictEqual(fake.itemFor('extension.nextMonth').visible, true);
				// Le mois choisi s'étend aux autres préférences
				assert.strictEqual(fake.userValue(PREFERRED_HCL), OCTOBER_HCL);

				// Le système choisit toujours la variante : le clic l'explique sans rien écrire
				const writes = fake.writes.length;
				await fake.run(TOGGLE);
				assert.strictEqual(fake.writes.length, writes);
				assert.ok(fake.infoMessages.some((message) => message.startsWith('Your system decides')));
			});

			test('a theme the user picks for it stays, month after month', async () => {
				await start(OCTOBER);
				await fake.setSystemAppearance({ highContrast: true });

				await fake.setTheme('Default High Contrast Light');
				assert.strictEqual(fake.itemFor('extension.nextMonth').visible, false);

				fake.setNow(NOVEMBER);
				await fake.runAutoCheck();
				fake.setNow(new Date(2027, 9, 1, 9, 0));
				await fake.runAutoCheck();

				assert.strictEqual(fake.userValue(PREFERRED_HCL), 'Default High Contrast Light');
			});

			test('a mode set up by version 0.12.0 saves the new preference before writing it, then restores it', async () => {
				// Sauvegarde de la version 0.12.0 : sans liste de réglages, sans le contraste élevé clair
				const globalState = new Map([
					['autoModeOffered', true],
					['systemModeBackup', { saved: { [PREFERRED_HCL]: 'ignored' }, complete: true }],
					['lastAutoPeriod', '2026-10 System']
				]);
				globalState.get('systemModeBackup').saved = {};
				load({
					theme: 'Monokai', systemDark: false, now: OCTOBER, globalState,
					settings: {
						...SYSTEM, 'window.autoDetectColorScheme': true, [PREFERRED_HCL]: 'Solarized Light',
						'workbench.preferredLightColorTheme': '365 10-October Light',
						'workbench.preferredDarkColorTheme': '365 10-October Dark',
						'workbench.preferredHighContrastColorTheme': OCTOBER_HC
					}
				});
				await fake.settle();

				assert.strictEqual(fake.userValue(PREFERRED_HCL), OCTOBER_HCL);
				assert.strictEqual(fake.globalState.get('systemModeBackup').saved[PREFERRED_HCL], 'Solarized Light');

				await fake.setSetting('365DayNight.enable', false);
				assert.strictEqual(fake.userValue(PREFERRED_HCL), 'Solarized Light');
				assert.strictEqual(fake.hasUserValue('window.autoDetectColorScheme'), false);
			});

			test('a window without focus does not save the new preference of a 0.12.0 setup', async () => {
				const globalState = new Map([
					['autoModeOffered', true],
					['systemModeBackup', { saved: {}, complete: true }],
					['lastAutoPeriod', '2026-10 System']
				]);
				load({ theme: 'Monokai', now: OCTOBER, globalState, focused: false, settings: { ...SYSTEM, 'window.autoDetectColorScheme': true } });
				await fake.settle();

				assert.strictEqual(fake.hasUserValue(PREFERRED_HCL), false);
				assert.strictEqual(fake.globalState.get('systemModeBackup').settings, undefined);
			});
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
