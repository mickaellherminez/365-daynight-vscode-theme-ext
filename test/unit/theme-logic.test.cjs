const assert = require('assert');
const { contributes } = require('../../package.json');
const {
	ThemeType,
	MONTH_NAMES,
	ColorThemeKind,
	getThemeTypeFromKind,
	getThemeMonth,
	getThemeState,
	getThemeLabel,
	getThemeLabelForMonth,
	getAdjacentMonth,
	getStatusBarText,
	getAutoThemeType,
	getAutoPeriod,
	getNextThemeType,
	getToggleThemeType,
	isThemeMaskedByWorkspace
} = require('../../theme-logic');

suite('Theme logic', () => {
	suite('getThemeTypeFromKind', () => {
		test('maps each kind of theme to a theme type', () => {
			assert.strictEqual(getThemeTypeFromKind(ColorThemeKind.LIGHT), ThemeType.LIGHT);
			assert.strictEqual(getThemeTypeFromKind(ColorThemeKind.DARK), ThemeType.DARK);
			assert.strictEqual(getThemeTypeFromKind(ColorThemeKind.HIGH_CONTRAST), ThemeType.HIGH_CONTRAST);
			assert.strictEqual(getThemeTypeFromKind(ColorThemeKind.HIGH_CONTRAST_LIGHT), ThemeType.HIGH_CONTRAST);
		});
	});

	suite('getThemeMonth', () => {
		test('reads the month of every contributed theme', () => {
			for (const { label } of contributes.themes) {
				const expected = Number(label.slice(4, 6));
				assert.strictEqual(getThemeMonth(label), expected, label);
			}
		});

		test('does not recognize other themes', () => {
			const others = [undefined, '', 'Monokai', 'Dracula', 'Dark High Contrast', '365', '365 05-May', '365 05-May Night',
				'365 05-June Dark', '365 13-December Dark', '365 00-January Dark', 'My 365 05-May Dark'];
			for (const name of others) {
				assert.strictEqual(getThemeMonth(name), undefined, String(name));
			}
		});
	});

	suite('getThemeState', () => {
		test('uses the kind of theme for a dark theme whose name does not say so', () => {
			assert.deepStrictEqual(getThemeState('Dracula', ColorThemeKind.DARK), { type: ThemeType.DARK, month: undefined });
		});

		test('reads the type and the month of a 365 theme', () => {
			assert.deepStrictEqual(getThemeState('365 05-May High Contrast', ColorThemeKind.HIGH_CONTRAST),
				{ type: ThemeType.HIGH_CONTRAST, month: 5 });
		});
	});

	suite('getThemeLabel', () => {
		test('pads the month number', () => {
			assert.strictEqual(getThemeLabel(ThemeType.DARK, new Date(2026, 0, 15)), '365 01-January Dark');
		});

		test('handles the last month of the year', () => {
			assert.strictEqual(getThemeLabel(ThemeType.HIGH_CONTRAST, new Date(2026, 11, 31)), '365 12-December High Contrast');
		});
	});

	suite('getThemeLabelForMonth', () => {
		test('builds the label of any month', () => {
			assert.strictEqual(getThemeLabelForMonth(ThemeType.DARK, 3), '365 03-March Dark');
			assert.strictEqual(getThemeLabelForMonth(ThemeType.HIGH_CONTRAST, 12), '365 12-December High Contrast');
		});
	});

	suite('getAdjacentMonth', () => {
		test('moves within the year', () => {
			assert.strictEqual(getAdjacentMonth(3, 1), 4);
			assert.strictEqual(getAdjacentMonth(3, -1), 2);
		});

		test('wraps around the year in both directions', () => {
			assert.strictEqual(getAdjacentMonth(12, 1), 1);
			assert.strictEqual(getAdjacentMonth(1, -1), 12);
			assert.strictEqual(getAdjacentMonth(11, 3), 2);
			assert.strictEqual(getAdjacentMonth(2, -3), 11);
			assert.strictEqual(getAdjacentMonth(5, 12), 5);
			assert.strictEqual(getAdjacentMonth(5, -24), 5);
		});
	});

	suite('getStatusBarText', () => {
		test('shows the month on two digits before the variant', () => {
			assert.strictEqual(getStatusBarText({ type: ThemeType.LIGHT, month: 1 }), '01 LGT');
			assert.strictEqual(getStatusBarText({ type: ThemeType.DARK, month: 10 }), '10 DRK');
			assert.strictEqual(getStatusBarText({ type: ThemeType.HIGH_CONTRAST, month: 12 }), '12 HCT');
		});

		test('shows only the variant for another theme', () => {
			assert.strictEqual(getStatusBarText({ type: ThemeType.DARK, month: undefined }), 'DRK');
		});
	});

	suite('getAutoThemeType', () => {
		test('switches to Light at 7:00 and to Dark at 19:00 in auto mode', () => {
			assert.strictEqual(getAutoThemeType('auto', 6), ThemeType.DARK);
			assert.strictEqual(getAutoThemeType('auto', 7), ThemeType.LIGHT);
			assert.strictEqual(getAutoThemeType('auto', 18), ThemeType.LIGHT);
			assert.strictEqual(getAutoThemeType('auto', 19), ThemeType.DARK);
		});

		test('ignores the hour in day and night modes', () => {
			for (const hour of [0, 12, 23]) {
				assert.strictEqual(getAutoThemeType('day', hour), ThemeType.LIGHT);
				assert.strictEqual(getAutoThemeType('night', hour), ThemeType.DARK);
			}
		});
	});

	suite('getAutoPeriod', () => {
		test('stays the same within a month and a type', () => {
			assert.strictEqual(getAutoPeriod(ThemeType.DARK, new Date(2026, 4, 1)), getAutoPeriod(ThemeType.DARK, new Date(2026, 4, 31, 23)));
		});

		test('changes with the type, the month and the year', () => {
			const period = getAutoPeriod(ThemeType.DARK, new Date(2026, 4, 1));
			assert.strictEqual(period, '2026-05 Dark');
			assert.notStrictEqual(getAutoPeriod(ThemeType.LIGHT, new Date(2026, 4, 1)), period);
			assert.notStrictEqual(getAutoPeriod(ThemeType.DARK, new Date(2026, 5, 1)), period);
			assert.notStrictEqual(getAutoPeriod(ThemeType.DARK, new Date(2027, 4, 1)), period);
		});
	});

	suite('getNextThemeType', () => {
		test('switches between Light and Dark by default', () => {
			assert.strictEqual(getNextThemeType(ThemeType.LIGHT), ThemeType.DARK);
			assert.strictEqual(getNextThemeType(ThemeType.DARK), ThemeType.LIGHT);
		});

		test('leaves High Contrast for Light as long as it has no Light variant', () => {
			assert.strictEqual(getNextThemeType(ThemeType.HIGH_CONTRAST), ThemeType.LIGHT);
		});

		test('cycles through High Contrast too when asked', () => {
			assert.strictEqual(getNextThemeType(ThemeType.LIGHT, true), ThemeType.DARK);
			assert.strictEqual(getNextThemeType(ThemeType.DARK, true), ThemeType.HIGH_CONTRAST);
			assert.strictEqual(getNextThemeType(ThemeType.HIGH_CONTRAST, true), ThemeType.LIGHT);
		});
	});

	suite('getToggleThemeType', () => {
		test('moves through the cycle from a 365 theme', () => {
			assert.strictEqual(getToggleThemeType({ type: ThemeType.DARK, month: 5 }), ThemeType.LIGHT);
			assert.strictEqual(getToggleThemeType({ type: ThemeType.DARK, month: 5 }, true), ThemeType.HIGH_CONTRAST);
		});

		test('keeps the same type from another theme', () => {
			assert.strictEqual(getToggleThemeType({ type: ThemeType.DARK, month: undefined }), ThemeType.DARK);
			assert.strictEqual(getToggleThemeType({ type: ThemeType.LIGHT, month: undefined }), ThemeType.LIGHT);
			assert.strictEqual(getToggleThemeType({ type: ThemeType.DARK, month: undefined }, true), ThemeType.DARK);
		});
	});

	suite('isThemeMaskedByWorkspace', () => {
		const label = '365 05-May Dark';

		test('detects another theme in the workspace or the workspace folder', () => {
			assert.strictEqual(isThemeMaskedByWorkspace({ workspaceValue: 'Monokai' }, label), true);
			assert.strictEqual(isThemeMaskedByWorkspace({ workspaceFolderValue: 'Monokai' }, label), true);
		});

		test('gives priority to the workspace folder', () => {
			assert.strictEqual(isThemeMaskedByWorkspace({ workspaceValue: 'Monokai', workspaceFolderValue: label }, label), false);
		});

		test('ignores user settings and the same theme in the workspace', () => {
			assert.strictEqual(isThemeMaskedByWorkspace({ globalValue: 'Monokai' }, label), false);
			assert.strictEqual(isThemeMaskedByWorkspace({ workspaceValue: label }, label), false);
			assert.strictEqual(isThemeMaskedByWorkspace(undefined, label), false);
		});
	});

	suite('package.json', () => {
		test('contributes exactly the computed theme names', () => {
			const computed = MONTH_NAMES.flatMap((_, month) =>
				Object.values(ThemeType).map((type) => getThemeLabel(type, new Date(2026, month, 1)))
			);
			const contributed = contributes.themes.map((theme) => theme.label);
			assert.deepStrictEqual([...contributed].sort(), computed.sort());
		});

		test('contributes the public commands without any menu', () => {
			assert.deepStrictEqual(contributes.commands.map((command) => command.command).sort(), [
				'extension.currentMonth',
				'extension.nextMonth',
				'extension.previousMonth',
				'extension.setDarkTheme',
				'extension.setHighContrastTheme',
				'extension.setLightTheme',
				'extension.toggleTheme'
			]);
			assert.strictEqual(contributes.menus, undefined);
			assert.strictEqual(contributes.submenus, undefined);
		});
	});
});
