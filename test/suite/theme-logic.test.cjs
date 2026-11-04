const assert = require('assert');
const { contributes } = require('../../package.json');
const {
	ThemeType,
	MONTH_NAMES,
	getThemeTypeFromName,
	getThemeLabel,
	getAutoThemeType,
	getNextThemeType
} = require('../../theme-logic');

suite('Theme logic', () => {
	suite('getThemeTypeFromName', () => {
		test('recognizes the type of a 365 theme', () => {
			assert.strictEqual(getThemeTypeFromName('365 05-May Light'), ThemeType.LIGHT);
			assert.strictEqual(getThemeTypeFromName('365 05-May Dark'), ThemeType.DARK);
			assert.strictEqual(getThemeTypeFromName('365 05-May High Contrast'), ThemeType.HIGH_CONTRAST);
		});

		test('checks High Contrast before Dark', () => {
			assert.strictEqual(getThemeTypeFromName('Dark High Contrast'), ThemeType.HIGH_CONTRAST);
		});

		test('falls back to Light without a theme name', () => {
			assert.strictEqual(getThemeTypeFromName(undefined), ThemeType.LIGHT);
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

	suite('getNextThemeType', () => {
		test('cycles through Light, Dark and High Contrast', () => {
			assert.strictEqual(getNextThemeType(ThemeType.LIGHT), ThemeType.DARK);
			assert.strictEqual(getNextThemeType(ThemeType.DARK), ThemeType.HIGH_CONTRAST);
			assert.strictEqual(getNextThemeType(ThemeType.HIGH_CONTRAST), ThemeType.LIGHT);
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
	});
});
